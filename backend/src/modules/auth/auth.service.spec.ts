import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let usersService: UsersService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    mockUsersService.create.mockImplementation(() => { throw new ConflictException(); });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        validatePassword: jest.fn().mockImplementation(async (password) => {
          return await bcrypt.compare(password, user.password);
        }),
      };
      mockUsersService.findByEmail.mockResolvedValue(user);
      const result = await service.validateUser('test@test.com', 'password123');
      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      
      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const user = {
        email: 'test@test.com',
        password: await bcrypt.hash('correctpassword', 10)
      };
      mockUserRepository.findOne.mockResolvedValue(user);
      
      const result = await service.validateUser('test@test.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should throw error when email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ email: 'test@test.com', id: '1' });
      await expect(service.register({
        email: 'test@test.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        role: 'proprietaire',
        acceptTerms: true
      })).rejects.toThrow(ConflictException);
    });
  });
});