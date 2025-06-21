import { useRouter } from 'vue-router';
import { useGameStore } from '../store/game.store.ts';
import { deleteOldGameAndReturnNewOne, getWaitingBubblesFromServer } from './game-api.service.ts';
import {
  computeGravityDistances,
  computeGravityMovements,
  getNextOrientation,
  getNextSatellitePosition,
  groupBubblesByColumn,
  isEmptyPosition,
  isFreeOfMovement,
  placeBubblesOnGridGame,
  removeBubblesOnGridGame,
} from '../utils/bubble.utils.ts';
import { type Bubble, type BubblePair, FALLING_BUBBLES_DELAY_MS, GRAVITY_ANIMATION_DELAY_MS, type GridGame } from '../models/game.types.ts';
import { BubbleStatusEnum } from '../models/BubbleStatusEnum.ts';
import { OrientationMoveEnum } from '../models/OrientationMoveEnum.ts';

export class GameFacadeService {
  private _gameStore = useGameStore();
  private _router = useRouter();
  private _gameId: string | undefined = this._gameStore.getGame()?.id;

  async newGame(): Promise<void> {
    try {
      if (this._gameId) {
        const newGame = await deleteOldGameAndReturnNewOne(this._gameId);
        this._gameStore.setGame(newGame);
      } else {
        this._router.push('/');
      }
    } catch (error) {
      throw error;
    }
  }

  deleteBubbles(bubblesToDelete: Bubble[]): void {
    const bubblesId = bubblesToDelete.map((bubble: Bubble) => bubble.id);
    const gridGame: GridGame = this._gameStore.getGridGame().map(row => row.map(cell => cell));

    this._gameStore.deleteBubbles(bubblesId);
    removeBubblesOnGridGame(bubblesToDelete, gridGame);
    this._gameStore.setGridGame(gridGame);
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

    const gridGame = this._gameStore.getGridGame();
    removeBubblesOnGridGame(bubblesToMove, gridGame);

    this._gameStore.updatePositionBubbles(bubblesToMove);
    this._gameStore.setGridGame(gridGame);
  }

  rotateSatelliteBubble(): void {
    const gridGame: GridGame = this._gameStore.getGridGame();
    const fallingBubbles: BubblePair | null = this._gameStore.getFallingBubbles();
    const satelliteBubble: Bubble | undefined = fallingBubbles?.satellite;

    if (fallingBubbles && satelliteBubble) {
      const nextPosition = getNextSatellitePosition(satelliteBubble, fallingBubbles.orientation);
      const isAvailablePosition = isEmptyPosition(nextPosition, gridGame);

      if (isAvailablePosition) {
        removeBubblesOnGridGame([satelliteBubble], gridGame);

        satelliteBubble.position = nextPosition;
        fallingBubbles.orientation = getNextOrientation(fallingBubbles.orientation);

        placeBubblesOnGridGame([satelliteBubble], gridGame);

        this._gameStore.setFallingBubbles(fallingBubbles);
        this._gameStore.setGridGame(gridGame);
      }
    }
  }

  pauseGame(): void {
    this._gameStore.setGameIsOn(false);
  }

  async gameOn(): Promise<void> {
    this._gameStore.setGameIsOn(true);

    const game = this._gameStore.getGame();
    if (!game) return;

    let fallingBubbles = game.fallingBubbles;
    let waitingBubbles = game.waitingBubbles;

    // 0. Si nouvelle partie,
    if (!fallingBubbles && !waitingBubbles) {
      try {
        await this.generatingWaitingBubbles(game.id);
        waitingBubbles = this._gameStore.getWaitingBubbles();
      } catch (error) {
        console.error('Erreur lors de la récupération des bulles en attente :', error);
      }
    }

    // 1. Promouvoir si nécessaire
    if (!fallingBubbles && waitingBubbles) {
      this.promoteWaitingBubbles();
      if (this._gameStore.getIsGameOver()) {
        this._gameStore.setGameIsOn(false);
        return;
      }
      fallingBubbles = this._gameStore.getFallingBubbles();

      // 2. Ne générer de nouvelles bulles que si on a promues les précédentes
      try {
        await this.generatingWaitingBubbles(game.id);
      } catch (error) {
        console.error('Erreur lors de la récupération des bulles en attente :', error);
      }
    }

    // 3. Descente des bulles
    if (fallingBubbles) {
      while (fallingBubbles && isFreeOfMovement(fallingBubbles, this._gameStore.getGridGameWithoutFallingBubbles(), OrientationMoveEnum.down)) {
        await new Promise(resolve => setTimeout(resolve, FALLING_BUBBLES_DELAY_MS));
        if (this._gameStore.getGameIsOn()) {
          this.moveOneStepDownFallingBubbles(fallingBubbles);
          fallingBubbles = this._gameStore.getFallingBubbles();
        } else {
          break;
        }
      }
    }

    // 4. Si le jeu est en pause, on arrête le traitement
    if (!this._gameStore.getGameIsOn()) {
      return;
    }

    // 5. Mise au repos et on recommence
    this.promoteFallingBubbles();
    await this.applyGravity();
    await this.gameOn();
  }

