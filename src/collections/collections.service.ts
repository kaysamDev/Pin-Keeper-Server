import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { Collections, Prisma } from 'generated/prisma/client';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';

@Injectable()
export class CollectionsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCollection(
    CollectionsWhereUniqueInput: Prisma.CollectionsWhereUniqueInput,
  ): Promise<Collections | null> {
    const cacheKey = CACHE_KEYS.COLLECTION_BY_ID(
      String(CollectionsWhereUniqueInput.id),
    );

    // Try to get from cache
    const cached = await this.cacheManager.get<Collections>(cacheKey);
    if (cached) {
      return cached;
    }

    const collection = await this.prisma.collections.findUnique({
      where: CollectionsWhereUniqueInput,
      include: {
        user: true,
        CollectionItems: true,
      },
    });

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
  }): Promise<Collections[] | null> {
    const { skip, take, cursor, where, orderBy } = params;

    // Cache user-specific collections list
    const userId = where?.userId as string | undefined;
    const isUserSpecificQuery = userId && !skip && !take && !cursor && !orderBy;
    const cacheKey = userId ? CACHE_KEYS.COLLECTIONS_BY_USER(userId) : null;

    if (isUserSpecificQuery && cacheKey) {
      const cached = await this.cacheManager.get<Collections[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const collections = await this.prisma.collections.findMany({
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

    if (isUserSpecificQuery && cacheKey && collections) {
      await this.cacheManager.set(cacheKey, collections, CACHE_TTL.SHORT);
    }

    return collections;
  }

  async createCollection(
    data: Prisma.CollectionsCreateInput,
  ): Promise<Collections> {
    const collection = await this.prisma.collections.create({
      data,
      include: {
        user: true,
        CollectionItems: true,
      },
    });

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
  }): Promise<Collections> {
    const { where, data } = params;
    const collection = await this.prisma.collections.update({
      data,
      where,
      include: {
        user: true,
        CollectionItems: true,
      },
    });

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
  ): Promise<Collections> {
    const collection = await this.prisma.collections.delete({
      where,
    });

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
