<template>
  <div class="game-dash">
    <Oxygen />
    <Inventory />
  </div>
</template>
<script setup lang="ts">
import Oxygen from './Oxygen.vue';
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
