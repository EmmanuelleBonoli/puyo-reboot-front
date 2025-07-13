import { useGameStore } from '../store/game.store.ts';
import { InventoryItemEnum } from '../models/InventoryItemEnum.ts';
import { GAIN_OXYGEN, type GridPosition, MAX_INVENTORY_SIZE, MAX_OXYGEN, POINTS_PER_BUBBLE } from '../models/game.types.ts';
import { findBubblesAroundPosition } from '../utils/bubble.utils.ts';
import { GameFacadeService } from './game-facade.service.ts';
import { saveBestScoreApi, updateCoinsApi } from './score-api.service.ts';
import type { InventoryItem, ItemStore } from '../models/store.types.ts';
import { BubbleTypeEnum } from '../models/BubbleTypeEnum.ts';

export class ScoreFacadeService {
  private _gameStore = useGameStore();
  gameFacadeService = new GameFacadeService();

  getCoins(): number {
    return this._gameStore.getGame().statsGame.coins;
  }

  getBestScore(): number {
    return this._gameStore.getGame().statsGame.bestScore;
  }

  getScore(): number {
    return this._gameStore.getGame().statsGame.score;
  }

  getOxygen(): number {
    return this._gameStore.getGame().statsGame.oxygen;
  }

  getInventory(): InventoryItemEnum[] {
    return this._gameStore.getGame().statsGame.inventory;
  }

  async useInventoryItem(itemSelected: InventoryItemEnum, usePosition?: GridPosition): Promise<void> {
    switch (itemSelected) {
      case InventoryItemEnum.BOMB:
        if (usePosition) {
          await this._useBomb(usePosition);
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

  private async _useBomb(usePosition: GridPosition): Promise<void> {
    const bubblesToDelete = findBubblesAroundPosition(usePosition, this._gameStore.getGridGameWithoutFallingBubbles());

    const giftBubbles = bubblesToDelete.filter(bubble => bubble.type === BubbleTypeEnum.GIFT);
    if (giftBubbles.length > 0) {
      this.gameFacadeService.generatePlayerGift(giftBubbles.length);
    }

    this.gameFacadeService.deleteBubbles(bubblesToDelete);
    await this.gameFacadeService.applyGravity();
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

  async saveBestScore(): Promise<void> {
    const game = this._gameStore.getGame();
    const currentScore = this.getScore();
    const bestScore = this.getBestScore();

    if (currentScore > bestScore) {
      this._gameStore.setGame({
        ...game,
        statsGame: {
          ...game?.statsGame,
          bestScore: currentScore,
        },
      });
      await saveBestScoreApi(currentScore);
    }
  }

  async buyCoin(coin: ItemStore): Promise<void> {
    const game = this._gameStore.getGame();
    const currentCoins = game.statsGame.coins;

    // todo: add payment logic here : external api ???

    await updateCoinsApi(coin.value);

    this._gameStore.setGame({
      ...game,
      statsGame: {
        ...game.statsGame,
        coins: currentCoins + coin.value,
      },
    });
  }

  async buyItemInventory(item: InventoryItem): Promise<void> {
    const game = this._gameStore.getGame();
    const currentCoins = game.statsGame.coins;

    if (currentCoins >= item.price && game.statsGame.inventory.length < MAX_INVENTORY_SIZE) {
      const newInventory = [...game.statsGame.inventory, item.inventory];
      await updateCoinsApi(parseInt(`-${item.price}`));

      this._gameStore.setGame({
        ...game,
        statsGame: {
          ...game.statsGame,
          coins: currentCoins - item.price,
          inventory: newInventory,
        },
      });
    }
  }
}
