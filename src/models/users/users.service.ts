import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, Users } from '../../../generated/prisma/client';

const userProfileSelect = {
  id: true,
  email: true,
  fullName: true,
  profileImageUrl: true,
  role: true,
  provider: true,
  createdAt: true,
  Location: true,
  Collections: true,
  ActivityLogs: true,
  RefreshTokens: {
    select: {
      id: true,
      userId: true,
      createdAt: true,
      expiresAt: true,
    },
  },
} satisfies Prisma.UsersSelect;

export type UserProfile = {
  id: number;
  email: string;
  fullName: string | null;
  profileImageUrl: string | null;
  role: string;
  provider: string | null;
  createdAt: Date;
  Location: unknown[];
  Collections: unknown[];
  ActivityLogs: unknown[];
  RefreshTokens: unknown[];
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UsersWhereUniqueInput,
  ): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async profile(userId: number): Promise<UserProfile | null> {
    const profile = await this.prisma.users.findUnique({
      where: { id: userId },
      select: userProfileSelect,
    });

    return profile;
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UsersWhereUniqueInput;
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
  }): Promise<Users[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.users.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UsersCreateInput): Promise<Users> {
    return this.prisma.users.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UsersWhereUniqueInput;
    data: Prisma.UsersUpdateInput;
  }): Promise<Users> {
    const { where, data } = params;
    return this.prisma.users.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UsersWhereUniqueInput): Promise<Users> {
    return this.prisma.users.delete({
      where,
    });
  }
}
