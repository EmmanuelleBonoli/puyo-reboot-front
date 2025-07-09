import { useAuthStore } from '../store/auth.store';
import type { User } from '../models/user.types.ts';
import { loginUser, getUserWithToken } from './auth-api.service';
import { useGameStore } from '../../Game/store/game.store.ts';

export class AuthFacadeService {
  private _authStore = useAuthStore();
  private _gameStore = useGameStore();

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await loginUser({ email, password });
      this._authStore.setAuthData(response);
      this._gameStore.setGame(response.game);
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
      this._gameStore.setGame(response.game);
      return response.user;
    } catch (error) {
      console.error("l'utilisateur n'a pas été récupéré", error);
      this._authStore.clearAuthData();
      return null;
    }
  }

  logout(): void {
    this._authStore.clearAuthData();
  }

  getFromLocalStorage(item: string): string | null {
    return localStorage.getItem(item);
  }

  saveToLocalStorage(item: string, value: string): void {
    localStorage.setItem(item, value);
  }

  removeToLocalStorage(item: string): void {
    localStorage.removeItem(item);
  }
}
