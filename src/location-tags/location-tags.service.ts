import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LocationTags, Prisma } from '../../generated/prisma/client';

@Injectable()
export class LocationTagsService {
  constructor(private prisma: PrismaService) {}

  async getLocationTag(
    LocationTagsWhereUniqueInput: Prisma.LocationTagsWhereUniqueInput,
  ): Promise<LocationTags | null> {
    return this.prisma.locationTags.findUnique({
      where: LocationTagsWhereUniqueInput,
      include: {
        tag: true,
        location: true,
      },
    });
  }

  async getLocationTags(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LocationTagsWhereUniqueInput;
    where?: Prisma.LocationTagsWhereInput;
    orderBy?: Prisma.LocationTagsOrderByWithRelationInput;
  }): Promise<LocationTags[] | null> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.locationTags.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        tag: true,
        location: true,
      },
    });
  }

  async getLocationTagsByLocationId(
    locationId: number,
  ): Promise<LocationTags[] | null> {
    return this.prisma.locationTags.findMany({
      where: { locationId },
      include: {
        tag: true,
        location: true,
      },
    });
  }

  async getLocationTagsByTagId(tagId: number): Promise<LocationTags[] | null> {
    return this.prisma.locationTags.findMany({
      where: { tagId },
      include: {
        tag: true,
        location: true,
      },
    });
  }

  async createLocationTag(
    data: Prisma.LocationTagsCreateInput,
  ): Promise<LocationTags> {
    return this.prisma.locationTags.create({
      data,
      include: {
        tag: true,
        location: true,
      },
    });
  }

  async deleteLocationTag(
    where: Prisma.LocationTagsWhereUniqueInput,
  ): Promise<LocationTags> {
    return this.prisma.locationTags.delete({
      where,
    });
  }
}
