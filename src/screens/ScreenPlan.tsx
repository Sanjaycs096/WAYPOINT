import React, { useState } from 'react';
import { CampusLocation, MandatoryRequirements, OptionalPreferences } from '../types';
import { MaterialIcon } from '../components/MaterialIcon';

interface ScreenPlanProps {
  locations: CampusLocation[];
  originId: string;
  destinationId: string;
  mandatory: MandatoryRequirements;
  optional: OptionalPreferences;
  onOriginChange: (id: string) => void;
  onDestinationChange: (id: string) => void;
  onMandatoryChange: (mandatory: MandatoryRequirements) => void;
  onOptionalChange: (optional: OptionalPreferences) => void;
  onFindRoutes: () => void;
  onNavigateToPreferences: () => void;
}

export const ScreenPlan: React.FC<ScreenPlanProps> = ({
  locations,
  originId,
  destinationId,
  mandatory,
  optional,
  onOriginChange,
  onDestinationChange,
  onMandatoryChange,
  onOptionalChange,
  onFindRoutes,
  onNavigateToPreferences,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [presetFeedback, setPresetFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationId) {
      setValidationError('Please select a destination campus building to find routes.');
      return;
    }
    if (originId === destinationId) {
      setValidationError('Origin and destination cannot be the same building.');
      return;
    }
    setValidationError(null);
    onFindRoutes();
  };

  const handleApplyPreset = (profile: 'wheelchair' | 'sensory' | 'injury') => {
    setValidationError(null);
    if (profile === 'wheelchair') {
      onMandatoryChange({
        stepFree: true,
        elevatorRequired: true,
        powerDoorRequired: true,
      });
      onOptionalChange({
        ...optional,
        gentleSlopes: true,
      });
      setPresetFeedback(
        'Applied Wheelchair User profile: Activated Step-free, Elevator, and Power-door mandatory constraints and gentle slopes preference.'
      );
    } else if (profile === 'sensory') {
      // Never silently weaken mandatory requirements: preserve user's active mandatory rules
      onOptionalChange({
        ...optional,
        quieterPaths: true,
        shelteredWalkways: true,
        gentleSlopes: true,
      });
      setPresetFeedback(
        'Applied Sensory Sensitive profile: Prioritized quiet corridors and sheltered paths without weakening your active mandatory requirements.'
      );
    } else if (profile === 'injury') {
      onMandatoryChange({
        ...mandatory,
        stepFree: true,
        elevatorRequired: true,
      });
      onOptionalChange({
        ...optional,
        seatingAlongPath: true,
        gentleSlopes: true,
      });
      setPresetFeedback(
        'Applied Temporary Injury profile: Enforced Step-free and Elevator constraints and prioritized frequent seating.'
      );
    }
    setTimeout(() => setPresetFeedback(null), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Screen Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0F6B5C] mb-1.5">
          <MaterialIcon name="alt_route" className="text-base" />
          <span>Screen 1 • Route Planning</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#17201F] tracking-tight">
          Plan Your Campus Route
        </h1>
        <p className="text-sm sm:text-base text-[#52605E] mt-1.5 leading-relaxed">
          Set essential accessibility requirements and comfort preferences to compare suitable walking paths across campus.
        </p>
      </div>

      {/* Quick Representative Profile Switcher */}
      <div className="mb-6 p-4 rounded-xl border border-[#E3DED8] bg-[#FFFFFF] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
          <span className="text-xs font-semibold text-[#17201F] flex items-center gap-1.5">
            <MaterialIcon name="accessibility_new" className="text-sm text-[#0F6B5C]" />
            <span>Sample Student Personas:</span>
          </span>
          <span className="text-xs text-[#52605E]">Illustrative profiles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleApplyPreset('wheelchair')}
            className={`flex items-center gap-2.5 p-3 min-h-[48px] rounded-lg border text-left transition-all ${
              mandatory.stepFree && mandatory.elevatorRequired && mandatory.powerDoorRequired
                ? 'border-[#0F6B5C] bg-[#E7F3F0] text-[#0F6B5C] font-semibold ring-1 ring-[#0F6B5C]'
                : 'border-[#E3DED8] bg-[#F7F5F2] hover:bg-[#EAE6E1] text-[#17201F]'
            }`}
          >
            <MaterialIcon name="accessible" className="text-xl shrink-0 text-[#0F6B5C]" />
            <div>
              <div className="text-xs font-semibold">Wheelchair User</div>
              <div className="text-[11px] text-[#52605E]">Step-free, Elevator, Power doors</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('sensory')}
            className={`flex items-center gap-2.5 p-3 min-h-[48px] rounded-lg border text-left transition-all ${
              optional.quieterPaths && optional.shelteredWalkways
                ? 'border-[#0F6B5C] bg-[#E7F3F0] text-[#0F6B5C] font-semibold ring-1 ring-[#0F6B5C]'
                : 'border-[#E3DED8] bg-[#F7F5F2] hover:bg-[#EAE6E1] text-[#17201F]'
            }`}
          >
            <MaterialIcon name="hearing" className="text-xl shrink-0 text-[#0F6B5C]" />
            <div>
              <div className="text-xs font-semibold">Sensory Sensitive</div>
              <div className="text-[11px] text-[#52605E]">Quiet corridors, Low crowds</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('injury')}
            className={`flex items-center gap-2.5 p-3 min-h-[48px] rounded-lg border text-left transition-all ${
              mandatory.stepFree && optional.seatingAlongPath
                ? 'border-[#0F6B5C] bg-[#E7F3F0] text-[#0F6B5C] font-semibold ring-1 ring-[#0F6B5C]'
                : 'border-[#E3DED8] bg-[#F7F5F2] hover:bg-[#EAE6E1] text-[#17201F]'
            }`}
          >
            <MaterialIcon name="chair" className="text-xl shrink-0 text-[#0F6B5C]" />
            <div>
              <div className="text-xs font-semibold">Temporary Injury</div>
              <div className="text-[11px] text-[#52605E]">Rest seating, Gentle slopes</div>
            </div>
          </button>
        </div>

        {/* Transparent Preset Feedback Live Region */}
        {presetFeedback && (
          <div
            className="mt-3 p-2.5 rounded-lg bg-[#E7F3F0] border border-[#0F6B5C]/30 text-xs text-[#0F6B5C] flex items-center justify-between"
            role="status"
            aria-live="polite"
          >
            <span className="flex items-center gap-1.5">
              <MaterialIcon name="check_circle" className="text-sm shrink-0" />
              <span>{presetFeedback}</span>
            </span>
            <button
              type="button"
              onClick={() => setPresetFeedback(null)}
              className="text-[#52605E] hover:text-[#17201F]"
              aria-label="Dismiss preset feedback"
            >
              <MaterialIcon name="close" className="text-xs" />
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Origin & Destination Selectors */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3DED8] shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin */}
            <div>
              <label htmlFor="origin-select" className="block text-xs font-semibold text-[#52605E] mb-1.5 flex items-center gap-1.5">
                <MaterialIcon name="my_location" className="text-[#1E5AA8] text-base" />
                <span>Origin (Start Location)</span>
              </label>
              <select
                id="origin-select"
                value={originId}
                onChange={(e) => {
                  onOriginChange(e.target.value);
                  setValidationError(null);
                }}
                className="w-full h-12 px-3.5 rounded-lg border border-[#E3DED8] bg-[#FFFFFF] text-sm text-[#17201F] focus:border-[#0F6B5C] focus:ring-1 focus:ring-[#0F6B5C] transition-colors"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label htmlFor="destination-select" className="block text-xs font-semibold text-[#52605E] mb-1.5 flex items-center gap-1.5">
                <MaterialIcon name="location_on" className="text-[#0F6B5C] text-base" />
                <span>Destination (Required)</span>
              </label>
              <select
                id="destination-select"
                value={destinationId}
                onChange={(e) => {
                  onDestinationChange(e.target.value);
                  setValidationError(null);
                }}
                className={`w-full h-12 px-3.5 rounded-lg border text-sm text-[#17201F] focus:ring-1 transition-colors ${
                  validationError
                    ? 'border-[#B35C00] bg-[#FFF7ED] focus:border-[#B35C00] focus:ring-[#B35C00]'
                    : 'border-[#E3DED8] bg-[#FFFFFF] focus:border-[#0F6B5C] focus:ring-[#0F6B5C]'
                }`}
                aria-required="true"
                aria-invalid={validationError ? 'true' : 'false'}
              >
                <option value="">-- Select destination campus building --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code}) • {loc.zone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Test Scenario Helpers */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE6E1] text-xs text-[#52605E]">
            <span className="flex items-center gap-1">
              <MaterialIcon name="lightbulb" className="text-sm text-[#0F6B5C]" />
              <span>
                <strong>Test scenarios:</strong> Try <em>Campus Center → Library</em> for multiple route comparison, or <em>Fine Arts → Science Complex</em> to verify no-match handling.
              </span>
            </span>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg bg-[#FFF7ED] border border-[#B35C00]/30 text-xs text-[#B35C00]"
              role="alert"
            >
              <MaterialIcon name="warning" className="text-base shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Access Requirements vs Optional Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Section 1: Mandatory Requirements (Hard Filters) */}
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border-2 border-[#0F6B5C]/35 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <MaterialIcon name="lock" className="text-[#0F6B5C] text-base" />
                  <h2 className="text-sm font-bold text-[#0F6B5C]">
                    Mandatory Requirements
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-[#0F6B5C] bg-[#E7F3F0] px-2 py-0.5 rounded-full">
                  Hard Eligibility Filter
                </span>
              </div>
              <p className="text-xs text-[#52605E] mb-4 leading-relaxed">
                Routes failing any active mandatory rule are completely excluded from recommendations.
              </p>

              <div className="space-y-3">
                {/* Step-Free */}
                <label
                  htmlFor="mandatory-step-free"
                  className="flex items-start gap-3 p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    id="mandatory-step-free"
                    checked={mandatory.stepFree}
                    onChange={(e) =>
                      onMandatoryChange({ ...mandatory, stepFree: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#17201F] block">
                      Step-free path only
                    </span>
                    <span className="text-xs text-[#52605E]">
                      Strictly excludes stairs, curbs, and unpaved barriers
                    </span>
                  </div>
                </label>

                {/* Elevator Required */}
                <label
                  htmlFor="mandatory-elevator"
                  className="flex items-start gap-3 p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    id="mandatory-elevator"
                    checked={mandatory.elevatorRequired}
                    onChange={(e) =>
                      onMandatoryChange({ ...mandatory, elevatorRequired: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#17201F] block">
                      Elevator required for elevation
                    </span>
                    <span className="text-xs text-[#52605E]">
                      Excludes level changes with unknown elevator status
                    </span>
                  </div>
                </label>

                {/* Power Automated Doors */}
                <label
                  htmlFor="mandatory-power-door"
                  className="flex items-start gap-3 p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    id="mandatory-power-door"
                    checked={mandatory.powerDoorRequired}
                    onChange={(e) =>
                      onMandatoryChange({ ...mandatory, powerDoorRequired: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#17201F] block">
                      Power-assisted doors required
                    </span>
                    <span className="text-xs text-[#52605E]">
                      Excludes building entries requiring manual pull forces
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE6E1] text-xs text-[#52605E] flex items-center gap-1.5">
              <MaterialIcon name="info" className="text-xs text-[#0F6B5C]" />
              <span>Unknown access data is treated as ineligible.</span>
            </div>
          </div>

          {/* Section 2: Optional Comfort Preferences (Soft Weights) */}
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3DED8] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <MaterialIcon name="tune" className="text-[#52605E] text-base" />
                  <h2 className="text-sm font-bold text-[#17201F]">
                    Comfort Preferences
                  </h2>
                </div>
                <span className="text-[11px] font-medium text-[#52605E] bg-[#EAE6E1] px-2 py-0.5 rounded-full">
                  Soft Ranking Factors
                </span>
              </div>
              <p className="text-xs text-[#52605E] mb-4 leading-relaxed">
                Influences which qualifying routes appear first. Does not exclude safe paths.
              </p>

              <div className="space-y-3">
                {/* Quieter Paths */}
                <label
                  htmlFor="optional-quieter-paths"
                  className="flex items-center justify-between p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#17201F] block">
                      Prioritize quieter paths
                    </span>
                    <span className="text-xs text-[#52605E]">
                      Lower crowd density and ambient sound
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="optional-quieter-paths"
                    checked={optional.quieterPaths}
                    onChange={(e) =>
                      onOptionalChange({ ...optional, quieterPaths: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
                  />
                </label>

                {/* Sheltered Walkways */}
                <label
                  htmlFor="optional-sheltered-walkways"
                  className="flex items-center justify-between p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#17201F] block">
                      Covered / sheltered walkways
                    </span>
                    <span className="text-xs text-[#52605E]">
                      Indoor skywalks or canopied corridors
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="optional-sheltered-walkways"
                    checked={optional.shelteredWalkways}
                    onChange={(e) =>
                      onOptionalChange({ ...optional, shelteredWalkways: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
                  />
                </label>

                {/* Gentle Slopes */}
                <label
                  htmlFor="optional-gentle-slopes"
                  className="flex items-center justify-between p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#17201F] block">
                      Gentle inclines only
                    </span>
                    <span className="text-xs text-[#52605E]">
                      Avoid steep ramps exceeding 1:16 grade
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="optional-gentle-slopes"
                    checked={optional.gentleSlopes}
                    onChange={(e) =>
                      onOptionalChange({ ...optional, gentleSlopes: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
                  />
                </label>

                {/* Seating along path */}
                <label
                  htmlFor="optional-seating-along-path"
                  className="flex items-center justify-between p-3 min-h-[50px] rounded-xl border border-[#E3DED8] hover:bg-[#F7F5F2] cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#17201F] block">
                      Frequent rest benches
                    </span>
                    <span className="text-xs text-[#52605E]">
                      Resting seating along the route corridor
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="optional-seating-along-path"
                    checked={optional.seatingAlongPath}
                    onChange={(e) =>
                      onOptionalChange({ ...optional, seatingAlongPath: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#0F6B5C] focus:ring-[#0F6B5C] border-[#B8B2A6]"
                  />
                </label>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE6E1] text-xs text-[#52605E] flex items-center justify-between">
              <span>Applied to ranking after eligibility.</span>
              <button
                type="button"
                onClick={onNavigateToPreferences}
                className="text-[#0F6B5C] hover:underline font-semibold"
              >
                Configure defaults
              </button>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full min-h-[48px] h-13 px-6 rounded-xl bg-[#0F6B5C] hover:bg-[#0B5449] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F6B5C]"
          >
            <MaterialIcon name="search" className="text-xl" />
            <span>Find Accessible Routes</span>
          </button>
          <div className="text-center mt-2.5">
            <span className="text-xs text-[#52605E]">
              Evaluates paths using deterministic representative sample campus data.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
