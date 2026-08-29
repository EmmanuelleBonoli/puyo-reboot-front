import type { Bubble, BubblePair, Game, GameData } from '../models/game.types.ts';
import { bubbleServerService } from '../../Api/services/bubble.server.service.ts';
import { gameServerService } from '../../Api/services/game.server.service.ts';
import { playerStatsServerService } from '../../Api/services/playerStats.server.service.ts';
import { generateUUID } from '../../shared/utils/shared.utils.ts';

export class GameApiService {
  async deleteOldGame(): Promise<void> {
    await gameServerService.deleteGame();
  }

  async createNewGame(): Promise<Game> {
    const newGameId = generateUUID();

    await gameServerService.insertGame();

    const playerStats = await playerStatsServerService.getPlayerStats();

    await bubbleServerService.createWaitingBubbles();
    const updatedFirstFallingBubbles = await bubbleServerService.promoteWaitingToFalling();
    const firstWaitingBubbles = await bubbleServerService.createWaitingBubbles();

    return {
      id: newGameId,
      statsGame: {
        score: 0,
        oxygen: 100,
        inventory: [],
        bestScore: playerStats?.bestScore || 0,
        coins: playerStats?.coins || 0,
      },
      restingBubbles: [],
      waitingBubbles: bubbleServerService.convertBubblesApiToBubblePair(firstWaitingBubbles),
      fallingBubbles: bubbleServerService.convertBubblesApiToBubblePair(updatedFirstFallingBubbles),
      waitingSpecialBubbles: [],
    };
  }

  async resetGameAndReturnNewOne(): Promise<Game> {
    await this.deleteOldGame();
    return await this.createNewGame();
  }

  async getWaitingBubblesFromServer(gameData: GameData): Promise<BubblePair | null> {
    await gameServerService.updateGameData(gameData);
    const waitingBubbles = await bubbleServerService.createWaitingBubbles();
    return bubbleServerService.convertBubblesApiToBubblePair(waitingBubbles);
  }

  async generateSpecialBubblesApi(gameData: GameData): Promise<Bubble[]> {
    await gameServerService.updateGameData(gameData);
    return await bubbleServerService.createWaitingSpecialBubbles();
  }

  async getGame(): Promise<Game> {
    return await gameServerService.getGame();
  }
}
