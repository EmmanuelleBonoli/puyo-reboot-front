import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type Bubble, type BubblePair, COLS_GRID_GAME, type Game, type GridGame, ROWS_GRID_GAME } from '../models/game.types.ts';

export const useGameStore = defineStore('game', () => {
  const gridGame = ref<GridGame>(Array.from({ length: ROWS_GRID_GAME }, () => Array<Bubble | null>(COLS_GRID_GAME).fill(null)));
  const game = ref<Game | null>(null);

  const gravityFallingBubbles = ref<Set<string>>(new Set());
  const gravityFallDistanceBubbles = ref<Record<string, number>>({});

  // const restingBubbles = ref<Bubble[] | []>([]);
  // const waitingBubbles = ref<BubblePair | null>(null);
  // const fallingBubbles = ref<BubblePair | null>(null);

  function getGridGame(): GridGame {
    return gridGame.value;
  }

  function setGridGame(dataGrid: GridGame): void {
    gridGame.value = dataGrid;
  }

  function getGame(): Game | null {
    return game.value;
  }

  function setFallingBubbles(dataFallingBubbles: BubblePair): void {
    if (game.value) {
      game.value.fallingBubbles = dataFallingBubbles;
    }
  }

  function setGame(dataGame: Game): void {
    game.value = dataGame;
  }

  function getRestingBubbles(): Bubble[] {
    return game.value?.restingBubbles ?? [];
  }

  function getWaitingBubbles(): BubblePair | null {
    return game.value?.waitingBubbles ?? null;
  }

  function getFallingBubbles(): BubblePair | null {
    return game.value?.fallingBubbles ?? null;
  }

  function setGravityFallingBubbles(ids: string[]): void {
    gravityFallingBubbles.value = new Set(ids);
  }

  function clearGravityFallingBubbles(): void {
    gravityFallingBubbles.value.clear();
  }

  function isGravityFallingBubble(id: string): boolean {
    return gravityFallingBubbles.value.has(id);
  }

  function setGravityFallDistances(distances: Record<string, number>): void {
    gravityFallDistanceBubbles.value = distances;
  }

  function getFallDistanceForBubble(id: string): number {
    return gravityFallDistanceBubbles.value[id] || 0;
  }

  function clearGravityFallDistances(): void {
    gravityFallDistanceBubbles.value = {};
  }

  function deleteBubbles(bubblesId: string[]): void {
    if (!game.value) return;

    game.value.restingBubbles = game.value.restingBubbles.filter(b => !bubblesId.includes(b.id));
  }

  function updatePositionBubbles(updatedBubbles: Bubble[]): void {
    if (!game.value) return;

    for (const updatedBubble of updatedBubbles) {
      const index = game.value.restingBubbles.findIndex(b => b.id === updatedBubble.id);
      if (index !== -1) {
        game.value.restingBubbles[index] = updatedBubble;
      }
    }
    // game.value.restingBubbles = [...game.value.restingBubbles];
  }

  return {
    game,
    getGridGame,
    setGridGame,
    getRestingBubbles,
    getWaitingBubbles,
    getFallingBubbles,
    setFallingBubbles,
    setGravityFallingBubbles,
    clearGravityFallingBubbles,
    isGravityFallingBubble,
    setGravityFallDistances,
    getFallDistanceForBubble,
    clearGravityFallDistances,
    updatePositionBubbles,
    getGame,
    setGame,
    deleteBubbles,
  };
});
