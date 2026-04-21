import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { Locations, Prisma } from '../../generated/prisma/client';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';

@Injectable()
export class LocationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async location(
    LocationsWhereUniqueInput: Prisma.LocationsWhereUniqueInput,
  ): Promise<Locations | null> {
    const cacheKey = CACHE_KEYS.LOCATION_BY_ID(
      String(LocationsWhereUniqueInput.id),
    );

    // Try to get from cache
    const cached = await this.cacheManager.get<Locations>(cacheKey);
    if (cached) {
      return cached;
    }

    const location = await this.prisma.locations.findUnique({
      where: LocationsWhereUniqueInput,
    });

    if (location) {
      await this.cacheManager.set(cacheKey, location, CACHE_TTL.MEDIUM);
    }

    return location;
  }

  async locations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LocationsWhereUniqueInput;
    where?: Prisma.LocationsWhereInput;
    orderBy?: Prisma.LocationsOrderByWithRelationInput;
  }): Promise<Locations[] | null> {
    const { skip, take, cursor, where, orderBy } = params;

    // Only cache if no filters applied (simple list all)
    const isSimpleQuery = !skip && !take && !cursor && !where && !orderBy;

    if (isSimpleQuery) {
      const cached = await this.cacheManager.get<Locations[]>(
        CACHE_KEYS.LOCATIONS_ALL,
      );
      if (cached) {
        return cached;
      }
    }

    const locations = await this.prisma.locations.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    if (isSimpleQuery && locations) {
      await this.cacheManager.set(
        CACHE_KEYS.LOCATIONS_ALL,
        locations,
        CACHE_TTL.MEDIUM,
      );
    }

    return locations;
  }

  async createLocation(data: Prisma.LocationsCreateInput): Promise<Locations> {
    const location = await this.prisma.locations.create({
      data,
    });

    // Invalidate list cache
    await this.cacheManager.del(CACHE_KEYS.LOCATIONS_ALL);

    return location;
  }

  async updateLocation(params: {
    where: Prisma.LocationsWhereUniqueInput;
    data: Prisma.LocationsUpdateInput;
  }): Promise<Locations> {
    const { where, data } = params;
    const location = await this.prisma.locations.update({
      data,
      where,
    });

    // Invalidate caches
    await this.cacheManager.del(CACHE_KEYS.LOCATION_BY_ID(String(where.id)));
    await this.cacheManager.del(CACHE_KEYS.LOCATIONS_ALL);

    return location;
  }

  async deleteLocation(
    where: Prisma.LocationsWhereUniqueInput,
  ): Promise<Locations> {
    const location = await this.prisma.locations.delete({
      where,
    });

    // Invalidate caches
    await this.cacheManager.del(CACHE_KEYS.LOCATION_BY_ID(String(where.id)));
    await this.cacheManager.del(CACHE_KEYS.LOCATIONS_ALL);

    return location;
  }
}
