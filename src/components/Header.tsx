import React from 'react';
import { ScreenType } from '../types';
import { MaterialIcon } from './MaterialIcon';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  savedPreferencesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  savedPreferencesCount = 0,
}) => {
  const isGuidanceMode = currentScreen === 'guidance';

  return (
    <header className="sticky top-0 z-30 border-b border-[#E3DED8] bg-[#F7F5F2]/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('plan')}
          className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B5C] rounded-lg p-1 transition-opacity hover:opacity-90 shrink-0"
          aria-label="Waypoint Home - Return to Plan"
        >
          {/* Restrained Waypoint wayfinding compass/node icon */}
          <div className="w-8 h-8 rounded-lg bg-[#0F6B5C] text-white flex items-center justify-center shadow-xs shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-current"
              aria-hidden="true"
            >
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base sm:text-lg text-[#17201F] tracking-tight">
                Waypoint
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#52605E] bg-[#EAE6E1] px-1.5 py-0.5 rounded hidden sm:inline-block">
                Sample
              </span>
            </div>
          </div>
        </button>

        {/* Global Navigation - Suppressed during Route Guidance mode */}
        {!isGuidanceMode ? (
          <nav className="flex items-center gap-1 shrink-0" aria-label="Main Navigation">
            <button
              onClick={() => onNavigate('plan')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 min-h-[44px] text-xs sm:text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B5C] ${
                currentScreen === 'plan' || currentScreen === 'results'
                  ? 'bg-[#E7F3F0] text-[#0F6B5C]'
                  : 'text-[#52605E] hover:text-[#17201F] hover:bg-[#EAE6E1]'
              }`}
              title="Plan Route"
              aria-label="Plan Route"
            >
              <MaterialIcon name="explore" className="text-base sm:text-lg" />
              <span className="hidden min-[480px]:inline">Plan</span>
            </button>

            <button
              onClick={() => onNavigate('preferences')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 min-h-[44px] text-xs sm:text-sm font-medium rounded-lg transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B5C] ${
                currentScreen === 'preferences'
                  ? 'bg-[#E7F3F0] text-[#0F6B5C]'
                  : 'text-[#52605E] hover:text-[#17201F] hover:bg-[#EAE6E1]'
              }`}
              title="Preferences"
              aria-label="Preferences"
            >
              <MaterialIcon name="tune" className="text-base sm:text-lg" />
              <span className="hidden min-[480px]:inline">Preferences</span>
              {savedPreferencesCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F6B5C] hidden sm:inline-block" title="Custom preferences saved" />
              )}
            </button>

            <button
              onClick={() => onNavigate('about')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 min-h-[44px] text-xs sm:text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B5C] ${
                currentScreen === 'about'
                  ? 'bg-[#E7F3F0] text-[#0F6B5C]'
                  : 'text-[#52605E] hover:text-[#17201F] hover:bg-[#EAE6E1]'
              }`}
              title="About Waypoint"
              aria-label="About Waypoint"
            >
              <MaterialIcon name="info" className="text-base sm:text-lg" />
              <span className="hidden min-[480px]:inline">About</span>
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#52605E]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0F6B5C] animate-pulse"></span>
            <span className="font-medium text-[#17201F]">Guidance Active</span>
          </div>
        )}
      </div>
    </header>
  );
};
