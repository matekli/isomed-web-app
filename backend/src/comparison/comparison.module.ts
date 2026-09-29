/*
 * Název souboru:    comparison.module.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            NestJS modul zajišťující registraci controlleru a servisu pro práci s porovnáními.
 */

import { Module } from '@nestjs/common';
import { ComparisonController } from './comparison.controller';
import { ComparisonService } from './comparison.service';

@Module({
  controllers: [ComparisonController],
  providers: [ComparisonService],
})
export class ComparisonModule {}
