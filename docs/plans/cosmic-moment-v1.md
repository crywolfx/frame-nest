# Cosmic Moment WebGL Product V1 Plan

## Repository Read

- Repository: `/Users/mili/code/frame-nest`
- Branch state at planning time: `main...origin/main`; existing untracked file `.codex-cosmic-moment-plan-prompt.md` should be left alone.
- Package manager: npm, confirmed by `package-lock.json` and `.npmrc`.
- Framework: Next.js App Router on React 19 with TypeScript strict mode.
- Deployment target: Cloudflare Workers through OpenNext. `package.json` uses `next build && opennextjs-cloudflare build --skipNextBuild`.
- Current scripts:
  - `npm run dev`
  - `npm run check`
  - `npm run build`
  - `npm run preview`
  - `npm run deploy`
- Current dependencies of note:
  - `motion` is already available and should be used for interface/product-site motion.
  - `leaflet` and `react-parallax-tilt` are travel-page-specific and should not shape this feature.
  - No Three.js, react-three-fiber, icon, or browser-test dependency exists yet.
- App structure:
  - `app/page.tsx`: current home page, static server component.
  - `app/layout.tsx`: root metadata and global CSS import.
  - `app/globals.css`: large shared stylesheet with existing responsive rules and animations.
  - `app/travel/**`: existing client-heavy travel experience with `motion/react` and dynamic browser-only Leaflet usage.
  - `src/`: currently empty.
- Styling convention:
  - Existing pages use handcrafted CSS, responsive grid layouts, 8px cards for repeated panels, and global animation keyframes.
  - For this V1, avoid adding thousands of lines to `app/globals.css`; use a CSS module colocated with the feature unless route-level global selectors are truly needed.

## Product Direction

Build `/cosmic-moment` as a usable first-screen product, not a marketing-only landing page. The first viewport should be a full-bleed interactive WebGL solar-system studio with restrained premium controls layered around it.

Visual direction: "private solar observatory plus editorial poster lab." The dominant experience is black space, warm solar gold, lunar ivory, instrument green, and small red/cyan status accents. Avoid generic purple-blue gradients and avoid card-heavy landing-page composition. The WebGL universe is the primary visual asset.

V1 should feel complete enough to use:

- Browse a solar-system scene in 3D.
- Select time to the second.
- Pause/resume simulated time and accelerate it.
- Click bodies and smoothly fly camera focus.
- Switch viewpoints.
- Compose a poster from the current view and text settings.
- Batch-generate multiple poster images client-side.

Astrophysics should be plausible and beautiful, not observatory-grade. The implementation should be concise, typed, and local to this route.

## Dependencies To Add

Runtime:

- `three`: core WebGL renderer and math primitives.
- `@react-three/fiber`: React renderer for Three.js, keeps WebGL scene integrated with React state.
- `@react-three/drei`: `OrbitControls`, labels/html helpers if needed, camera helpers, and pragmatic R3F utilities.
- `lucide-react`: icons for control buttons and toolbars, matching frontend UI guidance.

Dev/test:

- `@playwright/test`: browser smoke checks for desktop/mobile layout and WebGL canvas nonblank capture. This repo has no current browser-test setup, and WebGL needs at least one automated visual smoke test.

Use existing:

- `motion`: product-site transitions, panel entrance, viewpoint/poster state transitions.
- Native Canvas 2D APIs: poster export and text composition, avoiding another screenshot dependency.
- Native Date APIs: sufficient for V1 input precision and deterministic simulation.

Avoid for V1:

- No backend storage.
- No ephemeris API.
- No image-generation API.
- No zip dependency unless browser multi-download proves unusable. Batch can generate sequential PNG downloads or one-by-one previews.
- No global state library. React `useReducer`, refs, and small hooks are enough.

Install command for implementation phase:

```bash
npm install three @react-three/fiber @react-three/drei lucide-react
npm install -D @playwright/test
```

## Route And File Plan

Create a feature-isolated route:

- `app/cosmic-moment/page.tsx`
  - Server component.
  - Route metadata.
  - Dynamic import of the client app with SSR disabled if needed.

- `app/cosmic-moment/CosmicMomentApp.tsx`
  - Main client shell.
  - Owns simulation state, selected body, selected view, poster config, and batch config.
  - Coordinates canvas capture through a ref exposed by `UniverseCanvas`.

