import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { Categories, Prisma } from 'generated/prisma/client';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCategory(
    CategoriesWhereUniqueInput: Prisma.CategoriesWhereUniqueInput,
  ): Promise<Categories | null> {
    const cacheKey = CACHE_KEYS.CATEGORY_BY_ID(
      String(CategoriesWhereUniqueInput.id),
    );

    // Try to get from cache
    const cached = await this.cacheManager.get<Categories>(cacheKey);
    if (cached) {
      return cached;
    }

    const category = await this.prisma.categories.findUnique({
      where: CategoriesWhereUniqueInput,
    });

    if (category) {
      await this.cacheManager.set(cacheKey, category, CACHE_TTL.MEDIUM);
    }

    return category;
  }

  async getCategories(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoriesWhereUniqueInput;
    where?: Prisma.CategoriesWhereInput;
    orderBy?: Prisma.CategoriesOrderByWithRelationInput;
  }): Promise<Categories[] | null> {
    const { skip, take, cursor, where, orderBy } = params;

    // Only cache if no filters applied (simple list all)
    const isSimpleQuery = !skip && !take && !cursor && !where && !orderBy;

    if (isSimpleQuery) {
      const cached = await this.cacheManager.get<Categories[]>(
        CACHE_KEYS.CATEGORIES_ALL,
      );
      if (cached) {
        return cached;
      }
    }

    const categories = await this.prisma.categories.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    if (isSimpleQuery && categories) {
      await this.cacheManager.set(
        CACHE_KEYS.CATEGORIES_ALL,
        categories,
        CACHE_TTL.MEDIUM,
      );
    }

    return categories;
  }

  async createCategory(
    data: Prisma.CategoriesCreateInput,
  ): Promise<Categories> {
    const category = await this.prisma.categories.create({
      data,
    });

    // Invalidate list cache
    await this.cacheManager.del(CACHE_KEYS.CATEGORIES_ALL);

    return category;
  }

  async updateCategory(params: {
    where: Prisma.CategoriesWhereUniqueInput;
    data: Prisma.CategoriesUpdateInput;
  }): Promise<Categories> {
    const { where, data } = params;
    const category = await this.prisma.categories.update({
      data,
      where,
    });

    // Invalidate caches
    await this.cacheManager.del(CACHE_KEYS.CATEGORY_BY_ID(String(where.id)));
    await this.cacheManager.del(CACHE_KEYS.CATEGORIES_ALL);

    return category;
  }

  async deleteCategory(
    where: Prisma.CategoriesWhereUniqueInput,
  ): Promise<Categories> {
    const category = await this.prisma.categories.delete({
      where,
    });

    // Invalidate caches
    await this.cacheManager.del(CACHE_KEYS.CATEGORY_BY_ID(String(where.id)));
    await this.cacheManager.del(CACHE_KEYS.CATEGORIES_ALL);

    return category;
  }
}
