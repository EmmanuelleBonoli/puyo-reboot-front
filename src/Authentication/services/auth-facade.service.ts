import { useAuthStore } from '../store/auth.store';
import type { User } from '../models/user';
import { loginUser, getUserWithToken } from './auth-api.service';

export class AuthFacadeService {
  private _authStore = useAuthStore();

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await loginUser({ email, password });
      this._authStore.setAuthData(response);
      return response.user;
    } catch (err) {
      console.error("la connexion de l'utilisateur n'a pas fonctionné : ", err);
      throw err;
    }
  }

  async getUser(): Promise<User | null> {
    const user = this._authStore.getUser();

    if (user?.email) {
      return user;
    }

    const token = this._authStore.getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await getUserWithToken();
      this._authStore.setAuthData(response);
      return response.user;
    } catch (error) {
      console.error('user not fetch', error);
      this._authStore.clearAuthData();
      return null;
    }
  }

  logout(): void {
    this._authStore.clearAuthData();
  }
}
