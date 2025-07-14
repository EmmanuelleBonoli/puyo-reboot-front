import { initialUser, type User } from '../models/user.types.ts';
import { useAuthStore } from '../stores/auth.store.ts';
import { userServerService } from '../../Api/services/user.server.service.ts';

export class AuthFacadeService {
  private _authStore = useAuthStore();

  async getUser(): Promise<User> {
    try {
      const user = await userServerService.getUser();
      this._authStore.setUser(user);
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération du user :', error);
      return initialUser;
    }
  }

  getFromLocalStorage(item: string): string | null {
    return localStorage.getItem(item);
  }

  saveToLocalStorage(item: string, value: string): void {
    localStorage.setItem(item, value);
  }
}
