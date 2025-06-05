<script setup lang="ts">
import { Button } from 'primevue';
import { baseApiUrl } from '../../shared/models/sharedVariables.ts';

const props = defineProps({
  srcImg: String,
  isOpenProfile: Boolean,
});

const emit = defineEmits(['update:isOpenProfile']);

function openProfile(): void {
  emit('update:isOpenProfile', !props.isOpenProfile);
}
</script>

<template>
  <Button class="avatar" rounded variant="text" @click="openProfile">
    <img class="avatar-img" :src="baseApiUrl + srcImg" alt="Mon Profil" />
  </Button>
</template>

<style scoped>
.avatar {
  position: fixed;
  top: 0;
  right: 0;

  .avatar-img {
    width: 50px;
    object-fit: contain;
  }
}
</style>
