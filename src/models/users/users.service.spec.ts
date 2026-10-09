import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { PrismaService } from '../../prisma.service';

describe('UsersService', () => {
  let service: UserService;
  const findUnique = jest.fn();
  const prismaServiceMock = {
    users: {
      findUnique,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns a safe relation-inclusive profile', async () => {
    const profile = {
      id: 7,
      profileImageUrl: 'https://example.com/avatar.png',
    };
    findUnique.mockResolvedValue(profile);

    await expect(service.profile(7)).resolves.toBe(profile);
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 7 },
      select: {
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
      },
    });
  });
});
