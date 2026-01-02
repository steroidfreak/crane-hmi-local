import { LoginRequest, LoginResponse } from '@crane/common';
import { apiClient } from './client';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return data;
}
