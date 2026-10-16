import React from 'react';
import { MaterialIcon } from '../components/MaterialIcon';

interface ScreenAboutProps {
  onBackToPlan: () => void;
}

export const ScreenAbout: React.FC<ScreenAboutProps> = ({ onBackToPlan }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Navigation */}
      <div className="mb-4">
        <button
          onClick={onBackToPlan}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F6B5C] hover:underline"
        >
          <MaterialIcon name="arrow_back" className="text-base" />
          <span>Back to Planner</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0F6B5C] font-semibold mb-1">
          <MaterialIcon name="info" className="text-base" />
          <span>Screen 6 • Data Transparency & Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#17201F] tracking-tight">
          About Waypoint
        </h1>
        <p className="text-sm text-[#52605E] mt-1">
          Accessibility-first campus wayfinding design philosophy, transparency disclaimers, and data boundaries.
        </p>
      </div>

      <div className="space-y-6">
        {/* Core Mission */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E3DED8] shadow-xs">
          <h2 className="text-base font-heading font-bold text-[#17201F] mb-2 flex items-center gap-2">
            <MaterialIcon name="flag" className="text-[#0F6B5C] text-lg" />
            <span>Product Mission</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#52605E] leading-relaxed">
            Waypoint is an accessibility-first campus wayfinding prototype created to help university students discover and compare walking routes based on physical mobility requirements, sensory thresholds, and comfort needs—not transit speed alone.
          </p>
        </div>

        {/* Representative Sample Data Notice (Prominent Disclosure) */}
        <div className="bg-[#FFF7ED] p-6 rounded-2xl border-2 border-[#B35C00]/30 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B35C00] text-white flex items-center justify-center shrink-0">
              <MaterialIcon name="campaign" className="text-xl" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-bold text-[#B35C00] uppercase tracking-wider mb-1">
                Representative Sample Data Disclosure
              </h2>
              <p className="text-xs sm:text-sm text-[#17201F] leading-relaxed">
                All campus buildings, pathway corridors, door widths, ramp slopes, elevator statuses, and sound levels in this prototype are <strong>synthetic representative sample data</strong> generated for UI/UX demonstration.
              </p>
              <div className="mt-3 p-3 rounded-xl bg-white/80 border border-[#B35C00]/20 text-xs text-[#52605E] space-y-1">
                <div>• This prototype does <strong>not</strong> provide live GPS tracking.</div>
                <div>• This prototype does <strong>not</strong> provide live facility telemetry or real-time elevator outage sensors.</div>
                <div>• This prototype does <strong>not</strong> claim independently verified campus accessibility audits or legal ADA certification.</div>
                <div>• This prototype does <strong>not</strong> guarantee real-world route safety or physical accessibility.</div>
              </div>
            </div>
          </div>
        </div>

        {/* How Routing Decision Logic Works */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E3DED8] shadow-xs space-y-4">
          <h2 className="text-base font-heading font-bold text-[#17201F] flex items-center gap-2">
            <MaterialIcon name="alt_route" className="text-[#0F6B5C] text-lg" />
            <span>Deterministic Accessibility Logic</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F7F5F2] border border-[#EAE6E1]">
              <strong className="text-[#0F6B5C] uppercase text-[11px] block mb-1">
                1. Hard Eligibility Filters
              </strong>
              <p className="text-[#52605E] leading-relaxed">
                Mandatory rules (e.g. step-free, required elevator, power door) strictly disqualify routes. Ineligible paths are never recommended. Unknown critical access data is treated as unverified and disqualified.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F5F2] border border-[#EAE6E1]">
              <strong className="text-[#17201F] uppercase text-[11px] block mb-1">
                2. Soft Ranking Factors
              </strong>
              <p className="text-[#52605E] leading-relaxed">
                Comfort preferences (quieter paths, sheltered routes, gentle slopes, seating) influence the ordering of eligible routes only after physical accessibility compliance is established.
              </p>
            </div>
          </div>
        </div>

        {/* Accessibility Design Targets */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E3DED8] shadow-xs">
          <h2 className="text-base font-heading font-bold text-[#17201F] mb-2 flex items-center gap-2">
            <MaterialIcon name="accessibility_new" className="text-[#0F6B5C] text-lg" />
            <span>Accessibility Design Targets</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#52605E] leading-relaxed mb-3">
            Waypoint is engineered around WCAG 2.1 AA digital accessibility standards as an intentional design target:
          </p>
          <ul className="text-xs sm:text-sm text-[#17201F] space-y-2 list-disc list-inside leading-relaxed">
            <li>High-contrast text tokens achieving at least 4.5:1 contrast against canvas and surfaces.</li>
            <li>Status and eligibility are never communicated via color alone (always paired with iconography and text labels).</li>
            <li>All controls provide visible keyboard focus rings and minimum 44×44px touch boundaries.</li>
            <li>Semantic landmarks, form labels, and live region announcements for assistive technologies.</li>
            <li><em>Note: WCAG 2.1 AA is pursued as an internal design target for this prototype; it does not constitute a certified legal or third-party accessibility audit.</em></li>
          </ul>
        </div>

        {/* Primary Return Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onBackToPlan}
            className="w-full min-h-[48px] h-12 px-6 rounded-xl bg-[#0F6B5C] hover:bg-[#0B5449] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <MaterialIcon name="explore" className="text-lg" />
            <span>Return to Route Planner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
