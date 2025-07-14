import { useRouter } from 'vue-router';
import { useGameStore } from '../store/game.store.ts';
// import {gameApiService} from './game-api.service.ts';
import {
  computeAvailableSlots,
  computeGravityMovements,
  getCellKey,
  getNextOrientation,
  getNextSatellitePosition,
  groupBubblesByColumn,
  isBubble,
  isEmptyPosition,
  isFreeOfMovement,
  isInsideGrid,
  pickValidColumn,
  placeBubblesOnGridGame,
  removeBubblesOnGridGame,
} from '../utils/bubble.utils.ts';
import {
  type Bubble,
  type BubblePair,
  CHANCE_TO_GENERATE_SPECIAL_BUBBLES,
  DIRECTIONS_MOVEMENT_GAME,
  FALLING_BUBBLES_DELAY_MS,
  type GameData,
  type GridGame,
  ITEMS_INVENTORY,
  MAX_INVENTORY_SIZE,
  OPPOSITE_ORIENTATION_MAP,
  CELL_SIZE,
  FALL_SPEED_PX_PER_MS,
  COLS_GRID_GAME,
  ROWS_VISIBLE_GRID_GAME,
  ROWS_GRID_GAME,
} from '../models/game.types.ts';
import { BubbleStatusEnum } from '../models/BubbleStatusEnum.ts';
import { OrientationMoveEnum } from '../models/OrientationMoveEnum.ts';
import { BubbleTypeEnum } from '../models/BubbleTypeEnum.ts';
import { generateRandomNumber } from '../../shared/services/utils.ts';
import type { InventoryItemEnum } from '../models/InventoryItemEnum.ts';
import { GameApiService } from './game-api.service.ts';
import { AuthFacadeService } from '../../shared/services/auth-facade.service.ts';

export class GameFacadeService {
  private _gameApiService = new GameApiService();
  private _authFacade = new AuthFacadeService();
  private _gameStore = useGameStore();
  private _router = useRouter();

  async initializeUserAndGame(): Promise<void> {
    await this._authFacade.getUser();
    await this.getGame();
  }

  async newGame(): Promise<void> {
    try {
      const newGame = await this._gameApiService.resetGameAndReturnNewOne();
      this._gameStore.setGame(newGame);
    } catch (error) {
      await this._router.push('/');
      throw error;
    }
  }

  async getGame(): Promise<void> {
    const game = await this._gameApiService.getGame();
    this._gameStore.setGame(game);
  }

  deleteBubbles(bubblesToDelete: Bubble[]): void {
    const bubblesId = bubblesToDelete.map((bubble: Bubble) => bubble.id);
    this._gameStore.deleteBubbles(bubblesId);
  }

  async applyGravity(): Promise<void> {
    const originalPositions: Bubble[] = JSON.parse(JSON.stringify(this._gameStore.getRestingBubbles()));

    const bubblesByCol = groupBubblesByColumn(originalPositions);
    const bubblesToMove = computeGravityMovements(bubblesByCol);

    if (bubblesToMove.length === 0) return;

    await this.animateGravity(bubblesToMove);

    const longestFall = Math.max(
      ...bubblesToMove.map(b => {
        const original = originalPositions.find((o: Bubble) => o.id === b.id);
        const distance = original ? Math.abs(b.position.rowIndex - original.position.rowIndex) : 0;
        return distance * CELL_SIZE;
      })
    );

    const duration = longestFall / FALL_SPEED_PX_PER_MS;

    await new Promise(resolve => setTimeout(resolve, duration));
    this.resetBubbleTransforms(bubblesToMove);
    this._gameStore.updatePositionBubbles(bubblesToMove);
  }

  rotateSatelliteBubble(): void {
    const gridGame: GridGame = this._gameStore.getGridGame();
    const fallingBubbles: BubblePair | null = this._gameStore.getFallingBubbles();
    const satelliteBubble: Bubble | undefined = fallingBubbles?.satellite;

    if (fallingBubbles && satelliteBubble) {
      let nextPosition = getNextSatellitePosition(satelliteBubble, fallingBubbles.orientation);
      let nextPositionIsInsideGrid = isInsideGrid(nextPosition);
      let isAvailablePosition = isEmptyPosition(nextPosition, gridGame);

      if (!nextPositionIsInsideGrid) {
        // on switch entre la satellite et la pivot
        const pivotBubble: Bubble = fallingBubbles.pivot;
        fallingBubbles.pivot = satelliteBubble;
        fallingBubbles.satellite = pivotBubble;
        fallingBubbles.orientation = OPPOSITE_ORIENTATION_MAP[fallingBubbles.orientation];
        nextPosition = getNextSatellitePosition(fallingBubbles.satellite, fallingBubbles.orientation);
        nextPositionIsInsideGrid = isInsideGrid(nextPosition);
        isAvailablePosition = isEmptyPosition(nextPosition, gridGame);
      }

      if (isAvailablePosition && nextPositionIsInsideGrid) {
        removeBubblesOnGridGame([satelliteBubble], gridGame);

        fallingBubbles.satellite.position = nextPosition;
        fallingBubbles.orientation = getNextOrientation(fallingBubbles.orientation);

        placeBubblesOnGridGame([fallingBubbles.satellite], gridGame);

        this._gameStore.setFallingBubbles(fallingBubbles);
      }
    }
  }

