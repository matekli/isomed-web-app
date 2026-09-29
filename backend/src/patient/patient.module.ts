/*
 * Název souboru:    patient.module.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            NestJS modul zajišťující registraci controlleru a servisu pro práci s pacienty a jejich skupinami.
 */

import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';

@Module({
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
