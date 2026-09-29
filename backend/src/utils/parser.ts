/*
 * Název souboru:    parser.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Zajišťuje  zpracování a validaci dat ze souboru.
 *                   Funkce `getParsedData` analyzuje jednotlivé řádky souboru,
 *                   ověřuje přítomnost povinných polí a převádí hodnoty do
 *                   struktury `TestData`. Dále se zde nacházejí pomocné funkce
 *                   pro práci s prázdnými hodnotami, číselnými hodnotami a daty.
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { EXPECTED_PROPERTIES } from 'src/constants/constants';
import { TestData } from 'src/sync/sync.service';

export function getParsedData(lines: string[], file: Express.Multer.File) {
  let testData: TestData = {
    examinationId: null,
    datetime: null,
    firstname: '',
    lastname: '',
    joint_side: null,
    test_mode: null,
    joint: null,
    plane: null,
    motion_start: null,
    motion_end: null,
    speed_1: null,
    speed_2: null,
    break: null,
    start_hold_position: null,
    end_hold_position: null,
    hold_time: null,
    number_of_sets: null,
    number_of_repetitions: null,
    weight: null,
    height: null,
    birthday: null,
    sex: null,
    grafity_compensation: null,
  };
  let date: Date | null = null;
  let time: string | null = null;
  let firstname: string | null = null;
  let lastname: string | null = null;

  testData.examinationId = lines[0].trim();

  const foundKeys = new Set(
    lines
      .filter((line) => line.includes(':'))
      .map((line) => line.slice(0, line.indexOf(':')).trim()),
  );

  for (const expectedKey of EXPECTED_PROPERTIES) {
    if (!foundKeys.has(expectedKey)) {
      throw new HttpException(
        {
          message: `Missing required field '${expectedKey}' in '${file.originalname}'`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  lines.forEach((line) => {
    const delimiterIndex = line.indexOf(':');
    if (delimiterIndex === -1) {
      return;
    }

    const key = line.slice(0, delimiterIndex).trim();
    const value = line.slice(delimiterIndex + 1).trim();

    if (key === 'Date of Test') {
      date = convertDate(value);
    }

    if (key === 'Time of Test') {
      time = value;
    }
    if (key === 'Name of Person') {
      [lastname, firstname] = value.split(' ');
    }

    switch (key) {
      case 'Joint-Side':
        testData.joint_side = handleEmpty(value);
        break;
      case 'Test-Mode':
        testData.test_mode = handleEmpty(value);
        break;
      case 'Joint':
        testData.joint = handleEmpty(value);
        break;
      case 'Plane':
        testData.plane = handleEmpty(value);
        break;
      case 'Motion-Start':
        testData.motion_start = handleInt(value);
        break;
      case 'Motion-End':
        testData.motion_end = handleInt(value);
        break;
      case 'Speed (Movement 1)':
        testData.speed_1 = handleInt(value);
        break;
      case 'Speed (Movement 2)':
        testData.speed_2 = handleInt(value);
        break;
      case 'Break':
        testData.break = handleInt(value);
        break;
      case 'Start-Holdposition':
        testData.start_hold_position = handleInt(value);
        break;
      case 'End-Holdposition':
        testData.end_hold_position = handleInt(value);
        break;
      case 'Hold-Time':
        testData.hold_time = handleInt(value);
        break;
      case 'No. of sets':
        testData.number_of_sets = handleInt(value);
        break;
      case 'No. of repetitions':
        testData.number_of_repetitions = handleInt(value);
        break;
      case 'Weight':
        testData.weight = handleInt(value);
        break;
      case 'Height':
        testData.height = handleInt(value);
        break;
      case 'Date of birth':
        testData.birthday = handleDate(value);
        break;
      case 'Sex':
        testData.sex = handleEmpty(value);
        break;
      case 'Gravitycomp.':
        testData.grafity_compensation = handleEmpty(value);
        break;
    }
  });
  testData.firstname = firstname == null ? '' : firstname;
  testData.lastname = lastname == null ? '' : lastname;
  testData.datetime = addTime(time, date);

  return testData;
}

const handleEmpty = (value: string) => {
  return value === '' ? null : value;
};

const handleInt = (value: string) => {
  return value === '' ? null : parseInt(value);
};

const handleDate = (value: string) => {
  return value === '' ? null : convertDate(value);
};

const convertDate = (date: string): Date => {
  if (date) {
    const datePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
    if (datePattern.test(date)) {
      const [day, month, year] = date.split('.');
      const formattedDate = new Date(
        `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
      );
      return formattedDate;
    }
  }
  return null;
};

const addTime = (time: string, date: Date): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  return date;
};