- `app/cosmic-moment/cosmic.module.css`
  - Route-scoped layout, control panels, mobile layout, poster controls, reduced motion styles.
  - Keep stable dimensions for toolbar buttons, segmented controls, output preview, and canvas area.

Scene and simulation:

- `app/cosmic-moment/components/UniverseCanvas.tsx`
  - Client component wrapping `<Canvas>`.
  - Sets renderer options, camera, orbit controls, scene lighting, and render loop.
  - Exposes imperative methods:
    - `focusBody(bodyId)`
    - `applyView(viewId)`
    - `captureFrame(options): Promise<HTMLCanvasElement | HTMLImageElement | string>`
  - Handles pointer selection and camera fly-to.

- `app/cosmic-moment/components/SolarSystemScene.tsx`
  - Pure R3F scene: Sun, planets, Moon, orbit rings, labels, star field.
  - Receives computed body positions and selected state.

- `app/cosmic-moment/components/BodyMesh.tsx`
  - Reusable mesh for Sun/planet/moon body rendering.
  - Keeps geometry/material choices simple and mobile-aware.

- `app/cosmic-moment/components/OrbitPath.tsx`
  - Renders orbit lines from sampled positions.

- `app/cosmic-moment/components/StarField.tsx`
  - Deterministic point cloud or instanced tiny spheres with a fixed seed.

Controls and product site UI:

- `app/cosmic-moment/components/ControlDeck.tsx`
  - Date/time input, pause/resume, speed control, body selector, view presets.
  - Uses icon buttons where commands are visual.

- `app/cosmic-moment/components/ViewPresetBar.tsx`
  - Free view, Earth view, Moon view, Sun view, Earth-to-Moon, Moon-to-Earth, overview, top, cinematic.

- `app/cosmic-moment/components/TimelineControl.tsx`
  - `datetime-local` with `step={1}`, pause, current simulated UTC/local display, speed segmented control.

- `app/cosmic-moment/components/PosterComposer.tsx`
  - Text content, font, color, size, alignment, normalized x/y position, layout preset, output ratio/dimensions, generate button.

- `app/cosmic-moment/components/BatchPanel.tsx`
  - Textarea or table-like rows for `datetime | text | view`.
  - Shared font/position/size/ratio settings.
  - Sequential generate-all button and progress.

Logic:

- `app/cosmic-moment/lib/bodies.ts`
  - Typed body catalog: Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune.
  - Radius, visual scale, color/material hints, orbital period, semi-major scene radius, inclination, phase offset, rotation period.

- `app/cosmic-moment/lib/orbits.ts`
  - Deterministic approximate orbital mechanics.
  - `getSolarSystemState(date: Date): BodyState[]`.
  - `sampleOrbit(bodyId, count): Vector3-like[]`.

- `app/cosmic-moment/lib/time.ts`
  - Parse/format datetime-local strings with seconds.
  - Simulation tick math.
  - Speed presets.

- `app/cosmic-moment/lib/views.ts`
  - Viewpoint definitions and camera target/position derivation from current body positions.

- `app/cosmic-moment/lib/poster.ts`
  - Output ratio presets.
  - Canvas 2D composition: draw WebGL snapshot, cover/crop to output, draw text with layout preset.
  - `downloadBlob(filename, blob)`.

- `app/cosmic-moment/lib/types.ts`
  - Shared narrow types to keep component props clean.

Optional home integration:

- `app/page.tsx`
  - Add a link to `/cosmic-moment` in the existing recent/content section after the route works.
  - Keep this edit small.

Testing:

- `tests/cosmic-moment.spec.ts`
  - Playwright smoke test after implementation:
    - Opens `/cosmic-moment`.
    - Asserts the app title/control deck is visible.
    - Waits for a canvas.
    - Checks canvas dimensions are nonzero.
    - Reads a small center pixel/region through `page.evaluate` to ensure the WebGL canvas is not fully blank.
    - Runs at desktop and mobile viewport sizes.

- `playwright.config.ts`
  - Minimal config if adding Playwright.
  - Use `webServer` with `npm run dev -- --hostname 127.0.0.1 --port 3000`.

## Simulation Model

V1 model should be approximate, deterministic, and visually stable.

