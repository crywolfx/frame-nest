# Moon Poster Page Implementation Plan

## Scope And Constraints

Plan-only phase. Do not implement the page, production code, or production assets in this phase.

Repo state observed during planning:

- Existing poster workstation route: `app/cosmic-moment`.
- Existing planning docs: `docs/plans/cosmic-moment-v1.md`, `docs/plans/cosmic-workstation-ux-eclipses-plan.md`.
- Existing untracked files at inspection time: `.codex/`, `.codex-moon-poster-plan.md`. Leave them alone unless the user explicitly asks.
- `next-env.d.ts` is tracked by git.

Design source of truth for this feature:

- Read and follow `./.codex/skills/geek-moon-poster-design/SKILL.md`.
- Visual language: dark aerospace workstation, glass panels, precision controls, restrained neon accents, close to `/cosmic-moment`.
- UI copy must be functional Chinese. Do not use random filler, poem-like text, or vague motivational text.

## 1. Route And Navigation

Recommended route: `/poster-lab`.

Reasoning:

- The user asked for a dedicated image poster generator page, and Moon Phase is one template. A generic route avoids boxing the feature into moon-only naming.
- It leaves room for future templates without another route rename.
- It still can default directly to the Moon Phase template in V1.

Files:

- `app/poster-lab/page.tsx`
- `app/poster-lab/PosterLabApp.tsx`

Route metadata:

- `title`: `海报实验室`
- `description`: `使用月相模板生成图片海报。`

Home navigation entry:

- Add a recent/content entry in `app/page.tsx` after `/cosmic-moment`.
- Suggested labels:
  - Category: `Poster`
  - Title: `Poster Lab`
  - Description: `使用月相模板生成图片海报。`

In-page top nav:

- Brand/home link: `海报实验室`
- Secondary link back to `/cosmic-moment`: `宇宙此刻`
- Status chips: `月相模板`, `北京时间 YYYY-MM-DD`, `月龄 NN`

## 2. Existing Code, Assets, And Utilities To Reuse

Reuse from `/cosmic-moment`:

- Visual style:
  - `app/cosmic-moment/cosmic.module.css` layout patterns: absolute desktop workbench, route-scoped dark shell, glass panels, small status chips, 8px panel radius, neon focus outlines, mobile stacked layout.
  - `motion/react` panel entrance style.
  - `lucide-react` icon buttons.
- Poster utilities:
  - `ratioSizes`, `outputSize`, size clamping from `app/cosmic-moment/lib/poster.ts`.
  - Text drawing concepts: `posterFontFamily`, Chinese-aware wrapping, shadow, metadata line.
  - `downloadBlob` filename/download behavior, adapted to `poster-lab-*` filenames.
- Time utilities:
  - `formatBeijingDateTime`, `formatBeijingDateTimeLabel`, `toDatetimeLocal`, `parseDatetimeLocal`, `fromDatetimeLocal`, `filenameDate` from `app/cosmic-moment/lib/time.ts`.
  - Keep user-facing dates in Beijing time. Do not show ISO/UTC strings in UI.
- UI control lists:
  - Font list from `CosmicMomentApp.tsx`, but remove decorative labels if needed and keep functional labels.
  - Alignment options and layout preset approach.
- Tests:
  - Use `tests/cosmic-moment.spec.ts` as a model for smoke tests and canvas pixel checks.

Avoid over-coupling:

- Do not import the new page into the WebGL scene.
- Do not make the Moon Phase poster depend on `UniverseCanvas`.
- Prefer extracting route-independent helpers into a shared folder in phase 2 rather than importing from `app/cosmic-moment/lib/*` forever.

Recommended extraction in implementation phase:

- New shared modules:
  - `app/lib/time.ts`: move/copy Beijing time helpers here.
  - `app/lib/posterCore.ts`: shared ratio sizing, font family, wrapping, canvas download helpers.
- Update `/cosmic-moment` imports to use these shared helpers only if the extraction is small and safe.
- Keep route-specific rendering logic in route folders:
  - `app/cosmic-moment/lib/poster.ts` for solar-system capture composition.
  - `app/poster-lab/lib/renderMoonPoster.ts` for moon image composition.

## 3. New File And Module Structure

Recommended structure:

