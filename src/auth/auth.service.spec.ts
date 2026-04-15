import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const result = await service.login({ username: 'admin', password: 'admin' });
      expect(result).toEqual({ access_token: 'mock_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'admin', sub: 1 });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      await expect(service.login({ username: 'wrong', password: 'user' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
