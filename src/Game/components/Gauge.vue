<template>
  <div class="gauge">
    <img src="/images/Game/oxygen.png" alt="gauge" />
    <p>{{ levelGauge }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const levelGauge = ref<number>(100);
</script>

<style scoped>
.gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 25%;
  gap: 10%;

  img {
    width: 100%;
  }

  p {
    color: var(--secondary-color);
  }
}
</style>
