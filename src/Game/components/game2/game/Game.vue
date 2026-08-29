<template>
  <div class="game">
    <AnimatedGauges />
    <GamePuyo :isGamePlayOn="isGamePlayOn" />
  </div>
</template>

<script setup lang="ts">
import GamePuyo from '../../game/GamePuyo.vue';
import AnimatedGauges from './AnimatedGauges.vue';

defineProps({
  isGamePlayOn: Boolean,
});
</script>

<style scoped>
.game {
  height: 55%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2% 9% 5% 9%;
  position: relative;
  z-index: 1;
}

.game::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/images/refonte/game.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: -1;
  pointer-events: none;
}
</style>
