import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { RefreshTokens, Prisma } from '../../../generated/prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(private prisma: PrismaService) {}

  // Generate a secure random refresh token
  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  // Create and store a refresh token for a user
  async createRefreshToken(
    userId: number,
    expiresInDays: number = 7,
  ): Promise<RefreshTokens> {
    const token = this.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return this.prisma.refreshTokens.create({
      data: {
        token,
        expiresAt,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  // Find a refresh token by its value
  async findRefreshToken(token: string): Promise<RefreshTokens | null> {
    return this.prisma.refreshTokens.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
  }

  // Delete a specific refresh token (logout)
  async deleteRefreshToken(token: string): Promise<RefreshTokens | null> {
    try {
      return await this.prisma.refreshTokens.delete({
        where: { token },
      });
    } catch {
      return null;
    }
  }

  // Delete all refresh tokens for a user (logout from all devices)
  async deleteAllUserRefreshTokens(
    userId: number,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshTokens.deleteMany({
      where: { userId },
    });
  }

  // Delete expired refresh tokens (cleanup)
  async deleteExpiredTokens(): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshTokens.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  // Check if a refresh token is valid (exists and not expired)
  async isValidRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await this.findRefreshToken(token);

    if (!refreshToken) {
      return false;
    }

    if (new Date() > refreshToken.expiresAt) {
      // Token is expired, delete it
      await this.deleteRefreshToken(token);
      return false;
    }

    return true;
  }
}
