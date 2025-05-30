<script setup lang="ts"></script>

<template>
  <div class="screen-game">
    <Toast />
    <RouterView />
  </div>
</template>

<style scoped>
.screen-game {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
