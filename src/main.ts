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
    },
  },
});

app.use(createPinia());
app.use(ToastService);
app.use(router);
app.component('Toast', Toast);

app.mount('#app');
