import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Tags, Prisma } from 'generated/prisma/client';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async getTag(
    TagsWhereUniqueInput: Prisma.TagsWhereUniqueInput,
  ): Promise<Tags | null> {
    return this.prisma.tags.findUnique({
      where: TagsWhereUniqueInput,
    });
  }

  async getTags(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TagsWhereUniqueInput;
    where?: Prisma.TagsWhereInput;
    orderBy?: Prisma.TagsOrderByWithRelationInput;
  }): Promise<Tags[] | null> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.tags.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createTag(data: Prisma.TagsCreateInput): Promise<Tags> {
    return this.prisma.tags.create({
      data,
    });
  }

  async updateTag(params: {
    where: Prisma.TagsWhereUniqueInput;
    data: Prisma.TagsUpdateInput;
  }): Promise<Tags> {
    const { where, data } = params;
    return this.prisma.tags.update({
      data,
      where,
    });
  }

  async deleteTag(where: Prisma.TagsWhereUniqueInput): Promise<Tags> {
    return this.prisma.tags.delete({
      where,
    });
  }
}
