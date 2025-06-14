<template>
  <Dialog :style="{ width: '80%' }" :visible="isOpenStore" @update:visible="updateVisible" modal dismissableMask :closable="false">
    <div>Store Gaaaaame</div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog } from 'primevue';

const props = defineProps({
  isOpenStore: Boolean,
});

const emit = defineEmits(['update:isOpenStore']);

function updateVisible(): void {
  emit('update:isOpenStore', !props.isOpenStore);
}
</script>

<style scoped></style>