```text
app/poster-lab/
  page.tsx
  PosterLabApp.tsx
  poster-lab.module.css
  components/
    BatchPanel.tsx
    CanvasControls.tsx
    MoonPhaseSelector.tsx
    PosterControls.tsx
    PosterPreview.tsx
    TemplatePicker.tsx
  lib/
    batch.ts
    fonts.ts
    moonPhases.ts
    renderMoonPoster.ts
    types.ts

app/lib/
  posterCore.ts
  time.ts

public/poster-lab/moon-phases/
  moon-phase-00-new-moon.webp
  moon-phase-01-waxing-crescent-01.webp
  ...
  moon-phase-29-waning-crescent-07.webp

docs/assets/
  moon-phase-audit.md

tests/
  poster-lab.spec.ts
```

Notes:

- `docs/assets/moon-phase-audit.md` is recommended for Hermes' one-by-one acceptance record. It should be created in phase 2 only when assets are ready to audit.
- If final asset sizes are too large for repo history, keep source files outside the app repo and commit optimized web/export assets plus an audit manifest.

## 4. Moon Phase Model

### Date To Phase Index

Use a deterministic approximate synodic-month model for V1. It is good enough for poster template selection and avoids adding a heavy astronomy dependency.

Constants:

- Synodic month: `29.530588853` days.
- Reference new moon: `2000-01-06 18:14 UTC` (`Date.UTC(2000, 0, 6, 18, 14, 0)`).
- Day length: `86_400_000` ms.

Algorithm:

```text
elapsedDays = (dateMs - referenceNewMoonMs) / 86_400_000
phaseAgeDays = positiveModulo(elapsedDays, 29.530588853)
phaseFraction = phaseAgeDays / 29.530588853
phaseIndex = round(phaseFraction * 30) % 30
lunarDay = phaseIndex + 1
illumination = (1 - cos(phaseFraction * 2π)) / 2
isWaxing = phaseFraction > 0 && phaseFraction < 0.5
```

UI wording:

- Use `月龄` / `相位档位`, not "农历初几", unless a true Chinese lunar-calendar library is added later.
- Example metadata: `月相：上弦月 · 月龄 08 · 北京时间 2026-05-15`.

Manual override:

- Date selection computes the default phase automatically.
- A manual phase selector can override the computed phase for poster design.
- UI should clearly show `按日期计算` / `手动指定`, so batch rows can be deterministic.

### Phase Names And Indexes

The 30 assets represent equal positions in the synodic cycle, not exact Chinese lunar calendar days.

| Index | Lunar Day Label | Chinese Name | Lit Side |
| --- | --- | --- | --- |
| 00 | 月龄 01 | 新月 | 无明显亮面 |
| 01 | 月龄 02 | 细盈蛾眉月 | 右侧 |
| 02 | 月龄 03 | 盈蛾眉月 02 | 右侧 |
| 03 | 月龄 04 | 盈蛾眉月 03 | 右侧 |
| 04 | 月龄 05 | 盈蛾眉月 04 | 右侧 |
| 05 | 月龄 06 | 盈月 05 | 右侧 |
| 06 | 月龄 07 | 近上弦月 | 右侧 |
| 07 | 月龄 08 | 上弦前 | 右侧 |
| 08 | 月龄 09 | 上弦月 | 右半 |
| 09 | 月龄 10 | 盈凸月 01 | 右侧为主 |
| 10 | 月龄 11 | 盈凸月 02 | 右侧为主 |
| 11 | 月龄 12 | 盈凸月 03 | 右侧为主 |
| 12 | 月龄 13 | 盈凸月 04 | 右侧为主 |
| 13 | 月龄 14 | 近满月 01 | 右侧为主 |
| 14 | 月龄 15 | 近满月 02 | 右侧为主 |
| 15 | 月龄 16 | 满月 | 全亮 |
| 16 | 月龄 17 | 亏凸月 01 | 左侧为主 |
| 17 | 月龄 18 | 亏凸月 02 | 左侧为主 |
| 18 | 月龄 19 | 亏凸月 03 | 左侧为主 |
| 19 | 月龄 20 | 亏凸月 04 | 左侧为主 |
| 20 | 月龄 21 | 亏凸月 05 | 左侧为主 |
| 21 | 月龄 22 | 近下弦月 | 左侧 |
| 22 | 月龄 23 | 下弦前 | 左侧 |
| 23 | 月龄 24 | 下弦月 | 左半 |
| 24 | 月龄 25 | 下弦后 | 左侧 |
| 25 | 月龄 26 | 亏蛾眉月 01 | 左侧 |
| 26 | 月龄 27 | 亏蛾眉月 02 | 左侧 |
| 27 | 月龄 28 | 亏蛾眉月 03 | 左侧 |
| 28 | 月龄 29 | 残月 | 左侧 |
| 29 | 月龄 30 | 晦月 | 极细左侧或近暗 |

