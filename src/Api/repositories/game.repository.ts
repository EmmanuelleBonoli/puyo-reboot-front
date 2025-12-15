import { storageService } from '../config/storage.service.ts';
import type { GameApi } from '../models/api.types.ts';
import { type StatsGame } from '../../Game/models/game.types.ts';

class GameRepository {
  async deleteGame(): Promise<void> {
    await storageService.truncate('bubble');
    await storageService.truncate('game');
  }

  async insertGame(userId: string, gameId: string): Promise<void> {
    await storageService.insert('game', {
      id: gameId,
      userId,
      score: 0,
      oxygenLevel: 100,
      inventory: [],
    });
  }

  async getGame(): Promise<GameApi> {
    const game = await storageService.getSingleton('game');
    if (!game) {
      throw new Error('Aucune game trouvée : problème de seeding !');
    }
    return game;
  }

  async updateStatsGame(statsGame: StatsGame): Promise<void> {
    await storageService.update('game', {
      score: statsGame.score,
      oxygenLevel: statsGame.oxygen,
      inventory: statsGame.inventory,
    });
  }
}

export const gameRepository = new GameRepository();
