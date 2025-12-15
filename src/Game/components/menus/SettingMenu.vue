<template>
  <div class="settings-options">
    <div class="menu-line">
      <div class="item-settings">
        <label for="switch1">{{ t('settings.music') }}</label>
        <ToggleSwitch
          @update:model-value="updateUserSettings('isMusicEnabled', $event)"
          :model-value="user.isMusicEnabled"
          inputId="switch1"
          class="p-mb-2" />
      </div>
      <div class="item-settings">
        <label for="switch2">{{ t('settings.soundEffects') }}</label>
        <ToggleSwitch
          @update:model-value="updateUserSettings('isSoundEffectsEnabled', $event)"
          :model-value="user.isSoundEffectsEnabled"
          class="p-mb-2"
          inputId="2" />
      </div>
    </div>

    <div class="menu-line">
      <div class="item-settings">
        <label for="switch3">{{ t('settings.leftHandedMode') }}</label>
        <ToggleSwitch @update:model-value="updateUserSettings('isLeftHanded', $event)" :model-value="user?.isLeftHanded" class="p-mb-2" inputId="3" />
      </div>
      <Button :label="t('settings.seeRules')" class="p-button-rounded p-button-text" />
    </div>
    <div class="menu-line card flex justify-center">
      <label for="language">{{ t('settings.language') }}</label>
      <div v-for="language of languages" :key="language.value" class="language-option">
        <RadioButton
          :model-value="user?.language"
          @update:model-value="updateUserSettings('language', $event)"
          :inputId="`language-${language.value}`"
          name="user-language"
          :value="language.value" />
        <label :for="`language-${language.value}`">{{ language.label }}</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ToggleSwitch, Button, RadioButton } from 'primevue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../../shared/stores/auth.store.ts';
import { useCommonToasts } from '../../../shared/services/utils.ts';
import { type LangCode, type LANGUAGE } from '../../../shared/models/user.types.ts';
import { UserFacadeService } from '../../services/user-facade.service.ts';

const authStore = useAuthStore();
const { t } = useI18n();
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

async function updateUserSettings(setting: string, value: boolean | LangCode): Promise<void> {
  try {
    await userFacadeService.updateUserSettings(setting, value);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des settings:', error);
    showToastError();
  }
}
</script>

<style scoped lang="scss">
.settings-options {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 15%;
  width: 100%;
  min-height: 300px;

  .menu-line {
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    width: 100%;

    .item-settings {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 150px;
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}
</style>