If Hermes prefers simpler labels, use group names only in the UI and keep the detailed index in metadata:

- `新月`
- `盈蛾眉月`
- `上弦月`
- `盈凸月`
- `满月`
- `亏凸月`
- `下弦月`
- `亏蛾眉月`
- `残月`
- `晦月`

### Orientation Convention

Use the Northern Hemisphere visual convention:

- Waxing phases before full moon: lit side grows on the right.
- Full moon: whole disk lit.
- Waning phases after full moon: lit side remains on the left and shrinks.
- New moon and晦月: no visible bright crescent or only a very faint rim.

Document this convention in `moonPhases.ts` and in the asset audit document. Do not silently flip assets.

## 5. Image Naming Scheme

Use stable ASCII filenames. The manifest maps filenames to Chinese labels.

Pattern:

```text
moon-phase-{index}-{english-slug}.webp
```

Recommended filenames:

```text
moon-phase-00-new-moon.webp
moon-phase-01-waxing-crescent-01.webp
moon-phase-02-waxing-crescent-02.webp
moon-phase-03-waxing-crescent-03.webp
moon-phase-04-waxing-crescent-04.webp
moon-phase-05-waxing-moon-05.webp
moon-phase-06-near-first-quarter.webp
moon-phase-07-before-first-quarter.webp
moon-phase-08-first-quarter.webp
moon-phase-09-waxing-gibbous-01.webp
moon-phase-10-waxing-gibbous-02.webp
moon-phase-11-waxing-gibbous-03.webp
moon-phase-12-waxing-gibbous-04.webp
moon-phase-13-near-full-01.webp
moon-phase-14-near-full-02.webp
moon-phase-15-full-moon.webp
moon-phase-16-waning-gibbous-01.webp
moon-phase-17-waning-gibbous-02.webp
moon-phase-18-waning-gibbous-03.webp
moon-phase-19-waning-gibbous-04.webp
moon-phase-20-waning-gibbous-05.webp
moon-phase-21-near-last-quarter.webp
moon-phase-22-before-last-quarter.webp
moon-phase-23-last-quarter.webp
moon-phase-24-after-last-quarter.webp
moon-phase-25-waning-crescent-01.webp
moon-phase-26-waning-crescent-02.webp
moon-phase-27-waning-crescent-03.webp
moon-phase-28-old-crescent.webp
moon-phase-29-dark-moon.webp
```

Manifest fields in `moonPhases.ts`:

```text
id
index
nameZh
lunarDayLabel
assetPath
expectedLitSide
expectedIllumination
phaseAngleDeg
```

## 6. Asset Generation Strategy

Preferred strategy: public-domain realistic lunar texture plus deterministic phase compositing.

Why:

- It gives realistic crater detail while keeping phase shape, orientation, and monotonic illumination under code control.
- It avoids image-model inconsistency across 30 files.
- It reduces copyright risk when using NASA/public-domain source material.

Recommended asset pipeline for phase 2:

1. Obtain a high-resolution public-domain Moon texture/source image, preferably NASA/LRO/GSFC/SVS material with clear license notes.
2. Keep the master source at 4096x4096 or higher.
3. Generate 30 square phase images from the same source using a deterministic terminator mask:
   - 1:1 canvas.
   - Consistent disk center, radius, scale, and rotation.
   - Waxing right-lit, waning left-lit.
   - Soft terminator and slight earthshine only if it does not obscure the expected phase.
4. Export web-ready built-ins as high-quality `webp` or `png`.
5. Validate every output file with a local audit script before visual review.

Acceptable fallback: generated image model assets.

- Only use if the deterministic texture pipeline cannot produce the required realistic style.
- Generate each phase from a strict prompt with index, expected lit fraction, and orientation.
- Hermes must review each file one-by-one before acceptance.
- Do not commit generated assets until they pass audit.

