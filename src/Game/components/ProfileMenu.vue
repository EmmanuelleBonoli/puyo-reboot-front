<script setup lang="ts">
import { Dialog } from 'primevue';

defineProps({
  isOpenProfile: Boolean,
});

const emit = defineEmits(['update:isOpenProfile']);

function updateVisible(val: boolean): void {
  emit('update:isOpenProfile', val);
}
</script>

<template>
  <Dialog :style="{ width: '80%' }" :visible="isOpenProfile" @update:visible="updateVisible" modal dismissableMask :closable="false">
    <div>Profile Menuuuuuuuuuuuuu</div>
  </Dialog>
</template>

<style scoped></style>