Use a heliocentric simplified model:

- Reference epoch: J2000-like timestamp, e.g. `2000-01-01T12:00:00Z`.
- For each planet:
  - Mean angle = `phaseAtEpoch + daysSinceEpoch / orbitalPeriodDays * TAU`.
  - Use circular or mildly elliptical orbit in the XZ plane.
  - Apply inclination by rotating the orbit position around X.
  - Apply visual spacing scale, not real astronomical scale.
- Sun at origin.
- Moon:
  - Geocentric position around Earth using 27.321661 day sidereal orbit.
  - Slight inclination.
  - Scene distance large enough to inspect but small enough to keep Earth/Moon viewpoint useful.
- Rotations:
  - Rotate each body around its own axis using approximate rotation periods.
  - Use slower visual rotation if real period creates unreadable movement.

Data shape example:

```ts
type BodyDefinition = {
  id: BodyId;
  name: string;
  parentId?: BodyId;
  radius: number;
  visualRadius: number;
  orbitRadius: number;
  orbitPeriodDays: number;
  rotationPeriodHours: number;
  inclinationDeg: number;
  phaseDeg: number;
  color: string;
};
```

This can later be swapped for higher-fidelity orbital elements without changing the UI.

## Moon Phase

Do not use fixed moon-phase image sets.

Implement the Moon as a real lit sphere in the scene:

- Sun is the light source.
- Moon material responds to scene lighting.
- In Earth view, the camera looks from near Earth toward the Moon, so the rendered Moon naturally shows its phase based on Sun/Moon/Earth geometry.
- For poster generation, capture the same rendered view instead of drawing a fixed moon asset.

Optional V1 polish:

- Compute a phase fraction and label from vectors:
  - `sunToMoon`
  - `earthToMoon`
  - angle between light direction and view direction
- Display phase name as small metadata, but keep the visual phase generated by the 3D model.

## Time Controls

Use a single simulation timestamp in state:

- `baseDate`: Date selected by user.
- `isPaused`: boolean.
- `speed`: numeric multiplier.
- `lastTick`: browser time.

When running:

- Each animation/timer tick advances simulation date by elapsed real milliseconds times `speed`.
- Minimum speed is real-time `1x`.
- Faster presets should be useful and not excessive:
  - `1x`, `60x`, `3600x`, `86400x`, `604800x`
  - Labels: Real, Minute/sec, Hour/sec, Day/sec, Week/sec.

Date input:

- Use `<input type="datetime-local" step={1}>`.
- Preserve seconds in parse/format.
- Treat user input as local time for UI friendliness.
- Display an ISO/UTC readout in metadata so exported posters are unambiguous.

When the user edits the timestamp:

- Pause simulation while typing or commit on blur/change.
- Recompute positions immediately.
- Keep selected body and selected viewpoint.

## Camera And Viewpoints

Use `OrbitControls` for free rotate/zoom/pan.

Camera behavior:

- Default overview: camera at an angled solar-system view looking at the Sun.
- Clicking a body:
  - Set selected body.
  - Compute focus target from body position.
  - Move camera to a nearby offset based on body visual radius.
  - Animate camera position and controls target with a small custom lerp loop or `useFrame`.
  - Temporarily enlarge visual emphasis with a halo/ring/label rather than changing orbital data.

View presets:

- `free`: Leaves OrbitControls enabled and preserves current camera.
- `earth`: Camera near Earth looking outward with Earth foreground or target.
- `moon`: Camera near Moon looking at Earth/Sun relationship.
- `sun`: Camera near Sun looking across inner planets.
- `earthToMoon`: Camera just above Earth looking at Moon.
- `moonToEarth`: Camera just above Moon looking at Earth.
- `overview`: Angled all-system view.
- `top`: Orthographic-feeling top-down solar-system view using perspective camera at high Y.
- `cinematic`: Slow autorotating overview around selected body or inner solar system.

Implementation should define presets as functions of current `BodyState[]`, not hard-coded positions. This keeps them valid for any selected timestamp.

## Poster Generation

Keep V1 fully browser-side.

Output ratios:

- `1:1`: 1080 x 1080 default.
- `4:5`: 1080 x 1350 default.
- `9:16`: 1080 x 1920 default.
- `16:9`: 1920 x 1080 default.
- `custom`: width/height numeric inputs, clamped to a sane range.