Avoid:

- Random web images with unclear rights.
- Baked-in text, stars, frames, or watermarks.
- Cartoon/vector-looking moons.
- Inconsistent disk sizes, off-center crops, or wrong orientation.
- Mixed hemisphere conventions.

Copyright policy:

- Prefer NASA/public-domain sources.
- Store source attribution in a manifest comment or `docs/assets/moon-phase-audit.md`.
- Do not use third-party images unless the license permits redistribution and derivative poster generation.

## 7. Hermes Asset Audit

Hermes should audit one image at a time using the manifest order.

Mechanical checklist:

- Exactly 30 files exist.
- File path matches manifest index.
- Every image is square 1:1.
- Minimum source/export size is 2048x2048; preferred 4096x4096 for export headroom.
- All files use the same pixel dimensions.
- Disk center, disk diameter, and outer margin are visually consistent.
- No text, watermark, border, UI, stars baked into the moon disk, or background clutter.
- No obvious compression blocks, duplicated crater artifacts, malformed terminator, or painterly/cartoon style.

Phase correctness checklist:

- `00` is a new moon: nearly dark disk or no visible lit crescent.
- `01` to `14` are waxing: right side lit and illumination increases.
- `08` is clearly right half lit.
- `15` is full moon: full disk illuminated.
- `16` to `29` are waning: left side lit and illumination decreases.
- `23` is clearly left half lit.
- `29` is near-dark/old crescent, not another new full disk.
- Adjacent images progress smoothly without sudden flips or jumps.

Recommended audit record columns:

```text
index | filename | dimensions | expected phase | orientation pass | realism pass | notes | accepted by Hermes
```

## 8. Poster Rendering Architecture

Rendering goal:

- Preview and export must share one renderer so final PNG matches the live preview.
- Canvas rendering should be deterministic and not depend on DOM screenshot capture.

Types:

```text
PosterLabTemplateId = "moonPhase"
PosterRatioId = "1:1" | "4:5" | "9:16" | "16:9" | "custom"
PhaseMode = "date" | "manual"

MoonPosterConfig:
  templateId
  date
  phaseMode
  phaseIndex
  text
  font
  color
  size
  x
  y
  align
  ratio
  width
  height
  metadata
  backgroundStyle
```

Renderer modules:

- `loadMoonPhaseImage(phaseIndex)`: loads and caches `HTMLImageElement` assets.
- `drawMoonPoster(ctx, config, image, phaseMeta)`: draws full poster at target output dimensions.
- `renderPosterPreview(targetCanvas, config)`: sets canvas dimensions and calls `drawMoonPoster`.
- `composeMoonPoster(config)`: creates an offscreen export canvas, calls `drawMoonPoster`, returns `Blob`.
- `downloadPosterBlob(blob, config, suffix)`: downloads `poster-lab-YYYY-MM-DD-phase-XX-{suffix}.png`.

Composition plan:

- Background:
  - Dark technical gradient, subtle star/noise field generated by canvas, no random decorative text.
  - Optional technical grid/reticle consistent with `/cosmic-moment`, restrained.
- Moon:
  - Draw selected 1:1 phase asset as the primary visual.
  - Support scale and vertical placement later if needed; V1 can use fixed centered visual per ratio.
  - Use high-quality image smoothing.
- Text:
  - Custom text content.
  - Font selection.
  - Font color.
  - Font size.
  - X/Y position.
  - Left/center/right alignment.
  - Chinese-aware wrapping.
  - Clamp text area to avoid overflow; max lines should be documented.
- Metadata:
  - Toggle on/off.
  - Factual only:
    - `月相：{nameZh}`
    - `月龄：{lunarDayLabel}`
    - `北京时间：YYYY-MM-DD`
    - Optional `相位：{index}/29`
  - No view labels, no poetic copy.

Controls:

- Template picker:
  - V1 has `月相`.
  - Keep structure ready for future templates.
- Date/phase:
  - Date input.
  - `按日期计算` / `手动指定` segmented control.
  - 30-state thumbnail grid/rail with phase names and indexes.
- Text:
  - Textarea with default `月相观测记录` or empty text.
  - Font select.
  - Color input.
  - Size slider.
  - Alignment segmented controls.
  - X/Y sliders.
  - Layout presets: `左下`, `居中`, `右上`, `底部说明`.
