import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(createPinia());
app.use(ToastService);
app.component('Toast', Toast);

app.mount('#app');