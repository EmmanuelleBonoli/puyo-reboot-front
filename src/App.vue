<template>
  <div class="screen-game">
    <Toast />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { getDeviceLang } from './shared/services/utils.ts';
import type { LangCode } from './shared/models/user.types.ts';
import { UserFacadeService } from './Game/services/user-facade.service.ts';

const userFacadeService = new UserFacadeService();

const lang: LangCode = (getDeviceLang() || 'en') as LangCode;
userFacadeService.setGameLanguage(lang);
</script>

<style scoped>
.screen-game {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
