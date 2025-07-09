import { http } from '../../shared/services/http-client';

export async function saveBestScoreApi(newBestScore: number): Promise<void> {
  return http<void>(`/playerStats/score`, {
    method: 'POST',
    body: newBestScore,
    auth: true,
  });
}

export async function updateCoinsApi(newCoins: number): Promise<void> {
  return http(`/playerStats/coins`, {
    method: 'POST',
    body: newCoins,
    auth: true,
  });
}
