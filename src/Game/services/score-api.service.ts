import { playerStatsServerService } from '../../Api/services/playerStats.server.service.ts';

export async function saveBestScoreApi(newBestScore: number): Promise<void> {
  await playerStatsServerService.saveBestScore(newBestScore);
}

export async function updateCoinsApi(newCoins: number): Promise<void> {
  await playerStatsServerService.updateCoins(newCoins);
}
