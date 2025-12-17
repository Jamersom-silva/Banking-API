import { z } from 'zod';
import { AccountType } from '../types';

// Schema para criar conta
export const createAccountSchema = z.object({
  type: z.nativeEnum(AccountType, {
    errorMap: () => ({ message: 'Tipo de conta inválido' }),
  }),
  initialBalance: z.number()
    .min(0, 'Saldo inicial não pode ser negativo')
    .optional()
    .default(0),
});
// Schema para depósito
export const depositSchema = z.object({
  amount: z.number()
    .positive('Valor deve ser positivo')
    .max(1000000, 'Valor máximo por depósito é R$ 1.000.000'),
  description: z.string()
    .max(200, 'Descrição muito longa')
    .optional(),
});

// Schema para saque
export const withdrawSchema = z.object({
  amount: z.number()
    .positive('Valor deve ser positivo')
    .max(50000, 'Valor máximo por saque é R$ 50.000'),
});

// Schema para transferência
export const transferSchema = z.object({
  toAccountId: z.string().uuid('ID da conta de destino inválido'),
  amount: z.number()
    .positive('Valor deve ser positivo')
    .max(100000, 'Valor máximo por transferência é R$ 100.000'),
  description: z.string()
    .max(200, 'Descrição muito longa')
    .optional(),
});

// Schema para consulta de extrato
export const statementSchema = z.object({
  from: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inicial deve estar no formato YYYY-MM-DD')
    .optional(),
  to: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data final deve estar no formato YYYY-MM-DD')
    .optional(),
  page: z.coerce.number()
    .int()
    .min(1, 'Página deve ser maior que 0')
    .default(1)
    .optional(),
  limit: z.coerce.number()
    .int()
    .min(1, 'Limite deve ser maior que 0')
    .max(100, 'Limite máximo é 100')
    .default(10)
    .optional(),
});

// Tipos inferidos
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
export type StatementInput = z.infer<typeof statementSchema>;