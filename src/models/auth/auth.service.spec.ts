import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../../../src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token.service';

describe('AuthService profile', () => {
  let service: AuthService;
  const profile = {
    id: 7,
    email: 'user@example.com',
    profileImageUrl: 'https://example.com/avatar.png',
  };
  const usersServiceMock = {
    profile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: usersServiceMock },
        { provide: JwtService, useValue: {} },
        { provide: RefreshTokenService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('returns the hydrated profile for a valid user id', async () => {
    usersServiceMock.profile.mockResolvedValue(profile);

    await expect(service.getProfile(7)).resolves.toBe(profile);
    expect(usersServiceMock.profile).toHaveBeenCalledWith(7);
  });

  it('rejects an invalid user id', async () => {
    await expect(service.getProfile(0)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(usersServiceMock.profile).not.toHaveBeenCalled();
  });

  it('rejects when the user no longer exists', async () => {
    usersServiceMock.profile.mockResolvedValue(null);

    await expect(service.getProfile(7)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
