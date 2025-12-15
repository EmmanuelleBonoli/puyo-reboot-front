import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.majorgame.puyo',
  appName: 'astro puyo',
  webDir: 'dist',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'astro-puyo',
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: "Biometric login for capacitor sqlite"
      }
    }
  },
  server: {
    url: process.env.VITE_FRONTEND_URL_LAN, // pour hot reload
    cleartext: true
  }
};

export default config;

