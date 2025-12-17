import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authService from '../../src/services/auth.service';
import { ConflictError, UnauthorizedError } from '../../src/utils/errors';
import prisma from '../../src/config/database';

// Mock do Prisma
jest.mock('../../src/config/database', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  token: {
    findFirst: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  },
  $disconnect: jest.fn(),
}));

// Mock do bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock do jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
  JsonWebTokenError: Error,
}));

describe('AuthService Unit Tests', () => {
  const mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    cpf: '111.222.333-44',
    password: 'hashedPassword123',
    birthDate: new Date('1990-01-01'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRegisterData = {
    name: 'Test User',
    email: 'test@example.com',
    cpf: '111.222.333-44',
    password: 'Test@1234',
    birthDate: '1990-01-01',
  };

  const mockLoginData = {
    email: 'test@example.com',
    password: 'Test@1234',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Mock: usuário não existe
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      // Mock: hash da senha
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      
      // Mock: criação do usuário
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-123',
        name: mockRegisterData.name,
        email: mockRegisterData.email,
      });

      const result = await authService.register(mockRegisterData);

      expect(result).toEqual({ userId: 'user-123' });
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterData.password, 12);
    });

    it('should throw ConflictError for duplicate email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

      await expect(authService.register(mockRegisterData))
        .rejects
        .toThrow(ConflictError);
    });

    it('should throw ConflictError for duplicate CPF', async () => {
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(null) // Email não existe
        .mockResolvedValueOnce(mockUser); // CPF existe

      await expect(authService.register(mockRegisterData))
        .rejects
        .toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Mock: usuário encontrado
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: mockLoginData.email,
        password: 'hashedPassword123',
        isActive: true,
      });

      // Mock: senha válida
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Mock: geração de tokens
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access-token-123')
        .mockReturnValueOnce('refresh-token-123');

      // Mock: salvar refresh token
      (jwt.decode as jest.Mock).mockReturnValue({ exp: 1234567890 });
      (prisma.token.create as jest.Mock).mockResolvedValue({});

      const result = await authService.login(mockLoginData);

      expect(result).toEqual({
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginData.password,
        'hashedPassword123'
      );
    });

    it('should throw UnauthorizedError for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(mockLoginData))
        .rejects
        .toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for invalid password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: mockLoginData.email,
        password: 'hashedPassword123',
        isActive: true,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(mockLoginData))
        .rejects
        .toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for inactive user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: mockLoginData.email,
        password: 'hashedPassword123',
        isActive: false,
      });

      await expect(authService.login(mockLoginData))
        .rejects
        .toThrow(UnauthorizedError);
    });
  });
});