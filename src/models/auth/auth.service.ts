import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { RefreshTokenService } from './refresh-token.service';
import { TokenResponseDto } from './dto/token-response.dto';

export type Profile = {
  user: Users;
};

interface JwtPayload {
  sub: number;
  username: string | null;
  fullName: string | null;
  role: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  saltRounds = 10;
  accessTokenExpiresIn = 60 * 60; // 1 hour in seconds

  private async generateTokens(user: Users): Promise<TokenResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.fullName,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      user.id,
      7, // 7 days expiry
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken.token,
      token_type: 'Bearer',
      expires_in: this.accessTokenExpiresIn,
    };
  }

  async signIn(email: string, pass: string): Promise<TokenResponseDto> {
    const user = await this.usersService.user({ email: email });

    const isMatch = user ? await bcrypt.compare(pass, user.password) : false;

    if (!isMatch || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
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

  async refreshTokens(refreshToken: string): Promise<TokenResponseDto> {
    const storedToken =
      await this.refreshTokenService.findRefreshToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > storedToken.expiresAt) {
      await this.refreshTokenService.deleteRefreshToken(refreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    // Get the user
    const user = await this.usersService.user({ id: storedToken.userId });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Delete the old refresh token (rotation)
    await this.refreshTokenService.deleteRefreshToken(refreshToken);

    // Generate new tokens
    return this.generateTokens(user);
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    await this.refreshTokenService.deleteRefreshToken(refreshToken);
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: number): Promise<{ message: string }> {
    await this.refreshTokenService.deleteAllUserRefreshTokens(userId);
    return { message: 'Logged out from all devices successfully' };
  }
}
