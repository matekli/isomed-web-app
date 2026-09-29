/*
 * Název souboru:    comparison.controller.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Kontroler pro cestu /saved, který obsluhuje CRUD operace
 *                   nad porovnáními uloženými v databázi.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ComparisonService } from './comparison.service';

type Comparison = {
  id: string;
  set: number;
  repetitionsToDelete: number[];
  type: string;
  joint: string;
};

type CreateComparison = {
  description: string | null;
  title: string | null;
  onlyIsokinetic: boolean;
  createdAt: Date;
  comment: string | null;
  paramsJson: string; // Zde použijeme pole typu Comparison
};

@Controller('saved')
export class ComparisonController {
  constructor(private readonly comparisonService: ComparisonService) {}

  @Post()
  create(@Body() createComparisonDto: Prisma.comparisonCreateInput) {
    return this.comparisonService.create(createComparisonDto);
  }

  @Get()
  findAll() {
    return this.comparisonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comparisonService.findOne(id);
  }

  @Delete()
  remove(@Body() ids: number[]) {
    return this.comparisonService.remove(ids);
  }

  @Put()
  editComparison(@Body() body: { id: number; data: CreateComparison }) {
    const { id, data } = body;
    try {
      return this.comparisonService.editComparison(id, data);
    } catch (error) {
      throw error;
    }
  }
}
