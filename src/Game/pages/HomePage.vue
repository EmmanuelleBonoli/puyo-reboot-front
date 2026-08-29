<template>
  <div class="home-page">
    <div class="best-score">
      <p class="best-score-label">{{ t('home.bestScore').toUpperCase() }}</p>
      <p class="best-score-value">{{ bestScore }}</p>
    </div>
    <button type="button" class="play-btn" @click="router.push('/game')">
      <img src="/images/refonte/play-btn.png" alt="play" />
      <p class="play">{{ t('home.play').toUpperCase() }}</p>
    </button>

    <button type="button" class="store-btn" @click="router.push('/store')">
      <img src="/images/refonte/store_btn.png" alt="store" />
      <p>{{ t('home.store').toUpperCase() }}</p>
    </button>

    <button type="button" class="settings-btn" @click="router.push('/settings')">
      <img src="/images/refonte/settings-button.png" alt="settings" />
      <p>{{ t('home.settings').toUpperCase() }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ScoreFacadeService } from '../services/score-facade.service.ts';
import { useRouter } from 'vue-router';

const { t } = useI18n();

const router = useRouter();
const scoreFacade = new ScoreFacadeService();
const bestScore = scoreFacade.getBestScore();
</script>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-image: url('/images/refonte/home.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  .best-score {
    position: absolute;
    bottom: 26%;
    left: 32%;
    font-weight: bold;
    display: flex;
    flex-direction: column;

    gap: 10px;

    .best-score-label {
      color: var(--text-blue);
      font-size: 15px;
    }

    .best-score-value {
      color: var(--text-yellow);
      text-align: center;
      font-size: 20px;
    }
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  button:active {
    transform: scale(0.8);
    transition: transform 0.3s ease-in-out;
  }

  .play-btn {
    position: absolute;
    bottom: 11.5%;
    width: 62%;
    left: 19.4%;

    img {
      width: 100%;
    }

    p {
      position: absolute;
      bottom: 25%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 35px;
      font-weight: bold;
      color: var(--text-beige);
      -webkit-text-stroke: 1px var(--text-dark-red);
    }
  }

  .store-btn {
    position: absolute;
    bottom: 1.5%;
    left: 53.5%;
    width: 33%;

    img {
      width: 100%;
    }

    p {
      position: absolute;
      bottom: 40%;
      left: 40%;
      font-size: 11px;
      font-weight: bold;
      color: var(--text-blue);
    }
  }

  .settings-btn {
    position: absolute;
    bottom: 1.5%;
    left: 14%;
    width: 33%;

    img {
      width: 100%;
    }

    p {
      position: absolute;
      bottom: 40%;
      left: 30%;
      font-size: 11px;
      font-weight: bold;
      color: var(--text-blue);
    }
  }
}
</style>
