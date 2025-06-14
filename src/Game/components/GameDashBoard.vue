<template>
  <div class="game-dash">
    <Gauge />
    <div>Score</div>
    <div>Timer</div>
  </div>
</template>
<script setup lang="ts">
import Gauge from './Gauge.vue';
</script>

<style scoped>
.game-dash {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  justify-content: space-around;
}
</style>
