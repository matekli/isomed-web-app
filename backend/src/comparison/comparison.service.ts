/*
 * Název souboru:    comparison.service.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Servis zajišťující přístup k entitě comparison v databázi
 *                   pomocí Prisma ORM – obsahuje CRUD logiku.
 */

import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComparisonService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createComparisonDto: Prisma.comparisonCreateInput) {
    return this.prismaService.comparison.create({
      data: createComparisonDto,
    });
  }

  async findAll() {
    return await this.prismaService.comparison.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.comparison.findUnique({
      where: {
        id: id,
      },
    });
  }

  async remove(ids: number[]) {
    return await this.prismaService.comparison.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async editComparison(
    id: number,
    updateComparisonGroupDto: Prisma.comparisonUpdateInput,
  ) {
    return await this.prismaService.comparison.update({
      where: {
        id: id,
      },
      data: {
        description: updateComparisonGroupDto.description,
        title: updateComparisonGroupDto.title,
        onlyIsokinetic: updateComparisonGroupDto.onlyIsokinetic,
        comment: updateComparisonGroupDto.comment,
        paramsJson: updateComparisonGroupDto.paramsJson,
      },
    });
  }
}
