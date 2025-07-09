<template>
  <Dialog :style="{ width: '80%' }" :visible="isGameOver" @update:visible="updateVisible" modal :closable="false">
    <div class="title">
      <h1 class="nabla-font">Game Over</h1>
    </div>

    <div class="game-over-info">
      <p>Score de la partie : {{ gameEndedScore }}</p>
      <p>Meilleur score : {{ bestScore }}</p>
    </div>

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
import { computed, onMounted } from 'vue';
import { Button, Dialog } from 'primevue';
import { GameFacadeService } from '../../services/game-facade.service.ts';
import { useCommonToasts } from '../../../shared/services/utils.ts';
import { ScoreFacadeService } from '../../services/score-facade.service.ts';

const gameFacadeService = new GameFacadeService();
const scoreFacadeService = new ScoreFacadeService();
const { showToastError } = useCommonToasts();

defineProps({
  isGameOver: Boolean,
});

onMounted(async () => {
  try {
    await scoreFacadeService.saveBestScore();
  } catch (error) {
    console.error(error);
    showToastError();
  }
});

const bestScore = computed(() => {
  const previousBestScore = scoreFacadeService.getBestScore();

  if (previousBestScore > gameEndedScore.value) {
    return previousBestScore;
  }
  return gameEndedScore.value;
});

const gameEndedScore = computed(() => scoreFacadeService.getScore());

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

<style scoped>
.title {
  text-align: center;
  margin-bottom: 20px;
}

.game-over-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.menu-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-options :deep(.p-button) {
  justify-content: flex-start;
  gap: 10px;
  padding-left: 4rem;
  width: 100%;
}
</style>
