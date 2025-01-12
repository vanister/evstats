import { PreferencesPlugin } from '@capacitor/preferences';

type SupportedPreferenceTypes = 'string' | 'number' | 'object' | 'boolean';

export interface PreferenceService {
  get<T>(key: string, type: SupportedPreferenceTypes): Promise<T | null>;
  remove(key: string): Promise<void>;
  set(key: string, value: string | number): Promise<void>;
}

export class EvsPreferenceService implements PreferenceService {
  constructor(private readonly preferences: PreferencesPlugin) {}

  async get<T>(key: string, type: SupportedPreferenceTypes): Promise<T | null> {
    const { value } = await this.preferences.get({ key });

    if (!value) {
      return null;
    }

    switch (type) {
      case 'boolean':
        return (value === 'true') as T;
      case 'number':
        return Number(value) as T;
      case 'object':
        return JSON.parse(value) as T;
      case 'string':
        return value as T;
      default:
        return null;
    }
  }

  async remove(key: string): Promise<void> {
    await this.preferences.remove({ key });
  }

  async set(key: string, value: string): Promise<void> {
    await this.preferences.set({ key, value });
  }
}
