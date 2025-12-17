import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/database';
import { 
  RegisterInput, 
  LoginInput, 
  RefreshTokenInput,
  LogoutInput 
} from '../schemas/auth.schemas';
import { 
  AppError, 
  UnauthorizedError, 
  ValidationError, 
  ConflictError 
} from '../utils/errors';
import { AuthTokens } from '../types';

export class AuthService {
  private readonly SALT_ROUNDS: number;

  constructor() {
    this.SALT_ROUNDS = env.BCRYPT_SALT_ROUNDS;
  }

  // Registrar novo usuário
  async register(data: RegisterInput): Promise<{ userId: string }> {
    // Verificar se email já existe
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new ConflictError('Email já cadastrado');
    }

    // Verificar se CPF já existe
    const existingCpf = await prisma.user.findUnique({
      where: { cpf: data.cpf },
    });

    if (existingCpf) {
      throw new ConflictError('CPF já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        password: hashedPassword,
        birthDate: new Date(data.birthDate),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return { userId: user.id };
  }

  // Login de usuário
  async login(data: LoginInput): Promise<AuthTokens> {
    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        password: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Conta desativada');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    // Gerar tokens
    const tokens = this.generateTokens(user.id, user.email);
    
    // Salvar refresh token no banco (para blacklist/rotation)
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // Refresh token
  async refreshToken(data: RefreshTokenInput): Promise<AuthTokens> {
    try {
      // Verificar token
      const payload = jwt.verify(data.refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload & {
        userId: string;
        email: string;
      };

      // Verificar se token está na blacklist
      const tokenInBlacklist = await prisma.token.findFirst({
        where: {
          token: data.refreshToken,
          isRevoked: true,
        },
      });

      if (tokenInBlacklist) {
        throw new UnauthorizedError('Token inválido');
      }

      // Gerar novos tokens
      const tokens = this.generateTokens(payload.userId, payload.email);
      
      // Invalidar token antigo
      await prisma.token.updateMany({
        where: {
          token: data.refreshToken,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });

      // Salvar novo refresh token
      await this.saveRefreshToken(payload.userId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token inválido ou expirado');
      }
      throw error;
    }
  }

  // Logout
  async logout(data: LogoutInput): Promise<void> {
    try {
      // Verificar token
      jwt.verify(data.refreshToken, env.JWT_REFRESH_SECRET);
      
      // Invalidar token
      await prisma.token.updateMany({
        where: {
          token: data.refreshToken,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });
    } catch (error) {
      // Não lançar erro se token for inválido - logout deve sempre "funcionar"
      console.log('Logout com token inválido');
    }
  }

  // Gerar tokens JWT
  private generateTokens(userId: string, email: string): AuthTokens {
    const accessToken = jwt.sign(
      { userId, email },
      env.JWT_SECRET,
      { expiresIn: env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
      { userId, email },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions['expiresIn'] }
    );

    return { accessToken, refreshToken };
  }

  // Salvar refresh token no banco
  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      
      if (!decoded || !decoded.exp) {
        throw new Error('Token inválido ao decodificar');
      }

      await prisma.token.create({
        data: {
          userId,
          token,
          type: 'REFRESH',
          expiresAt: new Date(decoded.exp * 1000),
        },
      });
    } catch (error) {
      console.error('Erro ao salvar refresh token:', error);
      // Não lançar erro para não quebrar o login/refresh
    }
  }
}

export default new AuthService();