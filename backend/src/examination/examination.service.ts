/*
 * Název souboru:    examination.service.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Servis zajišťující přístup k entitě examination a examination_group v databázi
 *                   pomocí Prisma ORM – obsahuje CRUD logiku.
 */

import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExaminationService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createExaminationDto: Prisma.examinationCreateInput) {
    return this.prismaService.examination.create({
      data: createExaminationDto,
    });
  }

  async findManyByIds(ids: string[]) {
    return await this.prismaService.examination.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        patient: true,
        examination_groups: true,
      },
    });
  }

  async findAll() {
    return await this.prismaService.examination.findMany({
      include: {
        patient: true,
        examination_groups: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return await this.prismaService.examination.findUnique({
      where: {
        id: id,
      },
      include: {
        patient: true,
      },
    });
  }

  async remove(ids: string[]) {
    return await this.prismaService.examination.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async addGroupMembership(
    createExaminationGroupMembershipDto: Prisma.examination_group_membershipCreateManyInput,
  ) {
    try {
      await this.prismaService.examination_group_membership.createMany({
        data: createExaminationGroupMembershipDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.warn('Duplicate membership detected. Skipping...');
        }
      }
    }
  }

  async addGroup(
    createExaminationGroupDto: Prisma.examination_groupCreateInput,
  ) {
    try {
      return await this.prismaService.examination_group.create({
        data: createExaminationGroupDto,
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
    return await this.prismaService.examination_group.findMany({});
  }

  async removeMembership(memberships: { item_id: string; group_id: string }[]) {
    return await this.prismaService.examination_group_membership.deleteMany({
      where: {
        OR: memberships.map((membership) => ({
          item_id: membership.item_id,
          group_id: membership.group_id,
        })),
      },
    });
  }

  async getGroupMembership() {
    return await this.prismaService.examination_group_membership.findMany();
  }

  async removeGroup(ids: string[]) {
    return await this.prismaService.examination_group.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
  async editGroup(
    id: string,
    updateExaminationGroupDto: Prisma.examination_groupUpdateInput,
  ) {
    return await this.prismaService.examination_group.update({
      where: {
        id: id,
      },
      data: {
        name: updateExaminationGroupDto.name,
      },
    });
  }
}
