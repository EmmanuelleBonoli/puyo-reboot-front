import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import router from './Router/router.ts';
import { createI18n } from 'vue-i18n';
import french from '../languages/fr.json';
import english from '../languages/en.json';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
    },
  },
});

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr: french,
    en: english,
  },
});

app.use(createPinia());
app.use(ToastService);
app.use(router);
app.use(i18n);
app.component('Toast', Toast);

app.mount('#app');
