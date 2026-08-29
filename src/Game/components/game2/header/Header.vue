<template>
  <div class="header">
    <div class="animations">
      <AnimationHeaderGame />
    </div>
    <div class="header-board">
      <div class="header-board-left">
        <Score />
      </div>
      <div class="header-board-right">
        <Oxygen />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Oxygen from './Oxygen.vue';
import Score from './Score.vue';
import AnimationHeaderGame from '../../game/AnimationHeaderGame.vue';
</script>

<style scoped>
.header {
  height: 27%;
  width: 100%;
  position: relative;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/images/refonte/header.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 1;
  pointer-events: none;
}

.animations {
  height: 60%;
  width: 100%;
  position: relative;
  z-index: 0;
}

.header-board {
  height: 40%;
  width: 100%;
  display: flex;
  position: relative;
  z-index: 2;
}

.header-board-left {
  height: 100%;
  width: 51%;
}

.header-board-right {
  height: 100%;
  width: 49%;
}
</style>
