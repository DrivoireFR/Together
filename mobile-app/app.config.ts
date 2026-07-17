import { ConfigContext, ExpoConfig } from "expo/config"

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.drivoire.together.dev';
  }

  if (IS_PREVIEW) {
    return 'com.drivoire.together.preview';
  }

  return 'com.drivoire.together';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'together (Dev)';
  }

  if (IS_PREVIEW) {
    return 'together (Preview)';
  }

  return 'together';
};


export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  "name": getAppName(),
  "slug": "togetthere",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "mobileapptogether",
  "userInterfaceStyle": "automatic",
  // @ts-expect-error newArchEnabled is a valid Expo config field
  "newArchEnabled": true,
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": getUniqueIdentifier(),
    "infoPlist": {
      "ITSAppUsesNonExemptEncryption": false
    }
  },
  "android": {
    // "adaptiveIcon": {
    //   "backgroundColor": "#E6F4FE",
    //   "foregroundImage": "./assets/images/android-icon-foreground.png",
    //   "backgroundImage": "./assets/images/android-icon-background.png",
    //   "monochromeImage": "./assets/images/android-icon-monochrome.png"
    // },
    // "edgeToEdgeEnabled": true,
    "predictiveBackGestureEnabled": false,
    "package": getUniqueIdentifier()
  },
  "web": {
    "output": "static",
    "favicon": "./assets/images/favicon.png"
  },
  "plugins": [
    "expo-router",
  ],
  "experiments": {
    "typedRoutes": true,
    "reactCompiler": true
  },
  "extra": {
    "router": {},
    "eas": {
      "projectId": "bdd1b598-7e47-44f8-8eea-4e2f95882003"
    }
  },
  "owner": "drivoire"
})