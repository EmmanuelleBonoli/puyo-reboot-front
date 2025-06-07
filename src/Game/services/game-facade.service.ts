import { useGameStore } from '../store/game.store.ts';
import { deleteOldGameAndReturnNewOne } from './game-api.service.ts';

export class GameFacadeService {
  private _gameStore = useGameStore();

  async newGame(): Promise<void> {
    try {
      const oldGameId = this._gameStore.getGame()?.id;
      if (oldGameId) {
        const newGame = await deleteOldGameAndReturnNewOne(oldGameId);
        this._gameStore.setGame(newGame);
      }
    } catch (error) {
      throw error;
    }
  }
}
