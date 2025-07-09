<template>
  <div class="profile-options">
    <div class="best-score">
      <div class="best-score-info">
        <Avatar image="/images/Game/Settings/trophy.png" shape="circle" size="large" />
        <span>{{ t('settings.bestScore') }}</span>
      </div>
      <p>{{ game.statsGame.bestScore }} pts</p>
    </div>

    <Button rounded class="astronaut-button">
      <i class="fa-solid fa-user-astronaut"></i>
      <span>{{ t('settings.myAstronaut') }}</span>
    </Button>
    <div class="user-astronaut">
      <div class="user-info">
        <Avatar @click="activeChangeAvatar = true" :image="baseApiUrl + user?.avatar" shape="circle" size="large" class="cursor" />
        <div v-if="!activeChangePlayerName">
          <Button class="p-button-text" rounded @click="activeChangePlayerName = true">{{ user?.playerName }} </Button>
          <i class="fa-solid fa-pencil" @click="activeChangePlayerName = true"></i>
        </div>
        <div class="modify-playerName" v-else>
          <InputText type="text" v-model="playerName" class="input-playerName" />
          <i class="fa-solid fa-floppy-disk" @click="changePlayerName()"></i>
        </div>
      </div>
      <Avatar @click="activeChangeAstronaut = true" class="cursor" :image="baseApiUrl + user?.astronaut" shape="circle" size="xlarge" />
    </div>
  </div>
  <ProfileMenuAvatarChange v-model:activeChangeAvatar="activeChangeAvatar" @close="activeChangeAvatar = false" @change="changeAvatar" />

  <ProfileMenuAstronautChange
    v-model:activeChangeAstronaut="activeChangeAstronaut"
    @close="activeChangeAstronaut = false"
    @change="changeAstronaut" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Button, Avatar, InputText } from 'primevue';
import { useI18n } from 'vue-i18n';
import { GameFacadeService } from '../../services/game-facade.service.ts';
import { useAuthStore } from '../../../Authentication/store/auth.store.ts';
import type { User } from '../../../Authentication/models/user.types.ts';
import type { Game } from '../../models/game.types.ts';
import ProfileMenuAvatarChange from './ProfileMenuAvatarChange.vue';
import { baseApiUrl } from '../../../shared/models/sharedVariables.ts';
import { UserFacadeService } from '../../services/user-facade.service.ts';
import { useCommonToasts } from '../../../shared/services/utils.ts';
import ProfileMenuAstronautChange from './ProfileMenuAstronautChange.vue';

const authStore = useAuthStore();
const { t } = useI18n();
const { showToastError } = useCommonToasts();
const gameFacadeService = new GameFacadeService();
const userFacadeService = new UserFacadeService();

const game = ref<Game>(gameFacadeService.getGame());
const user = computed<User>(() => authStore.user);
const playerName = ref('');
const activeChangePlayerName = ref(false);
const activeChangeAstronaut = ref(false);
const activeChangeAvatar = ref(false);

onMounted(() => {
  playerName.value = authStore.user?.playerName;
});

async function changeAvatar(chosenAvatar: string): Promise<void> {
  try {
    await userFacadeService.updateAvatar(chosenAvatar);
  } catch (error) {
    console.error("L'avatar n'a pu être changé", error);
    showToastError();
  }
}

async function changePlayerName(): Promise<void> {
  try {
    if (playerName.value !== user.value.playerName) {
      await userFacadeService.updatePlayerName(playerName.value);
    }
  } catch (error) {
    console.error("Le nom du joueur n'a pas pu être changé", error);
    showToastError();
  }
  activeChangePlayerName.value = false;
}

async function changeAstronaut(chosenAstronaut: string): Promise<void> {
  try {
    await userFacadeService.updateAstronaut(chosenAstronaut);
  } catch (error) {
    console.error("L'astronaute n'a pu être changé", error);
    showToastError();
  }
}
</script>

<style scoped lang="scss">
.profile-options {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 15px;
  width: 100%;
  min-height: 300px;

  .best-score {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    .best-score-info {
      display: flex;
      align-items: center;
    }
  }

  .astronaut-button {
    cursor: initial;
  }

  .user-astronaut {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 10px;
    width: 100%;

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      gap: 10px;

      .fa-pencil,
      .fa-floppy-disk {
        color: var(--secondary-color);
      }

      .modify-playerName {
        display: flex;
        align-items: center;
        gap: 10px;

        .input-playerName {
          width: 120px;
        }
      }
    }

    .cursor {
      cursor: pointer;
    }
  }
}
</style>
