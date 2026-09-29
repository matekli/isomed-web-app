/*
 * Název souboru:    measurement.controller.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Kontroler pro cestu /measurement, zajišťující vytvoření a načítání měření.
 */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { MeasurementService } from './measurement.service';

@Controller('measurement')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Get('/many')
  findManyByIds(@Query('ids') ids: string) {
    const idArray = ids.split(',');
    return this.measurementService.findAllByIds(idArray);
  }

  @Get(':id')
  findAllById(@Param('id') id: string) {
    return this.measurementService.findAllById(id);
  }
}
