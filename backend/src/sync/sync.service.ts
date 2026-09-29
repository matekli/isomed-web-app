/*
 * Název souboru:    sync.service.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Servis zajišťující nahrávání, synchronizaci a mazání dat.
 */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BATCHSIZE } from 'src/constants/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPool } from 'src/utils/createPool';
import { getParsedData } from 'src/utils/parser';
import * as sqlite3 from 'sqlite3';

export type TestData = {
  examinationId: string;
  datetime: Date;
  firstname: string;
  lastname: string;
  joint_side: string;
  test_mode: string;
  joint: string;
  plane: string;
  motion_start: number;
  motion_end: number;
  speed_1: number;
  speed_2: number;
  break: number;
  start_hold_position: number;
  end_hold_position: number;
  hold_time: number;
  number_of_sets: number;
  number_of_repetitions: number;
  weight: number;
  height: number;
  birthday: Date;
  sex: string;
  grafity_compensation: string;
};

const db = new (sqlite3.verbose().Database)('./prisma/dev.db');

@Injectable()
export class SyncService {
  constructor(private readonly prismaService: PrismaService) {}

  async DeleteAll() {
    await this.prismaService.$executeRaw`TRUNCATE TABLE patient CASCADE`;
  }

  async Synchronise(file: Express.Multer.File) {
    if (file.size === 0) {
      throw new HttpException(
        { message: `File ${file.originalname} is empty` },
        HttpStatus.BAD_REQUEST,
      );
    }

    const fileData = file.buffer.toString();

    //Rozdělení souboru na řádky
    const lines = fileData.split('\n');

    // Naparsování souboru a uložení do objektu typu TestData
    const parsedData = getParsedData(lines, file);

    try {
      const createdPatient = await this.savePatient(parsedData);

      const createdExamination = await this.saveExamination(
        parsedData,
        createdPatient,
      );

      if (createdExamination) {
        await this.saveMeasurementsSQL(lines, createdExamination);
      }
    } catch (error) {
      throw new HttpException(
        { message: `Error processing file ${file.originalname}` },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async savePatient(parsedData: TestData): Promise<{ id: string }> {
    // Vytvoření pacienta z naparsovaných dat
    const newPatient: Prisma.patientCreateInput = {
      firstname: parsedData.firstname,
      lastname: parsedData.lastname,
      birthday: parsedData.birthday,
      height: parsedData.height,
      sex: parsedData.sex,
    };

    // Pokusí se uložit pacienta do databáze, pokud již existuje, vrátí existujícího
    let createdPatient;
    try {
      createdPatient = await this.prismaService.patient.create({
        data: newPatient,
        select: { id: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          createdPatient = await this.prismaService.patient.findFirst({
            where: {
              firstname: newPatient.firstname,
              lastname: newPatient.lastname,
            },
          });
        }
      }
    }

    // Uložení váhy do patient_weights, pokud je v souboru definovaná
    if (parsedData.weight) {
      const newWeight: Prisma.patient_weightsCreateInput = {
        weight: parsedData.weight,
        date: parsedData.datetime,
        patient: {
          connect: {
            id: createdPatient.id,
          },
        },
      };

      try {
        await this.prismaService.patient_weights.create({
          data: newWeight,
        });
      } catch (error) {
        if (error.code !== 'P2002') {
          throw new HttpException(
            {
              message: 'Error processing patient weight',
              detail: error.message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
    return createdPatient;
  }

  private async saveExamination(parsedData: TestData, patient) {
    let examinationData: Prisma.examinationCreateInput = {
      id: parsedData.examinationId,
      datetime: parsedData.datetime,
      test_mode: parsedData.test_mode,
      joint_side: parsedData.joint_side,
      joint: parsedData.joint,
      plane: parsedData.plane,
      motion_start: parsedData.motion_start,
      motion_end: parsedData.motion_end,
      speed_1: parsedData.speed_1,
      speed_2: parsedData.speed_2,
      break: parsedData.break,
      start_hold_position: parsedData.start_hold_position,
      end_hold_position: parsedData.end_hold_position,
      hold_time: parsedData.hold_time,
      number_of_sets: parsedData.number_of_sets,
      number_of_repetitions: parsedData.number_of_repetitions,
      weight: parsedData.weight,
      height: parsedData.height,
      grafity_compensation: parsedData.grafity_compensation,

      patient: {
        connect: {
          id: patient.id,
        },
      },
    };

    if (parsedData.weight === null) {
      const weight = await this.prismaService.patient_weights.findFirst({
        where: {
          patient_id: patient.id, // Hledáme váhu pro konkrétního pacienta
          date: {
            lte: examinationData.datetime, // Hledáme váhu, která je platná před nebo v okamžiku vyšetření
          },
        },
        orderBy: {
          date: 'desc',
        },
        select: { weight: true },
      });

      examinationData.weight = weight === null ? null : weight.weight;
    }

    let createdExamination = null;
    try {
      createdExamination = await this.prismaService.examination.create({
        data: examinationData,
        select: { id: true },
      });
    } catch (error) {
      if (error.code !== 'P2002') {
        throw new HttpException(
          {
            message: 'Error processing examination',
            detail: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return createdExamination;
  }

  // Prochází všechny řádky s měřeními a ukládá dávky do databáze po dosažení BATCHSIZE
  private async saveMeasurementsSQL(lines: string[], examination) {
    const batchSize = BATCHSIZE;
    let measurements = [];

    let line = 101;
    while (line < lines.length && lines[line].trim() !== '') {
      const measurement = this.parseMeasurementLine(
        lines[line],
        examination.id,
      );
      measurements.push(measurement);
      line++;

      // Pokud dosáhneme velikosti dávky nebo posledního řádku, uložíme aktuální batch
      if (measurements.length === batchSize || line === lines.length - 1) {
        await this.saveMeasurementsBatch(measurements, examination.id);
        measurements = []; // Vyprázdnění pole pro další dávku
      }
    }
  }

  // Parsuje jeden řádek a vrátí pole s hodnotami pro uložení
  private parseMeasurementLine(line: string, examinationId: number): number[] {
    const values = line.trim().split(' ');

    const [
      time = null,
      relative_position = null,
      torque = null,
      speed = null,
      torque_without_g_calibration = null,
      current_repetition = null,
      current_set = null,
      torque_on_dynamometer = null,
      force_on_right_leg = null,
      force_on_left_leg = null,
    ] = values.map((value) => (value ? Number(value) : null));

    return [
      time,
      relative_position,
      torque,
      speed,
      torque_without_g_calibration,
      current_repetition,
      current_set,
      torque_on_dynamometer,
      force_on_right_leg,
      force_on_left_leg,
      examinationId,
    ];
  }

  // Ukládá dávku měření do databáze s použitím transakce
  private async saveMeasurementsBatch(
    measurements: number[][],
    examinationId: string,
  ): Promise<void> {
    if (measurements.length === 0) {
      return;
    }

    const insertQuery = this.buildInsertQuery(measurements);
    const flatValues = measurements.flat();

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run(insertQuery, flatValues, (err) => {
          if (err) {
            console.error('Chyba při ukládání měření:', examinationId, err);
            db.run('ROLLBACK');
            return reject(err);
          }
          db.run('COMMIT', (commitErr) => {
            if (commitErr) return reject(commitErr);
            resolve();
          });
        });
      });
    });
  }

  // Generuje SQL dotaz pro hromadné vložení měření do tabulky measurement
  // Pro každý řádek vytvoří skupinu 11 parametrických placeholderů ($1, $2, ..., $n)
  private buildInsertQuery(measurements: number[][]): string {
    return `
        INSERT INTO Measurement (
            time,
            relative_position,
            torque,
            speed,
            torque_without_g_calibration,
            current_repetition,
            current_set,
            torque_on_dynamometer,
            force_on_right_leg,
            force_on_left_leg,
            examination_id
        ) VALUES ${measurements
          .map(
            (_, i) =>
              `(${Array.from({ length: 11 }, (_, j) => `?`).join(', ')})`,
          )
          .join(', ')}  
    `;
  }
}
