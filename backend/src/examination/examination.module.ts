/*
 * Název souboru:    examination.module.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            NestJS modul zajišťující registraci controlleru a servisu pro práci s vyšetřeními a jejich skupinami.
 */

import { Module } from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { ExaminationController } from './examination.controller';

@Module({
  controllers: [ExaminationController],
  providers: [ExaminationService],
})
export class ExaminationModule {}
