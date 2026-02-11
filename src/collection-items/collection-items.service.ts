import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CollectionItems, Prisma } from 'generated/prisma/client';

@Injectable()
export class CollectionItemsService {
  constructor(private prisma: PrismaService) {}

  async getCollectionItem(
    CollectionItemsWhereUniqueInput: Prisma.CollectionItemsWhereUniqueInput,
  ): Promise<CollectionItems | null> {
    return this.prisma.collectionItems.findUnique({
      where: CollectionItemsWhereUniqueInput,
      include: {
        collection: true,
        location: true,
      },
    });
  }

  async getCollectionItems(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CollectionItemsWhereUniqueInput;
    where?: Prisma.CollectionItemsWhereInput;
    orderBy?: Prisma.CollectionItemsOrderByWithRelationInput;
  }): Promise<CollectionItems[] | null> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.collectionItems.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        collection: true,
        location: true,
      },
    });
  }

  async getCollectionItemsByCollectionId(
    collectionId: number,
  ): Promise<CollectionItems[] | null> {
    return this.prisma.collectionItems.findMany({
      where: { collectionId },
      include: {
        collection: true,
        location: true,
      },
    });
  }

  async getCollectionItemsByLocationId(
    locationId: number,
  ): Promise<CollectionItems[] | null> {
    return this.prisma.collectionItems.findMany({
      where: { locationId },
      include: {
        collection: true,
        location: true,
      },
    });
  }

  async createCollectionItem(
    data: Prisma.CollectionItemsCreateInput,
  ): Promise<CollectionItems> {
    return this.prisma.collectionItems.create({
      data,
      include: {
        collection: true,
        location: true,
      },
    });
  }

  async deleteCollectionItem(
    where: Prisma.CollectionItemsWhereUniqueInput,
  ): Promise<CollectionItems> {
    return this.prisma.collectionItems.delete({
      where,
    });
  }
}
