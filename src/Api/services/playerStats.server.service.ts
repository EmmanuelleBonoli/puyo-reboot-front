import type { PlayerStatsApi } from '../models/api.types.ts';
import { playerStatsRepository } from '../repositories/playerStats.repository.ts';

class PlayerStatsServerService {
  async getPlayerStats(): Promise<PlayerStatsApi> {
    return playerStatsRepository.getPlayerStats();
  }

  async saveBestScore(newBestScore: number): Promise<void> {
    await playerStatsRepository.saveBestScore(newBestScore);
  }

  async updateCoins(newCoins: number): Promise<void> {
    await playerStatsRepository.updateCoins(newCoins);
  }
}

export const playerStatsServerService = new PlayerStatsServerService();