- Canvas:
  - Aspect ratio select: `1:1`, `4:5`, `9:16`, `16:9`, `自定义`.
  - Custom width/height with clamp 512-4096.
  - Metadata toggle.
- Export:
  - `导出 PNG`.
  - Export status.
  - Disable while assets are loading.

Live preview:

- Debounce preview refresh by about 200-360ms.
- Show `正在更新预览` only when useful; avoid noisy status changes on every slider movement.
- Do not regenerate on animation frames continuously.

## 9. Batch Generation Flow

Batch input format:

```text
日期 | 月相 | 文案
2026-05-15 | auto | 月相观测记录
2026-05-16 | phase-08 | 上弦月记录
2026-05-17 | 满月 | 月相观测记录
```

Accepted phase tokens:

- `auto`: compute from date.
- `phase-00` through `phase-29`.
- `00` through `29`.
- Chinese phase name from manifest, resolving to first matching index if unique.

Parser behavior:

- Trim whitespace.
- Ignore empty lines.
- Reject rows without valid date or text.
- Report row-level warnings in Chinese:
  - `第 3 行日期无效，已跳过。`
  - `第 4 行月相未识别，已按日期计算。`
- Keep parsed rows in a visible queue with status: `等待`, `生成中`, `已完成`, `失败`.

Batch renderer behavior:

- Each row must build a fresh config from:
  - Current global poster style settings.
  - Row date.
  - Row phase/template override.
  - Row text.
- Do not rely on stale React state after `setState`.
- Do not mutate the currently selected UI state unless explicitly intended.
- Sequential generation is acceptable for V1.
- Use individual PNG downloads first; add ZIP only if a dependency is approved later.

## 10. UX And Responsive Design

### Desktop Layout

Use a workstation layout close to `/cosmic-moment`:

- Full viewport dark shell with subtle technical grid.
- Top nav/status row.
- Left panel:
  - Template picker.
  - Date/phase mode.
  - 30-state phase selector.
- Center stage:
  - Large live poster preview.
  - Preview toolbar: refresh, fit/zoom, export.
  - Keep preview visually dominant.
- Right panel:
  - Text, font, color, size, alignment, position, ratio, metadata.
- Bottom or right-lower panel:
  - Batch queue and status.

Controls should feel like production tools, not a landing page:

- Dense but readable hierarchy.
- Small functional labels.
- Icon buttons where a familiar icon exists.
- 8px panel radius following current CSS.
- No nested cards.

### Mobile / H5 Layout

Mobile-first requirements:

- No horizontal scroll.
- Tap targets at least about 48x48px.
- Preview should appear near the top after nav.
- Controls stack below preview in grouped sections.
- Use tabs or collapsible panels:
  - `模板`
  - `文字`
  - `画布`
  - `批量`
- Sticky bottom action bar:
  - `导出 PNG`
  - `批量生成`
- Phase selector:
  - Horizontal thumbnail rail with snap scrolling, or 3-column grid inside a collapsible panel.
  - Each thumbnail must be large enough to tap.
- Preserve safe-area padding.
- Avoid tiny range controls; use full-width sliders.

### Motion Plan

Use restrained motion:

- Panel entrance fade/slide with `motion/react`, same feel as `/cosmic-moment`.
- Thumbnail selected state: short border/glow transition.
- Preview refresh: quick opacity/scale settle, not a loop.
- Batch progress: row status transition or progress line.
- Hover/focus glow on desktop controls.

Do not:

- Animate canvas rendering continuously.
- Add distracting orbital loops.
- Use decorative text animations.
- Ignore `prefers-reduced-motion`.

## 11. Testing And Verification Plan

Run in phase 2:

```text
npm run check
npm run build
```

Add Playwright coverage:

- `tests/poster-lab.spec.ts`.
- Desktop project:
  - Open `/poster-lab`.
  - Confirm `海报实验室` visible.
  - Confirm `月相` template visible.
  - Confirm `导出 PNG` button visible.
  - Confirm preview canvas visible and nonblank.
  - Change phase to `上弦月` and verify canvas changes.
  - Toggle metadata and verify preview remains nonblank.