Recommended clamps:

- Minimum: 512 px.
- Maximum: 4096 px per side on desktop.
- Mobile maximum: 2048 px per side, or warn/auto-clamp.

Capture approach:

1. Use the current WebGL canvas with `preserveDrawingBuffer: true`.
2. On generate, request a fresh render at the selected timestamp/view.
3. Read the canvas as a PNG/data URL or draw it directly into an export canvas.
4. Create an offscreen `<canvas>` at output dimensions.
5. Draw WebGL snapshot using CSS-like `cover` crop.
6. Draw optional gradient/text readability scrim from layout preset.
7. Draw user text with Canvas 2D:
   - content
   - font family
   - color
   - size
   - x/y position
   - max width
   - alignment
   - line height
8. Add optional small metadata line: selected date, body/view.
9. Convert to blob and download.

Text customization:

- Content textarea.
- Font select:
  - `Avenir Next`
  - `Georgia`
  - `Times New Roman`
  - `Helvetica Neue`
  - `PingFang SC`
  - `monospace`
- Color picker and alpha-safe text color.
- Size slider/input.
- Position controls as percentage x/y.
- Alignment segmented control.
- Layout presets:
  - Lower left editorial.
  - Center title.
  - Upper right timestamp.
  - Full bleed quiet caption.

Avoid external font downloads for V1 to keep Cloudflare/browser output deterministic.

## Batch Generation

No backend for V1.

Pragmatic browser-only flow:

- User enters rows in a textarea:
  - `2026-05-13 21:30:15 | The night we looked up | earthToMoon`
  - `2026-06-01 00:00:00 | June sky | overview`
- Parser supports:
  - ISO-like datetime.
  - text.
  - optional viewpoint.
  - optional body if useful.
- Shared settings:
  - output ratio/dimensions
  - font
  - text size
  - text color
  - position
  - layout preset
- Generate all:
  - Iterate rows sequentially.
  - Set timestamp and viewpoint.
  - Wait for camera/render settle.
  - Compose and download PNG.
  - Show progress and errors.

Browser download limits vary, so V1 should also allow "Generate current row" and a visible result count. Skip zip unless there is time after the core experience is solid.

## Layout Plan

Desktop:

- Full viewport WebGL scene as the main layer.
- Top nav: brand, route links, compact status.
- Left/bottom control deck for time, speed, pause, body selection.
- Right poster composer panel.
- Bottom preset rail for viewpoints.
- Product-site content can continue below the first viewport with concise feature bands, but the first screen remains the actual tool.

Mobile H5:

- Canvas remains first and large, at least 58svh.
- Controls collapse into bottom sheets/tabs:
  - Time
  - View
  - Poster
  - Batch
- Icon toolbar uses stable square tap targets.
- Avoid hover-only interactions.
- Text must not overlap or exceed controls; use constrained panel heights and scrolling inside sheets.
- Use `svh`/safe-area padding for iOS browser chrome.

Accessibility:

- All icon buttons need labels/title.
- Date, speed, color, size, and position inputs need labels.
- Keyboard focus styles.
- `prefers-reduced-motion`:
  - Reduce product-site animations.
  - Keep canvas interactive, but disable cinematic auto camera movement.

## Performance Constraints

Mobile first constraints:

- Keep the body count small: Sun, 8 planets, Moon.
- Use procedural colors/materials rather than large texture assets in V1.
- Use one deterministic star point cloud, not many DOM elements.
- Use orbit rings as line geometry with fixed samples.
- Limit device pixel ratio:
  - Desktop: max 2.
  - Mobile: max 1.5.
- Use lower sphere segments on small screens:
  - Desktop: 48-64 segments for main bodies.
  - Mobile: 24-32 segments.
- Avoid heavy postprocessing/bloom in V1. Simulate glow with transparent meshes/CSS overlays where cheap.
- Do not rerender React controls every frame; keep simulation tick and canvas refs separated where possible.
- Pause simulation and camera auto motion when tab is hidden.
- Keep labels sparse on mobile.
- Dispose geometries/materials only if dynamically creating/removing many items; prefer memoized static geometry.

Cloudflare/Next constraints:

