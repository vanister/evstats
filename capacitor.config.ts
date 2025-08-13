/// <reference types="@capacitor/splash-screen" />
/// <reference types="@capacitor-community/sqlite" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vanister.evstats',
  appName: 'EV Stats',
  webDir: 'dist',
  plugins: {
    CapacitorSQLite: {
      iosIsEncryption: true,
      iosKeychainPrefix: 'com.vanister.evs',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite'
      },
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite',
        biometricSubTitle: 'Log in using your biometric'
      }
    },
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false
    },
    ScreenOrientation: {
      orientation: 'portrait'
    }
  }
};

export default config;
