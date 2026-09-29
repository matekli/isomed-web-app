/*
 * Název souboru:    sync.controller.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Kontroler pro cestu /sync, zajišťuje nahrávání, synchronizaci a mazání dat.
 */

import {
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('sync')
export class SyncController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async Synchronise(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return this.syncService.Synchronise(file);
  }
  @Delete()
  async DeleteAll(): Promise<any> {
    return this.syncService.DeleteAll();
  }

  constructor(private readonly syncService: SyncService) {}
}
