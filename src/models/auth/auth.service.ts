import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../../../generated/prisma/client';
import * as bcrypt from 'bcrypt';

export type Profile = {
  user: Users;
};
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  saltRounds = 10;

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.user({ email: email });

    const isMatch = user ? await bcrypt.compare(pass, user.password) : false;

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user?.id, username: user?.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, pass: string): Promise<Users> {
    const existingUser = await this.usersService.user({ email: email });
    if (existingUser) {
      throw new UnauthorizedException('User email already exists');
    }

    const hashedPassword = await bcrypt.hash(pass, this.saltRounds);

    return await this.usersService.createUser({
      email: email,
      password: hashedPassword,
    });
  }
}
