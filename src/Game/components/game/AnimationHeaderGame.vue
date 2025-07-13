<template>
  <div class="animation-header">
    <div class="background background-space"></div>
    <div class="astro-container">
      <img class="astronaut fly-wave" :src="baseApiUrl + user.astronaut" alt="astronaut" />
      <img v-if="spaceObstacleDisplay" :class="spaceObstacleDisplay.classNames" :src="spaceObstacleDisplay.image" :alt="spaceObstacleDisplay.name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../../../Authentication/store/auth.store.ts';
import type { User } from '../../../Authentication/models/user.types.ts';
import { baseApiUrl } from '../../../shared/models/sharedVariables.ts';
import './animationsHeader/backgroundSpace.scss';
import './animationsHeader/astronaut.scss';
import './animationsHeader/meteor.scss';
import {
  MAX_DELAY_BETWEEN_OBSTACLE_ANIMATIONS,
  MIN_DELAY_BETWEEN_OBSTACLE_ANIMATIONS,
  SPACE_OBSTACLES,
  type SpaceObstacle,
} from '../../models/Animations.ts';
import { generateRandomNumber, generateRandomNumberBetweenRang } from '../../../shared/services/utils.ts';

const authStore = useAuthStore();
const user = computed<User>(() => authStore.user);

const allSpaceObstacles = SPACE_OBSTACLES;
const spaceObstacleDisplay = ref<SpaceObstacle | null>(null);

onMounted(() => {
  launchObstacleCycle();
});

function launchObstacleCycle(): void {
  const delay = generateRandomNumberBetweenRang(MIN_DELAY_BETWEEN_OBSTACLE_ANIMATIONS, MAX_DELAY_BETWEEN_OBSTACLE_ANIMATIONS);
  setTimeout(() => {
    showRandomObstacle();
    launchObstacleCycle();
  }, delay);
}

function showRandomObstacle(): void {
  const randomIndex = generateRandomNumber(allSpaceObstacles.length);
  const chosenObstacle = allSpaceObstacles[randomIndex];

  spaceObstacleDisplay.value = chosenObstacle;

  setTimeout(() => {
    spaceObstacleDisplay.value = null;
  }, chosenObstacle.delay);
}
</script>

<style scoped lang="scss">
.animation-header {
  height: 20%;
  width: 100%;
  overflow: hidden;
  position: relative;

  .background {
    height: 100%;
    width: 200%;
    background: url('/images/Game/Animations/flyingStars.png') repeat-x;
    background-size: cover;
  }

  .astro-container {
    position: absolute;
    top: 0;
    left: 10px;
    z-index: 1;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
