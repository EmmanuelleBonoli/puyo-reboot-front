<script setup lang="ts">
import { Dialog } from 'primevue';

defineProps({
  isOpenStore: Boolean,
});

const emit = defineEmits(['update:isOpenStore']);

function updateVisible(val: boolean): void {
  emit('update:isOpenStore', val);
}
</script>

<template>
  <Dialog :style="{ width: '80%' }" :visible="isOpenStore" @update:visible="updateVisible" modal dismissableMask :closable="false">
    <div>Store Gaaaaame</div>
  </Dialog>
</template>

<style scoped></style>
