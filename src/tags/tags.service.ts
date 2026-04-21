import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { Tags, Prisma } from '../../generated/prisma/client';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getTag(
    TagsWhereUniqueInput: Prisma.TagsWhereUniqueInput,
  ): Promise<Tags | null> {
    const cacheKey = CACHE_KEYS.TAG_BY_ID(String(TagsWhereUniqueInput.id));

    // Try to get from cache
    const cached = await this.cacheManager.get<Tags>(cacheKey);
    if (cached) {
      return cached;
    }

    const tag = await this.prisma.tags.findUnique({
      where: TagsWhereUniqueInput,
    });

    if (tag) {
      await this.cacheManager.set(cacheKey, tag, CACHE_TTL.MEDIUM);
    }

    return tag;
  }

  async getTags(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TagsWhereUniqueInput;
    where?: Prisma.TagsWhereInput;
    orderBy?: Prisma.TagsOrderByWithRelationInput;
  }): Promise<Tags[] | null> {
    const { skip, take, cursor, where, orderBy } = params;

    // Only cache if no filters applied (simple list all)
    const isSimpleQuery = !skip && !take && !cursor && !where && !orderBy;

    if (isSimpleQuery) {
      const cached = await this.cacheManager.get<Tags[]>(CACHE_KEYS.TAGS_ALL);
      if (cached) {
        return cached;
      }
    }

    const tags = await this.prisma.tags.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    if (isSimpleQuery && tags) {
      await this.cacheManager.set(CACHE_KEYS.TAGS_ALL, tags, CACHE_TTL.MEDIUM);
    }

    return tags;
  }

  async createTag(data: Prisma.TagsCreateInput): Promise<Tags> {
    const tag = await this.prisma.tags.create({
      data,
    });

    // Invalidate list cache
    await this.cacheManager.del(CACHE_KEYS.TAGS_ALL);

    return tag;
  }

  async updateTag(params: {
    where: Prisma.TagsWhereUniqueInput;
    data: Prisma.TagsUpdateInput;
  }): Promise<Tags> {
    const { where, data } = params;
    const tag = await this.prisma.tags.update({
      data,
      where,
    });

    // Invalidate caches
    await this.cacheManager.del(CACHE_KEYS.TAG_BY_ID(String(where.id)));
    await this.cacheManager.del(CACHE_KEYS.TAGS_ALL);

    return tag;
  }

  async deleteTag(where: Prisma.TagsWhereUniqueInput): Promise<Tags> {
    const tag = await this.prisma.tags.delete({
      where,
    });

    // Invalidate caches
    await this.cacheManager.del(CACHE_KEYS.TAG_BY_ID(String(where.id)));
    await this.cacheManager.del(CACHE_KEYS.TAGS_ALL);

    return tag;
  }
}
