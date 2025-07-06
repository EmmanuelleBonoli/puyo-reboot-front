<template>
  <div class="game-dash">
    <Oxygen />
    <Inventory />
    <Score />
  </div>
</template>
<script setup lang="ts">
import Oxygen from './Oxygen.vue';
import Score from './Score.vue';
import Inventory from './Inventory.vue';
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
