import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
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
      waitingSpecialBubbles: dataGame.waitingSpecialBubbles ?? [],
    };
  }

  function getWaitingBubbles(): BubblePair | null {
    return game.value.waitingBubbles;
  }

  function setWaitingBubbles(dataWaitingBubbles: BubblePair | null): void {
    game.value.waitingBubbles = dataWaitingBubbles;
  }

  function getFallingBubbles(): BubblePair | null {
    return game.value.fallingBubbles;
  }

  function setFallingBubbles(dataFallingBubbles: BubblePair | null): void {
    game.value.fallingBubbles = dataFallingBubbles;
  }

  function getRestingBubbles(): Bubble[] {
    return game.value.restingBubbles ?? [];
  }

  function getWaitingSpecialBubbles(): Bubble[] {
    return game.value.waitingSpecialBubbles ?? [];
  }

  function setWaitingSpecialBubbles(bubbles: Bubble[] = []): void {
    game.value.waitingSpecialBubbles = [...bubbles];
  }

  function addRestingBubbles(bubbles: Bubble[]): void {
    const reactiveBubbles = bubbles.map(b => reactive(b));
    game.value.restingBubbles = [...game.value.restingBubbles, ...reactiveBubbles];
  }

  function updatePositionBubbles(updatedBubbles: Bubble[]): void {
    const bubbleMap = new Map(updatedBubbles.map(b => [b.id, b]));
    game.value.restingBubbles = game.value.restingBubbles.map(b => (bubbleMap.has(b.id) ? bubbleMap.get(b.id)! : b));
  }

  function deleteBubbles(bubblesId: string[]): void {
    game.value.restingBubbles = game.value.restingBubbles.filter(b => !bubblesId.includes(b.id));
  }

  return {
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
    getWaitingSpecialBubbles,
    setWaitingSpecialBubbles,
    updatePositionBubbles,
    getGame,
    setGame,
    deleteBubbles,
    addRestingBubbles,
  };
});
