import type { AuthLoginRequest, AuthLoginResponse } from '../models/user.types.ts';
import { http } from '../../shared/services/http-client';

export function loginUser(payload: AuthLoginRequest): Promise<AuthLoginResponse> {
  return http<AuthLoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getUserWithToken(): Promise<AuthLoginResponse> {
  return http<AuthLoginResponse>('/auth/with-token', {
    auth: true,
  });
}
