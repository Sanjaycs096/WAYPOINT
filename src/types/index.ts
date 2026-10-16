/**
 * Waypoint Type Definitions
 * Accessibility-first campus wayfinding
 */

export interface MandatoryRequirements {
  stepFree: boolean;          // Strict requirement: zero stairs, curbs, or unpaved barriers
  elevatorRequired: boolean;  // Strict requirement: operational elevator for any elevation change
  powerDoorRequired: boolean; // Strict requirement: power automated doors at building entries
}

export interface OptionalPreferences {
  quieterPaths: boolean;      // Prioritize low-auditory & low-crowd corridors
  shelteredWalkways: boolean; // Prioritize covered arcades or indoor skywalks
  gentleSlopes: boolean;      // Prioritize flat grade / avoid steeper ramps
  seatingAlongPath: boolean;  // Prioritize paths with benches within short intervals
}

export interface UserPreferences {
  mandatory: MandatoryRequirements;
  optional: OptionalPreferences;
}

export interface EntranceDetail {
  id: string;
  name: string;
  type: 'At Grade' | 'Ramp Access' | 'Stairs Only';
  powerDoor: 'Available' | 'Manual Only' | 'Access information unknown';
  primary: boolean;
}

export interface VerticalAccessDetail {
  id: string;
  name: string;
  type: 'Passenger Elevator' | 'Freight Elevator' | 'Stairs Only';
  status: 'Operational in sample data' | 'Access information unknown' | 'None';
  floorsServed: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  category: 'Academic' | 'Student Life' | 'Library' | 'Arts' | 'Administration';
  zone: 'Central Quad' | 'North Campus' | 'West Campus' | 'South Campus';
  description: string;
  mapCoords: { x: number; y: number }; // Percentage 0-100 for schematic map
  entrances: EntranceDetail[];
  verticalAccess: VerticalAccessDetail[];
  accessibleRestrooms: string;
  quietRestAreas: string;
  knownLimitations: string[];
}

export interface RouteStep {
  id: string;
  stepNumber: number;
  instruction: string;
  distanceMeters: number;
  estimatedMinutes: number;
  surfaceType: string;         // e.g. "Smooth poured concrete", "Indoor terrazzo"
  slopeProfile: string;        // e.g. "Flat grade (0-1%)", "Gentle ramp (1:20)"
  noiseLevel: 'Quiet' | 'Moderate' | 'Active';
  cautionAlert?: string;       // e.g. "Caution: Manual heavy exterior door"
  isIndoor: boolean;
  hasStairs: boolean;
  requiresElevator: boolean;
  elevatorStatus: 'available' | 'unknown' | 'none';
  powerDoorStatus: 'available' | 'unknown' | 'none';
  hasSeating: boolean;
}

export interface RouteOption {
  id: string;
  originId: string;
  destinationId: string;
  name: string;
  tag: string;
  totalTimeMinutes: number;
  totalDistanceMeters: number;
  recommendationReason: string;
  tradeOff: string;
  steps: RouteStep[];
  pathNodes: { x: number; y: number }[]; // Coordinates for schematic SVG route line
  hasStairs: boolean;
  requiresElevator: boolean;
  elevatorDataStatus: 'available' | 'unknown' | 'none';
  powerDoorStatus: 'available' | 'unknown' | 'none';
  isSheltered: boolean;
  isQuiet: boolean;
  hasGentleSlope: boolean;
  hasFrequentSeating: boolean;
  matchScore: number;
}

export type ScreenType = 
  | 'plan'
  | 'results'
  | 'guidance'
  | 'location-details'
  | 'preferences'
  | 'about';