- Mobile project:
  - Open `/poster-lab`.
  - Confirm no horizontal overflow.
  - Confirm sticky action bar exists.
  - Confirm tap target controls are reachable.

Browser validation checklist:

- Desktop 1440x950:
  - Left, center, right, and batch regions do not overlap.
  - Preview is large enough to judge poster composition.
  - Phase thumbnails are readable and selectable.
  - Export produces PNG with selected dimensions.
  - Batch queue generates each row with its own date/phase/text.
- Tablet width:
  - Panels wrap without covering preview controls.
- Mobile/H5:
  - No horizontal scroll.
  - No clipped button text.
  - Preview remains visible above controls.
  - Range sliders and selectors are usable by touch.
  - Sticky actions do not cover important form fields.
- Accessibility:
  - All controls have labels.
  - Focus outlines visible.
  - Keyboard can reach export and phase controls.
  - Reduced motion disables nonessential transitions.

Asset audit checklist:

- Run a local script to check count, dimensions, 1:1 ratio, and manifest references.
- Visually audit every index in manifest order.
- Confirm waxing/waning orientation.
- Confirm monotonic illumination progression.
- Confirm no copyright or attribution gap.

## 12. `next-env.d.ts` Policy Recommendation

Observed state:

- `next-env.d.ts` is tracked by git.
- It currently contains generated Next references, including `.next/types/routes.d.ts`.
- `.gitignore` does not ignore `next-env.d.ts`.
- Adding `next-env.d.ts` to `.gitignore` alone will not stop diffs because tracked files remain tracked.

Policy decision for phase 2:

- Preferred durable policy: keep `next-env.d.ts` tracked only if the repo accepts Next's generated reference line as canonical and it stays stable across machines/builds.
- If repeated dev/build diffs continue, change policy explicitly:
  1. Add `next-env.d.ts` to `.gitignore`.
  2. Run `git rm --cached next-env.d.ts` to untrack it without deleting the local generated file.
  3. Ensure `tsconfig.json` still includes generated Next type paths directly:
     - `.next/types/**/*.ts`
     - `.next/dev/types/**/*.ts`
  4. Verify `npm run check` and `npm run build`.
  5. Commit the policy change once, instead of repeatedly mentioning generated noise.

Do not implement this in plan mode. In implementation mode, only apply the policy if the user agrees or if the recurring diff is actively blocking the feature work.

## 13. Risks And Open Decisions

Risks:

- Phase accuracy: the synodic-month algorithm is approximate. It is acceptable for poster template selection but not for professional ephemeris output.
- Asset size: 30 high-resolution realistic images can increase repo and page weight. Use lazy loading and only preload adjacent thumbnails if needed.
- Asset correctness: generated images can easily flip waxing/waning orientation. Prefer deterministic compositing and strict audit.
- Copyright: random online moon images are risky. Use NASA/public-domain or explicitly licensed sources.
- Font availability: system font choices can render differently by device. Keep font fallbacks and test Chinese wrapping.
- Batch downloads: browsers may throttle many sequential downloads. V1 can generate sequentially with visible status; ZIP export can be a later decision.
- Shared helper extraction: moving existing `/cosmic-moment` helpers adds regression risk. Keep extraction small and run existing tests.

Open decisions for Hermes/user before implementation:

- Confirm route name: recommended `/poster-lab`.
- Confirm asset source: public-domain NASA/LRO texture pipeline is recommended over image-model generation.
- Confirm whether final committed phase assets should be 4096x4096 WebP or 2048x2048 WebP with source archived outside repo.
- Confirm whether batch V1 should download individual PNGs or introduce a ZIP dependency.
- Confirm `next-env.d.ts` repo policy if it keeps changing during phase 2.

## 14. Phase 2 Implementation Order

1. Extract minimal shared time/poster helpers if doing so is low-risk.
2. Add moon phase manifest and model utilities without production assets yet.
3. Add `/poster-lab` page shell and route-scoped CSS.
4. Add renderer with placeholder internal phase source only for development, then swap to audited assets.
5. Add controls and debounced live preview.
6. Add export.
7. Add batch parser/queue/generation.
8. Add responsive mobile layout and sticky actions.
9. Add navigation entry.
10. Add tests.
11. Run `npm run check`, `npm run build`, and browser validation.
12. Resolve `next-env.d.ts` policy only if needed and approved.
