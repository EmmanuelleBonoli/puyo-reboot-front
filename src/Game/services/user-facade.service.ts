import { updateAstronautApi, updateSettingsApi } from './user-api.service.ts';
import type { LangCode, User } from '../../shared/models/user.types.ts';
import { useAuthStore } from '../../shared/stores/auth.store.ts';
import { useI18n } from 'vue-i18n';

export class UserFacadeService {
  private _authStore = useAuthStore();
  i18n = useI18n();

  setGameLanguage(lang: LangCode): void {
    this.i18n.locale.value = lang;
    this._authStore.setGameLanguage(lang);
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

  async updateAstronaut(astronaut: string): Promise<void> {
    try {
      await updateAstronautApi(astronaut);
      this._authStore.setAstronaut(astronaut);
    } catch (error) {
      throw error;
    }
  }
}
