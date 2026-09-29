/*
 * Název souboru:    measurement.service.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Servis zajišťující přístup k entitě measurement v databázi
 *                   pomocí Prisma ORM – zajišťuje vytvoření načítání měření.
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MeasurementService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllById(examination_id: string) {
    return this.prismaService.measurement.findMany({
      where: {
        examination_id,
      },
      orderBy: { time: 'asc' },
    });
  }

  async findAllByIds(examinations_ids: string[]) {
    const data = await this.prismaService.measurement.findMany({
      where: {
        examination_id: {
          in: examinations_ids,
        },
      },
      orderBy: [{ examination_id: 'asc' }, { time: 'asc' }],
    });
    const groupedData = examinations_ids.map((id) => ({
      examination_id: id,
      measurements: data.filter((item) => item.examination_id === id),
    }));

    return groupedData;
  }
}
