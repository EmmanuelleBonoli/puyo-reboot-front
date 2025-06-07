<template>
  <div class="game-container" :class="authStore.user?.isLeftHanded ? 'left-handed' : 'right-handed'">
    <div class="grid-game">
      <div v-for="(cell, index) in grid.flat()" :key="index" class="cell"></div>
    </div>

    <div class="info-game">
      <div class="waiting-bubbles">
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
      <GameDashBoad />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../Authentication/store/auth.store.ts';

import GameDashBoad from './GameDashBoad.vue';

defineProps({
  isGamePlayOn: Boolean,
});

const authStore = useAuthStore();
const ROWS = 10;

const COLS = 6;

const grid = ref<(string | null)[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: space-around;

  &.left-handed {
    flex-direction: row-reverse;
  }

  &.right-handed {
    flex-direction: row;
  }

  .grid-game {
    display: grid;
    grid-template-rows: repeat(10, 50px);
    grid-template-columns: repeat(6, 50px);
  }

  .info-game {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 12%;

    .waiting-bubbles {
      display: grid;
      grid-template-rows: repeat(2, 50px);
      grid-template-columns: repeat(1, 50px);
    }
  }

  .cell {
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
