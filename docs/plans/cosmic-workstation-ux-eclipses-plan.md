# Cosmic Workstation UX And Eclipse Plan

## Scope

This is a planning-only document for `/Users/mili/code/frame-nest`. No application code should be changed during this phase.

Current repository state observed during planning:

- Branch: `main...origin/main`
- Existing untracked file: `.codex-plan-cosmic-workstation-ux-eclipses.md`; leave it untouched.
- Main route: `app/cosmic-moment/page.tsx`
- Client shell: `app/cosmic-moment/CosmicMomentApp.tsx`
- WebGL scene and camera: `app/cosmic-moment/components/UniverseCanvas.tsx`
- Route styles: `app/cosmic-moment/cosmic.module.css`
- Orbit/time/types logic: `app/cosmic-moment/lib/orbits.ts`, `app/cosmic-moment/lib/time.ts`, `app/cosmic-moment/lib/types.ts`

The coding phase must preserve the current product goal: a usable first-screen WebGL workstation, not a marketing page.

## A. PC Copy Blocking The Model

### Current DOM And CSS

The text reported by the user is rendered in `CosmicMomentApp.tsx`:

- `p`: `太阳系海报工作台`
- `h1`: `把重要的一秒，定格成一片真实的星空。`
- Wrapper: `<motion.section className={styles.heroCopy}>`

Current desktop CSS in `cosmic.module.css`:

- `.heroCopy`
  - `left: clamp(456px, 31vw, 560px)`
  - `bottom: clamp(132px, 16vh, 190px)`
  - `width: min(620px, calc(100vw - 950px))`
  - `pointer-events: none`
- `.heroCopy h1`
  - `font-size: clamp(2.8rem, 5.4vw, 6.1rem)`
  - `line-height: 0.92`

This puts very large editorial copy directly inside the canvas viewport on wide screens. It is hidden only below `1280px`, but on PC screens above that breakpoint it can cover the solar-system model and pull focus away from the workstation.

### Layout Goal

The canvas/model should remain the primary visual object. Brand/explanatory copy should become secondary, readable, and spatially predictable.

### Desktop Plan

1. Replace the hero-scale desktop treatment with a compact workstation title block.
   - Keep it in `heroCopy` for minimal code churn.
   - Move it near the upper-left content lane under the nav, or into a slim translucent status card that does not sit over the central model.
   - Suggested placement: `left: 22px`, `top: 76px`, width around `min(360px, 28vw)`.
   - Keep `pointer-events: none` unless the block gains interactive controls.

2. Reduce type scale on desktop.
   - Eyebrow: around `0.68rem` to `0.74rem`, less letter spacing than current `0.18em`.
   - H1: around `clamp(1.1rem, 1.6vw, 1.8rem)` with `line-height: 1.12`.
   - This preserves brand context without competing with planets.

3. Reserve the canvas center for the model.
   - Avoid placing copy in the horizontal center band where camera presets target the Sun/Earth/Moon.
   - Do not add a large floating card in the middle of the viewport.
   - If a card treatment is used, keep it small, 8px radius, and low opacity.

4. Use z-index intentionally.
   - Keep controls/copy above canvas at `z-index: 2`.
   - Keep `.shell::after` `pointer-events: none` and avoid raising it above controls.
   - Ensure the copy does not create interaction dead zones; if it remains non-interactive, `pointer-events: none` is correct.

### Mobile Plan

Current mobile layout makes the canvas a relative block, then shows `heroCopy` below it. This is directionally good because it does not cover the model.

Adjust mobile text so it is not hero-scale:

- `.heroCopy` stays below the canvas in document flow.
- H1 becomes around `clamp(1.6rem, 7vw, 2.4rem)`, not current `clamp(2.25rem, 11vw, 4.4rem)`.
- Keep margins tight so time/view controls remain reachable.

## B. Camera Views, Oversized Bodies, Zoom/Drag Issues

### Current Logic

`UniverseCanvas.tsx` owns the camera behavior:

