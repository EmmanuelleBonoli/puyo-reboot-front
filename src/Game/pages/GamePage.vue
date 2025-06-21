<template>
  <div class="page game-page" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove" @touchend.passive="onTouchEnd">
    <AnimationHeaderGame />
    <GamePuyo :isGamePlayOn="isGamePlayOn" />
    <FooterGame v-model:isOpenMenu="isOpenMenu" v-model:isOpenStore="isOpenStore" />

    <GameMenu v-model:isOpenMenu="isOpenMenu" />
    <StoreGame v-model:isOpenStore="isOpenStore" />
    <GameOver v-model:isGameOver="isGameOver" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import GameMenu from '../components/GameMenu.vue';
import GamePuyo from '../components/GamePuyo.vue';
import AnimationHeaderGame from '../components/AnimationHeaderGame.vue';
import FooterGame from '../components/FooterGame.vue';
import StoreGame from '../components/StoreGame.vue';
import { AuthFacadeService } from '../../Authentication/services/auth-facade.service.ts';
import { GameFacadeService } from '../services/game-facade.service.ts';
import type { User } from '../../Authentication/models/user';
import { OrientationMoveEnum } from '../models/OrientationMoveEnum.ts';
import GameOver from '../components/GameOver.vue';
import { useGameStore } from '../store/game.store.ts';

const router = useRouter();
const gameStore = useGameStore();
const authFacade = new AuthFacadeService();
const gameFacade = new GameFacadeService();
const user = ref<User | null>(null);
const isOpenMenu = ref(true);
const isOpenStore = ref(false);

const startX = ref(0);
const startY = ref(0);
const hasMoved = ref(false);

const isGamePlayOn = computed<boolean>(() => {
  return !isOpenMenu.value && !isOpenStore.value;
});

const isGameOver = computed<boolean>(() => {
  return gameStore.getIsGameOver();
});

onMounted(async () => {
  user.value = await authFacade.getUser();
  if (!user.value) {
    await router.push('/login');
  }
});

function onTouchStart(e: TouchEvent): void {
  const touch = e.touches[0];
  startX.value = touch.clientX;
  startY.value = touch.clientY;
  hasMoved.value = false;
}

function onTouchMove(e: TouchEvent): void {
  const touch = e.touches[0];
  const dx = touch.clientX - startX.value;
  const dy = touch.clientY - startY.value;

  const threshold = 30; // Minimum move to consider a swipe

  if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
    hasMoved.value = true;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        gameFacade.moveBubble(OrientationMoveEnum.right);
      } else {
        gameFacade.moveBubble(OrientationMoveEnum.left);
      }
    } else {
      if (dy > 0) {
        gameFacade.moveBubble(OrientationMoveEnum.down);
      }
    }

    // Reset so it doesn't move repeatedly
    startX.value = touch.clientX;
    startY.value = touch.clientY;
  }
}

function onTouchEnd(): void {
  if (!hasMoved.value) {
    gameFacade.rotateSatelliteBubble();
  }
}
</script>

<style scoped></style>
