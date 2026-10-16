import { describe, it, expect } from 'vitest';
import { evaluateRoutes } from './routing';
import { MandatoryRequirements, OptionalPreferences } from '../types';

const defaultNoMandatory: MandatoryRequirements = {
  stepFree: false,
  elevatorRequired: false,
  powerDoorRequired: false,
};

const defaultNoOptional: OptionalPreferences = {
  quieterPaths: false,
  shelteredWalkways: false,
  gentleSlopes: false,
  seatingAlongPath: false,
};

describe('Deterministic Routing Evaluation', () => {
  describe('Individual Mandatory Requirements (Hard Filters)', () => {
    it('disqualifies routes with stairs when stepFree is required', () => {
      const result = evaluateRoutes(
        'loc-center',
        'loc-library',
        { ...defaultNoMandatory, stepFree: true },
        defaultNoOptional
      );

      // route-ccp-lib-3 has stairs and should be disqualified
      expect(result.qualifyingRoutes.length).toBeGreaterThan(0);
      expect(result.qualifyingRoutes.some((r) => r.id === 'route-ccp-lib-3')).toBe(false);
      expect(result.qualifyingRoutes.every((r) => !r.hasStairs)).toBe(true);
      expect(result.disqualifiedRoutesCount).toBeGreaterThanOrEqual(1);
      expect(result.unmetMandatoryReasons).toContain(
        'Contains exterior or interior stairs without verified ramp alternatives.'
      );
    });

    it('allows routes with stairs when stepFree is NOT required', () => {
      const result = evaluateRoutes(
        'loc-center',
        'loc-library',
        { ...defaultNoMandatory, stepFree: false },
        defaultNoOptional
      );

      // route-ccp-lib-3 should be included among candidates
      const hasStairRoute = result.qualifyingRoutes.some((r) => r.id === 'route-ccp-lib-3');
      expect(hasStairRoute).toBe(true);
    });

    it('disqualifies routes with missing elevator when elevatorRequired is set', () => {
      // Find or verify route with elevation and no elevator
      const result = evaluateRoutes(
        'loc-center',
        'loc-science',
        { ...defaultNoMandatory, elevatorRequired: true },
        defaultNoOptional
      );

      expect(result.qualifyingRoutes.every((r) => !r.requiresElevator || r.elevatorDataStatus === 'available')).toBe(true);
    });

    it('treats unknown elevator status as ineligible when elevatorRequired is set', () => {
      // route-ccp-nsc-3 has elevatorDataStatus: 'unknown' and requiresElevator: true
      const result = evaluateRoutes(
        'loc-center',
        'loc-science',
        { ...defaultNoMandatory, elevatorRequired: true },
        defaultNoOptional
      );

      const unknownElevatorRoute = result.qualifyingRoutes.some((r) => r.id === 'route-ccp-nsc-3');
      expect(unknownElevatorRoute).toBe(false);
      expect(result.unmetMandatoryReasons).toContain(
        'Requires elevator access, but elevator operational status is unverified or unknown in sample records.'
      );
    });

    it('disqualifies manual doors when powerDoorRequired is set', () => {
      // route-ccp-lib-3 has powerDoorStatus: 'none'
      const result = evaluateRoutes(
        'loc-center',
        'loc-library',
        { ...defaultNoMandatory, powerDoorRequired: true },
        defaultNoOptional
      );

      expect(result.qualifyingRoutes.every((r) => r.powerDoorStatus === 'available')).toBe(true);
      expect(result.qualifyingRoutes.some((r) => r.id === 'route-ccp-lib-3')).toBe(false);
      expect(result.unmetMandatoryReasons).toContain(
        'Requires manual pull doors without automated push-button assist.'
      );
    });

    it('treats unknown power door status as ineligible when powerDoorRequired is set', () => {
      // route-ccp-nsc-3 has powerDoorStatus: 'unknown'
      const result = evaluateRoutes(
        'loc-center',
        'loc-science',
        { ...defaultNoMandatory, powerDoorRequired: true },
        defaultNoOptional
      );

      expect(result.qualifyingRoutes.some((r) => r.id === 'route-ccp-nsc-3')).toBe(false);
      expect(result.unmetMandatoryReasons).toContain(
        'Power door automation status is unknown in sample records.'
      );
    });
  });

  describe('Combinations of Mandatory Requirements', () => {
    it('applies full wheelchair persona profile strictly (step-free + elevator + power door)', () => {
      const wheelchairMandatory: MandatoryRequirements = {
        stepFree: true,
        elevatorRequired: true,
        powerDoorRequired: true,
      };

      const result = evaluateRoutes(
        'loc-center',
        'loc-library',
        wheelchairMandatory,
        defaultNoOptional
      );

      expect(result.qualifyingRoutes.length).toBeGreaterThan(0);
      result.qualifyingRoutes.forEach((route) => {
        expect(route.hasStairs).toBe(false);
        expect(route.powerDoorStatus).toBe('available');
        if (route.requiresElevator) {
          expect(route.elevatorDataStatus).toBe('available');
        }
      });
    });

    it('collects all distinct disqualification reasons when candidate routes fail multiple requirements', () => {
      const allMandatory: MandatoryRequirements = {
        stepFree: true,
        elevatorRequired: true,
        powerDoorRequired: true,
      };

      const result = evaluateRoutes(
        'loc-center',
        'loc-science',
        allMandatory,
        defaultNoOptional
      );

      // route-ccp-nsc-3 fails both elevator (unknown) and power doors (unknown)
      expect(result.unmetMandatoryReasons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Preference-Based Ranking (Soft Weights)', () => {
    it('ranks quieter route higher when quieterPaths is requested and both routes are eligible', () => {
      const mandatory: MandatoryRequirements = {
        stepFree: true,
        elevatorRequired: false,
        powerDoorRequired: false,
      };

      // Without quiet preference
      const neutralResult = evaluateRoutes('loc-center', 'loc-library', mandatory, {
        ...defaultNoOptional,
        quieterPaths: false,
      });

      // With quiet preference
      const quietResult = evaluateRoutes('loc-center', 'loc-library', mandatory, {
        ...defaultNoOptional,
        quieterPaths: true,
      });

      // Both should have qualifying routes
      expect(neutralResult.qualifyingRoutes.length).toBeGreaterThan(1);
      expect(quietResult.qualifyingRoutes.length).toBeGreaterThan(1);

      // In quietResult, the quiet route should have a higher score than in neutralResult
      const quietRouteNeutral = neutralResult.qualifyingRoutes.find((r) => r.isQuiet);
      const quietRouteBoosted = quietResult.qualifyingRoutes.find((r) => r.isQuiet);

      expect(quietRouteBoosted!.matchScore).toBeGreaterThan(quietRouteNeutral!.matchScore);
    });

    it('ranks sheltered route higher when shelteredWalkways is enabled', () => {
      const mandatory: MandatoryRequirements = {
        stepFree: true,
        elevatorRequired: false,
        powerDoorRequired: false,
      };

      const shelteredResult = evaluateRoutes('loc-center', 'loc-science', mandatory, {
        ...defaultNoOptional,
        shelteredWalkways: true,
      });

      const topRoute = shelteredResult.qualifyingRoutes[0];
      expect(topRoute.isSheltered).toBe(true);
    });

    it('never promotes an ineligible route even if its comfort characteristics are optimal', () => {
      // route-ccp-lib-3 is short (4 min), but has stairs
      const result = evaluateRoutes(
        'loc-center',
        'loc-library',
        { ...defaultNoMandatory, stepFree: true },
        { quieterPaths: true, shelteredWalkways: true, gentleSlopes: true, seatingAlongPath: true }
      );

      expect(result.qualifyingRoutes.some((r) => r.id === 'route-ccp-lib-3')).toBe(false);
    });
  });

  describe('No-Match and Edge Case Scenarios', () => {
    it('returns empty qualifying list and complete diagnostic when all candidate routes are disqualified', () => {
      // Fine Arts to Science complex route-fad-nsc-1 has stairs, route-fad-nsc-2 has unknown elevator
      const strictMandatory: MandatoryRequirements = {
        stepFree: true,
        elevatorRequired: true,
        powerDoorRequired: true,
      };

      const result = evaluateRoutes('loc-arts', 'loc-science', strictMandatory, defaultNoOptional);

      expect(result.qualifyingRoutes).toHaveLength(0);
      expect(result.disqualifiedRoutesCount).toBe(result.totalCandidateRoutes);
      expect(result.unmetMandatoryReasons.length).toBeGreaterThan(0);
    });

    it('handles identical origin and destination gracefully', () => {
      const result = evaluateRoutes(
        'loc-center',
        'loc-center',
        defaultNoMandatory,
        defaultNoOptional
      );

      expect(result.qualifyingRoutes).toHaveLength(0);
      expect(result.totalCandidateRoutes).toBe(0);
    });

    it('handles unknown origin or destination gracefully', () => {
      const result = evaluateRoutes(
        'loc-nonexistent-1',
        'loc-nonexistent-2',
        defaultNoMandatory,
        defaultNoOptional
      );

      expect(result.qualifyingRoutes).toHaveLength(0);
      expect(result.totalCandidateRoutes).toBe(0);
      expect(result.disqualifiedRoutesCount).toBe(0);
    });
  });

  describe('Reverse Route Direction Synthesis', () => {
    it('synthesizes qualifying reverse routes with inverted pathNodes and steps', () => {
      const mandatory: MandatoryRequirements = {
        stepFree: true,
        elevatorRequired: false,
        powerDoorRequired: false,
      };

      const forward = evaluateRoutes('loc-center', 'loc-library', mandatory, defaultNoOptional);
      const reverse = evaluateRoutes('loc-library', 'loc-center', mandatory, defaultNoOptional);

      expect(forward.qualifyingRoutes.length).toBeGreaterThan(0);
      expect(reverse.qualifyingRoutes.length).toBeGreaterThan(0);

      const revTop = reverse.qualifyingRoutes[0];
      expect(revTop.originId).toBe('loc-library');
      expect(revTop.destinationId).toBe('loc-center');
      expect(revTop.id).toContain('rev-');
      expect(revTop.steps[0].stepNumber).toBe(1);
    });
  });
});
