import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const StorageUtil = {
  async getItem<T = string>(key: string): Promise<T | null> {
    try {
      let value: string | null;
      if (isWeb) {
        value = await AsyncStorage.getItem(key);
      } else {
        value = await SecureStore.getItemAsync(key);
      }
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string | object): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (isWeb) {
      await AsyncStorage.setItem(key, stringValue);
    } else {
      await SecureStore.setItemAsync(key, stringValue);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};
