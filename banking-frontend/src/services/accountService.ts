import { api } from './api';
import type { BankTransaction } from '../types/Transaction';

/**
 * Lista todas as contas do usuário autenticado
 */
export async function getAccounts() {
  const response = await api.get('/api/v1/accounts');
  return response.data;
}

/**
 * Retorna o saldo da conta
 */
export async function getBalance(accountId: string): Promise<number> {
  const response = await api.get(
    `/api/v1/accounts/${accountId}/balance`
  );
  return response.data.balance;
}

/**
 * Retorna o extrato da conta
 */
export async function getStatement(
  accountId: string
): Promise<BankTransaction[]> {
  const response = await api.get(
    `/api/v1/accounts/${accountId}/statement`
  );
  return response.data;
}
