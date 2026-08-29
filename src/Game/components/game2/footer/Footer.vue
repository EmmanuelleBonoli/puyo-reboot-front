<template>
  <div class="footer">
    <div class="footer-board">
      <div class="board-left">
        <img class="btn-store" src="/images/refonte/store.png" alt="store" @click="emit('openStore')" style="cursor: pointer" />
      </div>
      <div class="board-center">
        <Inventory />
      </div>
      <div class="board-right">
        <img class="btn" src="/images/refonte/pause.png" alt="pause" @click="emit('pause')" style="cursor: pointer" />
        <img class="btn" src="/images/refonte/menu.png" alt="menu" @click="emit('openMenu')" style="cursor: pointer" />
      </div>
    </div>
    <div class="ads"></div>
  </div>
</template>

<script setup lang="ts">
import Inventory from './Inventory.vue';

const emit = defineEmits(['openStore', 'pause', 'openMenu']);
</script>

<style scoped>
.footer {
  background: url('/images/refonte/footer.png');
  height: 18%;
  width: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.footer-board {
  height: 64%;
  width: 100%;
  display: flex;
}

.board-left {
  height: 100%;
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-store {
  width: 80%;
  height: 75%;
  object-fit: contain;
  transition: transform 0.1s ease;
}

.board-center {
  height: 100%;
  width: 48%;
}

.board-right {
  height: 100%;
  width: 27%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2%;
  flex-direction: column;
}

.btn {
  object-fit: contain;
  width: 85%;
  height: 90%;
  transition: transform 0.1s ease;
}

.btn:active,
.btn-store:active {
  transform: scale(0.85);
}

.footer-board {
  height: 64%;
  width: 100%;
}

.ads {
  height: 36%;
  width: 100%;
}
</style>
