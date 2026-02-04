import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../../../generated/prisma/client';

export type Profile = {
  user: Users;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.user({ email: email });
    if (!user || user.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.email };

    // const { password, ...result } = user;
    // // TODO: Generate a JWT and return it here
    // // instead of the user object
    // return Promise.resolve(result);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, pass: string): Promise<Users> {
    const existingUser = await this.usersService.user({ email: email });
    if (existingUser) {
      throw new UnauthorizedException('User email already exists');
    }

    return await this.usersService.createUser({
      email: email,
      password: pass,
    });
  }
}
