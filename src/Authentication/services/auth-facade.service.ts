import { useAuthStore } from '../store/auth.store';
import type { User } from '../models/user';
import { loginUser, getUserWithToken } from './auth-api.service';

export class AuthFacadeService {
  private _store = useAuthStore();

  async login(email: string, password: string): Promise<User> {
    const response = await loginUser({ email, password });
    this._store.setAuthData(response);
    return response.user;
  }

  async getUser(): Promise<User | null> {
    const user = this._store.getUser();

    if (user?.email) {
      return user;
    }

    const token = this._store.getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await getUserWithToken();
      this._store.setAuthData(response);
      return response.user;
    } catch (error) {
      console.error('user not fetch', error);
      this._store.clearAuthData();
      return null;
    }
  }

  logout(): void {
    this._store.clearAuthData();
  }
}
