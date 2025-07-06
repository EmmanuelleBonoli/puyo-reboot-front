<template>
  <div class="score">
    <p class="numbers">{{ displayScore }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ScoreFacadeService } from '../../services/score-facade.service.ts';

const scoreService = new ScoreFacadeService();
const targetScore = computed<number>(() => scoreService.getScore());
const displayScore = ref(0);
const previousScore = ref(0);
let intervalId: number | null = null;

watch(targetScore, newVal => {
  if (intervalId) clearInterval(intervalId);

  if (previousScore.value === 0) {
    // c'est le chargement initial, on ne veut pas l'animation
    displayScore.value = newVal;
    previousScore.value = newVal;
    return;
  }

  intervalId = setInterval(() => {
    if (displayScore.value >= newVal) {
      clearInterval(intervalId!);
      intervalId = null;
      previousScore.value = newVal;
      return;
    }
    displayScore.value += 1;
  }, 10);
});
</script>

<style scoped>
.score {
  position: fixed;
  bottom: 9%;
  left: 20%;
  padding: 0 1rem 0 1rem;
  width: 60%;
  text-align: end;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;

  .numbers {
    font-family: 'Digital', monospace;
    font-size: 1.5rem;
    color: var(--secondary-color);
  }
}
</style>
