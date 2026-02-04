import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Locations, Prisma } from '../../generated/prisma/client';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async location(
    LocationsWhereUniqueInput: Prisma.LocationsWhereUniqueInput,
  ): Promise<Locations | null> {
    return this.prisma.locations.findUnique({
      where: LocationsWhereUniqueInput,
    });
  }

  async locations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LocationsWhereUniqueInput;
    where?: Prisma.LocationsWhereInput;
    orderBy?: Prisma.LocationsOrderByWithRelationInput;
  }): Promise<Locations[] | null> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.locations.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createLocation(data: Prisma.LocationsCreateInput): Promise<Locations> {
    return this.prisma.locations.create({
      data,
    });
  }

  async updateLocation(params: {
    where: Prisma.LocationsWhereUniqueInput;
    data: Prisma.LocationsUpdateInput;
  }): Promise<Locations> {
    const { where, data } = params;
    return this.prisma.locations.update({
      data,
      where,
    });
  }

  async deleteLocation(
    where: Prisma.LocationsWhereUniqueInput,
  ): Promise<Locations> {
    return this.prisma.locations.delete({
      where,
    });
  }
}
