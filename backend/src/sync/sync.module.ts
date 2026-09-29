/*
 * Název souboru:    sync.module.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            NestJS modul zajišťující registraci controlleru a servisu pro nahrávání, synchronizaci a mazání.
 */

import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
