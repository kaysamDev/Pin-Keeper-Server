import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Users } from '../../../generated/prisma/client';
import type { UsersCreateInput } from '../../../generated/prisma/models/Users';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<Users | null> {
    return this.userService.user({ id: Number(id) });
  }

  @Get('users')
  async getAllUsers(): Promise<Users[]> {
    return this.userService.users({});
  }

  @Post('user')
  async createUser(@Body() user: UsersCreateInput): Promise<UsersCreateInput> {
    return this.userService.createUser({
      ...user,
    });
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: Partial<Users>,
  ): Promise<Users> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: {
        ...user,
      },
    });
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string): Promise<Users> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
