import { api } from './api';
import type { AmountPayload, TransferPayload } from '../types/Operations';

export async function deposit(accountId: string, payload: AmountPayload) {
  await api.post(`/accounts/${accountId}/deposit`, payload);
}

export async function withdraw(accountId: string, payload: AmountPayload) {
  await api.post(`/accounts/${accountId}/withdraw`, payload);
}

export async function transfer(accountId: string, payload: TransferPayload) {
  await api.post(`/accounts/${accountId}/transfer`, payload);
}
