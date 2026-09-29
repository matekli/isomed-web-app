/*
 * Název souboru:    prisma.module.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Globální modul pro zpřístupnění PrismaService napříč celou aplikací.
 *                   Zajišťuje jednotné připojení k databázi pomocí Prisma ORM.
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
