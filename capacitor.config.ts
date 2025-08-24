import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.majorgame.puyo',
  appName: 'astro puyo',
  webDir: 'dist',
  server: {
    url: process.env.VITE_FRONTEND_URL_LAN, // pour hot reload
    cleartext: true
  }
};

export default config;
