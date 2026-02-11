import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Collections, Prisma } from 'generated/prisma/client';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async getCollection(
    CollectionsWhereUniqueInput: Prisma.CollectionsWhereUniqueInput,
  ): Promise<Collections | null> {
    return this.prisma.collections.findUnique({
      where: CollectionsWhereUniqueInput,
      include: {
        user: true,
        CollectionItems: true,
      },
    });
  }

  async getCollections(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CollectionsWhereUniqueInput;
    where?: Prisma.CollectionsWhereInput;
    orderBy?: Prisma.CollectionsOrderByWithRelationInput;
  }): Promise<Collections[] | null> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.collections.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        user: true,
        CollectionItems: true,
      },
    });
  }

  async createCollection(
    data: Prisma.CollectionsCreateInput,
  ): Promise<Collections> {
    return this.prisma.collections.create({
      data,
      include: {
        user: true,
        CollectionItems: true,
      },
    });
  }

  async updateCollection(params: {
    where: Prisma.CollectionsWhereUniqueInput;
    data: Prisma.CollectionsUpdateInput;
  }): Promise<Collections> {
    const { where, data } = params;
    return this.prisma.collections.update({
      data,
      where,
      include: {
        user: true,
        CollectionItems: true,
      },
    });
  }

  async deleteCollection(
    where: Prisma.CollectionsWhereUniqueInput,
  ): Promise<Collections> {
    return this.prisma.collections.delete({
      where,
    });
  }
}
