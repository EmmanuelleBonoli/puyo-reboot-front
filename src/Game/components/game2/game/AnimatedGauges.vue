<template>
  <div class="gauges-container">
    <div class="gauge left-gauge">
      <div class="gauge-fill" :style="{ transform: `scaleY(${leftLevel})`, transitionDuration: `${leftDuration}ms` }"></div>
    </div>
    <div class="gauge right-gauge">
      <div class="gauge-fill right-fill" :style="{ transform: `scaleY(${rightLevel})`, transitionDuration: `${rightDuration}ms` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const leftLevel = ref(0.1);
const rightLevel = ref(0.1);

const leftDuration = ref(1000);
const rightDuration = ref(1000);

let leftTimeout: number;
let rightTimeout: number;

const randomRange = (min: number, max: number): number => Math.random() * (max - min) + min;

const animateGauge = (side: 'left' | 'right'): void => {
  // 1. Niveau aléatoire (entre 5% et 100%)
  const newLevel = randomRange(0.05, 1);

  // 2. Durée du mouvement aléatoire (entre 1s et 3s)
  const moveDuration = randomRange(1000, 3000);

  // 3. Durée de la pause après le mouvement (entre 0.5s et 2.5s)
  const pauseDuration = randomRange(500, 2500);

  if (side === 'left') {
    leftLevel.value = newLevel;
    leftDuration.value = moveDuration;
    leftTimeout = window.setTimeout(() => animateGauge('left'), moveDuration + pauseDuration);
  } else {
    rightLevel.value = newLevel;
    rightDuration.value = moveDuration;
    rightTimeout = window.setTimeout(() => animateGauge('right'), moveDuration + pauseDuration);
  }
};

onMounted(() => {
  // On lance la première animation tout de suite pour la gauche
  animateGauge('left');
  // On décale légèrement le départ de la droite pour qu'elles ne soient pas synchronisées
  rightTimeout = window.setTimeout(() => animateGauge('right'), 800);
});

onUnmounted(() => {
  clearTimeout(leftTimeout);
  clearTimeout(rightTimeout);
});
</script>

<style scoped>
.gauges-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  pointer-events: none;
}

.gauge {
  width: 5%;
  height: 45%;
  position: absolute;
  top: 10%;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.left-gauge {
  left: 0;
}

.right-gauge {
  right: 0;
}

.gauge-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #ff0055, #ffaa00);
  transform-origin: bottom;
  transition-property: transform;
  transition-timing-function: ease-in-out;
}

.right-fill {
  background: linear-gradient(to top, #0055ff, #00aaff);
}
</style>
