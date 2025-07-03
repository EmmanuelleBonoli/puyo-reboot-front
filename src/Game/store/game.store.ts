import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type Bubble, type BubblePair, COLS_GRID_GAME, type Game, type GridGame, ROWS_GRID_GAME } from '../models/game.types.ts';
import { BubbleStatusEnum } from '../models/BubbleStatusEnum.ts';

export const useGameStore = defineStore('game', () => {
  const gridGame = ref<GridGame>(Array.from({ length: ROWS_GRID_GAME }, () => Array<Bubble | null>(COLS_GRID_GAME).fill(null)));
  const game = ref<Game | null>(null);
  const gameIsOn = ref<boolean>(false);
  const isGameOver = ref<boolean>(false);

  function getIsGameOver(): boolean {
    return isGameOver.value;
  }

  function setIsGameOver(isOver: boolean): void {
    isGameOver.value = isOver;
  }

  function getGameIsOn(): boolean {
    return gameIsOn.value;
  }

  function setGameIsOn(isOn: boolean): void {
    gameIsOn.value = isOn;
  }

  function getGridGame(): GridGame {
    return gridGame.value;
  }

  function setGridGame(newGrid: GridGame): void {
    gridGame.value = newGrid;
  }

  function getGridGameWithoutFallingBubbles(): GridGame {
    return gridGame.value.map(row => row.map(cell => (cell && cell.status !== BubbleStatusEnum.FALLING ? cell : null)));
  }

  function getGame(): Game | null {
    return game.value;
  }

  function setGame(dataGame: Game): void {
    game.value = {
      id: dataGame.id,
      statsGame: dataGame.statsGame,
      restingBubbles: [...(dataGame.restingBubbles ?? [])],
      waitingBubbles: dataGame.waitingBubbles ?? null,
      fallingBubbles: dataGame.fallingBubbles ?? null,
    };
  }

  function getWaitingBubbles(): BubblePair | null {
    return game.value?.waitingBubbles ?? null;
  }

  function setWaitingBubbles(dataWaitingBubbles: BubblePair | null): void {
    if (game.value) {
      game.value.waitingBubbles = dataWaitingBubbles;
    }
  }

  function getFallingBubbles(): BubblePair | null {
    return game.value?.fallingBubbles ?? null;
  }

  function setFallingBubbles(dataFallingBubbles: BubblePair | null): void {
    if (game.value) {
      game.value.fallingBubbles = dataFallingBubbles;
    }
  }

  function getRestingBubbles(): Bubble[] {
    return game.value?.restingBubbles ?? [];
  }

  function addRestingBubbles(bubbles: Bubble[]): void {
    if (!game.value) return;
    game.value.restingBubbles.push(...bubbles);
  }

  function updatePositionBubbles(updatedBubbles: Bubble[]): void {
    if (!game.value) return;

    for (const updatedBubble of updatedBubbles) {
      const index = game.value.restingBubbles.findIndex(b => b.id === updatedBubble.id);
      if (index !== -1) {
        game.value.restingBubbles[index] = updatedBubble;
      }
    }
  }

  function deleteBubbles(bubblesId: string[]): void {
    if (!game.value) return;

    game.value.restingBubbles = game.value.restingBubbles.filter(b => !bubblesId.includes(b.id));
  }

  return {
    game,
    getIsGameOver,
    setIsGameOver,
    getGameIsOn,
    setGameIsOn,
    getGridGame,
    setGridGame,
    getGridGameWithoutFallingBubbles,
    getRestingBubbles,
    getWaitingBubbles,
    getFallingBubbles,
    setFallingBubbles,
    setWaitingBubbles,
    updatePositionBubbles,
    getGame,
    setGame,
    deleteBubbles,
    addRestingBubbles,
  };
});
