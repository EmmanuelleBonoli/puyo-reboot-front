<template>
  <div class="animation-header">
    <div class="background"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.animation-header {
  height: 15%;
  width: 100%;
  overflow: hidden;

  .background {
    height: 100%;
    width: 200%;
    background: url('/images/Game/flyingStars.png') repeat-x;
    background-size: cover;
    animation: space-anim infinite 10s linear;
  }

  @keyframes space-anim {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
}
</style>
