/*
 * Název souboru:    patient.controller.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Kontroler pro cesty /patient a /patient/group,
 *                   obsluhující CRUD operace nad pacienty a jejich skupinami.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { Prisma } from '@prisma/client';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() createPatientDto: Prisma.patientCreateInput) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Get('/group/membership')
  getGroupMembership() {
    return this.patientService.getGroupMembership();
  }

  @Delete()
  remove(@Body() ids: string[]) {
    return this.patientService.remove(ids);
  }

  @Delete('/group')
  removeGroup(@Body() ids: string[]) {
    return this.patientService.removeGroup(ids);
  }

  @Get('/group')
  findAllGroups() {
    return this.patientService.findAllGroups();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Get(':id/examination')
  findPatientExaminations(@Param('id') patientId: string) {
    return this.patientService.findPatientExaminations(patientId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: Prisma.patientUpdateInput,
  ) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Post('/group')
  addGroup(
    @Body()
    createpatientGroupDto: Prisma.patient_groupCreateInput,
  ) {
    try {
      return this.patientService.addGroup(createpatientGroupDto);
    } catch (error) {
      throw error;
    }
  }

  @Put('/group')
  editGroup(@Body() body: { id: string; name: string }) {
    const { id, name } = body;
    try {
      return this.patientService.editGroup(id, { name });
    } catch (error) {
      throw error;
    }
  }

  @Post('/group/membership')
  addToGroup(
    @Body()
    createPatientGroupMembershipDto: Prisma.patient_group_membershipCreateManyInput,
  ) {
    try {
      return this.patientService.addGroupMembership(
        createPatientGroupMembershipDto,
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
    return this.patientService.removeMembership(memberships);
  }
}