  isPlayingGame(): boolean {
    return this._gameStore.getGameIsOn();
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

    await this.applyGravity();

    // 0. Si nouvelle partie,
    if (!fallingBubbles && !waitingBubbles) {
      try {
        await this.generatingWaitingBubbles(game.id);
        waitingBubbles = this._gameStore.getWaitingBubbles();
      } catch (error) {
        console.error('Erreur lors de la récupération des bulles en attente :', error);
      }
    }

    if (game.waitingSpecialBubbles.length > 0) {
      await this.promoteWaitingSpecialBubbles();
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

    // 6 Générer aléatoirement des bulles spéciales (gift, ghost, unbreakable)
    try {
      await this.generateSpecialBubblesIfNeeded(game.id);
    } catch (error) {
      console.error('Erreur lors de la génération des bulles spéciales :', error);
    }

    // // Time out nécessaire sinon l'animation des special bubbles se déclenche pas.
    // // nextTick ne résout pas le problème.
    // setTimeout(async () => {
    //   await this.applyGravity();
    await this.gameOn();
    // }, 20);
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

  async promoteWaitingSpecialBubbles(): Promise<void> {
    const waitingSpecialBubbles = this._gameStore.getWaitingSpecialBubbles();
    if (!waitingSpecialBubbles || waitingSpecialBubbles.length === 0) return;

    const restingBubbles = this._gameStore.getRestingBubbles();
    const columnCount = COLS_GRID_GAME;
    const startRowAboveGrid = ROWS_VISIBLE_GRID_GAME; // 10
    const maxRow = ROWS_GRID_GAME - 1; // 14

    // 1. Calcul des slots dispo
    const availableSlots = computeAvailableSlots(restingBubbles, columnCount, maxRow);

    // 2. Suivi des spéciales déjà placées par colonne
    const placedCounts: Record<number, number> = {};

    // 3. Placement des bulles spéciales
    for (const bubble of waitingSpecialBubbles) {
      const columnIndex = pickValidColumn(availableSlots);

      if (columnIndex === null) {
        console.warn('⚠️ Aucune place dispo pour placer une bulle spéciale !');
        continue;
      }

      const stackHeight = placedCounts[columnIndex] ?? 0;
      const rowIndex = startRowAboveGrid + stackHeight;

      if (rowIndex > maxRow) {
        console.warn(`⚠️ Impossible de placer une bulle spéciale dans la colonne ${columnIndex}, plus de place`);
        continue;
      }

      bubble.position = { rowIndex, columnIndex };
      bubble.status = BubbleStatusEnum.RESTING;

      // maj compteurs
      placedCounts[columnIndex] = stackHeight + 1;
      availableSlots[columnIndex] -= 1;
    }

    // 4. Mettre à jour le store
    this._gameStore.addRestingBubbles(waitingSpecialBubbles);
    this._gameStore.setWaitingSpecialBubbles([]);
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
      const gameData: GameData = {
        restingBubbles: this._gameStore.getRestingBubbles(),
        statsGame: this._gameStore.getGame().statsGame,
      };

      const newWaiting = await this._gameApiService.getWaitingBubblesFromServer(gameId, gameData);
      if (!newWaiting) {
        console.warn('Aucune nouvelle bulle en attente !', newWaiting);
        return;
      }
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
    const gridCopy = this._gameStore.getGridGame().map((row, rowIndex) =>
      row.map((_, columnIndex) => ({
        rowIndex,
        columnIndex,
      }))
    );
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
        console.error(`Orientation inconnue: ${orientationMove}`);
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
    }
  }

  ghostBubbleAroundMatchingGroup(bubbles: Bubble[]): Bubble[] {
    const ghostBubbles: Bubble[] = [];
    const seen = new Set<string>();

    for (const bubble of bubbles) {
      const { rowIndex, columnIndex } = bubble.position;

      for (const [dRow, dCol] of DIRECTIONS_MOVEMENT_GAME) {
        const newRow = rowIndex + dRow;
        const newCol = columnIndex + dCol;

        if (!isInsideGrid({ rowIndex: newRow, columnIndex: newCol })) continue;

        const neighbor = this._gameStore.getGridGame()[newRow][newCol];
        const key = getCellKey(newRow, newCol);
        if (!seen.has(key) && isBubble(neighbor) && neighbor.type === BubbleTypeEnum.GHOST && neighbor.status === BubbleStatusEnum.RESTING) {
          ghostBubbles.push(neighbor);
          seen.add(key);
        }
      }
    }

    return ghostBubbles;
  }

  generatePlayerGift(giftToGenerateNumber: number): void {
    const game = this._gameStore.getGame();
    const itemsInInventory: number = game.statsGame.inventory.length;

    const availableSlots = MAX_INVENTORY_SIZE - itemsInInventory;
    const itemToGenerateAvailable = Math.min(giftToGenerateNumber, availableSlots);

    if (itemToGenerateAvailable > 0) {
      const itemGift: InventoryItemEnum[] = [];
      for (let i = 0; i < itemToGenerateAvailable; i++) {
        const maxLengthInventory = ITEMS_INVENTORY.length;
        const randomItemGenerate = ITEMS_INVENTORY[generateRandomNumber(maxLengthInventory)];
        itemGift.push(randomItemGenerate.inventory);
      }
      const newInventory = [...game.statsGame.inventory, ...itemGift];
      this._gameStore.setGame({
        ...game,
        statsGame: {
          ...game.statsGame,
          inventory: newInventory,
        },
      });
    }
  }

  private _isGameOver(): boolean {
    const grid = this._gameStore.getGridGame();

    const entryPositions = [
      { rowIndex: 8, columnIndex: 2 },
      { rowIndex: 9, columnIndex: 2 },
    ];

    return entryPositions.some(pos => {
      const cell = grid[pos.rowIndex]?.[pos.columnIndex];
      return isBubble(cell) && cell.status === BubbleStatusEnum.RESTING;
    });
  }

  setIsGameOver(isOver: boolean): void {
    this._gameStore.setIsGameOver(isOver);
  }

  async generateSpecialBubblesIfNeeded(gameId: string): Promise<void> {
    const shouldGenerate = Math.random() < CHANCE_TO_GENERATE_SPECIAL_BUBBLES;
    if (!shouldGenerate) return;

    const gameData: GameData = {
      restingBubbles: this._gameStore.getRestingBubbles(),
      statsGame: this._gameStore.getGame().statsGame,
    };

    this._gameStore.setWaitingSpecialBubbles(await this._gameApiService.generateSpecialBubblesApi(gameId, gameData));
  }

  async animateGravity(updated: Bubble[]): Promise<void> {
    for (const bubble of updated) {
      const originalBubble = this._gameStore.getRestingBubbles().find(b => b.id === bubble.id);
      if (!originalBubble) continue;
      const distance = bubble.position.rowIndex - originalBubble.position.rowIndex;
      if (distance > 0) continue;
      const el = document
        .getElementById(`${originalBubble.position.rowIndex}-${originalBubble.position.columnIndex}`)
        ?.querySelector('img.bubble-img') as HTMLImageElement;
      let el2;
      if (originalBubble.type === BubbleTypeEnum.GIFT) {
        el2 = document
          .getElementById(`${originalBubble.position.rowIndex}-${originalBubble.position.columnIndex}`)
          ?.querySelector('img.gift') as HTMLImageElement;
      }
      if (!el) continue;

      const pixelDistance: number = Math.abs(distance * CELL_SIZE);
      const duration = pixelDistance / FALL_SPEED_PX_PER_MS;

      el.classList.add('bubble-falling');
      el.style.transition = `transform ${duration}ms ease-out`;
      el.style.transform = `translateY(${-pixelDistance}px)`;
      if (el2) {
        el2.classList.add('bubble-falling');
        el2.style.transition = `transform ${duration}ms ease-out`;
        el2.style.transform = `translateY(${-pixelDistance}px)`;
      }
    }
  }

  resetBubbleTransforms(bubbles: Bubble[]): void {
    for (const bubble of bubbles) {
      const el = document
        .getElementById(`${bubble.position.rowIndex}-${bubble.position.columnIndex}`)
        ?.querySelector('img.bubble-img') as HTMLImageElement;
      if (!el) continue;
      el.style.transition = '';
      el.style.transform = '';
      el.classList.remove('bubble-falling');
      const el2 = document
        .getElementById(`${bubble.position.rowIndex}-${bubble.position.columnIndex}`)
        ?.querySelector('img.gift') as HTMLImageElement;
      if (!el2) continue;
      el2.style.transition = '';
      el2.style.transform = '';
      el2.classList.remove('bubble-falling');
    }
  }
}
