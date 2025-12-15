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
import { Capacitor } from '@capacitor/core';
import { storageService } from './Api/config/storage.service.ts';

async function initializeApp(): Promise<void> {
  try {
    // Initialisation du stockage (web ou android)
    await storageService.initialize();

    // Création de l'app Vue
    const app = createApp(App);

    // Configuration PrimeVue
    app.use(PrimeVue, {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        },
      },
    });

    // Configuration i18n
    const i18n = createI18n({
      legacy: false,
      locale: 'fr',
      fallbackLocale: 'fr',
      messages: {
        fr: french,
        en: english,
      },
    });

    // Installation des plugins
    app.use(createPinia());
    app.use(ToastService);
    app.use(router);
    app.use(i18n);
    app.component('Toast', Toast);

    // Montage de l'application
    app.mount('#app');
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    showInitializationError(error as Error);
  }
}

function showInitializationError(error: Error): void {
  const platform = Capacitor.getPlatform();

  console.error("Détails de l'erreur:", error);
  console.log('Platform:', platform);
  console.log('NODE_ENV:', import.meta.env.NODE_ENV);
  console.log('MODE:', import.meta.env.MODE);
  console.log('DEV:', import.meta.env.DEV);

  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f8f9fa;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
      z-index: 9999;
    ">
      <h1 style="color: #dc3545; margin-bottom: 20px;">
        ⚠️ Erreur d'initialisation
      </h1>
      <p style="color: #6c757d; text-align: center; max-width: 400px; line-height: 1.5;">
        Une erreur s'est produite lors du démarrage de l'application${platform === 'web' ? ' (mode web)' : ' (mode natif)'}.
        Veuillez redémarrer l'application.
      </p>
      <p style="color: #6c757d; font-size: 14px; margin: 10px 0;">
        Platform: <strong>${platform}</strong> | Mode: <strong>${import.meta.env.MODE}</strong>
      </p>
      
      ${
        import.meta.env.NODE_ENV === 'development'
          ? `
        <details style="margin-bottom: 20px; max-width: 600px;">
          <summary style="cursor: pointer; color: #6c757d;">Détails de l'erreur (dev)</summary>
          <pre style="
            background: #f1f3f4; 
            padding: 10px; 
            border-radius: 4px; 
            font-size: 12px; 
            color: #d63384;
            white-space: pre-wrap;
            word-wrap: break-word;
          ">${error.message}\n${error.stack || ''}</pre>
        </details>
      `
          : ''
      }
      
      <div style="display: flex; gap: 10px;">
        <button 
          onclick="window.location.reload()" 
          style="
            margin-top: 20px;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          "
        >
          🔄 Redémarrer
        </button>
        
        <button 
          onclick="${platform === 'web' ? 'storageService.resetDatabase();' : ''} window.location.reload();" 
          style="
            padding: 10px 20px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          "
        >
          🗑️ ${platform === 'web' ? 'Vider localStorage' : 'Reset'} & Redémarrer
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(errorDiv);
}

// Ajouter des logs globaux pour debugging
window.addEventListener('error', e => {
  console.error('🚨 Erreur globale capturée:', e.error);
});

window.addEventListener('unhandledrejection', e => {
  console.error('🚨 Promise rejetée non gérée:', e.reason);
});

// Démarrage de l'application
initializeApp();
