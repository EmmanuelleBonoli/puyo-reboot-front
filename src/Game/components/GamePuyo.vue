<template>
  <div class="game-container" :class="authStore.user?.isLeftHanded ? 'left-handed' : 'right-handed'">
    <div class="grid-game">
      <div v-for="(bubble, index) in gridGame.flat()" :key="bubble?.id ?? `empty-${index}`" class="cell">
        <img v-if="bubble" :src="getBubbleImage(bubble)" alt="bubble" class="bubble-img" />
      </div>
    </div>

    <div class="info-game">
      <div class="waiting-bubbles">
        <div class="cell">
          <img v-if="waitingBubbles" :src="getBubbleImage(waitingBubbles.satellite)" alt="bubble" class="bubble-img" />
        </div>
        <div class="cell">
          <img v-if="waitingBubbles" :src="getBubbleImage(waitingBubbles.pivot)" alt="bubble" class="bubble-img" />
        </div>
      </div>
      <GameDashBoard />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue';
import { useAuthStore } from '../../Authentication/store/auth.store.ts';

import GameDashBoard from './GameDashBoard.vue';
import { useGameStore } from '../store/game.store.ts';
import type { Bubble, BubblePair, GridGame } from '../models/game.types.ts';
import { getBubbleImage, getMatchingGroup } from '../utils/bubble.utils.ts';
import { GameFacadeService } from '../services/game-facade.service.ts';

const props = defineProps({
  isGamePlayOn: Boolean,
});

const authStore = useAuthStore();
const gameStore = useGameStore();
const gameFacadeService = new GameFacadeService();

const restingBubbles = computed<Bubble[]>(() => gameStore.getRestingBubbles());
const waitingBubbles = computed<BubblePair | null>(() => gameStore.getWaitingBubbles());
const fallingBubbles = computed<BubblePair | null>(() => gameStore.getFallingBubbles());

const gridGame = computed<GridGame>(() => {
  const bubblesOnGrid = fallingBubbles.value
    ? [...restingBubbles.value, fallingBubbles.value.satellite, fallingBubbles.value.pivot]
    : [...restingBubbles.value];
  return gameFacadeService.updateGridGame(bubblesOnGrid);
});

const matchBubbles = computed<Bubble[]>(() => {
  return getMatchingGroup(gridGame.value);
});

watch(
  () => props.isGamePlayOn,
  async isGamePlayOn => {
    if (isGamePlayOn) {
      await gameFacadeService.gameOn();
    } else {
      gameFacadeService.pauseGame();
    }
  },
  { immediate: true }
);

watchEffect(async () => {
  if (props.isGamePlayOn) {
    if (matchBubbles.value.length > 0) {
      console.log(`Match found: ${matchBubbles.value}`);
      await gameFacadeService.applyGravity();
      gameFacadeService.deleteBubbles(matchBubbles.value);
      // gameStore.incrementScore(matchBubbles.value.length);
      await gameFacadeService.applyGravity();
    }
  }
});
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  &.left-handed {
    flex-direction: row-reverse;
  }

  &.right-handed {
    flex-direction: row;
  }

  .grid-game {
    display: grid;
    grid-template-rows: repeat(10, 50px);
    grid-template-columns: repeat(6, 50px);
    transform: scaleY(-1);
  }

  .info-game {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 12%;

    .waiting-bubbles {
      display: grid;
      grid-template-rows: repeat(2, 50px);
      grid-template-columns: repeat(1, 50px);
      padding-top: 20%;
    }
  }

  .bubble-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .cell {
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scaleY(-1);
  }

  @keyframes fall {
    from {
      transform: translateY(0);
      opacity: 0.5;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .falling-animation {
    animation: fall 0.25s ease-out;
  }
}
</style>
