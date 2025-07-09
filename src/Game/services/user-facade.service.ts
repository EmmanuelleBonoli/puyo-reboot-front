import { useCommonToasts } from '../../shared/services/utils.ts';
import {
  getAvailableAstronautsApi,
  getAvailableAvatarsApi,
  updateAstronautApi,
  updateAvatarApi,
  updatePlayerNameApi,
  updateSettingsApi,
} from './user-api.service.ts';
import type { LangCode, User } from '../../Authentication/models/user.types.ts';
import { useAuthStore } from '../../Authentication/store/auth.store.ts';
import { useI18n } from 'vue-i18n';
import { AuthFacadeService } from '../../Authentication/services/auth-facade.service.ts';

export class UserFacadeService {
  private _authService = new AuthFacadeService();
  private _authStore = useAuthStore();
  commonToasts = useCommonToasts();
  i18n = useI18n();

  setGameLanguage(lang: LangCode): void {
    this.i18n.locale.value = lang;
    this._authStore.setGameLanguage(lang);
    this._authService.saveToLocalStorage('language', lang);
  }

  async updateUserSettings(setting: string, value: boolean | LangCode): Promise<void> {
    try {
      const user = this._authStore.getUser();
      if (!user) {
        throw new Error('User not found');
      }

      await updateSettingsApi(setting, value);

      const updatedUser: User = {
        ...user,
        [setting]: value,
      };

      if (setting === 'language') {
        this.setGameLanguage(value as LangCode);
      }
      this._authStore.setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  async getAvailableAvatars(): Promise<string[]> {
    try {
      return await getAvailableAvatarsApi();
    } catch (error) {
      console.error(`impossible de récupérer les avatars : ${error}`);
      this.commonToasts.showToastError();
      return [];
    }
  }

  async getAvailableAstronauts(): Promise<string[]> {
    try {
      return await getAvailableAstronautsApi();
    } catch (error) {
      console.error(`impossible de récupérer les astronautes : ${error}`);
      this.commonToasts.showToastError();
      return [];
    }
  }

  async updateAvatar(avatar: string): Promise<void> {
    try {
      await updateAvatarApi(avatar);
      this._authStore.setAvatar(avatar);
    } catch (error) {
      throw error;
    }
  }

  async updateAstronaut(astronaut: string): Promise<void> {
    try {
      await updateAstronautApi(astronaut);
      this._authStore.setAstronaut(astronaut);
    } catch (error) {
      throw error;
    }
  }

  async updatePlayerName(playerName: string): Promise<void> {
    try {
      await updatePlayerNameApi(playerName);
      this._authStore.setPlayerName(playerName);
    } catch (error) {
      throw error;
    }
  }
}
