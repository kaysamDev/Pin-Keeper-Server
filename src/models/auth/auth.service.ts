import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from 'src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';

export type Profile = {
  user: User;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.userId, username: user.username };

    // const { password, ...result } = user;
    // // TODO: Generate a JWT and return it here
    // // instead of the user object
    // return Promise.resolve(result);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
