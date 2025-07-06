import { http } from '../../shared/services/http-client';
import type { BubblePair, Game, GameData } from '../models/game.types.ts';

export async function deleteOldGameAndReturnNewOne(gameId: string): Promise<Game> {
  return http<Game>(`/game/${gameId}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function getWaitingBubblesFromServer(gameId: string, gameData: GameData): Promise<BubblePair> {
  return http<BubblePair>(`/bubble/game/${gameId}/generateBubbles`, {
    method: 'POST',
    body: gameData,
    auth: true,
  });
}
