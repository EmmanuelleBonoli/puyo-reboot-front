<template>
  <Dialog :style="{ width: '80%' }" :visible="isOpenMenu" @update:visible="updateVisible" modal :closable="false">
    <template #header>
      <div class="title">
        <h2 class="nabla-font">Puyo Game</h2>
      </div>
    </template>

    <div class="menu-options">
      <Button rounded @click="continueGame()">
        <i class="fa-solid fa-play"></i>
        <span>Reprendre la partie</span>
      </Button>
      <Button rounded @click="newGame()">
        <i class="fa-solid fa-rocket"></i>
        <span>Nouvelle Partie</span>
      </Button>
      <Button rounded>
        <i class="fa-solid fa-sliders"></i>
        <span>Paramètres</span>
      </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {Dialog, Button} from 'primevue';
import {GameFacadeService} from '../services/game-facade.service.ts';
import {useCommonToasts} from "../../shared/services/utils.ts";

const gameFacadeService = new GameFacadeService();
const {showToastError} = useCommonToasts();

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
    console.error(error);
    showToastError();
  }
}

async function continueGame(): Promise<void> {
  updateVisible(false);
}

//TODO: add settingsFunction
</script>

<style scoped>
.title {
  text-align: center;
  width: 100%;
  margin: 0;
}

.menu-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-options :deep(.p-button) {
  justify-content: flex-start;
  gap: 10px;
  padding-left: 4rem;
  width: 100%;
}
</style>
