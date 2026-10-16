import { UserPreferences } from '../types';

export const DEFAULT_PREFERENCES: UserPreferences = {
  mandatory: {
    stepFree: true,
    elevatorRequired: false,
    powerDoorRequired: false,
  },
  optional: {
    quieterPaths: false,
    shelteredWalkways: false,
    gentleSlopes: true,
    seatingAlongPath: false,
  },
};

const STORAGE_KEY = 'waypoint_campus_user_preferences_v1';

/**
 * Loads preferences from the current browser's local storage.
 * Defaults are returned if not found or invalid.
 */
export function loadSavedPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      mandatory: {
        stepFree: Boolean(parsed.mandatory?.stepFree),
        elevatorRequired: Boolean(parsed.mandatory?.elevatorRequired),
        powerDoorRequired: Boolean(parsed.mandatory?.powerDoorRequired),
      },
      optional: {
        quieterPaths: Boolean(parsed.optional?.quieterPaths),
        shelteredWalkways: Boolean(parsed.optional?.shelteredWalkways),
        gentleSlopes: Boolean(parsed.optional?.gentleSlopes),
        seatingAlongPath: Boolean(parsed.optional?.seatingAlongPath),
      },
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Saves preferences to the current browser's local storage.
 * Note: Data is stored solely on this browser device without cloud synchronization.
 */
export function savePreferencesToStorage(prefs: UserPreferences): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

/**
 * Resets preferences to factory defaults.
 */
export function resetPreferencesInStorage(): UserPreferences {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_PREFERENCES;
}
