<template>
  <Dialog :style="{ width: '80%' }" :visible="isOpenMenu" @update:visible="updateVisible" modal :closable="false" dismissableMask>
    <template #header>
      <div class="title">
        <Button
          v-if="displayMenu !== 'GameMenu'"
          icon="fa-solid fa-arrow-left"
          class="p-button-rounded p-button-text back-button"
          @click="displayMenu = 'GameMenu'" />
        <h2 class="nabla-font">{{ t('game.name') }}</h2>
      </div>
    </template>

    <div v-if="displayMenu === 'GameMenu'" class="menu-options">
      <Button rounded @click="continueGame()" :disabled="disabledContinue">
        <i class="fa-solid fa-play"></i>
        <span>{{ t('game.menu.resume') }}</span>
      </Button>
      <Button rounded @click="newGame()">
        <i class="fa-solid fa-rocket"></i>
        <span>{{ t('game.menu.newGame') }}</span>
      </Button>
      <Button rounded @click="displayMenu = 'ProfileMenu'">
        <i class="fa-solid fa-user"></i>
        <span>{{ t('game.menu.profile') }}</span>
      </Button>
      <Button rounded @click="displayMenu = 'SettingMenu'">
        <i class="fa-solid fa-sliders"></i>
        <span>{{ t('game.menu.settings') }}</span>
      </Button>
    </div>
    <ProfileMenu v-else-if="displayMenu === 'ProfileMenu'" />
    <SettingMenu v-else />
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Dialog, Button } from 'primevue';
import { useI18n } from 'vue-i18n';
import { GameFacadeService } from '../../services/game-facade.service.ts';
import { useCommonToasts } from '../../../shared/services/utils.ts';
import { useGameStore } from '../../store/game.store.ts';
import SettingMenu from './SettingMenu.vue';
import ProfileMenu from './ProfileMenu.vue';

const gameStore = useGameStore();
const { t } = useI18n();
const gameFacadeService = new GameFacadeService();
const { showToastError } = useCommonToasts();
const displayMenu = ref('GameMenu');
const disabledContinue = computed(() => gameStore.getIsGameOver());

defineProps({
  isOpenMenu: Boolean,
});

const emit = defineEmits(['update:isOpenMenu']);

function updateVisible(val: boolean): void {
  emit('update:isOpenMenu', val);
}

async function newGame(): Promise<void> {
  try {
    await gameFacadeService.newGame();
    updateVisible(false);
  } catch (error) {
    console.error("Une nouvelle partie n'a pas pu être chargée : ", error);
    showToastError();
  }
}

async function continueGame(): Promise<void> {
  updateVisible(false);
}

//TODO: add settingsFunction
</script>

<style scoped lang="scss">
.title {
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;

  .back-button {
    position: absolute;
    left: 0;
  }
}

.menu-options {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  min-height: 300px;
}

.menu-options :deep(.p-button) {
  justify-content: flex-start;
  gap: 10px;
  padding-left: 4rem;
  width: 100%;
}
</style>
