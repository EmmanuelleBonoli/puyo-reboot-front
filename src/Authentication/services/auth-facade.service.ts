import {useAuthStore} from '../store/auth.store.ts';
import type {User} from "../models/user";
import {loginUser} from "./auth-api.service.ts";

export class AuthFacadeService {
    private _store = useAuthStore();

    async login(email: string, password: string): Promise<User> {
        const response = await loginUser({email, password});
        this._store.setAuthData(response);
        return response.user;
    }

    logout() {
        this._store.clearAuthData();
    }
}
