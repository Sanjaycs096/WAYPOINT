import React from 'react';
import { CampusLocation } from '../types';
import { MaterialIcon } from '../components/MaterialIcon';

interface ScreenLocationDetailsProps {
  location: CampusLocation;
  onSetAsDestination: (locationId: string) => void;
  onBackToPrevious: () => void;
}

export const ScreenLocationDetails: React.FC<ScreenLocationDetailsProps> = ({
  location,
  onSetAsDestination,
  onBackToPrevious,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={onBackToPrevious}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F6B5C] hover:underline min-h-[36px]"
        >
          <MaterialIcon name="arrow_back" className="text-base" />
          <span>Back to Route Comparison</span>
        </button>
      </div>

      {/* Facility Header Card */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E3DED8] shadow-xs mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-[#0F6B5C] bg-[#E7F3F0] px-2.5 py-0.5 rounded">
                {location.category} • {location.zone}
              </span>
              <span className="text-xs text-[#52605E] bg-[#EAE6E1] px-2 py-0.5 rounded font-mono">
                Code: {location.code}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#17201F] tracking-tight">
              {location.name}
            </h1>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#B35C00]/20 text-xs font-medium text-[#B35C00]">
            <MaterialIcon name="info" className="text-sm" />
            <span>Representative sample data</span>
          </div>
        </div>

        <p className="text-sm text-[#52605E] leading-relaxed mb-5">
          {location.description}
        </p>

        {/* Set as Destination CTA */}
        <button
          type="button"
          onClick={() => onSetAsDestination(location.id)}
          className="w-full sm:w-auto min-h-[48px] h-12 px-6 rounded-xl bg-[#0F6B5C] hover:bg-[#0B5449] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <MaterialIcon name="place" className="text-lg" />
          <span>Set as Destination & Plan Route</span>
        </button>
      </div>

      {/* Accessibility Profile Breakdown */}
      <div className="space-y-5">
        {/* Entrance Information */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3DED8] shadow-xs">
          <h2 className="text-sm font-bold text-[#17201F] flex items-center gap-1.5 mb-3.5">
            <MaterialIcon name="door_front" className="text-[#0F6B5C] text-base" />
            <span>Documented Entrances (Sample Data)</span>
          </h2>

          <div className="space-y-3">
            {location.entrances.map((ent) => (
              <div
                key={ent.id}
                className="p-3.5 rounded-xl border border-[#EAE6E1] bg-[#F7F5F2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-semibold text-[#17201F] flex items-center gap-2">
                    <span>{ent.name}</span>
                    {ent.primary && (
                      <span className="text-xs font-semibold text-[#0F6B5C] bg-[#E7F3F0] px-2 py-0.5 rounded">
                        Main Entrance
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#52605E] mt-1">
                    Entry Type: <strong className="text-[#17201F]">{ent.type}</strong>
                  </div>
                </div>

                <div className="self-start sm:self-auto">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                      ent.powerDoor === 'Available'
                        ? 'bg-[#E7F3F0] text-[#0F6B5C]'
                        : ent.powerDoor === 'Manual Only'
                        ? 'bg-[#FFF7ED] text-[#B35C00]'
                        : 'bg-[#EAE6E1] text-[#52605E]'
                    }`}
                  >
                    {ent.powerDoor === 'Available'
                      ? 'Power automated'
                      : ent.powerDoor === 'Manual Only'
                      ? 'Manual pull only'
                      : 'Access information unknown'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Access (Elevators) */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3DED8] shadow-xs">
          <h2 className="text-sm font-bold text-[#17201F] flex items-center gap-1.5 mb-3.5">
            <MaterialIcon name="elevator" className="text-[#0F6B5C] text-base" />
            <span>Vertical Access & Elevators</span>
          </h2>

          <div className="space-y-3">
            {location.verticalAccess.map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-xl border border-[#EAE6E1] bg-[#F7F5F2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-semibold text-[#17201F]">{v.name}</div>
                  <div className="text-xs text-[#52605E] mt-1">
                    {v.type} • {v.floorsServed}
                  </div>
                </div>

                <div className="self-start sm:self-auto">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                      v.status === 'Operational in sample data'
                        ? 'bg-[#E7F3F0] text-[#0F6B5C]'
                        : 'bg-[#FFF7ED] text-[#B35C00]'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restrooms & Quiet Rest Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3DED8] shadow-xs">
            <h3 className="text-sm font-bold text-[#17201F] flex items-center gap-1.5 mb-2">
              <MaterialIcon name="wc" className="text-[#1E5AA8] text-base" />
              <span>Accessible Restrooms</span>
            </h3>
            <p className="text-xs text-[#52605E] leading-relaxed">
              {location.accessibleRestrooms}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3DED8] shadow-xs">
            <h3 className="text-sm font-bold text-[#17201F] flex items-center gap-1.5 mb-2">
              <MaterialIcon name="chair" className="text-[#0F6B5C] text-base" />
              <span>Quiet Seating & Rest Areas</span>
            </h3>
            <p className="text-xs text-[#52605E] leading-relaxed">
              {location.quietRestAreas}
            </p>
          </div>
        </div>

        {/* Known Limitations */}
        {location.knownLimitations.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#B35C00]/30 text-xs text-[#B35C00]">
            <h3 className="font-bold mb-1.5 flex items-center gap-1.5 text-xs">
              <MaterialIcon name="report" className="text-base" />
              <span>Known Limitations in Sample Records</span>
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-[#17201F]">
              {location.knownLimitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
