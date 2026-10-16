import { MandatoryRequirements, OptionalPreferences, RouteOption } from '../types';
import { SAMPLE_ROUTES } from '../data/campusData';

export interface RouteEvaluationResult {
  qualifyingRoutes: RouteOption[];
  disqualifiedRoutesCount: number;
  totalCandidateRoutes: number;
  unmetMandatoryReasons: string[];
}

/**
 * Deterministic routing evaluation against representative sample data.
 * Adheres strictly to the accessibility rules:
 * - Mandatory requirements act as HARD eligibility filters.
 * - Unknown critical data is NEVER assumed accessible.
 * - Optional preferences influence ranking only after eligibility is proven.
 */
export function evaluateRoutes(
  originId: string,
  destinationId: string,
  mandatory: MandatoryRequirements,
  optional: OptionalPreferences
): RouteEvaluationResult {
  if (!originId || !destinationId || originId === destinationId) {
    return {
      qualifyingRoutes: [],
      disqualifiedRoutesCount: 0,
      totalCandidateRoutes: 0,
      unmetMandatoryReasons: originId === destinationId ? ['Origin and destination are the same building.'] : [],
    };
  }

  // Find all candidate routes for this origin-destination pair
  let candidateRoutes = SAMPLE_ROUTES.filter(
    (r) => r.originId === originId && r.destinationId === destinationId
  );

  // If no direct pre-configured route exists in sample data, provide synthetic reverse or generic connection
  if (candidateRoutes.length === 0) {
    // Check reverse routes
    const reverseRoutes = SAMPLE_ROUTES.filter(
      (r) => r.originId === destinationId && r.destinationId === originId
    );
    if (reverseRoutes.length > 0) {
      candidateRoutes = reverseRoutes.map((r) => ({
        ...r,
        id: `rev-${r.id}`,
        originId,
        destinationId,
        pathNodes: [...r.pathNodes].reverse(),
        steps: [...r.steps].reverse().map((s, idx) => ({
          ...s,
          id: `rev-${s.id}`,
          stepNumber: idx + 1,
          instruction: s.instruction.replace('Depart', 'Approach').replace('Enter', 'Arrive at'),
        })),
      }));
    }
  }

  const qualifyingRoutes: RouteOption[] = [];
  const unmetReasonsSet = new Set<string>();
  let disqualifiedCount = 0;

  for (const route of candidateRoutes) {
    let qualifies = true;

    // Hard Rule 1: Step-Free Requirement (Route & Step level)
    if (mandatory.stepFree) {
      const containsStairs = route.hasStairs || route.steps.some((s) => s.hasStairs);
      if (containsStairs) {
        qualifies = false;
        unmetReasonsSet.add('Contains exterior or interior stairs without verified ramp alternatives.');
      }
    }

    // Hard Rule 2: Elevator Access Required for elevation changes
    if (mandatory.elevatorRequired) {
      const needsElevator = route.requiresElevator || route.steps.some((s) => s.requiresElevator);
      if (needsElevator) {
        const isElevatorUnknown =
          route.elevatorDataStatus === 'unknown' ||
          route.steps.some((s) => s.requiresElevator && s.elevatorStatus === 'unknown');
        const isElevatorMissing =
          route.elevatorDataStatus === 'none' ||
          route.steps.some((s) => s.requiresElevator && s.elevatorStatus === 'none');

        if (isElevatorUnknown) {
          qualifies = false;
          unmetReasonsSet.add(
            'Requires elevator access, but elevator operational status is unverified or unknown in sample records.'
          );
        } else if (isElevatorMissing) {
          qualifies = false;
          unmetReasonsSet.add('Traverses level changes where no elevator is present.');
        }
      }
    }

    // Hard Rule 3: Power Automated Doors Required
    if (mandatory.powerDoorRequired) {
      const isDoorUnknown =
        route.powerDoorStatus === 'unknown' ||
        route.steps.some((s) => s.powerDoorStatus === 'unknown');
      const isDoorManualOnly = route.powerDoorStatus === 'none';

      if (isDoorManualOnly) {
        qualifies = false;
        unmetReasonsSet.add('Requires manual pull doors without automated push-button assist.');
      } else if (isDoorUnknown) {
        qualifies = false;
        unmetReasonsSet.add('Power door automation status is unknown in sample records.');
      }
    }

    if (!qualifies) {
      disqualifiedCount++;
      continue;
    }

    // Route qualifies! Calculate soft ranking score based on optional comfort preferences
    let score = 100 - route.totalTimeMinutes * 2;

    if (optional.quieterPaths && route.isQuiet) {
      score += 25;
    }
    if (optional.shelteredWalkways && route.isSheltered) {
      score += 25;
    }
    if (optional.gentleSlopes && route.hasGentleSlope) {
      score += 15;
    }
    if (optional.seatingAlongPath && route.hasFrequentSeating) {
      score += 15;
    }

    qualifyingRoutes.push({
      ...route,
      matchScore: score,
    });
  }

  // Rank qualifying routes descending by score
  qualifyingRoutes.sort((a, b) => b.matchScore - a.matchScore);

  // Return at most top 3 qualifying options
  const topQualifying = qualifyingRoutes.slice(0, 3);

  return {
    qualifyingRoutes: topQualifying,
    disqualifiedRoutesCount: disqualifiedCount,
    totalCandidateRoutes: candidateRoutes.length,
    unmetMandatoryReasons: Array.from(unmetReasonsSet),
  };
}
