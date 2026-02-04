import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaService } from '../../prisma.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService, PrismaService],
})
export class UsersModule {}
