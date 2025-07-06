import { useGameStore } from '../store/game.store.ts';
import { InventoryItemEnum } from '../models/InventoryItemEnum.ts';
import { GAIN_OXYGEN, type GridPosition, MAX_OXYGEN, POINTS_PER_BUBBLE } from '../models/game.types.ts';
import { findBubblesAroundPosition } from '../utils/bubble.utils.ts';
import { GameFacadeService } from './game-facade.service.ts';

export class ScoreFacadeService {
  private _gameStore = useGameStore();
  gameFacadeService = new GameFacadeService();

  getScore(): number {
    return this._gameStore.getGame().statsGame.score;
  }

  getOxygen(): number {
    return this._gameStore.getGame().statsGame.oxygen;
  }

  getInventory(): InventoryItemEnum[] {
    return this._gameStore.getGame().statsGame.inventory;
  }

  useInventoryItem(itemSelected: InventoryItemEnum, usePosition?: GridPosition): void {
    switch (itemSelected) {
      case InventoryItemEnum.BOMB:
        if (usePosition) {
          this._useBomb(usePosition);
          this._removeItemFromInventory(InventoryItemEnum.BOMB);
        }
        break;
      case InventoryItemEnum.OXYGEN:
        this.updateOxygen(GAIN_OXYGEN, false);
        this._removeItemFromInventory(InventoryItemEnum.OXYGEN);
        break;
      default:
        console.warn(`Item ${itemSelected} is not implemented yet.`);
        break;
    }
  }

  private _useBomb(usePosition: GridPosition): void {
    const bubblesToDelete = findBubblesAroundPosition(usePosition, this._gameStore.getGridGameWithoutFallingBubbles());

    this.gameFacadeService.deleteBubbles(bubblesToDelete);
    this.gameFacadeService.applyGravity();
  }

  private _removeItemFromInventory(item: InventoryItemEnum): void {
    const game = this._gameStore.getGame();
    const inventory = game.statsGame.inventory;
    const itemIndex = inventory.indexOf(item);

    if (itemIndex > -1) {
      inventory.splice(itemIndex, 1);
      this._gameStore.setGame({
        ...game,
        statsGame: {
          ...game?.statsGame,
          inventory: [...inventory],
        },
      });
    }
  }

  updateScore(matchBubbles: number, isDouble: boolean): void {
    const game = this._gameStore.getGame();
    const currentScore = this.getScore();
    const newScore = isDouble ? currentScore + matchBubbles * POINTS_PER_BUBBLE * 2 : currentScore + matchBubbles * POINTS_PER_BUBBLE;
    this._gameStore.setGame({
      ...game,
      statsGame: {
        ...game?.statsGame,
        score: newScore,
      },
    });
  }

  updateOxygen(newOxygen: number, isDouble: boolean): void {
    const actualOxygen = this.getOxygen();

    const newOxygenValue = isDouble ? newOxygen * 2 : newOxygen;

    if (actualOxygen + newOxygenValue > MAX_OXYGEN) {
      this._gameStore.getGame().statsGame.oxygen = MAX_OXYGEN;
    } else {
      this._gameStore.getGame().statsGame.oxygen = actualOxygen + newOxygenValue;
    }
  }
}
