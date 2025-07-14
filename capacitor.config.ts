import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.majorgame.puyo',
  appName: 'astro puyo',
  webDir: 'dist',
  server: {
    url: 'http://192.168.1.15:5421', // pour hot reload : nécessaire de mettre adresse ip (ipconfig) + port vite utilisé
    cleartext: true
  }
};

export default config;