- `<Canvas camera={{ position: [0, 30, 55], fov: 52, near: 0.1, far: 220 }}>`
- `<OrbitControls enableDamping dampingFactor={0.08} makeDefault minDistance={0.35} maxDistance={160} />`
- `CameraRig`
  - On `focusKey`, `selectedBodyId`, or `selectedViewId`, computes `cameraPreset(...)` and stores it in `flyTo.current`.
  - On every frame, if the view is not `free`, recomputes a preset and lerps the camera/controls target toward it.
  - If the view is `free`, it still applies `flyTo.current` until the camera is close enough.
- `cameraPreset`
  - `earthToMoon`: `between(earth, moon, 0.55)`
  - `moonToEarth`: `between(moon, earth, 0.45)`
  - generic focus: `focusBody(...)`
- `between(origin, target, clearance)`
  - places the camera at `origin + direction * (origin.visualRadius + clearance) + lift`
  - targets the other body directly.

### Why "地望月" And "月望地" Are Too Large

The current two-body preset computes camera position mainly from the origin body's radius, not from the target body's visible radius, FOV, aspect ratio, or safe screen margin.

With the current body data:

- Earth radius: `0.84`
- Moon radius: `0.28`
- Moon orbit radius around Earth: about `2.05`
- Vertical FOV: `52deg`

Approximate result:

- `earthToMoon`: camera is about `0.66` scene units from the Moon. Moon radius `0.28` nearly fills the vertical FOV.
- `moonToEarth`: camera is about `1.32` scene units from Earth. Earth radius `0.84` exceeds the available FOV, so it can crop off-screen.

Other focus presets can have related problems because `focusBody()` uses a fixed `visualRadius * 6.2` rule without considering viewport aspect, labels, or panel-obscured safe zones.

### Why Free View Can Feel Undraggable

Likely causes to address together:

1. Free view fly-to overwrites user interaction.
   - Selecting a body sets `selectedViewId` to `free` and increments `focusKey`.
   - `CameraRig` then lerps camera position and target toward `flyTo.current`.
   - If the user drags during that transition, OrbitControls can update, but the next frame lerp pulls the camera back until the fly-to finishes.

2. Non-free presets are effectively locked.
   - For presets other than `free`, `CameraRig` recomputes and reapplies position/target every frame.
   - Any manual OrbitControls adjustment is overwritten.

3. Overlay panels may reduce usable pointer area.
   - `leftPanel`, `rightPanel`, `batchPanel`, `viewRail`, and `heroCopy` are absolute overlays above the canvas.
   - Panels should block canvas interaction only where controls actually exist; the large copy should remain `pointer-events: none`.

### Camera Plan

Implement a camera fitting utility instead of hard-coded distances.

1. Add helper logic near `CameraRig` or move to a new small module, for example `app/cosmic-moment/lib/views.ts`.
   - `fitDistanceForBody(bodyRadius, cameraFovDeg, fill = 0.42, minDistance?)`
   - Formula concept: ensure the body's angular diameter occupies only a safe fraction of vertical FOV.
   - Example: `distance >= radius / tan((fov * fill) / 2)`
   - Use a smaller fill on mobile or when the target is Earth/Sun.

2. Replace `between()` with a target-aware version.
   - Compute the line from origin to target.
   - Compute required target distance from `target.visualRadius`, FOV, and safe fill.
   - Add side/lift offset so the composition feels like "from Earth/Moon" without putting the camera so close that the target clips.
   - Clamp by scene constraints and avoid crossing through either sphere.
   - Name the behavior honestly in UI if needed: "地望月" and "月望地" are composed observatory viewpoints, not exact surface-eye coordinates.

3. Improve `focusBody()`.
   - Use FOV-based distance plus body-specific minimums.
   - Include selected halo/atmosphere scale in the radius budget, for example `visualRadius * 1.65` when selected.
   - Add label clearance so labels do not overlap the body.
   - Clamp to `OrbitControls` min/max distance.

4. Make presets land once, then allow manual micro-adjustment.
   - On preset switch, set a `flyTo` target.
   - After arrival, stop writing camera position every frame for stable presets.
   - For moving simulation time, either:
     - Keep the target softly following the body only when the user is not interacting, or
     - Pause auto-follow after the first manual drag/zoom.
   - Cinematic can remain an intentionally controlled camera mode.

