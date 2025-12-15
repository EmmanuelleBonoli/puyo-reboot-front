<template>
  <div class="screen-game">
    <Toast />
    <RouterView />
  </div>
  <div class="ad"></div>
</template>

<script setup lang="ts">
import { AuthFacadeService } from './shared/services/auth-facade.service.ts';
import { getDeviceLang } from './shared/services/utils.ts';
import type { LangCode } from './shared/models/user.types.ts';
import { UserFacadeService } from './Game/services/user-facade.service.ts';

const authStore = new AuthFacadeService();
const userFacadeService = new UserFacadeService();

const lang: LangCode = (authStore.getFromLocalStorage('language') || getDeviceLang() || 'en') as LangCode;
userFacadeService.setGameLanguage(lang);
</script>

<style scoped>
.screen-game {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 90vh;
  overflow: hidden;
}

.ad {
  height: 10vh;
}
</style>
