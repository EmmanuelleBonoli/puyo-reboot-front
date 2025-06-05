<template>
  <div class="loading-page page">
    <h1 class="nabla-font">Astro Puyo</h1>

    <img class="astro" src="/images/Home/astro.png" alt="astronaute" />
    <img class="planet" src="/images/Home/planet.png" alt="planète" />
    <div class="loading-progress">
      <ProgressBar class="progress-bar" :value="progressValue" />
      <p class="caveat-font">{{ loadingMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProgressBar } from 'primevue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { AuthFacadeService } from '../../Authentication/services/auth-facade.service.ts';
import { useRouter } from 'vue-router';

const messages: string[] = ['Préparation au décollage !', "Remplissage des réserves d'oxygène", 'Départ imminent !'];

const router = useRouter();
const authFacade = new AuthFacadeService();
const progressValue = ref(0);
const loadingMessage = ref(messages[0]);
const interval = ref();

const DURATION_MS = 8000;
const STEP_MS = 200;
const STEP_INCREMENT = 200 / (DURATION_MS / STEP_MS);

onMounted(() => {
  startProgress();

  setTimeout(async () => {
    const user = await authFacade.getUser();
    if (user) {
      await router.push('/game');
    } else {
      await router.push('/login');
    }
  }, DURATION_MS);
});

onBeforeUnmount(() => {
  endProgress();
});

const startProgress = (): void => {
  interval.value = setInterval(() => {
    progressValue.value += STEP_INCREMENT;
    if (progressValue.value >= 100) {
      progressValue.value = 100;

      // TODO: rajouter le turn des messages de chargements
      endProgress();
    }
  }, STEP_MS);
};
const endProgress = (): void => {
  clearInterval(interval.value);
  interval.value = null;
};
</script>

<style>
.loading-page {
  position: relative;

  h1 {
    font-size: 3rem;
    margin-bottom: 30%;
    color: var(--secondary-color);
  }

  .loading-progress {
    width: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    padding: 3%;
  }

  .progress-bar {
    z-index: 1;
    width: 80%;
    color: var(--background-color);
  }

  .p-progressbar .p-progressbar-value {
    background-color: var(--secondary-color);
  }

  .p-progressbar {
    background-color: var(--surface-card);
  }

  .astro {
    width: 40%;
    animation: navigate 9s linear infinite;
    z-index: 1;
  }

  .planet {
    position: absolute;
    bottom: 0;
    width: 130%;
  }
}

@keyframes navigate {
  0% {
    transform: translateX(-50vw) translateY(0);
  }
  25% {
    transform: translateX(-50vw) translateY(0);
  }
  55% {
    transform: translateX(10vh) translateY(-20vw);
  }
  90% {
    transform: translateX(120vw) translateY(0) rotate(50deg);
  }
  100% {
    transform: translateX(120vw) translateY(0) rotate(50deg);
  }
}
</style>
