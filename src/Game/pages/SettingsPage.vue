<template>
  <div class="settings-page">
    <div class="content-layer">
      <!-- HEADER COHÉRENT AVEC LA HOME -->
      <header class="settings-header">
        <button class="back-btn" @click="goBack">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 class="settings-title">{{ t('settings.title').toUpperCase() }}</h1>
        <div class="spacer"></div>
      </header>

      <main class="settings-main">
        <div class="scroll-container">
          <!-- MODULE : LANGUE -->
          <section class="settings-module">
            <h2 class="module-label">{{ t('settings.language').toUpperCase() }}</h2>
            <div class="module-card">
              <div class="lang-grid">
                <button
                  v-for="lang in languages"
                  :key="lang.value"
                  class="choice-btn"
                  :class="{ active: user?.language === lang.value }"
                  @click="updateUserSettings('language', lang.value)">
                  {{ lang.label.toUpperCase() }}
                </button>
              </div>
            </div>
          </section>

          <!-- MODULE : AUDIO -->
          <section class="settings-module">
            <h2 class="module-label">{{ t('settings.audio').toUpperCase() }}</h2>
            <div class="module-card">
              <div class="control-row">
                <div class="control-header">
                  <span>{{ t('settings.music').toUpperCase() }}</span>
                  <ToggleSwitch @update:model-value="updateUserSettings('isMusicEnabled', $event)" :model-value="user?.isMusicEnabled" />
                </div>
                <input type="range" class="tech-slider" min="0" max="100" value="80" />
              </div>

              <div class="divider"></div>

              <div class="control-row">
                <div class="control-header">
                  <span>{{ t('settings.soundEffects').toUpperCase() }}</span>
                  <ToggleSwitch
                    @update:model-value="updateUserSettings('isSoundEffectsEnabled', $event)"
                    :model-value="user?.isSoundEffectsEnabled" />
                </div>
                <input type="range" class="tech-slider" min="0" max="100" value="90" />
              </div>
            </div>
          </section>

          <!-- MODULE : TUTORIAL -->
          <section class="settings-module">
            <h2 class="module-label">{{ t('tutorial.list_title').toUpperCase() }}</h2>
            <div class="module-card no-padding">
              <div class="list-item clickable" @click="showTutorial('game')">
                <div class="item-content">
                  <i class="fa-solid fa-play-circle"></i>
                  <span>{{ t('tutorial.game_tutorial').toUpperCase() }}</span>
                </div>
                <i class="fa-solid fa-chevron-right arrow"></i>
              </div>
            </div>
          </section>

          <!-- MODULE : INFOS -->
          <section class="settings-module">
            <h2 class="module-label">SYSTEM</h2>
            <div class="module-card no-padding">
              <div class="list-item">
                <div class="item-content">
                  <i class="fa-solid fa-info-circle"></i>
                  <span>VERSION</span>
                </div>
                <span class="value">1.0.0_REBOOT</span>
              </div>
              <div class="list-item clickable" @click="contactUs">
                <div class="item-content">
                  <i class="fa-solid fa-envelope"></i>
                  <span>CONTACT</span>
                </div>
                <span class="value link">SUPPORT@REBOOT.COM</span>
              </div>
              <div class="list-item clickable" @click="openPrivacy">
                <div class="item-content">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span>{{ t('settings.privacyPolicy').toUpperCase() }}</span>
                </div>
                <i class="fa-solid fa-external-link-alt arrow"></i>
              </div>
            </div>
          </section>

          <!-- ACTIONS -->
          <div class="action-section">
            <button class="footer-btn restore" @click="restorePurchases">
              {{ t('settings.restorePurchases').toUpperCase() }}
            </button>
            <button class="footer-btn reset" @click="resetSettings">
              {{ t('settings.reset').toUpperCase() }}
            </button>
            <p class="copyright">{{ t('settings.rights') }}</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ToggleSwitch } from 'primevue';
import { useAuthStore } from '../../shared/stores/auth.store.ts';
import { useCommonToasts } from '../../shared/services/utils.ts';
import { UserFacadeService } from '../services/user-facade.service.ts';
import type { LANGUAGE, LangCode } from '../../shared/models/user.types.ts';

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const userFacadeService = new UserFacadeService();
const { showToastError } = useCommonToasts();

const user = computed(() => authStore.user);

const languages = computed<LANGUAGE[]>(() => [
  {
    label: t('settings.english'),
    value: 'en',
  },
  {
    label: t('settings.french'),
    value: 'fr',
  },
]);

function goBack(): void {
  router.go(-1);
}

async function updateUserSettings(setting: string, value: boolean | LangCode): Promise<void> {
  try {
    await userFacadeService.updateUserSettings(setting, value);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des settings:', error);
    showToastError();
  }
}

function showTutorial(type: string): void {
  console.log('Showing tutorial:', type);
}

function contactUs(): void {
  window.location.href = 'mailto:contact@puyoreboot.com';
}

