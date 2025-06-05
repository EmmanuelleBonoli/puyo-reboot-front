<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GameMenu from '../components/GameMenu.vue';
import { AuthFacadeService } from '../../Authentication/services/auth-facade.service.ts';
import { useRouter } from 'vue-router';
import AvatarButton from '../components/AvatarButton.vue';
import type { User } from '../../Authentication/models/user';
import ProfileMenu from '../components/ProfileMenu.vue';
import GamePuyo from '../components/GamePuyo.vue';

const router = useRouter();
const authFacade = new AuthFacadeService();
const user = ref<User | null>(null);
const isOpenMenu = ref(true);
const isOpenProfile = ref(false);

onMounted(async () => {
  user.value = await authFacade.getUser();
  if (!user.value) {
    await router.push('/login');
  }
});
</script>

<template>
  <div class="page">
    <AvatarButton :srcImg="user?.avatar" v-model:isOpenProfile="isOpenProfile" />
    <Button class="button-pause" variant="outlined" rounded>
      <i class="pause-icon fa-solid fa-pause"></i>
    </Button>

    <GamePuyo />

    <GameMenu v-if="isOpenMenu" v-model:isOpenMenu="isOpenMenu" />
    <ProfileMenu v-if="isOpenProfile" v-model:isOpenProfile="isOpenProfile" />
  </div>
</template>

<style scoped>
.button-pause {
  border-radius: 50%;
  background-color: var(--secondary-color);

  .pause-icon {
    padding: 12px;
    font-size: 1.5rem;
    color: var(--background-color);
  }
}
</style>
