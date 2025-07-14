import { userRepository } from '../repositories/user.repository.ts';
import type { LangCode, User } from '../../shared/models/user.types.ts';
import type { UserApi } from '../models/api.types.ts';

class UserServerService {
  fromServerToClient(userApi: UserApi): User {
    return {
      ...userApi,
      isMusicEnabled: userApi.isMusicEnabled,
      isLeftHanded: userApi.isLeftHanded,
      isSoundEffectsEnabled: userApi.isSoundEffectsEnabled,
    };
  }

  async getUser(): Promise<User> {
    const userApi = await userRepository.getUser();
    return this.fromServerToClient(userApi);
  }

  async updateSettings(setting: string, value: boolean | LangCode): Promise<void> {
    await userRepository.updateSettings(setting, value);
  }

  async updateAvatar(avatar: string): Promise<void> {
    await userRepository.updateAvatar(avatar);
  }

  async updateAstronaut(astronaut: string): Promise<void> {
    await userRepository.updateAstronaut(astronaut);
  }

  async updatePlayerName(playerName: string): Promise<void> {
    await userRepository.updatePlayerName(playerName);
  }
}

export const userServerService = new UserServerService();
