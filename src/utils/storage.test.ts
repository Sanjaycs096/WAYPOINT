import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import {
  DEFAULT_PREFERENCES,
  loadSavedPreferences,
  savePreferencesToStorage,
  resetPreferencesInStorage,
} from './storage';
import { UserPreferences } from '../types';

// In-memory mock for localStorage in Node test environment
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

describe('Preferences Local Storage Utility', () => {
  beforeAll(() => {
    if (typeof globalThis.localStorage === 'undefined') {
      const mock = new LocalStorageMock();
      Object.defineProperty(globalThis, 'localStorage', {
        value: mock,
        writable: true,
      });
    }
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default preferences when storage is empty', () => {
    const prefs = loadSavedPreferences();
    expect(prefs).toEqual(DEFAULT_PREFERENCES);
  });

  it('saves and loads valid preferences successfully', () => {
    const customPrefs: UserPreferences = {
      mandatory: {
        stepFree: true,
        elevatorRequired: true,
        powerDoorRequired: true,
      },
      optional: {
        quieterPaths: true,
        shelteredWalkways: true,
        gentleSlopes: true,
        seatingAlongPath: true,
      },
    };

    const saved = savePreferencesToStorage(customPrefs);
    expect(saved).toBe(true);

    const loaded = loadSavedPreferences();
    expect(loaded).toEqual(customPrefs);
  });

  it('returns defaults gracefully if storage contains corrupted JSON', () => {
    localStorage.setItem('waypoint_campus_user_preferences_v1', '{invalid-json');
    const loaded = loadSavedPreferences();
    expect(loaded).toEqual(DEFAULT_PREFERENCES);
  });

  it('coerces missing or malformed fields safely to boolean defaults', () => {
    localStorage.setItem(
      'waypoint_campus_user_preferences_v1',
      JSON.stringify({ mandatory: { stepFree: 1 }, optional: {} })
    );

    const loaded = loadSavedPreferences();
    expect(loaded.mandatory.stepFree).toBe(true);
    expect(loaded.mandatory.elevatorRequired).toBe(false);
    expect(loaded.optional.quieterPaths).toBe(false);
  });

  it('resets preferences in storage and returns defaults', () => {
    const customPrefs: UserPreferences = {
      mandatory: { stepFree: false, elevatorRequired: true, powerDoorRequired: false },
      optional: { quieterPaths: true, shelteredWalkways: false, gentleSlopes: false, seatingAlongPath: false },
    };
    savePreferencesToStorage(customPrefs);

    const reset = resetPreferencesInStorage();
    expect(reset).toEqual(DEFAULT_PREFERENCES);
    expect(loadSavedPreferences()).toEqual(DEFAULT_PREFERENCES);
  });
});
