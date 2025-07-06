<template>
  <Dialog :style="{ width: '80%' }" :visible="isGameOver" @update:visible="updateVisible" modal :closable="false">
    <template #header>
      <div class="title">
        <h2 class="nabla-font">Puyo Game</h2>
        <h1>Game Over</h1>
      </div>
    </template>

    <div class="menu-options">
      <Button rounded @click="newGame()">
        <i class="fa-solid fa-rocket"></i>
        <span>Nouvelle Partie</span>
      </Button>
      <Button rounded>
        <i class="fa-solid fa-sliders"></i>
        <span>Paramètres</span>
      </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Button, Dialog } from 'primevue';
import { GameFacadeService } from '../../services/game-facade.service.ts';
import { useCommonToasts } from '../../../shared/services/utils.ts';

const gameFacadeService = new GameFacadeService();
const { showToastError } = useCommonToasts();

defineProps({
  isGameOver: Boolean,
});

const emit = defineEmits(['update:isGameOver']);

function updateVisible(val: boolean): void {
  emit('update:isGameOver', val);
}

async function newGame(): Promise<void> {
  try {
    await gameFacadeService.newGame();
    updateVisible(false);
  } catch (error) {
    console.error("Une nouvelle partie n'a pas pu être chargée : ", error);
    showToastError();
  }
}
</script>

<style scoped></style>