5. Cancel or pause fly-to on user interaction.
   - Use OrbitControls events such as `onStart`, `onEnd`, or `onChange`.
   - On `onStart`, mark `isUserInteracting` and clear `flyTo.current`.
   - For preset views, optionally switch `selectedViewId` to `free` on direct drag, or keep the selected label but set a local `manualOverride` flag. Switching to `free` is simpler and clearer.

6. Tune OrbitControls.
   - Set `enableZoom`, `enableRotate`, and `enablePan` explicitly.
   - Use min distance based on current focus radius instead of global `0.35`, or raise the global min to avoid going inside bodies.
   - Keep `maxDistance` high enough for overview, current `160` is sufficient.
   - Set `target` before/while animating and call `controls.update()`.

### Interaction Acceptance Criteria

- Dragging during a fly-to immediately gives control to the user.
- Wheel/pinch zoom works in `free`, `earth`, `moon`, `earthToMoon`, and `moonToEarth`.
- Presets do not crop the main target on desktop or mobile.
- "月望地" shows Earth with margin around the disk.
- "地望月" shows Moon as a readable target, not full-screen.
- Cinematic remains controlled, but the UI should make clear it is an auto camera mode.

## C. Circle On Earth's Orbit

### Likely Source

The circle is most likely an intentional orbit line, not a DOM label:

- `SolarSystem` samples every non-Sun orbit with `sampleOrbit(...)`.
- The Moon orbit uses `sampleOrbit("moon", 96)` and renders as a `Line`.
- `sampleOrbit()` currently uses the parent position at the fixed epoch for parented bodies:
  - `const parent = body.parentId ? orbitPositionAt(body.parentId, epoch) : [0, 0, 0]`
  - This means the Moon orbit ring is drawn around Earth's J2000 position, not around Earth's current animated position.

This can visually appear as a confusing circle on or near Earth's orbital path. It may be interpreted as Earth's orbit, selected halo, atmosphere, or a rendering artifact.

Other possible circular elements to verify visually during implementation:

- Selected-body halo: rendered as a transparent sphere when `selected`.
- Earth atmosphere: additive transparent sphere at scale `1.08`.
- Earth clouds/night layers: transparent spherical layers at `1.006` and `1.018`.
- HTML body label: not a circle, but can overlap.

### Verification Plan

During coding, temporarily inspect/toggle these render elements one at a time:

1. Orbit lines in `SolarSystem`.
2. Moon orbit line only.
3. Selected halo mesh.
4. Earth atmosphere and texture layers.
5. HTML labels.

Use a browser screenshot at the default date and at a few selected views to confirm the actual source before changing visuals.

### Treatment Plan

If it is the Moon orbit line:

- Attach the Moon orbit visualization to Earth's current transform, or render it as a local ring around Earth instead of sampling it at epoch.
- Lower its visual weight:
  - line width around `0.5` to `0.75`
  - opacity around `0.12` to `0.2` in visual styles where it distracts
  - avoid bright white/blue unless in instrument mode
- Add a short legend/readout only if needed, such as "细线为月球轨道", preferably in an existing panel rather than over the model.

If it is the selected halo:

- Reduce opacity and radius.
- Show it only on hover/selected, not as a persistent bright sphere.
- Consider replacing it with a subtle rim shader or a small label accent.

If it is Earth atmosphere/cloud/night layers:

- Reduce opacity or scale if the edge reads as an artificial circle.
- Keep the atmosphere because it helps depth, but make it less graphic.

If it is a stale orbit artifact:

- Remove the stale line or recompute it relative to the correct parent position.

## D. Special Events: Solar And Lunar Eclipses

### Product Goal

Add a useful "special celestial events" MVP without claiming observatory-grade precision. The user should be able to discover eclipse dates, understand where they are visible, and jump the simulation to the event time/view.

### Accuracy Positioning

The current orbit model is simplified circular motion with approximate inclination. It is not accurate enough to predict real eclipses from first principles.

