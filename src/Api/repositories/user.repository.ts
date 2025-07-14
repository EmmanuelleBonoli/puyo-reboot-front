import type { User } from '../../shared/models/user.types.ts';
import { storageService } from '../config/storage.service.ts';

class UserRepository {
  async getUser(): Promise<User> {
    const user = await storageService.getSingleton('user');
    if (!user) {
      throw new Error('Aucun user trouvé : problème de seeding !');
    }
    return user;
  }

  async updateSettings(setting: string, value: boolean | string): Promise<void> {
    await storageService.update('user', {
      [setting]: value,
    });
  }

  async updateAvatar(avatar: string): Promise<void> {
    await storageService.update('user', { avatar });
  }

  async updateAstronaut(astronaut: string): Promise<void> {
    await storageService.update('user', { astronaut });
  }

  async updatePlayerName(playerName: string): Promise<void> {
    await storageService.update('user', { playerName });
  }
}

export const userRepository = new UserRepository();
