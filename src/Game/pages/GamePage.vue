<template>
  <div class="page game-page" @click="moveBubble()">
    <AnimationHeaderGame/>
    <GamePuyo :isGamePlayOn="isGamePlayOn"/>
    <FooterGame v-model:isOpenMenu="isOpenMenu" v-model:isOpenStore="isOpenStore"/>

    <GameMenu v-if="isOpenMenu" v-model:isOpenMenu="isOpenMenu"/>
    <StoreGame v-if="isOpenStore" v-model:isOpenStore="isOpenStore"/>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import GameMenu from '../components/GameMenu.vue';
import {AuthFacadeService} from '../../Authentication/services/auth-facade.service.ts';
import {useRouter} from 'vue-router';
import type {User} from '../../Authentication/models/user';
import StoreGame from '../components/StoreGame.vue';
import GamePuyo from '../components/GamePuyo.vue';
import AnimationHeaderGame from '../components/AnimationHeaderGame.vue';
import FooterGame from '../components/FooterGame.vue';
import {GameFacadeService} from "../services/game-facade.service.ts";

const router = useRouter();
const authFacade = new AuthFacadeService();
const gameFacade = new GameFacadeService();
const user = ref<User | null>(null);
const isOpenMenu = ref(true);
const isOpenStore = ref(false);

const isGamePlayOn = computed<boolean>(() => {
  return !isOpenMenu.value && !isOpenStore.value;
});

onMounted(async () => {
  user.value = await authFacade.getUser();
  if (!user.value) {
    await router.push('/login');
  }
});

function moveBubble(): void {
  gameFacade.rotateSatelliteBubble();
}

</script>

<style scoped>
</style>
