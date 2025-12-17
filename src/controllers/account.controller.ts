import { Request, Response } from 'express';
import accountService from '../services/account.service';
import { sendSuccess } from '../utils/apiResponse';
import { handleControllerError } from '../utils/errorHandler';
import { AuthRequest } from '../middlewares/auth';

class AccountController {
  async createAccount(req: AuthRequest, res: Response) {
    try {
      const account = await accountService.createAccount(req.user!.userId, req.body);
      sendSuccess(res, account, 'Conta criada com sucesso', 201);
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

    // ✅ NOVO: Verificar consistência do saldo
  async verifyBalance(req: AuthRequest, res: Response) {
    try {
      const result = await accountService.verifyBalance(
        req.params.id,
        req.user!.userId
      );
      sendSuccess(res, result, 'Consistência verificada');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

  async getAccount(req: AuthRequest, res: Response) {
    try {
      const account = await accountService.getAccount(
        req.user!.userId, 
        req.params.id
      );
      sendSuccess(res, account, 'Conta encontrada');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

  async deposit(req: AuthRequest, res: Response) {
    try {
      const result = await accountService.deposit(
        req.user!.userId,
        req.params.id,
        req.body
      );
      sendSuccess(res, result, 'Depósito realizado com sucesso');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

  async withdraw(req: AuthRequest, res: Response) {
    try {
      const result = await accountService.withdraw(
        req.user!.userId,
        req.params.id,
        req.body
      );
      sendSuccess(res, result, 'Saque realizado com sucesso');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

  async transfer(req: AuthRequest, res: Response) {
    try {
      const result = await accountService.transfer(
        req.user!.userId,
        req.params.id,
        req.body
      );
      sendSuccess(res, result, 'Transferência realizada com sucesso');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

  async getStatement(req: AuthRequest, res: Response) {
    try {
      const result = await accountService.getStatement(
        req.user!.userId,
        req.params.id,
        req.query as any
      );
      sendSuccess(res, result, 'Extrato obtido com sucesso');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }

  async getUserAccounts(req: AuthRequest, res: Response) {
    try {
      const accounts = await accountService.getUserAccounts(req.user!.userId);
      sendSuccess(res, accounts, 'Contas obtidas com sucesso');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }
  // ✅ NOVO: Obter saldo atual
  async getBalance(req: AuthRequest, res: Response) {
    try {
      const result = await accountService.getCurrentBalance(
        req.params.id,
        req.user!.userId
      );
      sendSuccess(res, result, 'Saldo obtido com sucesso');
    } catch (error: unknown) {
      handleControllerError(error, res);
    }
  }
}




export default new AccountController();