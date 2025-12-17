import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de autenticação não fornecido');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Token inválido ou expirado'));
      return;
    }
    next(error);
  }
};

// Middleware para verificar se usuário é dono da conta
export const checkAccountOwnership = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { userId } = req.user!;
    const accountId = req.params.id;

    // Verificação será feita no service
    req.params.accountId = accountId;
    req.params.userId = userId;
    
    next();
  } catch (error) {
    next(error);
  }
};