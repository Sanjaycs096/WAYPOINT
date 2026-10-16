# Waypoint — Accessible Campus Navigation

Waypoint is an accessibility-first campus wayfinding web application built to help university students explore and compare walking routes based on physical mobility requirements, sensory thresholds, and personal comfort factors—not transit speed alone.

---

## Product Mission & Core Scope

Conventional navigation systems routinely route individuals down steep staircases, through unpaved alleys, or into buildings without automated entryways. Waypoint balances **hard accessibility eligibility filters** with **soft comfort preferences**, ensuring users are never directed into inaccessible barriers.

Waypoint operates within a focused **six-screen scope**:

1. **Screen 1: Plan** — Origin & destination selection, sample persona presets (Wheelchair User, Sensory Sensitive, Temporary Injury), and independent configuration of mandatory access constraints versus comfort preferences.
2. **Screen 2: Route Results & Comparison** — Side-by-side comparison of qualified paths, ranking indicators, route trade-offs, schematic campus map visualization, and explicit exclusion counts for inaccessible paths.
3. **Screen 3: Route Guidance** — Step-by-step turn guidance with surface textures, slope gradients, crowd noise levels, advance cautions, keyboard controls, and arrival celebration.
4. **Screen 4: Location Details** — Granular facility accessibility profiles detailing documented entry types, power automated door availability, elevator operational status, accessible single-occupancy restrooms, and quiet study areas.
5. **Screen 5: Default Preferences** — Custom default rules persisted strictly to local browser storage (`localStorage`) without server-side tracking or external accounts.
6. **Screen 6: About & Data Transparency** — Full methodology disclosure, synthetic sample data boundaries, and WCAG 2.1 AA design target documentation.

---

## Locked Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens (`--color-canvas`, `--color-action`, `--color-warning`, etc.)
- **Typography**: Inter (Body) & Bricolage Grotesque (Headings) via Google Fonts
- **Iconography**: Google Material Symbols Outlined exclusively (`material-symbols-outlined`)
- **Unit Testing**: Vitest
- **End-to-End Testing**: Playwright
- **Continuous Integration**: GitHub Actions CI (`.github/workflows/ci.yml`)
- **State & Storage**: Client-side React state + browser `localStorage`
- **Data**: Local deterministic representative campus sample data (`src/data/campusData.ts`)

> **Note**: No backend servers, external paid APIs, live GPS tracking, or third-party tracking scripts are used.

---

## Routing Engine & Decision Logic

Waypoint enforces strict safety rules in its deterministic routing evaluator (`src/utils/routing.ts`):

1. **Hard Eligibility Constraints**:
   - `stepFree`: Disqualifies any path containing exterior or interior stairs, curbs, or unpaved sections at both the route and individual step levels.
   - `elevatorRequired`: Disqualifies paths requiring vertical travel where elevator status is absent or unknown.
   - `powerDoorRequired`: Disqualifies building entries requiring manual pull force or where automation data is unknown.
2. **Handling of Unknown Critical Data**:
   - **Zero-Assumption Safety**: Unverified or unknown access records are treated as strictly ineligible under corresponding mandatory requirements.
3. **Soft Ranking Factors**:
   - Comfort criteria (`quieterPaths`, `shelteredWalkways`, `gentleSlopes`, `seatingAlongPath`) apply *only* after physical eligibility is verified, influencing the recommendation score without eliminating viable alternatives.
4. **Preset Transparency**:
   - Persona presets configure controls transparently with live status announcements. Comfort presets (e.g., Sensory Sensitive) **never silently weaken or deactivate** existing mandatory safety rules.
5. **No-Match Diagnostics**:
   - When no path satisfies 100% of declared mandatory requirements, a dedicated barrier inspection state details the specific physical impediments detected in the sample records and offers actionable adjustment paths.

---

## Accessibility & Responsive Design

Waypoint treats **WCAG 2.1 AA** as a foundational design target:

- **Keyboard Navigation**: Full keyboard operability across all flows; `Tab`, `Shift+Tab`, `Space`, `Enter`, and Arrow keys (`ArrowLeft`/`ArrowRight` in Route Guidance).
- **Focus Management**: Visible high-contrast focus rings (`outline: 2px solid #0F6B5C; outline-offset: 2px`).
- **Touch Targets**: Minimum 44×44px interactive bounding boxes across primary buttons, navigation items, checkboxes, and map pins.
- **Screen Reader Announcements**: Strategic `aria-live="polite"` and `aria-live="assertive"` regions for preset activations, step transitions, route selections, and storage feedback.
- **Color Independence**: Status, trade-offs, and eligibility are always communicated through text, metrics, and iconography, never color alone.
- **Responsive Viewport Support**: Verified across Desktop (1440px), Tablet (768px), Mobile (390px), and Narrow Mobile (320px) with zero horizontal overflow (`scrollWidth <= window.innerWidth`).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- `npm` (version 9 or higher)

