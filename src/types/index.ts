// Tipos para autenticação
export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Tipos para usuário
export interface CreateUserInput {
  name: string;
  email: string;
  cpf: string;
  password: string;
  birthDate: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Tipos para conta bancária
export interface CreateAccountInput {
  userId: string;
  type: 'CHECKING' | 'SAVINGS' | 'SALARY';
  initialBalance?: number;
}

export interface TransactionInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

// Tipos para paginação (ADICIONE ESTE)
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos para erros
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
}

// Enums como constantes (já que SQLite não suporta enums)
export const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  SALARY: 'SALARY',
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

export const TransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  TRANSFER: 'TRANSFER',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export const TokenType = {
  REFRESH: 'REFRESH',
  RESET_PASSWORD: 'RESET_PASSWORD',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
} as const;

export type TokenType = typeof TokenType[keyof typeof TokenType];