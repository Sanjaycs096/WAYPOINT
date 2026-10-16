import React from 'react';
import { CampusLocation, MandatoryRequirements, OptionalPreferences, RouteOption } from '../types';
import { SchematicMap } from '../components/SchematicMap';
import { MaterialIcon } from '../components/MaterialIcon';

interface ScreenRouteResultsProps {
  locations: CampusLocation[];
  originLoc?: CampusLocation;
  destinationLoc?: CampusLocation;
  mandatory: MandatoryRequirements;
  optional: OptionalPreferences;
  qualifyingRoutes: RouteOption[];
  selectedRouteId: string;
  unmetReasons: string[];
  totalCandidateRoutes: number;
  onSelectRoute: (routeId: string) => void;
  onStartGuidance: (route: RouteOption) => void;
  onViewLocationDetails: (locationId: string) => void;
  onModifyPlan: () => void;
}

export const ScreenRouteResults: React.FC<ScreenRouteResultsProps> = ({
  locations,
  originLoc,
  destinationLoc,
  mandatory,
  optional,
  qualifyingRoutes,
  selectedRouteId,
  unmetReasons,
  totalCandidateRoutes,
  onSelectRoute,
  onStartGuidance,
  onViewLocationDetails,
  onModifyPlan,
}) => {
  const activeRoute = qualifyingRoutes.find((r) => r.id === selectedRouteId) || qualifyingRoutes[0];
  const alternateRoutes = qualifyingRoutes.filter((r) => r.id !== activeRoute?.id);

  const hasNoRoutes = qualifyingRoutes.length === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button
          onClick={onModifyPlan}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F6B5C] hover:underline min-h-[36px]"
        >
          <MaterialIcon name="arrow_back" className="text-base" />
          <span>Edit Origin & Requirements</span>
        </button>

        <span className="text-xs text-[#52605E]">
          Screen 2 • Route Results & Comparison
        </span>
      </div>

      {/* Origin -> Destination Trip Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#E3DED8] bg-[#FFFFFF] shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex flex-col items-center gap-1 pt-1 sm:pt-0">
              <span className="w-3 h-3 rounded-full bg-[#1E5AA8] ring-4 ring-[#EFF6FF]"></span>
              <span className="w-0.5 h-6 bg-[#D4CEC4]"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#0F6B5C] ring-4 ring-[#E7F3F0]"></span>
            </div>

            <div>
              <div className="text-xs text-[#52605E] flex items-center gap-1.5">
                <span>From:</span>
                <strong className="text-[#17201F]">{originLoc?.name ?? 'Origin'}</strong>
                <span className="text-xs bg-[#EAE6E1] text-[#52605E] px-1.5 py-0.2 rounded font-mono">
                  {originLoc?.code}
                </span>
              </div>
              <div className="text-base sm:text-lg font-heading font-bold text-[#17201F] flex items-center gap-1.5 mt-0.5">
                <span>To:</span>
                <span>{destinationLoc?.name ?? 'Destination'}</span>
                <span className="text-xs font-semibold bg-[#E7F3F0] text-[#0F6B5C] px-2 py-0.5 rounded">
                  {destinationLoc?.code}
                </span>
              </div>
            </div>
          </div>

          {/* Action to view destination facility profile */}
          {destinationLoc && (
            <button
              onClick={() => onViewLocationDetails(destinationLoc.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-lg border border-[#E3DED8] bg-[#F7F5F2] hover:bg-[#EAE6E1] text-xs font-medium text-[#17201F] transition-colors self-start sm:self-auto"
            >
              <MaterialIcon name="domain" className="text-base text-[#0F6B5C]" />
              <span>Inspect Destination Accessibility</span>
            </button>
          )}
        </div>

        {/* Active Filters Pill Bar */}
        <div className="mt-4 pt-3 border-t border-[#EAE6E1] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-xs font-semibold text-[#52605E]">
            Active Rules:
          </span>
          {mandatory.stepFree && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E7F3F0] text-[#0F6B5C] font-semibold text-xs">
              <MaterialIcon name="check" className="text-xs" />
              <span>Step-free only</span>
            </span>
          )}
          {mandatory.elevatorRequired && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E7F3F0] text-[#0F6B5C] font-semibold text-xs">
              <MaterialIcon name="check" className="text-xs" />
              <span>Elevator required</span>
            </span>
          )}
          {mandatory.powerDoorRequired && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E7F3F0] text-[#0F6B5C] font-semibold text-xs">
              <MaterialIcon name="check" className="text-xs" />
              <span>Power doors</span>
            </span>
          )}
          {optional.quieterPaths && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EAE6E1] text-[#17201F] text-xs font-medium">
              <span>Quieter preferred</span>
            </span>
          )}
          {optional.shelteredWalkways && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EAE6E1] text-[#17201F] text-xs font-medium">
              <span>Sheltered preferred</span>
            </span>
          )}
          {optional.gentleSlopes && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EAE6E1] text-[#17201F] text-xs font-medium">
              <span>Gentle slopes preferred</span>
            </span>
          )}
          {optional.seatingAlongPath && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EAE6E1] text-[#17201F] text-xs font-medium">
              <span>Seating preferred</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Schematic Map & Route Cards */}
      {!hasNoRoutes ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Schematic Map (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-[#17201F] flex items-center gap-1.5">
                <MaterialIcon name="route" className="text-[#0F6B5C] text-base" />
                <span>Schematic Path Overview</span>
              </h2>
              <span className="text-xs text-[#52605E]">
                Highlighting: <strong className="text-[#0F6B5C]">{activeRoute?.name}</strong>
              </span>
            </div>

            <SchematicMap
              locations={locations}
              selectedOriginId={originLoc?.id ?? ''}
              selectedDestinationId={destinationLoc?.id ?? ''}
              activeRoute={activeRoute}
              alternateRoutes={alternateRoutes}
              onSelectLocation={(locId) => onViewLocationDetails(locId)}
            />

            <div className="p-3 rounded-xl border border-[#E3DED8] bg-[#FFFFFF] text-xs text-[#52605E] flex items-start gap-2">
              <MaterialIcon name="visibility" className="text-base text-[#1E5AA8] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-[#17201F]">Schematic Representation:</strong> Distances and pathway nodes are simplified representations of representative sample campus geography. Guidance follows turn-by-turn manual directives.
              </div>
            </div>
          </div>

          {/* Right Column: Route Cards & Start Guidance CTA (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-sm font-bold text-[#17201F]">
                    Qualifying Route Options ({qualifyingRoutes.length})
                  </h2>
                  {totalCandidateRoutes > qualifyingRoutes.length && (
                    <span className="text-[11px] text-[#B35C00] font-medium bg-[#FFF7ED] border border-[#B35C00]/20 px-2 py-0.5 rounded-full">
                      {totalCandidateRoutes - qualifyingRoutes.length} inaccessible {totalCandidateRoutes - qualifyingRoutes.length === 1 ? 'path' : 'paths'} excluded
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#52605E]">Ranked by comfort criteria</span>
              </div>

              {/* Accessible Live Region for Route Selection */}
              <div className="sr-only" role="status" aria-live="polite">
                {activeRoute ? `Currently selected: ${activeRoute.name}, ${activeRoute.totalTimeMinutes} minutes, ${activeRoute.totalDistanceMeters} meters.` : ''}
              </div>

              {/* Route Cards List */}
              <div className="space-y-3" role="radiogroup" aria-label="Available qualifying routes">
                {qualifyingRoutes.map((route) => {
                  const isSelected = route.id === activeRoute?.id;
                  return (
                    <div
                      key={route.id}
                      onClick={() => onSelectRoute(route.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectRoute(route.id);
                        }
                      }}
                      tabIndex={0}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${route.name}, ${route.totalTimeMinutes} minutes, ${route.totalDistanceMeters} meters. ${route.tag}.`}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left focus:outline-none min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#0F6B5C] ${
                        isSelected
                          ? 'border-[#0F6B5C] bg-[#FFFFFF] shadow-sm ring-1 ring-[#0F6B5C]'
                          : 'border-[#E3DED8] bg-[#FFFFFF] hover:border-[#C9C3BA] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {/* Card Header: Tag & Metrics */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-[#0F6B5C] bg-[#0F6B5C]'
                                : 'border-[#B8B2A6] bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-[#0F6B5C] bg-[#E7F3F0] px-2 py-0.5 rounded-md inline-block">
                              {route.tag}
                            </span>
                            <h3 className="text-sm sm:text-base font-heading font-bold text-[#17201F] mt-1 leading-snug">
                              {route.name}
                            </h3>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base sm:text-lg font-bold text-[#17201F] leading-tight">
                            {route.totalTimeMinutes} min
                          </div>
                          <div className="text-xs text-[#52605E]">
                            {route.totalDistanceMeters} m
                          </div>
                        </div>
                      </div>

                      {/* Eligibility confirmation label */}
                      <div className="text-xs font-medium text-[#20714A] flex items-center gap-1 mb-2.5">
                        <MaterialIcon name="verified_user" className="text-sm" />
                        <span>Meets mandatory rules (Sample data)</span>
                      </div>

                      {/* Why Recommended Reason */}
                      <div className="text-xs text-[#17201F] mb-2.5 bg-[#F7F5F2] p-2.5 rounded-lg border border-[#EAE6E1] leading-relaxed">
                        <span className="font-semibold block text-[#0F6B5C] text-xs mb-0.5">
                          Why Recommended:
                        </span>
                        {route.recommendationReason}
                      </div>

                      {/* Trade-off explanation */}
                      <div className="text-xs text-[#52605E] flex items-start gap-1.5 pt-2 border-t border-[#EAE6E1] leading-relaxed">
                        <MaterialIcon name="compare_arrows" className="text-sm text-[#B35C00] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#17201F]">Trade-off:</strong> {route.tradeOff}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Button: Start Guidance */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => activeRoute && onStartGuidance(activeRoute)}
                className="w-full min-h-[48px] h-13 px-6 rounded-xl bg-[#0F6B5C] hover:bg-[#0B5449] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F6B5C]"
              >
                <MaterialIcon name="navigation" className="text-xl" />
                <span>Start Guidance for Selected Route</span>
              </button>
              <p className="text-center text-xs text-[#52605E] mt-2">
                User-directed step-by-step guidance without live GPS tracking.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* No Qualifying Route Fallback State with Schematic Context */
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E3DED8] bg-[#FFFFFF] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs sm:text-sm font-bold text-[#17201F] flex items-center gap-1.5">
                <MaterialIcon name="route" className="text-[#B35C00] text-base" />
                <span>Schematic Campus Map • Barrier Inspection</span>
              </h2>
              <span className="text-xs text-[#B35C00] font-semibold bg-[#FFF7ED] px-2.5 py-0.5 rounded-full">
                No step-free route qualified
              </span>
            </div>

            <SchematicMap
              locations={locations}
              selectedOriginId={originLoc?.id ?? ''}
              selectedDestinationId={destinationLoc?.id ?? ''}
              activeRoute={undefined}
              alternateRoutes={[]}
              onSelectLocation={(locId) => onViewLocationDetails(locId)}
            />
          </div>

          <div className="p-6 sm:p-10 rounded-2xl border-2 border-[#B35C00]/30 bg-[#FFFFFF] shadow-sm max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-[#FFF7ED] text-[#B35C00] flex items-center justify-center mx-auto mb-4">
              <MaterialIcon name="block" className="text-3xl" />
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#17201F] mb-2">
              No Fully Qualifying Routes Found
            </h2>

          <p className="text-sm text-[#52605E] max-w-md mx-auto mb-6 leading-relaxed">
            We evaluated all {totalCandidateRoutes} candidate paths between{' '}
            <strong className="text-[#17201F]">{originLoc?.name}</strong> and{' '}
            <strong className="text-[#17201F]">{destinationLoc?.name}</strong> in our sample data, but none meet 100% of your active mandatory accessibility rules.
          </p>

          {/* Specific Barrier Diagnostic */}
          {unmetReasons.length > 0 && (
            <div className="bg-[#FFF7ED] p-4 rounded-xl border border-[#B35C00]/20 text-left mb-6">
              <span className="text-xs font-bold text-[#B35C00] block mb-1.5 flex items-center gap-1.5">
                <MaterialIcon name="report_problem" className="text-base" />
                <span>Identified Physical Barriers in Sample Data:</span>
              </span>
              <ul className="list-disc list-inside text-xs text-[#17201F] space-y-1.5">
                {unmetReasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onModifyPlan}
              className="w-full sm:w-auto min-h-[48px] h-12 px-6 rounded-xl bg-[#0F6B5C] hover:bg-[#0B5449] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MaterialIcon name="tune" className="text-lg" />
              <span>Adjust Constraints or Select Another Destination</span>
            </button>
            {destinationLoc && (
              <button
                onClick={() => onViewLocationDetails(destinationLoc.id)}
                className="w-full sm:w-auto min-h-[48px] h-12 px-4 rounded-xl border border-[#E3DED8] bg-[#F7F5F2] hover:bg-[#EAE6E1] text-xs font-semibold text-[#17201F] flex items-center justify-center gap-1.5 transition-colors"
              >
                <MaterialIcon name="info" className="text-base" />
                <span>View Building Details</span>
              </button>
            )}
          </div>

          <p className="text-xs text-[#52605E] mt-4">
            Waypoint will never recommend or preselect an inaccessible route that violates your declared mandatory access rules.
          </p>
        </div>
      </div>
      )}
    </div>
  );
};
