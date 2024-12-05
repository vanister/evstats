import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vanister.evstats',
  appName: 'EV Stats',
  webDir: 'dist',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
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
      },
      electronIsEncryption: true,
      electronWindowsLocation: 'C:\\ProgramData\\CapacitorDatabases',
      electronMacLocation: '/Volumes/Development_Lacie/Development/Databases',
      electronLinuxLocation: 'Databases'
    }
    // SplashScreen: {
    //   launchAutoHide: false,
    //   backgroundColor: '#ffffffff',
    //   androidSplashResourceName: 'splash',
    //   androidScaleType: 'CENTER_CROP',
    //   showSpinner: true,
    //   androidSpinnerStyle: 'large',
    //   iosSpinnerStyle: 'small',
    //   spinnerColor: '#999999',
    //   splashFullScreen: true,
    //   splashImmersive: true,
    //   layoutName: 'launch_screen',
    //   useDialog: true
    // }
  }
};

export default config;
