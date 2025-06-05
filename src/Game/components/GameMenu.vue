<template>
  <Dialog :style="{ width: '80%' }" :visible="isOpenMenu" @update:visible="updateVisible" modal dismissableMask :closable="false">
    <template #header>
      <div class="title">
        <h2 class="nabla-font">Puyo Game</h2>
      </div>
    </template>

    <div class="menu-options">
      <Button rounded>Reprendre la partie</Button>
      <Button rounded>Nouvelle Partie</Button>
      <Button rounded>Paramètres</Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, Button } from 'primevue';

defineProps({
  isOpenMenu: Boolean,
});

const emit = defineEmits(['update:isOpenMenu']);

function updateVisible(val: boolean): void {
  emit('update:isOpenMenu', val);
}
</script>

<style scoped>
.title {
  text-align: center;
  width: 100%;
  margin: 0;
}

.menu-options {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}
</style>
