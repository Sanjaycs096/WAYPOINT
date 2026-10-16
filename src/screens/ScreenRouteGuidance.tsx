import React, { useState } from 'react';
import { RouteOption } from '../types';
import { MaterialIcon } from '../components/MaterialIcon';

interface ScreenRouteGuidanceProps {
  route: RouteOption;
  onExitGuidance: () => void;
  onCompleteGuidance: () => void;
}

export const ScreenRouteGuidance: React.FC<ScreenRouteGuidanceProps> = ({
  route,
  onExitGuidance,
  onCompleteGuidance,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const steps = route.steps;
  const totalSteps = steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isArrivalCompleted = currentStepIndex >= totalSteps;

  const currentStep = steps[currentStepIndex];

  // Calculate remaining distance from current step onwards
  const remainingDistance = steps
    .slice(currentStepIndex)
    .reduce((acc, s) => acc + s.distanceMeters, 0);

  const remainingMinutes = Math.max(
    1,
    steps.slice(currentStepIndex).reduce((acc, s) => acc + s.estimatedMinutes, 0)
  );

  const handleNext = () => {
    if (isLastStep) {
      setCurrentStepIndex(totalSteps); // Move to arrival state
    } else {
      setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  // Keyboard arrow shortcuts for step progression
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !isArrivalCompleted) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0 && !isArrivalCompleted) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, isArrivalCompleted]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Screen Reader Live Announcement */}
      <div className="sr-only" role="status" aria-live="assertive">
        {isArrivalCompleted
          ? `You have arrived at your destination: ${route.name}.`
          : `Step ${currentStepIndex + 1} of ${totalSteps}: ${currentStep.instruction}`}
      </div>

      {/* Guidance Top Control Bar */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-[#E3DED8]">
        <div>
          <span className="text-xs font-semibold text-[#0F6B5C] block">
            Guided Wayfinding • {route.name}
          </span>
          <span className="text-xs text-[#52605E]">
            Step-by-step manual progression
          </span>
        </div>

        <button
          onClick={onExitGuidance}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-lg border border-[#E3DED8] bg-[#FFFFFF] hover:bg-[#F7F5F2] text-xs font-semibold text-[#52605E] hover:text-[#17201F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B5C]"
        >
          <MaterialIcon name="close" className="text-base" />
          <span>Exit Guidance</span>
        </button>
      </div>

      {/* Arrival Celebration State */}
      {isArrivalCompleted ? (
        <div className="bg-[#FFFFFF] p-8 sm:p-10 rounded-2xl border-2 border-[#20714A]/40 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#20714A] flex items-center justify-center mx-auto mb-4 ring-8 ring-[#F0FDF4]">
            <MaterialIcon name="check_circle" className="text-4xl" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-[#17201F] mb-1">
            You Have Arrived
          </h2>
          <p className="text-sm text-[#52605E] max-w-md mx-auto mb-6">
            You completed the step-free route to your destination following the {route.name} path.
          </p>

          <div className="p-4 rounded-xl bg-[#F7F5F2] border border-[#E3DED8] text-xs text-[#17201F] max-w-sm mx-auto mb-6 space-y-1 text-left">
            <div className="flex justify-between">
              <span className="text-[#52605E]">Total Distance:</span>
              <strong>{route.totalDistanceMeters} meters</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#52605E]">Estimated Time:</span>
              <strong>{route.totalTimeMinutes} minutes</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#52605E]">Accessibility Adherence:</span>
              <strong className="text-[#20714A]">100% Satisfied (Sample data)</strong>
            </div>
          </div>

          <button
            onClick={onCompleteGuidance}
            className="w-full sm:w-auto min-h-[48px] h-12 px-8 rounded-xl bg-[#0F6B5C] hover:bg-[#0B5449] text-white font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B5C]"
          >
            Finish & Plan Another Route
          </button>
        </div>
      ) : (
        /* Active Step Card */
        <div className="space-y-6">
          {/* Progress Tracker Banner */}
          <div
            className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E3DED8] shadow-xs flex items-center justify-between"
            role="progressbar"
            aria-valuenow={currentStepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${currentStepIndex + 1} of ${totalSteps}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E7F3F0] text-[#0F6B5C] font-bold text-sm flex items-center justify-center font-heading">
                {currentStepIndex + 1}/{totalSteps}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#17201F]">
                  Step {currentStepIndex + 1} of {totalSteps}
                </div>
                <div className="text-xs text-[#52605E]">
                  {remainingDistance}m remaining • ~{remainingMinutes} min left
                </div>
              </div>
            </div>

            {/* Step Progress Dots */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'w-6 bg-[#0F6B5C]'
                      : idx < currentStepIndex
                      ? 'w-2 bg-[#20714A]'
                      : 'w-2 bg-[#D4CEC4]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Large Clear Direction Directive */}
          <div className="bg-[#FFFFFF] p-4 sm:p-8 rounded-2xl border-2 border-[#0F6B5C]/30 shadow-xs space-y-4 sm:space-y-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0F6B5C] text-white flex items-center justify-center shrink-0">
                <MaterialIcon
                  name={
                    currentStep.isIndoor
                      ? 'door_sliding'
                      : currentStep.requiresElevator
                      ? 'elevator'
                      : 'straight'
                  }
                  className="text-xl sm:text-2xl"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#0F6B5C] block mb-1">
                  Immediate Directive
                </span>
                <h2 className="text-base sm:text-2xl font-heading font-bold text-[#17201F] leading-snug break-words">
                  {currentStep.instruction}
                </h2>
                <div className="text-xs text-[#52605E] mt-2">
                  Segment length: <strong className="text-[#17201F]">{currentStep.distanceMeters}m</strong> (~{currentStep.estimatedMinutes} min)
                </div>
              </div>
            </div>

            {/* Environmental & Surface Context Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-[#EAE6E1] text-xs">
              <div className="p-2.5 rounded-lg bg-[#F7F5F2] border border-[#EAE6E1]">
                <span className="text-[11px] font-semibold text-[#52605E] block flex items-center gap-1 mb-0.5">
                  <MaterialIcon name="layers" className="text-xs text-[#0F6B5C]" />
                  <span>Surface</span>
                </span>
                <span className="text-[#17201F] font-medium">{currentStep.surfaceType}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F5F2] border border-[#EAE6E1]">
                <span className="text-[11px] font-semibold text-[#52605E] block flex items-center gap-1 mb-0.5">
                  <MaterialIcon name="trending_up" className="text-xs text-[#0F6B5C]" />
                  <span>Incline</span>
                </span>
                <span className="text-[#17201F] font-medium">{currentStep.slopeProfile}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F5F2] border border-[#EAE6E1]">
                <span className="text-[11px] font-semibold text-[#52605E] block flex items-center gap-1 mb-0.5">
                  <MaterialIcon name="volume_up" className="text-xs text-[#0F6B5C]" />
                  <span>Noise Level</span>
                </span>
                <span className="text-[#17201F] font-medium">{currentStep.noiseLevel}</span>
              </div>
            </div>

            {/* Advance Caution Warning Block (Only when applicable) */}
            {currentStep.cautionAlert && (
              <div
                className="p-3.5 rounded-xl bg-[#FFF7ED] border border-[#B35C00]/30 text-xs text-[#B35C00] flex items-start gap-2.5"
                role="alert"
              >
                <MaterialIcon name="warning" className="text-lg shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Advance Caution:</strong>
                  <span>{currentStep.cautionAlert}</span>
                </div>
              </div>
            )}
          </div>

          {/* Previous & Next Step Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`w-full sm:flex-1 min-h-[48px] h-12 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                currentStepIndex === 0
                  ? 'border-[#E3DED8] text-[#A39E95] bg-[#F7F5F2] cursor-not-allowed'
                  : 'border-[#E3DED8] bg-[#FFFFFF] hover:bg-[#F7F5F2] text-[#17201F]'
              }`}
            >
              <MaterialIcon name="arrow_back" className="text-lg" />
              <span>Previous Step</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:flex-1 min-h-[48px] h-12 px-6 rounded-xl bg-[#0F6B5C] hover:bg-[#0B5449] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B5C]"
            >
              <span>{isLastStep ? 'Arrive at Destination' : 'Next Step'}</span>
              <MaterialIcon name={isLastStep ? 'check' : 'arrow_forward'} className="text-lg" />
            </button>
          </div>

          <div className="text-center">
            <span className="text-xs text-[#52605E]">
              Guidance is completely user-directed. Tap "Next Step" as you move along campus.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
