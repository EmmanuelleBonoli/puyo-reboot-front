<script setup lang="ts">
import LoginForm from "./Authentication/components/LoginForm.vue";

</script>

<template>
  <div class="screen-game">
    <Toast/>
    <LoginForm/>
  </div>
</template>

<style scoped>
.screen-game {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
