<template>
  <div class="oxygen">
    <div class="progress-bar-container">
      <ProgressBar :value="levelOxygen" class="vertical-progress" :show-value="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { ProgressBar } from 'primevue';
import { ScoreFacadeService } from '../../services/score-facade.service.ts';
import { GameFacadeService } from '../../services/game-facade.service.ts';

const scoreFacadeService = new ScoreFacadeService();
const gameFacadeService = new GameFacadeService();
const isPlayingGame = computed<boolean>(() => gameFacadeService.isPlayingGame());
const levelOxygen = computed<number>(() => scoreFacadeService.getOxygen());

let oxygenInterval: ReturnType<typeof setInterval> | null = null;

watch(isPlayingGame, newVal => {
  if (newVal) {
    startOxygenConsumption();
  } else {
    stopOxygenConsumption();
  }
});

watch(levelOxygen, newValue => {
  if (newValue <= 0) {
    gameFacadeService.setIsGameOver(true);
    stopOxygenConsumption();
  }
});

onMounted(() => {
  if (isPlayingGame.value) {
    startOxygenConsumption();
  }
});

onUnmounted(() => {
  stopOxygenConsumption();
});

function startOxygenConsumption(): void {
  if (oxygenInterval) return;

  oxygenInterval = setInterval(() => {
    if (isPlayingGame.value && levelOxygen.value > 0) {
      scoreFacadeService.updateOxygen(-1, false);
    }
  }, 1000);
}

function stopOxygenConsumption(): void {
  if (oxygenInterval) {
    clearInterval(oxygenInterval);
    oxygenInterval = null;
  }
}
</script>

<style scoped lang="scss">
.oxygen {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 35%;
  gap: 10%;
  background-color: var(--surface-card);
  border-radius: 10px;

  .progress-bar-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vertical-progress {
    transform: rotate(-90deg);
    width: 100px; /* correspond à la hauteur finale */
    height: 20px; /* correspond à la largeur finale */
    transform-origin: center center;
  }
}
</style>
