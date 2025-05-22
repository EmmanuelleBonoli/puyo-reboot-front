import type {AuthLoginRequest, AuthLoginResponse} from '../models/user';
import {http} from "../../shared/services/http-client.ts";

export function loginUser(payload: AuthLoginRequest): Promise<AuthLoginResponse> {
    return http<AuthLoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export function fetchUserWithToken(): Promise<AuthLoginResponse> {
    return http<any>('/auth/me', {
        auth: true, // ajoute automatiquement le token Bearer
    });
}