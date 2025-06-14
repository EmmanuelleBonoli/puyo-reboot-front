<template>
  <Button class="avatar" rounded variant="text" @click="openProfile">
    <img class="avatar-img" :src="baseApiUrl + user?.avatar" alt="Mon Profil" />
  </Button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from 'primevue';
import { useAuthStore } from '../../Authentication/store/auth.store.ts';
import { baseApiUrl } from '../../shared/models/sharedVariables.ts';
import type { User } from '../../Authentication/models/user';

const props = defineProps({
  isOpenMenu: Boolean,
});

const emit = defineEmits(['update:isOpenMenu']);

const authStore = useAuthStore();
const user = ref<User | null>(null);

onMounted(() => {
  user.value = authStore.user;
});

function openProfile(event: Event): void {
  event.stopPropagation();
  emit('update:isOpenMenu', !props.isOpenMenu);
}
</script>

<style scoped>
.avatar {
  .avatar-img {
    width: 50px;
    object-fit: contain;
  }
}
</style>
