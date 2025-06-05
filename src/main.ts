import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import router from './Router/router.ts';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: true,
      colors: {
        primary: '#720404',
        primaryTextColor: '#ffffff',
        highlight: '#c60529',
        surface: '#ffffff',
        surfaceBorder: '#e0e0e0',
        content: '#212121',
        contentSecondary: '#757575',
      },
    },
  },
});

app.use(createPinia());
app.use(ToastService);
app.use(router);
app.component('Toast', Toast);

app.mount('#app');
