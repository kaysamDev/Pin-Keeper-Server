import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityLogs, Prisma } from '../../generated/prisma/client';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivityLog(
    ActivityLogsWhereUniqueInput: Prisma.ActivityLogsWhereUniqueInput,
  ): Promise<ActivityLogs | null> {
    return this.prisma.activityLogs.findUnique({
      where: ActivityLogsWhereUniqueInput,
      include: {
        user: true,
      },
    });
  }

  async getActivityLogs(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ActivityLogsWhereUniqueInput;
    where?: Prisma.ActivityLogsWhereInput;
    orderBy?: Prisma.ActivityLogsOrderByWithRelationInput;
  }): Promise<ActivityLogs[] | null> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.activityLogs.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        user: true,
      },
    });
  }

  async getActivityLogsByUserId(
    userId: number,
  ): Promise<ActivityLogs[] | null> {
    return this.prisma.activityLogs.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createActivityLog(
    data: Prisma.ActivityLogsCreateInput,
  ): Promise<ActivityLogs> {
    return this.prisma.activityLogs.create({
      data,
      include: {
        user: true,
      },
    });
  }

  // async updateActivityLog(params: {
  //   where: Prisma.ActivityLogsWhereUniqueInput;
  //   data: Prisma.ActivityLogsUpdateInput;
  // }): Promise<ActivityLogs> {
  //   const { where, data } = params;
  //   return this.prisma.activityLogs.update({
  //     data,
  //     where,
  //     include: {
  //       user: true,
  //     },
  //   });
  // }

  // async deleteActivityLog(
  //   where: Prisma.ActivityLogsWhereUniqueInput,
  // ): Promise<ActivityLogs> {
  //   return this.prisma.activityLogs.delete({
  //     where,
  //   });
  // }
}
