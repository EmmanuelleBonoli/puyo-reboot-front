import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Game } from '../models/game';

export const useGameStore = defineStore('game', () => {
  const game = ref<Game | null>(null);

  function setGame(dataGame: Game): void {
    game.value = dataGame;
  }

  return { game, setGame };
});
