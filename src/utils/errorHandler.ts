import { Response } from 'express';
import { AppError } from './errors';
import { sendError } from './apiResponse';

export const handleControllerError = (error: unknown, res: Response): void => {
  console.error('Controller error:', error);
  
  if (error instanceof AppError) {
    sendError(res, error.message, error.statusCode);
  } else if (error instanceof Error) {
    sendError(res, error.message, 500);
  } else if (typeof error === 'string') {
    sendError(res, error, 500);
  } else {
    sendError(res, 'Erro interno do servidor', 500);
  }
};

// Helper para extrair mensagem de erro de forma segura
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Erro desconhecido';
};