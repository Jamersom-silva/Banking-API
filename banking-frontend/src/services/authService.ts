import { api } from './api';
import type { LoginResponse } from '../types/Auth';

interface LoginPayload {
  email: string;
  password: string;
}

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/api/v1/auth/login',
    payload
  );

  return response.data;
}
