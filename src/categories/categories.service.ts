import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Categories, Prisma } from 'generated/prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getCategory(
    CategoriesWhereUniqueInput: Prisma.CategoriesWhereUniqueInput,
  ): Promise<Categories | null> {
    return this.prisma.categories.findUnique({
      where: CategoriesWhereUniqueInput,
    });
  }

  async getCategories(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoriesWhereUniqueInput;
    where?: Prisma.CategoriesWhereInput;
    orderBy?: Prisma.CategoriesOrderByWithRelationInput;
  }): Promise<Categories[] | null> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.categories.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createCategory(
    data: Prisma.CategoriesCreateInput,
  ): Promise<Categories> {
    return this.prisma.categories.create({
      data,
    });
  }

  async updateCategory(params: {
    where: Prisma.CategoriesWhereUniqueInput;
    data: Prisma.CategoriesUpdateInput;
  }): Promise<Categories> {
    const { where, data } = params;
    return this.prisma.categories.update({
      data,
      where,
    });
  }

  async deleteCategory(
    where: Prisma.CategoriesWhereUniqueInput,
  ): Promise<Categories> {
    return this.prisma.categories.delete({
      where,
    });
  }
}
