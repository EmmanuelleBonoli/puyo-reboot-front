import { http } from '../../shared/services/http-client';
import type { Game } from '../models/game';

export async function deleteOldGameAndReturnNewOne(gameId: string): Promise<Game> {
  return http<Game>(`/game/${gameId}`, {
    method: 'DELETE',
    auth: true,
  });
}
