import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';

type CollectionEntity = {
  id: number;
  userId: number;
  [key: string]: unknown;
};

type CollectionWithRelations = CollectionEntity & {
  user?: unknown;
  CollectionItems?: unknown[];
};

@Injectable()
export class CollectionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getCollection(
    CollectionsWhereUniqueInput: Prisma.CollectionsWhereUniqueInput,
  ): Promise<CollectionWithRelations | null> {
    const cacheKey = CACHE_KEYS.COLLECTION_BY_ID(
      String(CollectionsWhereUniqueInput.id),
    );

    // Try to get from cache
    const cached =
      await this.cacheManager.get<CollectionWithRelations>(cacheKey);
    if (cached) {
      return cached;
    }

    const collection = (await this.prisma.collections.findUnique({
      where: CollectionsWhereUniqueInput,
      include: {
        user: true,
        CollectionItems: true,
      },
    })) as unknown as CollectionWithRelations | null;

    if (collection) {
      await this.cacheManager.set(cacheKey, collection, CACHE_TTL.SHORT);
    }

    return collection;
  }

  async getCollections(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CollectionsWhereUniqueInput;
    where?: Prisma.CollectionsWhereInput;
    orderBy?: Prisma.CollectionsOrderByWithRelationInput;
  }): Promise<CollectionWithRelations[] | null> {
    const { skip, take, cursor, where, orderBy } = params;

    // Cache user-specific collections list
    const userId = where?.userId;
    const isUserSpecificQuery =
      typeof userId === 'number' && !skip && !take && !cursor && !orderBy;
    const cacheKey =
      typeof userId === 'number'
        ? CACHE_KEYS.COLLECTIONS_BY_USER(String(userId))
        : null;

    if (isUserSpecificQuery && cacheKey) {
      const cached =
        await this.cacheManager.get<CollectionWithRelations[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const collections = (await this.prisma.collections.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        user: true,
        CollectionItems: true,
      },
    })) as unknown as CollectionWithRelations[];

    if (isUserSpecificQuery && cacheKey && collections) {
      await this.cacheManager.set(cacheKey, collections, CACHE_TTL.SHORT);
    }

    return collections;
  }

  async createCollection(
    data: Prisma.CollectionsCreateInput,
  ): Promise<CollectionWithRelations> {
    const collection = (await this.prisma.collections.create({
      data,
      include: {
        user: true,
        CollectionItems: true,
      },
    })) as unknown as CollectionWithRelations;

    // Invalidate user's collections cache
    if (collection.userId) {
      await this.cacheManager.del(
        CACHE_KEYS.COLLECTIONS_BY_USER(String(collection.userId)),
      );
    }

    return collection;
  }

  async updateCollection(params: {
    where: Prisma.CollectionsWhereUniqueInput;
    data: Prisma.CollectionsUpdateInput;
  }): Promise<CollectionWithRelations> {
    const { where, data } = params;
    const collection = (await this.prisma.collections.update({
      data,
      where,
      include: {
        user: true,
        CollectionItems: true,
      },
    })) as unknown as CollectionWithRelations;

    // Invalidate caches
    await this.cacheManager.del(CACHE_KEYS.COLLECTION_BY_ID(String(where.id)));
    if (collection.userId) {
      await this.cacheManager.del(
        CACHE_KEYS.COLLECTIONS_BY_USER(String(collection.userId)),
      );
    }

    return collection;
  }

  async deleteCollection(
    where: Prisma.CollectionsWhereUniqueInput,
  ): Promise<CollectionEntity> {
    const collection = (await this.prisma.collections.delete({
      where,
    })) as unknown as CollectionEntity;

    // Invalidate caches
    await this.cacheManager.del(CACHE_KEYS.COLLECTION_BY_ID(String(where.id)));
    if (collection.userId) {
      await this.cacheManager.del(
        CACHE_KEYS.COLLECTIONS_BY_USER(String(collection.userId)),
      );
    }

    return collection;
  }
}
