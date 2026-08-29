import { userRepository } from '../repositories/user.repository.ts';
import type { LangCode, User } from '../../shared/models/user.types.ts';

class UserServerService {
  async getUser(): Promise<User> {
    return await userRepository.getUser();
  }

  async updateSettings(setting: string, value: boolean | LangCode): Promise<void> {
    await userRepository.updateSettings(setting, value);
  }

  async updateAstronaut(astronaut: string): Promise<void> {
    await userRepository.updateAstronaut(astronaut);
  }
}

export const userServerService = new UserServerService();
