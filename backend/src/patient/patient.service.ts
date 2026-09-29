/*
 * Název souboru:    patient.service.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Servis zajišťující přístup k entitě patient a patient_group v databázi
 *                   pomocí Prisma ORM – obsahuje CRUD logiku.
 */

import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPatientDto: Prisma.patientCreateInput) {
    return this.prismaService.patient.create({ data: createPatientDto });
  }

  async findAll() {
    return await this.prismaService.patient.findMany({
      include: {
        patient_groups: true,
      },
    });
  }

  async findOne(id: string) {
    const patient = await this.prismaService.patient.findUnique({
      where: {
        id,
      },
      include: {
        patient_weights: {
          take: 1,
          orderBy: {
            date: 'desc',
          },
          select: {
            weight: true,
          },
        },
      },
    });
    return {
      ...patient, // Zkopíruje všechny atributy pacienta
      weight: patient?.patient_weights?.[0]?.weight || null, // Přidáme poslední váhu jako nový atribut
    };
  }

  async findPatientExaminations(patientId: string) {
    return await this.prismaService.examination.findMany({
      where: {
        patientId,
      },
      include: {
        patient: true,
        examination_groups: true,
      },
    });
  }

  async update(id: string, updatePatientDto: Prisma.patientUpdateInput) {
    return await this.prismaService.patient.update({
      where: {
        id,
      },
      data: updatePatientDto,
    });
  }

  async remove(ids: string[]) {
    return await this.prismaService.patient.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async addGroupMembership(
    createPatientGroupMembershipDto: Prisma.patient_group_membershipCreateManyInput,
  ) {
    try {
      await this.prismaService.patient_group_membership.createMany({
        data: createPatientGroupMembershipDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.warn('Duplicate membership detected. Skipping...');
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  async addGroup(createPatientGroupDto: Prisma.patient_groupCreateInput) {
    try {
      return await this.prismaService.patient_group.create({
        data: createPatientGroupDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Group with this name already exists.');
        }
      }
    }
  }

  async findAllGroups() {
    return await this.prismaService.patient_group.findMany({});
  }

  async getGroupMembership() {
    return await this.prismaService.patient_group_membership.findMany();
  }

  async removeMembership(memberships: { item_id: string; group_id: string }[]) {
    return await this.prismaService.patient_group_membership.deleteMany({
      where: {
        OR: memberships.map((membership) => ({
          item_id: membership.item_id,
          group_id: membership.group_id,
        })),
      },
    });
  }

  async removeGroup(ids: string[]) {
    return await this.prismaService.patient_group.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async editGroup(
    id: string,
    patientExaminationGroupDto: Prisma.patient_groupUpdateInput,
  ) {
    return await this.prismaService.patient_group.update({
      where: {
        id: id,
      },
      data: {
        name: patientExaminationGroupDto.name,
      },
    });
  }
}