Therefore the MVP should use built-in curated event data for real dates and regions, then use the existing 3D scene as a visual storytelling view. The UI should state this succinctly in metadata/help text:

- "事件日期和可见地区来自预置资料；3D 构图为简化太阳系模型示意。"

This avoids heavy ephemeris dependencies and avoids misleading users.

NASA sources checked during planning:

- Future eclipses: `https://science.nasa.gov/eclipses/future-eclipses/`
- March 2026 total lunar eclipse article: `https://science.nasa.gov/solar-system/moon/march-2026-total-lunar-eclipse-your-questions-answered/`
- Eclipse overview and upcoming events: `https://science.nasa.gov/moon/eclipses/?lv=true`

### MVP Data

Add a small typed dataset, likely in a new file:

- `app/cosmic-moment/lib/celestialEvents.ts`

Proposed type additions in `types.ts`:

```ts
export type CelestialEventType = "solarEclipse" | "lunarEclipse";

export type CelestialEvent = {
  id: string;
  type: CelestialEventType;
  title: string;
  startsAt: string;
  peaksAt?: string;
  endsAt?: string;
  visibility: string;
  locationSummary: string;
  description: string;
  recommendedView: ViewPresetId;
  sourceLabel?: string;
  sourceUrl?: string;
};
```

Initial event examples to include:

- `2026-03-03` total lunar eclipse
  - Totality visible from eastern Asia and Australia in the evening, throughout the Pacific at night, and North/Central America in early morning.
  - Recommended view: `moonToEarth` or a new future `lunarEclipse` camera preset.
  - Use NASA article UTC milestones if including detailed stage times.

- `2026-08-12` total solar eclipse
  - Total path includes Greenland, Iceland, Spain, Russia, and a small area of Portugal; partial visibility across wider regions.
  - Recommended view: `earthToMoon` or a new future `solarEclipse` camera preset.

- `2026-08-27/28` partial lunar eclipse
  - Visibility: Americas, Europe, Africa, Western Asia or East Pacific/Americas/Europe/Africa depending the source wording.
  - Recommended view: `moonToEarth`.

- Optional next events from NASA list:
  - `2027-02-06` annular solar eclipse
  - `2027-08-02` total solar eclipse
  - `2027-02-20/21` penumbral lunar eclipse

Keep the dataset small for MVP; do not introduce a large event catalog yet.

### Event UI

Place event UI where it does not cover the model center:

Preferred option:

- Add a compact "特殊天象" section inside or below the existing left time panel.
- Each event row shows:
  - type badge: 日食/月食
  - date/time
  - location/visibility summary
  - one action button: "跳到时刻"
  - optional small action: "推荐视角"

Alternative if the left panel becomes too tall:

- Add a bottom drawer below the time machine on mobile and a right-side compact card above/below poster tools on desktop.
- Do not place event cards over the central model.

### Event Actions

1. Clicking "跳到时刻":
   - `seekDate(new Date(event.peaksAt ?? event.startsAt))`
   - `setPaused(true)`
   - `setSelectedViewId(event.recommendedView)`
   - increment `focusKey`
   - optionally set `selectedBodyId` to `moon` for lunar eclipse or `earth` for solar eclipse.

2. Display current/nearby event:
   - `getUpcomingEvents(currentDate, celestialEvents, limit = 3)`
   - `getActiveEvent(currentDate)` if within `startsAt`/`endsAt`.

3. Visual marker in the scene:
   - MVP can skip geometry overlays.
   - If included, use a subtle Sun-Earth-Moon alignment guide only in recommended views.

### Future Upgrade Path

After MVP:

- Add more curated events by year.
- Add local visibility filtering if a user location is available.
- Add map thumbnails or path data for solar eclipses.
- Replace simplified event display with a higher-accuracy ephemeris library only if product needs justify the dependency.

## E. Implementation Steps, Files, Risks, Validation

### Implementation Steps

1. Layout fix for copy.
   - Edit `app/cosmic-moment/cosmic.module.css`.
   - Keep `CosmicMomentApp.tsx` DOM unless wording changes are requested.
   - Verify desktop and mobile placements.

