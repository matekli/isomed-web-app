/*
 * Název souboru:    examination.controller.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Kontroler pro cesty /examination a /examination/group,
 *                   obsluhující CRUD operace nad vyšetřeními a jejich skupinami.
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
} from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { Prisma } from '@prisma/client';

@Controller('examination')
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}

  @Post()
  create(@Body() createExaminationDto: Prisma.examinationCreateInput) {
    return this.examinationService.create(createExaminationDto);
  }

  @Get()
  findAll() {
    return this.examinationService.findAll();
  }

  @Get('/many')
  findManyByIds(@Query('ids') ids: string) {
    const idArray = ids.split(',');
    return this.examinationService.findManyByIds(idArray);
  }

  @Get('/group/membership')
  getGroupMembership() {
    return this.examinationService.getGroupMembership();
  }

  @Delete()
  remove(@Body() ids: string[]) {
    return this.examinationService.remove(ids);
  }

  @Delete('/group')
  removeGroup(@Body() ids: string[]) {
    return this.examinationService.removeGroup(ids);
  }

  @Get('/group')
  findAllGroups() {
    return this.examinationService.findAllGroups();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examinationService.findOne(id);
  }

  @Post('/group')
  addGroup(
    @Body()
    createExaminationGroupDto: Prisma.examination_groupCreateInput,
  ) {
    try {
      return this.examinationService.addGroup(createExaminationGroupDto);
    } catch (error) {
      throw error;
    }
  }

  @Put('/group')
  editGroup(@Body() body: { id: string; name: string }) {
    const { id, name } = body;
    try {
      return this.examinationService.editGroup(id, { name });
    } catch (error) {
      throw error;
    }
  }

  @Post('/group/membership')
  addToGroup(
    @Body()
    createExaminationGroupMembershipDto: Prisma.examination_group_membershipCreateManyInput,
  ) {
    try {
      return this.examinationService.addGroupMembership(
        createExaminationGroupMembershipDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete('/group/membership')
  removeMemberhip(
    @Body()
    memberships: { item_id: string; group_id: string }[],
  ) {
    return this.examinationService.removeMembership(memberships);
  }
}
