import { defineStore } from 'pinia';
import { ref } from 'vue';
import { initialUser, type LangCode, type User } from '../models/user.types.ts';
import { AuthFacadeService } from '../services/auth-facade.service.ts';

export const useAuthStore = defineStore('user', () => {
  const authFacade = new AuthFacadeService();
  const user = ref<User>(initialUser);
  const token = ref<string | null>(null);

  function setAuthData(data: { user: User; token: string }): void {
    user.value = data.user;
    token.value = data.token;
    authFacade.saveToLocalStorage('token', data.token);
  }

  function clearAuthData(): void {
    user.value = initialUser;
    token.value = null;
    authFacade.removeToLocalStorage('token');
  }

  function getUser(): User {
    return user.value;
  }

  function setUser(userData: User): void {
    user.value = userData;
  }

  function getToken(): string | null {
    if (token.value) return token.value;
    const tokenStorage = authFacade.getFromLocalStorage('token');
    if (tokenStorage) {
      token.value = tokenStorage;
      return tokenStorage;
    }
    return null;
  }

  function setGameLanguage(lang: LangCode): void {
    user.value = { ...user.value, language: lang };
  }

  function setAvatar(avatar: string): void {
    user.value = { ...user.value, avatar: avatar };
  }

  function setAstronaut(astronaut: string): void {
    user.value = { ...user.value, astronaut: astronaut };
  }

  function setPlayerName(playerName: string): void {
    user.value = { ...user.value, playerName: playerName };
  }

  return {
    user,
    token,
    getUser,
    setUser,
    getToken,
    setAuthData,
    clearAuthData,
    setGameLanguage,
    setAvatar,
    setAstronaut,
    setPlayerName,
  };
});
