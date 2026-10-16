import React from 'react';
import { CampusLocation, RouteOption } from '../types';
import { MaterialIcon } from './MaterialIcon';

interface SchematicMapProps {
  locations: CampusLocation[];
  selectedOriginId: string;
  selectedDestinationId: string;
  activeRoute?: RouteOption;
  alternateRoutes?: RouteOption[];
  onSelectLocation?: (locationId: string) => void;
  className?: string;
}

export const SchematicMap: React.FC<SchematicMapProps> = ({
  locations,
  selectedOriginId,
  selectedDestinationId,
  activeRoute,
  alternateRoutes = [],
  onSelectLocation,
  className = '',
}) => {
  // Map dimensions viewBox 0 0 600 420
  const width = 600;
  const height = 420;

  // Convert percentage coordinates to SVG pixels
  const getCoords = (loc: CampusLocation) => ({
    x: (loc.mapCoords.x / 100) * width,
    y: (loc.mapCoords.y / 100) * height,
  });

  const originLoc = locations.find((l) => l.id === selectedOriginId);
  const destLoc = locations.find((l) => l.id === selectedDestinationId);

  // Convert route pathNodes (percentages) to SVG path d string
  const renderPathString = (nodes: { x: number; y: number }[]) => {
    if (!nodes || nodes.length < 2) return '';
    return nodes
      .map((node, i) => {
        const px = (node.x / 100) * width;
        const py = (node.y / 100) * height;
        return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
      })
      .join(' ');
  };

  return (
    <div
      className={`relative w-full rounded-xl border border-[#E3DED8] bg-[#F4F1EA] overflow-hidden select-none ${className}`}
      role="region"
      aria-label="Schematic campus wayfinding route map"
    >
      {/* Schematic Map Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-[#E3DED8] bg-[#FAF8F5] text-xs">
        <div className="flex items-center gap-1.5 font-medium text-[#17201F]">
          <MaterialIcon name="map" className="text-[#0F6B5C] text-base" />
          <span>Campus Schematic Wayfinding</span>
          <span className="text-[11px] font-normal text-[#52605E] px-1.5 py-0.5 rounded bg-[#EAE6E0]">
            Illustrative sample
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#52605E]">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3.5 h-1 rounded-full bg-[#0F6B5C]"></span>
            <span>Active Route</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-1 border-t-2 border-dashed border-[#A39E95]"></span>
            <span>Alternate</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full border border-[#0F6B5C] bg-[#E7F3F0]"></span>
            <span>Landmark</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/10] sm:aspect-[16/9] max-h-[380px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Campus Lawn Texture / Gradient */}
            <linearGradient id="quadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EDEAE2" />
              <stop offset="100%" stopColor="#E4E0D7" />
            </linearGradient>

            <pattern id="gridDots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#DDD8CE" />
            </pattern>

            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#17201F" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Background dot grid for scale and texture */}
          <rect width={width} height={height} fill="url(#gridDots)" />

          {/* Stylized Campus Zones / Soft Fills */}
          <path
            d="M 120,60 C 240,40 380,45 520,70 C 560,180 540,320 480,380 C 340,400 160,390 80,320 C 60,200 80,100 120,60 Z"
            fill="url(#quadGrad)"
            opacity="0.6"
          />

          {/* Central Lawn Circle */}
          <circle cx="280" cy="210" r="75" fill="#E8E5DD" stroke="#DDD7CC" strokeWidth="1" strokeDasharray="3 3" />
          <text x="280" y="214" textAnchor="middle" fontSize="10" fill="#888278" letterSpacing="1" fontWeight="500">
            CENTRAL QUAD
          </text>

          {/* Base Campus Walkways Network (Neutral Light Lines) */}
          <g stroke="#D4CEC4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Horizontal and cross walkways */}
            <path d="M 130,185 L 290,218 L 430,142" />
            <path d="M 290,218 L 230,327" />
            <path d="M 290,218 L 490,302" />
            <path d="M 270,75 L 290,218" />
            <path d="M 130,185 L 270,75" />
            <path d="M 270,75 L 430,142" />
            <path d="M 230,327 L 490,302" />
          </g>

          {/* Alternate Routes (Subtle dashed paths) */}
          {alternateRoutes.map((alt) => {
            const d = renderPathString(alt.pathNodes);
            if (!d) return null;
            return (
              <path
                key={alt.id}
                d={d}
                fill="none"
                stroke="#9E988D"
                strokeWidth="3.5"
                strokeDasharray="5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
            );
          })}

          {/* Active Route Highlight (Bold Deep Teal) */}
          {activeRoute && (
            <g>
              {/* Soft glow under active route */}
              <path
                d={renderPathString(activeRoute.pathNodes)}
                fill="none"
                stroke="#0F6B5C"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.18"
              />
              {/* Primary active stroke */}
              <path
                d={renderPathString(activeRoute.pathNodes)}
                fill="none"
                stroke="#0F6B5C"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Campus Location Nodes */}
          {locations.map((loc) => {
            const coords = getCoords(loc);
            const isOrigin = loc.id === selectedOriginId;
            const isDest = loc.id === selectedDestinationId;
            const isHighlighted = isOrigin || isDest;

            return (
              <g
                key={loc.id}
                transform={`translate(${coords.x}, ${coords.y})`}
                className="cursor-pointer transition-transform duration-150 hover:scale-105"
                onClick={() => onSelectLocation && onSelectLocation(loc.id)}
                role="button"
                tabIndex={0}
                aria-label={`${loc.name} (${loc.code})`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectLocation && onSelectLocation(loc.id);
                  }
                }}
              >
                {/* Node Outer Circle / Ripple if selected */}
                {isHighlighted && (
                  <circle
                    r="20"
                    fill={isDest ? '#0F6B5C' : '#1E5AA8'}
                    opacity="0.15"
                    className="animate-pulse"
                  />
                )}

                {/* Node Main Pin Circle */}
                <circle
                  r="13"
                  fill={isDest ? '#0F6B5C' : isOrigin ? '#1E5AA8' : '#FFFFFF'}
                  stroke={isDest ? '#0B5449' : isOrigin ? '#16437E' : '#B8B2A6'}
                  strokeWidth={isHighlighted ? '2.5' : '1.5'}
                  filter="url(#shadow)"
                />

                {/* Node Center Label / Code */}
                <text
                  y="4"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill={isHighlighted ? '#FFFFFF' : '#17201F'}
                  letterSpacing="0.5"
                >
                  {loc.code}
                </text>

                {/* Location Name Pill Tag */}
                <g transform="translate(0, 22)">
                  <rect
                    x={-loc.name.length * 3.2 - 6}
                    y="-9"
                    width={loc.name.length * 6.4 + 12}
                    height="18"
                    rx="9"
                    fill={isHighlighted ? '#17201F' : '#FFFFFF'}
                    stroke={isHighlighted ? '#17201F' : '#D4CEC4'}
                    strokeWidth="1"
                    filter="url(#shadow)"
                  />
                  <text
                    y="3"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight={isHighlighted ? '600' : '500'}
                    fill={isHighlighted ? '#FFFFFF' : '#17201F'}
                  >
                    {loc.name}
                  </text>
                </g>

                {/* Start / Finish Flag Indicator */}
                {isOrigin && (
                  <g transform="translate(0, -22)">
                    <rect x="-18" y="-7" width="36" height="14" rx="4" fill="#1E5AA8" />
                    <text y="3" textAnchor="middle" fontSize="8" fontWeight="700" fill="#FFFFFF">
                      START
                    </text>
                  </g>
                )}
                {isDest && (
                  <g transform="translate(0, -22)">
                    <rect x="-24" y="-7" width="48" height="14" rx="4" fill="#0F6B5C" />
                    <text y="3" textAnchor="middle" fontSize="8" fontWeight="700" fill="#FFFFFF">
                      DESTINATION
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Schematic Map Footer Info */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#E3DED8] bg-[#FAF8F5] text-xs text-[#52605E]">
        <div className="flex items-center gap-1 truncate">
          <MaterialIcon name="pin_drop" className="text-[#0F6B5C] text-sm shrink-0" />
          <span className="truncate">
            From <strong className="text-[#17201F]">{originLoc?.name ?? 'Start'}</strong> to{' '}
            <strong className="text-[#17201F]">{destLoc?.name ?? 'Destination'}</strong>
          </span>
        </div>
        <span className="text-[11px] shrink-0 text-[#888278]">Schematic view • Click node to inspect</span>
      </div>
    </div>
  );
};
