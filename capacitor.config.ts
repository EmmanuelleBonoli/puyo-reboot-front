import type {CapacitorConfig} from '@capacitor/cli';

// désactivé en build de prod (CAPACITOR_ENV=production) pour que l'app embarque le dist/ au lieu de charger le serveur de dev
const isProdBuild = process.env.CAPACITOR_ENV === 'production';

const config: CapacitorConfig = {
  appId: 'com.majorgame.puyo',
  appName: 'Space Match',
  webDir: 'dist',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'space-match',
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: "Biometric login for capacitor sqlite"
      }
    }
  },
  ...(isProdBuild ? {} : {
    server: {
      url: "http://10.0.2.2:5421", // pour hot reload
      cleartext: true
    }
  })
};

export default config;

