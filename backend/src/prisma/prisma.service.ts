/*
 * Název souboru:    prisma.service.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Definice PrismaService, který rozšiřuje PrismaClient a zajišťuje
 *                   připojení k databázi při inicializaci modulu pomocí metody onModuleInit.
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
