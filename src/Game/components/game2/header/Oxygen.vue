<template>
  <div class="oxygen">
    <img src="/images/refonte/oxygen.png" alt="Oxygen" />
    <div class="oxygen-mask">
      <div class="oxygen-liquid" :style="{ height: `${levelOxygen}%` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { ScoreFacadeService } from '../../../services/score-facade.service.ts';
import { GameFacadeService } from '../../../services/game-facade.service.ts';

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

<style scoped>
.oxygen {
  width: 100%;
  height: 100%;
  padding: 1%;
  position: relative;
}

img {
  height: 100%;
  width: 100%;
  object-fit: contain;
  position: relative;
  z-index: 10;
}

.oxygen-mask {
  position: absolute;
  top: 28%;
  left: 20%;
  width: 55%;
  height: 45%;
  z-index: 5;
  overflow: hidden;
}

.oxygen-liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, #1432a7, #0055ff);
  transition: height 1s linear;
  animation: tiltSurface 2.5s ease-in-out infinite alternate;
}

.oxygen-liquid::before,
.oxygen-liquid::after {
  content: '';
  position: absolute;
  bottom: -15px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: rise 4s infinite ease-in;
  z-index: 4;
}

.oxygen-liquid::before {
  width: 10px;
  height: 10px;
  left: 20%;
  animation-duration: 3s;
}

.oxygen-liquid::after {
  width: 15px;
  height: 15px;
  left: 60%;
  animation-duration: 4.5s;
  animation-delay: 1s;
}

@keyframes tiltSurface {
  0% {
    clip-path: polygon(0 6px, 100% 0px, 100% 100%, 0 100%);
  }
  100% {
    clip-path: polygon(0 0px, 100% 6px, 100% 100%, 0 100%);
  }
}

@keyframes rise {
  0% {
    bottom: -15px;
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    bottom: 100%;
    transform: translateX(-5px);
    opacity: 0;
  }
}
</style>
