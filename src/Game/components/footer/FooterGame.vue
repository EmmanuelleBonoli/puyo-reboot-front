<template>
  <div class="buttons-game" :class="authStore.user.isLeftHanded ? 'left-handed' : 'right-handed'">
    <Score />

    <h1 class="title nabla-font">{{ t('game.name') }}</h1>
    <div class="coin-counter">
      <Avatar image="/images/Game/Store/oneCoin.png" shape="circle" />
      <p>{{ coins }}</p>
    </div>
    <Button @click="openStore" class="button-store" variant="outlined" rounded>
      <i class="store-icon fa-solid fa-store"></i>
    </Button>
    <Avatar :image="user.avatar" size="large" shape="circle" class="avatar" @click="openProfile" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button, Avatar } from 'primevue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../../shared/stores/auth.store.ts';
import type { User } from '../../../shared/models/user.types.ts';
import { ScoreFacadeService } from '../../services/score-facade.service.ts';
import Score from './Score.vue';

const props = defineProps({
  isOpenMenu: Boolean,
  isOpenStore: Boolean,
});

const emit = defineEmits<{
  (e: 'update:isOpenMenu', value: boolean): void;
  (e: 'update:isOpenStore', value: boolean): void;
}>();

const authStore = useAuthStore();
const { t } = useI18n();
const scoreFacadeService = new ScoreFacadeService();
const user = computed<User>(() => authStore.user);
const coins = computed(() => scoreFacadeService.getCoins());

function openStore(event: Event): void {
  event.stopPropagation();
  emit('update:isOpenStore', !props.isOpenStore);
}

function openProfile(event: Event): void {
  event.stopPropagation();
  emit('update:isOpenMenu', !props.isOpenMenu);
}
</script>

<style scoped lang="scss">
.buttons-game {
  display: flex;
  width: 100%;
  height: 10%;
  align-items: center;
  padding: 2%;
  background-color: var(--primary-color);
  position: relative;

  &.left-handed {
    flex-direction: row;
  }

  &.right-handed {
    flex-direction: row-reverse;
  }

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

  .coin-counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 2%;
    color: var(--secondary-color);
    font-size: 1rem;

    p {
      margin: 0;
      font-weight: bold;
    }
  }

  .title {
    flex-grow: 1;
    text-align: center;
  }
}
</style>
