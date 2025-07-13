<template>
  <div class="page game-page" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <AnimationHeaderGame />

    <svg viewBox="0 0 100 10" width="100%" height="60" preserveAspectRatio="none">
      <path d="M0,0 L0,1 L10,1 L20,9 L80,9 L90,1 L100,1 L100,0 Z" fill="black" />
      <polyline points="0,1 10,1 20,9 80,9 90,1 100,1" fill="none" stroke="white" stroke-width="0.5" />
      <path d="M0,1 L10,1 L20,9 L80,9 L90,1 L100,1 L100,10 L0,10 Z" fill="#1e293b" />
    </svg>

    <GamePuyo :isGamePlayOn="isGamePlayOn" />

    <svg viewBox="0 0 100 10" width="100%" height="60" preserveAspectRatio="none">
      <path d="M0,0 L0,9 L10,9 L20,1 L80,1 L90,9 L100,9 L100,0 Z" fill="#1e293b" />
      <polyline points="0,9 10,9 20,1 80,1 90,9 100,9" fill="none" stroke="white" stroke-width="0.5" />
      <path d="M0,9 L10,9 L20,1 L80,1 L90,9 L100,9 L100,10 L0,10 Z" fill="black" />
    </svg>

    <FooterGame v-model:isOpenMenu="isOpenMenu" v-model:isOpenStore="isOpenStore" />

    <GameMenu v-model:isOpenMenu="isOpenMenu" />
    <StoreGame v-model:isOpenStore="isOpenStore" />
    <GameOver v-model:isGameOver="isGameOver" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AnimationHeaderGame from '../components/game/AnimationHeaderGame.vue';
import FooterGame from '../components/game/FooterGame.vue';
import StoreGame from '../components/store/StoreGame.vue';
import GameMenu from '../components/menus/GameMenu.vue';
import GamePuyo from '../components/game/GamePuyo.vue';
import { AuthFacadeService } from '../../Authentication/services/auth-facade.service.ts';
import { GameFacadeService } from '../services/game-facade.service.ts';
import type { User } from '../../Authentication/models/user.types.ts';
import { OrientationMoveEnum } from '../models/OrientationMoveEnum.ts';
import GameOver from '../components/menus/GameOver.vue';
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

const isGameOver = computed<boolean>({
  get: () => gameStore.getIsGameOver(),
  set: (value: boolean) => gameStore.setIsGameOver(value),
});

const isGamePlayOn = computed<boolean>(() => {
  return !isOpenMenu.value && !isOpenStore.value && !isGameOver.value;
  //return false ; // Pour les tests, on peut désactiver le jeu en activant cette ligne
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

<style scoped></style>
