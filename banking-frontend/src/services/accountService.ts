import { api } from './api';
import type { Account } from '../types/Account';
import type { BankTransaction } from '../types/Transaction';

export async function getAccounts(): Promise<Account[]> {
  const response = await api.get('/accounts');
  return response.data;
}

export async function getBalance(accountId: string): Promise<number> {
  const response = await api.get(`/accounts/${accountId}/balance`);
  return response.data.balance;
}

export async function getStatement(accountId: string): Promise<BankTransaction[]> {
  const response = await api.get(`/accounts/${accountId}/statement`);
  return response.data.items;
}
