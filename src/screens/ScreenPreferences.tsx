import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { DEFAULT_PREFERENCES } from '../utils/storage';
import { MaterialIcon } from '../components/MaterialIcon';

interface ScreenPreferencesProps {
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
  onResetDefaults: () => void;
  onBackToPlan: () => void;
}

export const ScreenPreferences: React.FC<ScreenPreferencesProps> = ({
  preferences,
  onSavePreferences,
  onResetDefaults,
  onBackToPlan,
}) => {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Keep local form in sync whenever parent preferences change
  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(localPrefs);
    setFeedbackMessage('Preferences successfully saved to browser local storage.');
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 4000);
  };

  const handleReset = () => {
    onResetDefaults();
    setLocalPrefs(DEFAULT_PREFERENCES);
    setFeedbackMessage('Preferences reset to default values.');
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Navigation */}
      <div className="mb-4">
        <button
          onClick={onBackToPlan}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F6B5C] hover:underline min-h-[36px]"
        >
          <MaterialIcon name="arrow_back" className="text-base" />
          <span>Back to Planner</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0F6B5C] mb-1.5">
          <MaterialIcon name="settings" className="text-base" />
          <span>Screen 5 • Default Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#17201F] tracking-tight">
          Accessibility Settings
        </h1>
        <p className="text-sm text-[#52605E] mt-1.5 leading-relaxed">
          Configure default access requirements and comfort weights stored locally on this device.
        </p>
      </div>

      {/* Saved Feedback Toast */}
      {savedFeedback && (
        <div
          className="mb-6 p-4 rounded-xl bg-[#F0FDF4] border border-[#20714A]/30 text-xs text-[#20714A] flex items-center justify-between"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <MaterialIcon name="check_circle" className="text-lg" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setSavedFeedback(false)}
            className="text-[#52605E] hover:text-[#17201F]"
            aria-label="Dismiss message"
          >
            <MaterialIcon name="close" className="text-sm" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Group 1: Mandatory Requirements */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border-2 border-[#0F6B5C]/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F6B5C] flex items-center gap-1.5">
                <MaterialIcon name="lock" className="text-base" />
                <span>Mandatory Access Requirements</span>
              </h2>
              <p className="text-xs text-[#52605E] mt-0.5">
                Strict hard exclusions. Any route failing these rules will never be recommended.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#0F6B5C] bg-[#E7F3F0] px-2.5 py-0.5 rounded-full">
              Hard Gate
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {/* Step-Free */}
            <label
              htmlFor="pref-mandatory-step-free"
              className="flex items-start gap-3 p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                id="pref-mandatory-step-free"
                checked={localPrefs.mandatory.stepFree}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    mandatory: { ...localPrefs.mandatory, stepFree: e.target.checked },
                  })
                }
                className="mt-0.5 w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
              />
              <div>
                <span className="text-xs font-semibold text-[#17201F] block">
                  Always enforce step-free paths
                </span>
                <span className="text-[11px] text-[#52605E]">
                  Disqualifies any route with stairs, curbs, or unpaved barriers.
                </span>
              </div>
            </label>

            {/* Elevator Required */}
            <label
              htmlFor="pref-mandatory-elevator"
              className="flex items-start gap-3 p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                id="pref-mandatory-elevator"
                checked={localPrefs.mandatory.elevatorRequired}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    mandatory: { ...localPrefs.mandatory, elevatorRequired: e.target.checked },
                  })
                }
                className="mt-0.5 w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
              />
              <div>
                <span className="text-xs font-semibold text-[#17201F] block">
                  Elevator required for vertical changes
                </span>
                <span className="text-[11px] text-[#52605E]">
                  Disqualifies routes with level changes if elevator data is unknown or absent.
                </span>
              </div>
            </label>

            {/* Power Doors */}
            <label
              htmlFor="pref-mandatory-power-door"
              className="flex items-start gap-3 p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                id="pref-mandatory-power-door"
                checked={localPrefs.mandatory.powerDoorRequired}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    mandatory: { ...localPrefs.mandatory, powerDoorRequired: e.target.checked },
                  })
                }
                className="mt-0.5 w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
              />
              <div>
                <span className="text-xs font-semibold text-[#17201F] block">
                  Require automated power doors
                </span>
                <span className="text-[11px] text-[#52605E]">
                  Disqualifies building access requiring heavy manual pull forces.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Group 2: Optional Comfort Preferences */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E3DED8] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#17201F] flex items-center gap-1.5">
                <MaterialIcon name="tune" className="text-base text-[#52605E]" />
                <span>Comfort & Sensory Preferences</span>
              </h2>
              <p className="text-xs text-[#52605E] mt-0.5">
                Soft ranking factors. Prioritizes matching routes without excluding safe alternatives.
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#52605E] bg-[#EAE6E1] px-2.5 py-0.5 rounded-full">
              Soft Ranking
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {/* Quieter Paths */}
            <label
              htmlFor="pref-optional-quieter-paths"
              className="flex items-center justify-between p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
            >
              <div>
                <span className="text-xs font-semibold text-[#17201F] block">
                  Prioritize low-auditory corridors
                </span>
                <span className="text-[11px] text-[#52605E]">
                  Ranks quiet garden paths higher than bustling courtyards.
                </span>
              </div>
              <input
                type="checkbox"
                id="pref-optional-quieter-paths"
                checked={localPrefs.optional.quieterPaths}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    optional: { ...localPrefs.optional, quieterPaths: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
              />
            </label>

            {/* Sheltered Walkways */}
            <label
              htmlFor="pref-optional-sheltered-walkways"
              className="flex items-center justify-between p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
            >
              <div>
                <span className="text-xs font-semibold text-[#17201F] block">
                  Prefer covered or indoor walkways
                </span>
                <span className="text-[11px] text-[#52605E]">
                  Favors indoor skybridges and arcades for protection from weather.
                </span>
              </div>
              <input
                type="checkbox"
                id="pref-optional-sheltered-walkways"
                checked={localPrefs.optional.shelteredWalkways}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    optional: { ...localPrefs.optional, shelteredWalkways: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
              />
            </label>

            {/* Gentle Inclines */}
            <label
              htmlFor="pref-optional-gentle-slopes"
              className="flex items-center justify-between p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
            >
              <div>
                <span className="text-xs font-semibold text-[#17201F] block">
                  Prefer gentle slopes
                </span>
                <span className="text-[11px] text-[#52605E]">
                  Ranks level walkways higher than steep ramps.
                </span>
              </div>
              <input
                type="checkbox"
                id="pref-optional-gentle-slopes"
                checked={localPrefs.optional.gentleSlopes}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    optional: { ...localPrefs.optional, gentleSlopes: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
              />
            </label>

            {/* Seating */}
            <label
              htmlFor="pref-optional-seating-along-path"
              className="flex items-center justify-between p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
            >
              <div>
                <span className="text-xs font-semibold text-[#17201F] block">
                  Prioritize paths with rest seating
                </span>
                <span className="text-[11px] text-[#52605E]">
                  Benefits students with fatigue or temporary physical injuries.
                </span>
              </div>
              <input
                type="checkbox"
                id="pref-optional-seating-along-path"
                checked={localPrefs.optional.seatingAlongPath}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    optional: { ...localPrefs.optional, seatingAlongPath: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
              />
            </label>
          </div>
        </div>

        {/* Browser Local Storage Privacy Disclosure */}
        <div className="p-4 rounded-xl bg-[#F7F5F2] border border-[#E3DED8] text-xs text-[#52605E] flex items-start gap-2.5">
          <MaterialIcon name="storage" className="text-base text-[#1E5AA8] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#17201F]">Local Browser Storage:</strong> Your preferences are stored exclusively within this browser's local storage (<code className="bg-[#EAE6E1] px-1 py-0.5 rounded text-[11px]">localStorage</code>). This prototype operates client-side without user accounts, server databases, or cross-device cloud synchronization.
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:flex-1 min-h-[48px] h-12 px-6 rounded-xl bg-[#0F6B5C] hover:bg-[#0B5449] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F6B5C]"
          >
            <MaterialIcon name="save" className="text-lg" />
            <span>Save Preferences to Browser</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto min-h-[48px] h-12 px-5 rounded-xl border border-[#E3DED8] bg-[#FFFFFF] hover:bg-[#F7F5F2] text-xs font-semibold text-[#52605E] hover:text-[#17201F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B5C]"
          >
            Reset to Defaults
          </button>
        </div>
      </form>
    </div>
  );
};
