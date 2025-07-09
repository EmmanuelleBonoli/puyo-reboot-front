import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type Bubble, type BubblePair, COLS_GRID_GAME, type Game, type GridGame, INITIAL_GAME, ROWS_GRID_GAME } from '../models/game.types.ts';
import { BubbleStatusEnum } from '../models/BubbleStatusEnum.ts';
import { isBubble } from '../utils/bubble.utils.ts';

export const useGameStore = defineStore('game', () => {
  const gridGame = ref<GridGame>(
    Array.from({ length: ROWS_GRID_GAME }, (_, rowIndex) =>
      Array.from({ length: COLS_GRID_GAME }, (_, columnIndex) => ({
        rowIndex,
        columnIndex,
      }))
    )
  );
  const game = ref<Game>(INITIAL_GAME);
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
    return gridGame.value.map(row =>
      row.map(cell => {
        return (isBubble(cell) && cell?.status !== BubbleStatusEnum.FALLING) || !isBubble(cell)
          ? cell
          : {
              rowIndex: cell.position.rowIndex,
              columnIndex: cell.position.columnIndex,
            };
      })
    );
  }

  function getGame(): Game {
    return game.value;
  }

  function setGame(dataGame: Game): void {
    game.value = {
      id: dataGame.id,
      statsGame: {
        score: dataGame.statsGame.score ?? 0,
        oxygen: dataGame.statsGame.oxygen ?? 100,
        inventory: dataGame.statsGame.inventory ?? [],
        bestScore: dataGame.statsGame.bestScore ?? 0,
        coins: dataGame.statsGame.coins ?? 0,
      },
      restingBubbles: dataGame.restingBubbles ?? [],
      waitingBubbles: dataGame.waitingBubbles ?? null,
      fallingBubbles: dataGame.fallingBubbles ?? null,
    };
  }

  function getWaitingBubbles(): BubblePair | null {
    return game.value.waitingBubbles ?? null;
  }

  function setWaitingBubbles(dataWaitingBubbles: BubblePair | null): void {
    game.value.waitingBubbles = dataWaitingBubbles;
  }

  function getFallingBubbles(): BubblePair | null {
    return game.value.fallingBubbles ?? null;
  }

  function setFallingBubbles(dataFallingBubbles: BubblePair | null): void {
    game.value.fallingBubbles = dataFallingBubbles;
  }

  function getRestingBubbles(): Bubble[] {
    return game.value.restingBubbles ?? [];
  }

  function addRestingBubbles(bubbles: Bubble[]): void {
    game.value.restingBubbles.push(...bubbles);
  }

  function updatePositionBubbles(updatedBubbles: Bubble[]): void {
    for (const updatedBubble of updatedBubbles) {
      const index = game.value.restingBubbles.findIndex(b => b.id === updatedBubble.id);
      if (index !== -1) {
        game.value.restingBubbles[index] = updatedBubble;
      }
    }
  }

  function deleteBubbles(bubblesId: string[]): void {
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
