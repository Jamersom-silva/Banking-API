import { api } from './api';
import type { LoginPayload, LoginResponse } from '../types/Auth';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return response.data;
}