### Installation

```bash
### One-Click Windows Startup (Batch Launcher)

For Windows users, a convenient launcher script is provided at the repository root:

1. Double-click `start-waypoint.bat` in File Explorer, or run it from Command Prompt:
   ```cmd
   start-waypoint.bat
   ```
2. The launcher automatically:
   - Verifies that Node.js and npm are installed on your system PATH.
   - Detects if `node_modules` are missing and offers a clean automatic install via `npm ci` / `npm install`.
   - Confirms that Waypoint is a pure client-side application (no backend or database required).
   - Starts the local Vite development server on port 3000 (`http://localhost:3000`).
   - Keeps the terminal window open to display logs and real-time status.

---

### Manual Setup & Startup

If you prefer manual command-line execution:

```bash
# Clone or enter the repository directory
cd waypoint

# Install dependencies cleanly
npm install

# Start local development server
npm run dev
```

Open your browser at: `http://localhost:3000`

### Building for Production

```bash
# Run production bundle build
npm run build

# Preview production build locally
npm run preview
```

---

## Testing Suite

Waypoint includes automated test coverage spanning unit testing and end-to-end browser journeys:

### 1. Unit Tests (Vitest)

Validates deterministic routing filters, unknown data handling, multi-constraint combinations, soft scoring, reverse route synthesis, and localStorage error boundaries:

```bash
npm test
```

### 2. End-to-End Tests (Playwright)

Validates all 6 user journeys, persona presets, validation handling, no-match diagnostics, keyboard navigation, and responsive viewport sizing across 4 device profiles (Desktop 1440, Tablet 768, Mobile 390, Narrow Mobile 320):

```bash
# Run full Playwright test suite
npm run test:e2e

# Or run with UI mode
npx playwright test --ui
```

### 3. TypeScript Typechecking

```bash
npm run lint
```

---

## Representative Sample Data Disclosure & Limitations

1. **Synthetic Demonstration Data**: All campus locations, pathways, ramp grades, door types, elevator records, and noise levels are synthetic representative sample data curated for UI/UX demonstration.
2. **No Real-Time Telemetry**: This prototype does not connect to live campus facility sensors or real-time elevator breakdown monitoring APIs.
3. **No Live GPS**: Waypoint provides user-directed, manual turn-by-turn guidance without tracking live device coordinates.
4. **Audit Target**: WCAG 2.1 AA is an intentional engineering target for this prototype and does not constitute a legal or third-party certified accessibility audit.

---

## Project Structure

```
waypoint/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow
├── e2e/
│   ├── accessibility-responsive.spec.ts # Responsive viewports & a11y tests
│   └── user-journey.spec.ts     # 7 complete end-to-end user journeys
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Global navigation with responsive breakpoints
│   │   ├── MaterialIcon.tsx     # Google Material Symbols helper
│   │   └── SchematicMap.tsx     # Interactive SVG campus map
│   ├── data/
│   │   └── campusData.ts        # Representative campus locations & paths
│   ├── screens/
│   │   ├── ScreenPlan.tsx           # Screen 1: Route planning & presets
│   │   ├── ScreenRouteResults.tsx   # Screen 2: Comparison & no-match states
│   │   ├── ScreenRouteGuidance.tsx  # Screen 3: Turn guidance & arrival
│   │   ├── ScreenLocationDetails.tsx# Screen 4: Facility accessibility
│   │   ├── ScreenPreferences.tsx    # Screen 5: Local storage defaults
│   │   └── ScreenAbout.tsx          # Screen 6: Methodology & disclaimers
│   ├── types/
│   │   └── index.ts             # Strict TypeScript definitions
│   ├── utils/
│   │   ├── routing.ts           # Deterministic routing logic
│   │   ├── routing.test.ts      # Routing test suite (15 tests)
│   │   ├── storage.ts           # LocalStorage preference manager
│   │   └── storage.test.ts      # Storage test suite (5 tests)
│   ├── App.tsx                  # Root state & navigation coordinator
│   ├── index.css                # Tailwind design tokens & accessible styles
│   └── main.tsx                 # Entry point
├── index.html                   # HTML document & Google Fonts imports
├── package.json                 # Project dependencies & scripts
├── playwright.config.ts         # Multi-viewport Playwright configuration
├── start-waypoint.bat           # Windows double-click local launcher
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite bundler configuration
```

---

## License

This project is licensed under the [MIT License](LICENSE).