2. Camera refactor.
   - Edit `app/cosmic-moment/components/UniverseCanvas.tsx`.
   - Optionally extract camera math into `app/cosmic-moment/lib/views.ts` if the helper logic grows.
   - Implement FOV-aware fit distance and target-aware two-body views.
   - Add OrbitControls interaction handlers to cancel fly-to/manual override.
   - Explicitly configure rotate/zoom/pan.

3. Circle/orbit treatment.
   - Confirm the source in the running app before changing it.
   - Likely edit `SolarSystem` orbit rendering and/or `sampleOrbit()`.
   - If the Moon orbit is the source, render it relative to Earth's live position or make it subtle enough to read as a guide.

4. Special celestial events.
   - Add `app/cosmic-moment/lib/celestialEvents.ts`.
   - Add event types to `app/cosmic-moment/lib/types.ts`.
   - Edit `CosmicMomentApp.tsx` to render the event list and handle "jump to event".
   - Edit `cosmic.module.css` for compact event rows.
   - Keep the UI out of the canvas center.

5. Browser verification.
   - Start local dev server if needed.
   - Check desktop and mobile viewports.
   - Use screenshots/canvas inspection to confirm the model is visible and controls work.

6. Required checks.
   - Run `npm run check`.
   - Run `npm run build`.

7. Delivery.
   - Review `git diff`.
   - Commit intentionally on `main`.
   - Push to `origin main`.

### File Modification Checklist For Coding Phase

Likely files:

- `app/cosmic-moment/CosmicMomentApp.tsx`
- `app/cosmic-moment/components/UniverseCanvas.tsx`
- `app/cosmic-moment/cosmic.module.css`
- `app/cosmic-moment/lib/orbits.ts`
- `app/cosmic-moment/lib/types.ts`
- `app/cosmic-moment/lib/celestialEvents.ts` new
- Optional: `app/cosmic-moment/lib/views.ts` new

Likely untouched:

- `app/cosmic-moment/lib/time.ts`, unless event date formatting helpers are needed.
- `app/cosmic-moment/page.tsx`, unless metadata needs to mention eclipses.

### Risks

- The current simplified orbit model will not visually align exactly with real eclipse event times. Mitigation: curated event data plus clear "示意" labeling.
- FOV-aware camera math can still fail if labels or side panels cover the model. Mitigation: validate with desktop and mobile screenshots, and keep model targets out of panel-heavy safe zones.
- Canceling fly-to on control start may make some preset transitions feel interrupted if users accidentally touch the canvas. Mitigation: this is preferable to a locked-feeling camera; keep transition fast and predictable.
- Moving the Moon orbit from epoch-relative to Earth-relative can change the visual language. Mitigation: make it subtler and explain it as a guide only if needed.
- `npm run build` uses OpenNext/Cloudflare and may surface unrelated deployment warnings. Mitigation: report exact failures if they are unrelated.

### Validation Checklist

Desktop:

- The compact copy does not overlap the Sun/Earth/Moon in overview, earth, moon, earth-to-moon, moon-to-earth.
- The main model remains the first visual focus.
- Right/left/batch panels remain readable and do not overlap each other.
- View rail is reachable and does not steal the canvas center.

Mobile:

- Canvas remains at the top with sufficient height.
- Copy appears below the canvas and uses smaller text.
- Event list does not make the time controls hard to reach.
- Text does not overflow buttons/cards.

Camera:

- Free view drag works immediately after selecting a body.
- Wheel/pinch zoom works.
- Preset views can be manually adjusted or switch cleanly to free/manual mode.
- "月望地" shows Earth fully in frame.
- "地望月" shows Moon fully in frame.
- Overview/top/cinematic still work.

Circle/orbit:

- The reported circle is identified.
- If retained, it is visually legible as an orbit/guide and is not distracting.
- If it is an artifact, it is removed.

Events:

- Event cards show type, date/time, visibility/location, and explanation.
- "跳到时刻" changes date, pauses simulation, and moves to recommended view.
- Event copy states the simplified-visualization accuracy boundary.

Commands:

- `npm run check`
- `npm run build`

