import { useGameStore } from '../store/game.store.ts';
import { deleteOldGameAndReturnNewOne, deleteBubbles, updateBubblesOnServer } from './game-api.service.ts';
import { type Bubble, type BubblePair, GRAVITY_ANIMATION_DELAY_MS, type GridGame } from '../models/game.types.ts';
import {
  computeGravityDistances,
  computeGravityMovements,
  getNextOrientation,
  getNextSatellitePosition,
  groupBubblesByColumn,
  isEmptyPosition,
} from '../utils/bubble.utils.ts';

export class GameFacadeService {
  private _gameStore = useGameStore();
  private _gameId: string | undefined = this._gameStore.getGame()?.id;

  async newGame(): Promise<void> {
    try {
      if (this._gameId) {
        const newGame = await deleteOldGameAndReturnNewOne(this._gameId);
        this._gameStore.setGame(newGame);
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteBubbles(bubbles: Bubble[]): Promise<void> {
    const bubblesId = bubbles.map((bubble: Bubble) => bubble.id);

    if (this._gameId) {
      try {
        const isBubblesDeleted = await deleteBubbles(this._gameId, bubblesId);
        if (isBubblesDeleted) {
          this._gameStore.deleteBubbles(bubblesId);
        }
      } catch (error) {
        throw error;
      }
    }
  }

  async applyGravity(): Promise<void> {
    const restingBubbles = this._gameStore.getRestingBubbles();
    const bubblesByCol = groupBubblesByColumn(restingBubbles);
    const bubblesToMove = computeGravityMovements(bubblesByCol);

    if (bubblesToMove.length === 0) return;

    const distanceMap = computeGravityDistances(bubblesToMove, restingBubbles);
    this._gameStore.setGravityFallingBubbles(Object.keys(distanceMap));
    this._gameStore.setGravityFallDistances(distanceMap);

    await new Promise(resolve => setTimeout(resolve, GRAVITY_ANIMATION_DELAY_MS));

    this._gameStore.clearGravityFallingBubbles();
    this._gameStore.clearGravityFallDistances();

    if (this._gameId) {
      try {
        await updateBubblesOnServer(this._gameId, bubblesToMove);
        this._gameStore.updatePositionBubbles(bubblesToMove);
      } catch (error) {
        throw error;
      }
    }
  }

  rotateSatelliteBubble(): void {
    const gridGame: GridGame = this._gameStore.getGridGame();
    const fallingBubbles: BubblePair | null = this._gameStore.getFallingBubbles();
    const satelliteBubble: Bubble | undefined = fallingBubbles?.satellite;

    if (fallingBubbles && satelliteBubble) {
      const nextPosition = getNextSatellitePosition(satelliteBubble, fallingBubbles.orientation);
      const isAvailablePosition = isEmptyPosition(nextPosition, gridGame);

      if (isAvailablePosition) {
        satelliteBubble.position = nextPosition;
        fallingBubbles.orientation = getNextOrientation(fallingBubbles.orientation);
        this._gameStore.setFallingBubbles(fallingBubbles);
      }
    }
  }
}
