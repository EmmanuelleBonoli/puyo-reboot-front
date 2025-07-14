import { storageService } from '../config/storage.service.ts';
import type { PlayerStatsApi } from '../models/api.types.ts';

class PlayerStatsRepository {
  async getPlayerStats(): Promise<PlayerStatsApi> {
    const playerStats = await storageService.getSingleton('playerStats');
    if (!playerStats) {
      throw new Error('Aucune stat trouvée : problème de seeding !');
    }
    return playerStats;
  }

  async saveBestScore(bestScore: number): Promise<void> {
    await storageService.update('playerStats', { bestScore });
  }

  async updateCoins(coins: number): Promise<void> {
    await storageService.update('playerStats', { coins });
  }
}

export const playerStatsRepository = new PlayerStatsRepository();
