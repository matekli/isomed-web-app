/*
 * Název souboru:    measurement.module.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            NestJS modul zajišťující registraci controlleru a servisu pro práci s měřeními.
 */

import { Module } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { MeasurementController } from './measurement.controller';

@Module({
  controllers: [MeasurementController],
  providers: [MeasurementService],
})
export class MeasurementModule {}
