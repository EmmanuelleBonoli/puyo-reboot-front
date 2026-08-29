<template>
  <div class="page game-page" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <Header />
    <Game :isGamePlayOn="isGamePlayOn" />
    <Footer
      @openStore="goToStore"
      @pause="togglePause"
      @openMenu="
        isPaused = true;
        router.push('/home');
      " />

    <GameOver v-model:isGameOver="isGameOver" />

    <div v-if="isPaused && !isGameOver" class="pause-overlay" @click="togglePause">
      <h2>PAUSED</h2>
      <p>Tap to resume</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { AuthFacadeService } from '../../shared/services/auth-facade.service.ts';
import { GameFacadeService } from '../services/game-facade.service.ts';
import type { User } from '../../shared/models/user.types.ts';
import { OrientationMoveEnum } from '../models/OrientationMoveEnum.ts';
import GameOver from '../components/menus/GameOver.vue';
import { useGameStore } from '../store/game.store.ts';
import Footer from '../components/game2/footer/Footer.vue';
import Header from '../components/game2/header/Header.vue';
import Game from '../components/game2/game/Game.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const gameStore = useGameStore();
const authFacade = new AuthFacadeService();
const gameFacade = new GameFacadeService();
const user = ref<User | null>(null);
const isPaused = ref(false);

const startX = ref(0);
const startY = ref(0);
const hasMoved = ref(false);

const isGameOver = computed<boolean>({
  get: () => gameStore.getIsGameOver(),
  set: (value: boolean) => gameStore.setIsGameOver(value),
});

const isGamePlayOn = computed<boolean>(() => {
  return !isGameOver.value && !isPaused.value;
});

function goToStore(): void {
  isPaused.value = true;
  router.push('/store');
}

function togglePause(): void {
  if (!isGameOver.value) {
    isPaused.value = !isPaused.value;
  }
}

onMounted(async () => {
  user.value = await authFacade.getUser();
  await gameFacade.getGame();
});

function onTouchStart(e: TouchEvent): void {
  const touch = e.touches[0];
  startX.value = touch.clientX;
  startY.value = touch.clientY;
  hasMoved.value = false;
}

function onTouchMove(e: TouchEvent): void {
  const target = e.target as HTMLElement;
  if (target.className === 'inventory-item') {
    // Si l'utilisateur touche un item de l'inventaire, on ne fait rien
    return;
  }

  const touch = e.touches[0];
  const dx = touch.clientX - startX.value;
  const dy = touch.clientY - startY.value;

  const threshold = 30; // Minimum pour considérer que l'utilisateur souhaite déplacer la bulle

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

    // Met à jour les coordonnées de départ pour le prochain mouvement
    startX.value = touch.clientX;
    startY.value = touch.clientY;
  }
}

function onTouchEnd(e: TouchEvent): void {
  const target = e.target as HTMLElement;
  // Si l'utilisateur clique sur les menus ou touche un item de l'inventaire, on ne fait rien
  if (target.className === 'inventory-item' || target.closest('.p-avatar, .p-dialog, .menu-options, button')) {
    return;
  }

  if (!hasMoved.value && isGamePlayOn.value) {
    gameFacade.rotateSatelliteBubble();
  }
}
</script>

<style scoped>
.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  color: white;
  cursor: pointer;
  backdrop-filter: blur(2px);
}

.pause-overlay h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}
</style>