  promoteWaitingBubbles(): void {
    const waitingBubbles = this._gameStore.getWaitingBubbles();
    if (waitingBubbles) {
      if (this._isGameOver()) {
        this._gameStore.setIsGameOver(true);
        return;
      }

      waitingBubbles.pivot.status = BubbleStatusEnum.FALLING;
      waitingBubbles.satellite.status = BubbleStatusEnum.FALLING;
      waitingBubbles.pivot.position = {
        rowIndex: 8,
        columnIndex: 2,
      };
      waitingBubbles.satellite.position = {
        rowIndex: 9,
        columnIndex: 2,
      };
      this._gameStore.setFallingBubbles(waitingBubbles);
      this._gameStore.setWaitingBubbles(null);
    }
  }

  promoteFallingBubbles(): void {
    const fallingBubbles = this._gameStore.getFallingBubbles();
    if (fallingBubbles) {
      fallingBubbles.pivot.status = BubbleStatusEnum.RESTING;
      fallingBubbles.satellite.status = BubbleStatusEnum.RESTING;
      this._gameStore.addRestingBubbles([fallingBubbles.pivot, fallingBubbles.satellite]);
      this._gameStore.setFallingBubbles(null);
    }
  }

  async generatingWaitingBubbles(gameId: string): Promise<void> {
    try {
      const newWaiting = await getWaitingBubblesFromServer(gameId, this._gameStore.getRestingBubbles());
      this._gameStore.setWaitingBubbles(newWaiting);
    } catch (error) {
      console.error('Erreur lors de la récupération des bulles en attente :', error);
    }
  }

  moveOneStepDownFallingBubbles(fallingBubblesData: BubblePair): void {
    const fallingBubbles: BubblePair | null = fallingBubblesData;
    if (
      this._gameStore.getGameIsOn() &&
      fallingBubbles &&
      isFreeOfMovement(fallingBubbles, this._gameStore.getGridGameWithoutFallingBubbles(), OrientationMoveEnum.down)
    ) {
      const grid = this._gameStore.getGridGame();

      removeBubblesOnGridGame([fallingBubbles.pivot, fallingBubbles.satellite], grid);

      fallingBubbles.satellite.position.rowIndex -= 1;
      fallingBubbles.pivot.position.rowIndex -= 1;

      placeBubblesOnGridGame([fallingBubbles.pivot, fallingBubbles.satellite], grid);

      this._gameStore.setFallingBubbles(fallingBubbles);
    }
  }

  updateGridGame(bubblesToDisplay: Bubble[]): GridGame {
    const gridCopy = this._gameStore.getGridGame().map(row => row.map(() => null));
    placeBubblesOnGridGame(bubblesToDisplay, gridCopy);
    this._gameStore.setGridGame(gridCopy);
    return gridCopy;
  }

  moveBubble(orientationMove: OrientationMoveEnum): void {
    const fallingBubbles: BubblePair | null = this._gameStore.getFallingBubbles();

    if (!fallingBubbles) {
      return;
    }

    switch (orientationMove) {
      case OrientationMoveEnum.left:
        this.moveOneVerticalStepFallingBubbles(orientationMove, fallingBubbles);
        break;
      case OrientationMoveEnum.right:
        this.moveOneVerticalStepFallingBubbles(orientationMove, fallingBubbles);
        break;
      case OrientationMoveEnum.down:
        this.moveOneStepDownFallingBubbles(fallingBubbles);
        break;
      default:
        console.warn(`Unknown orientation move: ${orientationMove}`);
    }
  }

  moveOneVerticalStepFallingBubbles(orientationMove: OrientationMoveEnum, fallingBubblesData: BubblePair): void {
    const fallingBubbles = fallingBubblesData;
    if (!fallingBubbles) return;

    const gridGame: GridGame = this._gameStore.getGridGame();

    if (isFreeOfMovement(fallingBubbles, this._gameStore.getGridGameWithoutFallingBubbles(), orientationMove)) {
      fallingBubbles.pivot.position.columnIndex =
        orientationMove === 'left' ? fallingBubbles.pivot.position.columnIndex - 1 : fallingBubbles.pivot.position.columnIndex + 1;
      fallingBubbles.satellite.position.columnIndex =
        orientationMove === 'left' ? fallingBubbles.satellite.position.columnIndex - 1 : fallingBubbles.satellite.position.columnIndex + 1;

      removeBubblesOnGridGame([fallingBubbles.pivot, fallingBubbles.satellite], gridGame);
      placeBubblesOnGridGame([fallingBubbles.pivot, fallingBubbles.satellite], gridGame);

      this._gameStore.setFallingBubbles(fallingBubbles);
      this._gameStore.setGridGame(gridGame);
    }
  }

  private _isGameOver(): boolean {
    const grid = this._gameStore.getGridGame();

    const entryPositions = [
      { rowIndex: 8, columnIndex: 2 },
      { rowIndex: 9, columnIndex: 2 },
    ];

    return entryPositions.some(pos => {
      const bubble = grid[pos.rowIndex]?.[pos.columnIndex];
      return bubble?.status === BubbleStatusEnum.RESTING;
    });
  }
}
