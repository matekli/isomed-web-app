/*
 * Název souboru:    app.module.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hlavní aplikační modul NestJS, který sdružuje všechny funkční moduly
 */

import { Module } from '@nestjs/common';
import { PatientModule } from './patient/patient.module';
import { PrismaModule } from './prisma/prisma.module';
import { SyncModule } from './sync/sync.module';
import { ExaminationModule } from './examination/examination.module';
import { MeasurementModule } from './measurement/measurement.module';
import { ComparisonModule } from './comparison/comparison.module';

@Module({
  imports: [
    PatientModule,
    PrismaModule,
    SyncModule,
    ExaminationModule,
    MeasurementModule,
    ComparisonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
