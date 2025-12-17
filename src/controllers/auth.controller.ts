import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { handleControllerError } from '../utils/errorHandler';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 'Usuário registrado com sucesso', 201);
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const tokens = await authService.login(req.body);
      sendSuccess(res, tokens, 'Login realizado com sucesso');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const tokens = await authService.refreshToken(req.body);
      sendSuccess(res, tokens, 'Token atualizado com sucesso');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await authService.logout(req.body);
      sendSuccess(res, null, 'Logout realizado com sucesso');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }
}

export default new AuthController();