<template>
  <div
    class="buttons-game"
    :style="{
      justifyContent: user?.isLeftHanded ? 'flex-end' : 'flex-start',
    }">
    <AvatarButton @click="emit('update:isOpenMenu', true)" />
    <Button @click="openStore" class="button-store" variant="outlined" rounded>
      <i class="store-icon fa-solid fa-store"></i>
    </Button>
    <h1 class="title nabla-font">Astro Puyo</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from 'primevue';
import AvatarButton from './AvatarButton.vue';
import { useAuthStore } from '../../Authentication/store/auth.store.ts';
import type { User } from '../../Authentication/models/user';

const props = defineProps({
  isOpenMenu: Boolean,
  isOpenStore: Boolean,
});

const emit = defineEmits<{
  (e: 'update:isOpenMenu', value: boolean): void;
  (e: 'update:isOpenStore', value: boolean): void;
}>();

const authStore = useAuthStore();
const user = ref<User | null>(authStore.user);

function openStore(event: Event): void {
  event.stopPropagation();
  emit('update:isOpenStore', !props.isOpenStore);
}
</script>

<style scoped>
.buttons-game {
  display: flex;
  width: 100%;
  height: 10%;
  align-items: center;
  padding: 2%;

  .button-store {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-color: var(--secondary-color);

    .store-icon {
      padding: 10px;
      font-size: 1.5rem;
      color: var(--background-color);
    }
  }

  .title {
    flex-grow: 1;
    text-align: center;
  }
}
</style>
