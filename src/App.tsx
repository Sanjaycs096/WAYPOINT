import React, { useState, useEffect } from 'react';
import {
  CampusLocation,
  MandatoryRequirements,
  OptionalPreferences,
  RouteOption,
  ScreenType,
  UserPreferences,
} from './types';
import { CAMPUS_LOCATIONS } from './data/campusData';
import { evaluateRoutes } from './utils/routing';
import {
  DEFAULT_PREFERENCES,
  loadSavedPreferences,
  resetPreferencesInStorage,
  savePreferencesToStorage,
} from './utils/storage';
import { Header } from './components/Header';
import { ScreenPlan } from './screens/ScreenPlan';
import { ScreenRouteResults } from './screens/ScreenRouteResults';
import { ScreenRouteGuidance } from './screens/ScreenRouteGuidance';
import { ScreenLocationDetails } from './screens/ScreenLocationDetails';
import { ScreenPreferences } from './screens/ScreenPreferences';
import { ScreenAbout } from './screens/ScreenAbout';
import { MaterialIcon } from './components/MaterialIcon';

export default function App() {
  // Screen Routing State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('plan');

  // Origin & Destination
  const [originId, setOriginId] = useState<string>('loc-center'); // Default: Campus Center Plaza
  const [destinationId, setDestinationId] = useState<string>('loc-library'); // Default: University Main Library
  const [viewingLocationId, setViewingLocationId] = useState<string>('loc-library');

  // User Preferences (Stored locally in browser storage)
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadSavedPreferences());
  const [mandatory, setMandatory] = useState<MandatoryRequirements>(preferences.mandatory);
  const [optional, setOptional] = useState<OptionalPreferences>(preferences.optional);

  // Active Selected Route for Guidance & Map
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [activeGuidanceRoute, setActiveGuidanceRoute] = useState<RouteOption | null>(null);

  // Sync state if preferences change from storage
  useEffect(() => {
    setMandatory(preferences.mandatory);
    setOptional(preferences.optional);
  }, [preferences]);

  // Compute Evaluation for current origin, destination, and rules
  const evaluation = evaluateRoutes(originId, destinationId, mandatory, optional);

  // Automatically select the top qualifying route if none selected or if routes changed
  useEffect(() => {
    if (evaluation.qualifyingRoutes.length > 0) {
      if (!evaluation.qualifyingRoutes.some((r) => r.id === selectedRouteId)) {
        setSelectedRouteId(evaluation.qualifyingRoutes[0].id);
      }
    } else {
      setSelectedRouteId('');
    }
  }, [originId, destinationId, mandatory, optional]);

  // Navigation Handlers
  const handleFindRoutes = () => {
    if (evaluation.qualifyingRoutes.length > 0) {
      setSelectedRouteId(evaluation.qualifyingRoutes[0].id);
    }
    setCurrentScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartGuidance = (route: RouteOption) => {
    setActiveGuidanceRoute(route);
    setCurrentScreen('guidance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitGuidance = () => {
    setCurrentScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteGuidance = () => {
    setActiveGuidanceRoute(null);
    setCurrentScreen('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewLocationDetails = (locId: string) => {
    setViewingLocationId(locId);
    setCurrentScreen('location-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetAsDestination = (locId: string) => {
    setDestinationId(locId);
    setCurrentScreen('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavePreferences = (newPrefs: UserPreferences) => {
    savePreferencesToStorage(newPrefs);
    setPreferences(newPrefs);
    setMandatory(newPrefs.mandatory);
    setOptional(newPrefs.optional);
  };

  const handleResetDefaults = () => {
    const defaults = resetPreferencesInStorage();
    setPreferences(defaults);
    setMandatory(defaults.mandatory);
    setOptional(defaults.optional);
  };

  const originLocation = CAMPUS_LOCATIONS.find((l) => l.id === originId);
  const destinationLocation = CAMPUS_LOCATIONS.find((l) => l.id === destinationId);
  const viewingLocation = CAMPUS_LOCATIONS.find((l) => l.id === viewingLocationId) || CAMPUS_LOCATIONS[0];

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#17201F] flex flex-col selection:bg-[#E7F3F0] selection:text-[#0F6B5C]">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0F6B5C] focus:text-white focus:rounded-md focus:shadow-md"
      >
        Skip to main content
      </a>

      {/* Global Minimal Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedPreferencesCount={
          (mandatory.stepFree ? 1 : 0) +
          (mandatory.elevatorRequired ? 1 : 0) +
          (mandatory.powerDoorRequired ? 1 : 0)
        }
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {currentScreen === 'plan' && (
          <ScreenPlan
            locations={CAMPUS_LOCATIONS}
            originId={originId}
            destinationId={destinationId}
            mandatory={mandatory}
            optional={optional}
            onOriginChange={setOriginId}
            onDestinationChange={setDestinationId}
            onMandatoryChange={setMandatory}
            onOptionalChange={setOptional}
            onFindRoutes={handleFindRoutes}
            onNavigateToPreferences={() => setCurrentScreen('preferences')}
          />
        )}

        {currentScreen === 'results' && (
          <ScreenRouteResults
            locations={CAMPUS_LOCATIONS}
            originLoc={originLocation}
            destinationLoc={destinationLocation}
            mandatory={mandatory}
            optional={optional}
            qualifyingRoutes={evaluation.qualifyingRoutes}
            selectedRouteId={selectedRouteId}
            unmetReasons={evaluation.unmetMandatoryReasons}
            totalCandidateRoutes={evaluation.totalCandidateRoutes}
            onSelectRoute={setSelectedRouteId}
            onStartGuidance={handleStartGuidance}
            onViewLocationDetails={handleViewLocationDetails}
            onModifyPlan={() => setCurrentScreen('plan')}
          />
        )}

        {currentScreen === 'guidance' && activeGuidanceRoute && (
          <ScreenRouteGuidance
            route={activeGuidanceRoute}
            onExitGuidance={handleExitGuidance}
            onCompleteGuidance={handleCompleteGuidance}
          />
        )}

        {currentScreen === 'location-details' && (
          <ScreenLocationDetails
            location={viewingLocation}
            onSetAsDestination={handleSetAsDestination}
            onBackToPrevious={() => setCurrentScreen('results')}
          />
        )}

        {currentScreen === 'preferences' && (
          <ScreenPreferences
            preferences={preferences}
            onSavePreferences={handleSavePreferences}
            onResetDefaults={handleResetDefaults}
            onBackToPlan={() => setCurrentScreen('plan')}
          />
        )}

        {currentScreen === 'about' && (
          <ScreenAbout onBackToPlan={() => setCurrentScreen('plan')} />
        )}
      </main>

      {/* Global Minimal Footer */}
      <footer className="border-t border-[#E3DED8] bg-[#FFFFFF] py-6 px-4 text-xs text-[#52605E]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-[#17201F]">Waypoint</span>
            <span className="text-[#888278]">•</span>
            <span>Accessibility-first campus wayfinding prototype</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#B35C00] font-medium flex items-center gap-1">
              <MaterialIcon name="info" className="text-xs" />
              <span>Representative sample data</span>
            </span>
            <button
              onClick={() => {
                setCurrentScreen('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#0F6B5C] hover:underline"
            >
              Data Transparency & Disclaimers
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
