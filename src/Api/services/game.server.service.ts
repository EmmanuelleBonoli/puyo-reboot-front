import { gameRepository } from '../repositories/game.repository.ts';
import type { Game, GameData, StatsGame } from '../../Game/models/game.types.ts';
import { bubbleRepository } from '../repositories/bubble.repository.ts';
import { bubbleServerService } from './bubble.server.service.ts';
import { playerStatsRepository } from '../repositories/playerStats.repository.ts';
import type { BubbleApi, GameApi, PlayerStatsApi } from '../models/api.types.ts';
import { BubbleStatusEnum } from '../../Game/models/BubbleStatusEnum.ts';
import type { InventoryItemEnum } from '../../Game/models/InventoryItemEnum.ts';

class GameServerService {
  convertApiDataGameToGame(game: GameApi, statsGame: PlayerStatsApi, bubbles: BubbleApi[]): Game {
    const restingBubbles = bubbles.filter(bubbles => bubbles.status === BubbleStatusEnum.RESTING);
    const waitingSpecialBubbles = bubbles.filter(bubbles => bubbles.status === BubbleStatusEnum.WAITING_SPECIAL);
    const waitingBubblesData = bubbles.filter(bubbles => bubbles.status === BubbleStatusEnum.WAITING);
    const fallingBubblesData = bubbles.filter(bubbles => bubbles.status === BubbleStatusEnum.FALLING);

    return {
      id: game.id,
      statsGame: {
        score: game.score,
        oxygen: game.oxygenLevel,
        inventory: game.inventory.map((item: string) => item as InventoryItemEnum),
        bestScore: statsGame.bestScore,
        coins: statsGame.coins,
      },
      restingBubbles: bubbleServerService.fromServerToClient(restingBubbles),
      waitingSpecialBubbles: bubbleServerService.fromServerToClient(waitingSpecialBubbles),
      waitingBubbles: waitingBubblesData.length
        ? bubbleServerService.convertBubblesApiToBubblePair(bubbleServerService.fromServerToClient(waitingBubblesData))
        : null,
      fallingBubbles: fallingBubblesData.length
        ? bubbleServerService.convertBubblesApiToBubblePair(bubbleServerService.fromServerToClient(fallingBubblesData))
        : null,
    };
  }

  async deleteGame(): Promise<void> {
    await gameRepository.deleteGame();
  }

  async insertGame(userId: string, gameId: string): Promise<void> {
    await gameRepository.insertGame(userId, gameId);
  }

  async updateGameData(gameData: GameData): Promise<void> {
    await this.updateStatsGame(gameData.statsGame);

    await bubbleServerService.promoteWaitingToFalling();
    await bubbleRepository.syncRestingBubblesWithFront(gameData.restingBubbles);
  }

  async updateStatsGame(statsGame: StatsGame): Promise<void> {
    await gameRepository.updateStatsGame(statsGame);
  }

  async getGame(): Promise<Game> {
    const game: GameApi = await gameRepository.getGame();
    const statsGame: PlayerStatsApi = await playerStatsRepository.getPlayerStats();
    const bubbles: BubbleApi[] = await bubbleRepository.findAll();

    return this.convertApiDataGameToGame(game, statsGame, bubbles);
  }
}

export const gameServerService = new GameServerService();