function openPrivacy(): void {
  console.log('Opening Privacy...');
}

function restorePurchases(): void {
  console.log('Restoring purchases...');
}

function resetSettings(): void {
  console.log('Resetting settings...');
}
</script>

<style scoped lang="scss">
.settings-page {
  width: 100%;
  height: 100vh;
  background-color: var(--background-color);
  background-image: radial-gradient(circle at center, #2c3e50 0%, var(--background-color) 100%);
  color: var(--text-beige);
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
}

.content-layer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.settings-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;

  .back-btn {
    width: 45px;
    height: 45px;
    border-radius: 12px;
    background: var(--text-beige);
    border: 3px solid var(--text-dark-red);
    color: var(--text-dark-red);
    box-shadow: 0 4px 0 var(--text-dark-red);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;

    &:active {
      transform: translateY(2px);
      box-shadow: 0 2px 0 var(--text-dark-red);
    }
  }

  .settings-title {
    flex: 1;
    text-align: center;
    color: var(--text-yellow);
    font-size: 2.2rem;
    font-weight: 900;
    -webkit-text-stroke: 1px var(--text-dark-red);
    text-shadow: 3px 3px 0 var(--text-dark-red);
    margin: 0;
    letter-spacing: 1px;
  }

  .spacer {
    width: 45px;
  }
}

.settings-main {
  flex: 1;
  overflow: hidden;
}

.scroll-container {
  height: 100%;
  overflow-y: auto;
  padding: 10px 0 40px;
  max-width: 600px;
  margin: 0 auto;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.settings-module {
  margin: 0 20px 25px;

  .module-label {
    color: var(--text-blue);
    font-size: 0.9rem;
    font-weight: 900;
    margin-bottom: 8px;
    letter-spacing: 1.5px;
    padding-left: 5px;
  }

  .module-card {
    background: rgba(255, 255, 255, 0.05);
    border: 3px solid var(--text-blue);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

    &.no-padding {
      padding: 0;
    }

    .divider {
      height: 2px;
      background: rgba(121, 250, 255, 0.1);
      margin: 20px 0;
    }
  }
}

.lang-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.choice-btn {
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 2.5px solid var(--text-blue);
  color: var(--text-blue);
  border-radius: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: var(--text-yellow);
    border-color: var(--text-dark-red);
    color: var(--text-dark-red);
    box-shadow: 0 5px 0 var(--text-dark-red);
    transform: translateY(-2px);
  }

  &:active:not(.active) {
    transform: scale(0.95);
  }
}

.control-row {
  .control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-weight: 900;
    color: var(--text-blue);
  }
}

.tech-slider {
  width: 100%;
  height: 10px;
  appearance: none;
  background: rgba(121, 250, 255, 0.15);
  border-radius: 5px;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 26px;
    height: 26px;
    background: var(--text-yellow);
    border: 3px solid var(--text-dark-red);
    border-radius: 50%;
    cursor: pointer;
  }
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 2px solid rgba(121, 250, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }

  &.clickable:active {
    background: rgba(121, 250, 255, 0.08);
  }

  .item-content {
    display: flex;
    align-items: center;
    gap: 15px;
    color: var(--text-yellow);
    font-weight: 900;

    i {
      font-size: 1.3rem;
      color: var(--text-blue);
    }
  }

  .value {
    color: var(--text-blue);
    font-weight: 800;
    font-size: 0.9rem;
  }

  .link {
    text-decoration: underline;
  }

  .arrow {
    color: var(--text-blue);
    opacity: 0.5;
  }
}

.action-section {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-btn {
  width: 100%;
  padding: 18px;
  background: var(--text-beige);
  border: 4px solid var(--text-dark-red);
  color: var(--text-dark-red);
  border-radius: 18px;
  font-weight: 900;
  font-size: 1rem;
  box-shadow: 0 6px 0 var(--text-dark-red);
  cursor: pointer;

  &:active {
    transform: translateY(3px);
    box-shadow: 0 3px 0 var(--text-dark-red);
  }

  &.reset {
    background: #ff4d4d;
    color: white;
    border-color: #800000;
    box-shadow: 0 6px 0 #800000;

    &:active {
      box-shadow: 0 3px 0 #800000;
    }
  }
}

.copyright {
  text-align: center;
  opacity: 0.3;
  font-size: 0.7rem;
  font-weight: 800;
  margin-top: 10px;
}

/* Customizing PrimeVue Toggle */
:deep(.p-toggleswitch) {
  width: 50px;
  height: 28px;

  .p-toggleswitch-slider {
    background: rgba(0, 0, 0, 0.3);
    border: 2.5px solid var(--text-blue);

    &::before {
      background: var(--text-blue);
    }
  }

  &.p-toggleswitch-checked .p-toggleswitch-slider {
    background: var(--text-blue);

    &::before {
      background: var(--text-dark-red);
    }
  }
}
</style>
