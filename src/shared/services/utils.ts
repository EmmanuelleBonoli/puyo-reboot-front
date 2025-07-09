import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import type { LangCode } from '../../Authentication/models/user.types.ts';

export function useCommonToasts(): { showToastError: () => void } {
  const toast = useToast();
  const { t } = useI18n();

  function showToastError(): void {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
    });
  }

  return {
    showToastError,
  };
}

export function getDeviceLang(): LangCode {
  const lang = navigator.language || navigator.languages[0] || 'en';
  return lang.split('-')[0] as LangCode;
}

export function generateRandomNumber(maxNumber: number): number {
  return Math.floor(Math.random() * maxNumber);
}