- WebGL components must be client-only.
- Avoid referencing `window`, `document`, `ResizeObserver`, or WebGL APIs during server render.
- Dynamic import `UniverseCanvas` if SSR issues appear.
- Keep route bundle isolated by placing Three imports under `/app/cosmic-moment`.

## State Shape

Use a small reducer in `CosmicMomentApp`:

```ts
type AppState = {
  currentDate: Date;
  paused: boolean;
  speed: TimeSpeed;
  selectedBodyId: BodyId;
  selectedViewId: ViewPresetId;
  poster: PosterConfig;
  batch: BatchConfig;
};
```

Keep high-frequency animation state in refs inside `UniverseCanvas`, not in React state.

Derived data:

- `bodyStates = useMemo(() => getSolarSystemState(currentDate), [currentDate])`
- View camera targets derived from `bodyStates`.

## Implementation Sequence For Next Phase

1. Install dependencies.
2. Add typed orbit/time/view/poster utilities.
3. Add `/cosmic-moment` route with client shell and CSS module.
4. Build the R3F scene:
   - Sun, planets, Moon, orbit rings, star field.
   - Orbit controls.
   - Selection and camera fly-to.
5. Add timeline controls:
   - Date/time to seconds.
   - Pause/resume.
   - Speed presets.
6. Add view presets:
   - Free, Earth, Moon, Sun, Earth-to-Moon, Moon-to-Earth, overview, top, cinematic.
7. Add poster composer and single export.
8. Add batch parser and sequential generation.
9. Add mobile bottom-sheet/tabs and responsive CSS.
10. Add optional home link to `/cosmic-moment`.
11. Add Playwright smoke test and minimal config.
12. Run verification.
13. Commit and push automatically.

## Verification Commands

After implementation:

```bash
npm install
npm run check
npm run build
```

Local interactive verification:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Browser checks:

- Desktop viewport: `/cosmic-moment` loads, canvas nonblank, rotate/zoom/pan works.
- Mobile viewport: controls fit, no text overlap, bottom sheets usable.
- Click Earth/Moon/Sun: camera flies and focuses.
- Date/time input with seconds changes positions.
- Pause/resume and speed changes advance simulation.
- Moon phase changes visibly when date changes.
- Each viewpoint preset applies.
- Poster export downloads PNG at selected ratio.
- Batch generation produces multiple PNGs without crashing.

If Playwright is added:

```bash
npx playwright test
```

Final git steps for implementation phase:

```bash
git status --short
git add package.json package-lock.json app/cosmic-moment app/page.tsx tests playwright.config.ts
git commit -m "Build cosmic moment WebGL experience"
git push origin main
```

Adjust `git add` paths to match actual changed files, and do not add unrelated untracked files such as `.codex-cosmic-moment-plan-prompt.md` unless explicitly requested.

## Risks And Mitigations

- WebGL SSR failure:
  - Keep all Three/R3F imports in client components and use dynamic import with SSR disabled if needed.

- Poster export reads a stale frame:
  - Force view/date update, wait for one or two animation frames, then capture.

- `preserveDrawingBuffer` performance cost:
  - Accept for V1 because export is core; keep scene lightweight. If needed, enable only during capture in a later version.

- Batch downloads blocked:
  - Provide per-row generation and progress. Sequential downloads with user initiation should work well enough for V1.

- Mobile performance:
  - Clamp DPR, reduce geometry segments, limit labels, avoid postprocessing.

- Orbital accuracy expectations:
  - UI copy should say approximate/poetic solar-system model if visible. Internally keep code structured so a future ephemeris model can replace the current model.

## Definition Of Done

- `/cosmic-moment` is a polished, responsive WebGL product tool.
- Solar system can be browsed freely with orbit/pan/zoom.
- Clicking a body smoothly focuses the camera.
- Date/time input supports seconds and updates the model.
- Pause/resume and speed presets work from real-time upward.
- Moon phase is visually generated by 3D lighting/view geometry.
- All required viewpoint presets exist.
- Poster composer exports PNGs in required ratios/custom size.
- Batch generation concept works client-side for multiple date/text rows.
- Mobile H5 layout is usable and visually polished.
- `npm run check`, `npm run build`, and browser smoke verification pass.
- Implementation commit is pushed to `origin/main` in the next phase.
