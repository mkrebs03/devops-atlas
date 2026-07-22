# Guided Learning UI Implementation Plan

## Objective

Implement the approved [guided learning UI design](../specs/2026-07-22-guided-learning-ui-design.md) as a static Astro/Starlight experience with a coherent visual system, a twelve-step bilingual learning path, and local progress persistence. Keep all content and navigation usable without JavaScript or browser storage.

## Locked Decisions

- The twelve steps are the four existing pages in each module; each module `index.md` is its first, completable overview.
- Canonical IDs are locale-neutral: `foundations.overview`, `foundations.linux-cli`, `foundations.networking`, `foundations.lab-shell-and-network`, and equivalent IDs for the other modules.
- Use storage key `devops-atlas:progress:v1` with `{ version: 1, completed: string[], lastVisited?: string }`. Invalid IDs, malformed JSON, and unsupported versions fall back to empty progress.
- The resume selector follows the spec's single ordered rule. “Open a lab” selects the first incomplete lab, falling back to the first lab. A completed route links **Review the route** to the localized `/#learning-path` anchor.
- Completion controls are hidden by default and revealed only after storage read/write availability succeeds. If storage fails, ordinary route and next-step links remain visible; no session-only state is introduced.
- Module overview times become short step durations rather than module totals. Module/course duration is calculated from canonical numeric minute values in the learning-path definition.
- No authentication, backend, analytics, quiz system, additional accessibility package, or content expansion is included.

## Phase 0 — Documentation and API Baseline

This discovery is complete and must be rechecked if dependency versions change.

### Allowed APIs and source evidence

- Extend the existing `docsSchema({ extend: z.object(...) })` pattern from `src/content.config.ts:10-23`; installed signature is in `node_modules/@astrojs/starlight/schema.ts:11-164`.
- Register supported `components.PageTitle` and `components.Footer` overrides in `astro.config.mjs`; keys and contracts are defined in `node_modules/@astrojs/starlight/schemas/components.ts:1-251`.
- Read lesson frontmatter and locale from `Astro.locals.starlightRoute.entry.data` and `.lang`; definitions are in `node_modules/@astrojs/starlight/locals.d.ts:15-42` and `utils/routing/types.ts:66-101`.
- Wrap the stock footer by importing `@astrojs/starlight/components/Footer.astro`; copy the composition pattern from the installed `components/Footer.astro` and preserve the stock pagination.
- Preserve exactly one `<h1 id="_top">` when replacing `PageTitle`; copy the structural contract from `node_modules/@astrojs/starlight/components/PageTitle.astro:1-17`.
- Generate localized internal links with `getRelativeLocaleUrl()` from `astro:i18n`. Do not import Starlight internal URL utilities.
- Use a plain bundled Astro `<script>` for DOM and storage enhancement. Copy the defensive `try/catch` storage approach from `node_modules/@astrojs/starlight/components-internals/SidebarPersistState.ts:1-58` and the initialization guard/`astro:page-load` lifecycle from `src/components/AtlasHome.astro:210-245`.
- Use Playwright 1.61.1 APIs already installed: `page.addInitScript`, `page.reload`, `page.evaluate`, `test.use`, `page.on('pageerror')`, role/label locators, and web-first assertions. Follow `tests/smoke.spec.ts:1-33` and `playwright.config.ts:1-25`.

### Guards

Do not use deprecated `Astro.props` route data, undocumented `virtual:starlight/*` modules, React-style hydration, localized URL strings as progress IDs, unguarded `localStorage`, invented Playwright matchers such as `toHaveContrast`, or Starlight pagination as the canonical route model.

## Phase 1 — Canonical Learning Model and Metadata

### Implement

1. Add `src/data/learning-path.mjs` as the single runtime definition, with `// @ts-check`, JSDoc types, frozen module/step records, canonical IDs, relative paths, kind, numeric minutes, prerequisites, and localized module/outcome labels. Export lookup and pure resume-target helpers so Astro code, client code, and Node validation consume the same data.
2. Derive the existing manual Starlight sidebar in `astro.config.mjs` from this definition where practical, or at minimum import its step records to generate links and order. Keep localized sidebar labels in the canonical model rather than a second hardcoded list.
3. Extend `src/content.config.ts` with `learningObjectives` and `takeaways` arrays. Keep these and `estimatedTime` optional at collection-schema level because the two splash roots are not learning steps; enforce them for the twelve canonical steps in repository validation. Remove defaults from fields whose omission should remain visible to validation.
4. Update frontmatter in all 24 localized step files. Add non-empty `learningObjectives` and `takeaways`; correct each module overview's `estimatedTime` to an actual introduction duration. Preserve paired meaning and canonical route identity across languages.
5. Replace regex-only array handling in `scripts/validate-content.mjs` with a bounded `parseFrontmatter()` helper supporting scalar lines, the repository's existing inline arrays, and indented dash arrays. Reject nested objects and unsupported syntax with a filename/line error instead of attempting general YAML parsing. Import the canonical path definition and verify: exact ES/EN counterpart coverage, required step metadata, unique IDs/order, valid module membership and prerequisites, and no missing path targets.

### References

Copy/adapt schema enums from `src/content.config.ts:6-21`, recursive discovery and aggregated errors from `scripts/validate-content.mjs:11-60`, current route order from `astro.config.mjs:28-57`, and frontmatter shape from lines 1–10 of each module page.

### Verify

- `pnpm run validate:content` reports 12 bilingual step pairs and no errors.
- Temporarily malformed metadata produces a precise filename/field error, then restore it.
- `pnpm run check` accepts imports and JSDoc types.

### Guards

Do not duplicate order in landing arrays, use localized entry IDs, count the two root splash pages, treat overview `2 horas` values as step duration, or let schema defaults hide missing author input.

## Phase 2 — Shared Visual Foundation

### Implement

1. Split `src/styles/atlas.css` into ordered files registered through Starlight's existing `customCss` array: `tokens.css`, `shell.css`, `learning-path.css`, `lesson.css`, and `progress.css`. Remove the monolithic file after all selectors are migrated.
2. Define semantic light/dark tokens for surfaces, ink, muted text, primary/progress, lab, information, focus, borders, type, spacing, radii, shadows, and reading width. Verify all critical foreground/background pairs at WCAG AA.
3. Restyle the global Starlight header, navigation, search, sidebar, controls, code blocks, callouts, and pagination so landing and lessons share one system.
4. Replace tiny uppercase metadata, opacity-based muted text, rigid heights, positional `nth-child` layout, and overflow masking. Preserve the existing visible focus and reduced-motion patterns from `src/styles/atlas.css:201-205`, `485-489`, and `595-597`.

### Verify

- Inspect landing and one lesson in light/dark themes at 1440px and 390px.
- Confirm meaningful controls and metadata compute to at least 14px.
- Confirm focus indicators are visible and document width does not exceed viewport width.

### Guards

Do not retain fragile `:has(.atlas-home)`/adjacent-panel coupling, fixed card heights, `overflow: hidden` as a layout fix, or decorative colors without a semantic role.

## Phase 3 — Progress Engine and Reusable Components

### Implement

1. Add `src/lib/progress.ts` for versioned parsing, ID sanitization, completion toggling, percentage calculation, and the pure resume-target rule. It must accept canonical step data rather than inspecting URLs.
2. Add `src/scripts/learning-progress.ts` as the only browser-storage adapter. Scope DOM queries to `[data-learning-progress]` roots, guard every storage operation, use an initialization marker, and re-run on `astro:page-load`.
3. Dispatch a documented `atlas:progress-change` custom event after successful writes so multiple summaries update without duplicating storage code.
4. Add `src/components/ProgressSummary.astro` and the shared route/progress data hooks. Render useful static labels/links on the server; reveal personalized percentages, resume labels, and completion buttons only after enhancement succeeds.

### Verify

- Empty, corrupt, old-version, partially complete, last-step-complete, gapped, and fully complete states select the expected target through focused Playwright scenarios.
- Storage denial produces no `pageerror`, leaves content navigable, and keeps completion controls hidden.
- Progress survives reload and is shared between root Spanish and `/en/`.

### Guards

Do not access browser globals in Astro frontmatter, create multiple order-dependent init scripts, persist localized paths, or make progress the only route to content.

## Phase 4 — Lesson Integration

### Implement

1. Add `src/components/LessonHeader.astro` with type, module, route position, title, description, step duration, prerequisites, objectives, and progressive status hooks.
2. Add `src/components/LessonCompletion.astro` with takeaways, hidden-until-enabled completion control, canonical next-step explanation, and static next link.
3. Add `src/components/starlight/LessonPageTitle.astro`; read `Astro.locals.starlightRoute`, resolve the canonical step, and render `LessonHeader`. For non-step pages, reproduce the installed default `PageTitle` behavior. Always preserve `<h1 id="_top">`.
4. Add `src/components/starlight/LessonFooter.astro`; render completion UI only for canonical steps, then render the default Starlight footer so pagination remains available and secondary.
5. Register only these two overrides in `astro.config.mjs`. Achieve mobile sidebar/context behavior with shared CSS and a compact lesson context bar before considering a broader `Sidebar` override.

### Verify

- Each of the 12 Spanish and 12 English step routes shows the correct position and localized next recommendation.
- Root splash pages do not render lesson-only chrome.
- Heading hierarchy, `_top`, table of contents, language switch, and stock pagination continue working.

### Guards

Do not replace the full Starlight page, convert `.md` lessons to MDX unnecessarily, duplicate footer pagination, or infer route position from sidebar text.

## Phase 5 — Landing and Learning Route

### Implement

1. Refactor `src/components/AtlasHome.astro` into a compact composition using new `LearningHero.astro`, `LearningPath.astro`, `LearningEntryPoints.astro`, and `LearningMethod.astro` components. Keep a small typed locale-copy module instead of parallel hardcoded content arrays.
2. Render the three connected modules and twelve steps from the canonical definition. Show outcomes, step counts, computed durations, and progressive summaries. Use `id="learning-path"` as the review destination.
3. Implement static primary/secondary destinations first, then enhance the primary CTA to Start, Continue, or Review using the shared resume target. Implement “Open a lab” with the locked next-incomplete-lab rule.
4. Remove the radar, fictional status/location/date labels, decorative indices, filters, catalog duplication, and fake `$ atlas lab --start` terminal. Replace final promo panels with the understand–practice–verify methodology.
5. Make the path vertical on mobile and prioritize the current/next step without changing DOM reading order incoherently.

### References

Reuse the locale prop/import pattern in `src/components/AtlasHome.astro:2-68` and `src/content/docs/{index.mdx,en/index.mdx}`. Reuse semantic links and section labeling from `AtlasHome.astro:87-108` and `131-154`, not the filter/radar implementation.

### Verify

- New visitors see Start; partial progress sees the correct Continue target; complete progress sees Review.
- English and Spanish render the same canonical order with localized text/links.
- All removed phrases/elements are absent via `rg` and DOM assertions.
- Mobile route is readable, ordered, and free of hidden/clipped content.

### Guards

Do not create a second route catalog, expose fake metrics, use fixed panel heights, or let client enhancement cause a large layout shift.

## Phase 6 — Automated and Final Verification

### Implement tests

1. Update `tests/smoke.spec.ts` to remove filter assertions and retain basic landing, language, and route-opening coverage.
2. Add `tests/guided-learning.spec.ts` for seeded progress, completion toggle, reload persistence, locale switch, resume edge cases, completed route, storage denial, and canonical next-step behavior.
3. Add a mobile `test.describe` using `test.use({ viewport: { width: 390, height: 844 } })`. Assert visible navigation/context controls and compare `document.documentElement.scrollWidth` with `clientWidth`; do not accept clipping as success.
4. Add a dependency-free test helper for explicit opaque token/component contrast pairs and minimum computed font sizes. Do not claim this replaces a full accessibility audit.

### Final checklist

- Run `pnpm run check`.
- Run `pnpm run validate:content`.
- Run `pnpm run build`.
- Run `pnpm run test:e2e`.
- Run `git diff --check`.
- Search for removed UI copy and obsolete selectors/data hooks.
- Capture and inspect landing, module overview, concept lesson, and lab at desktop/mobile in light/dark modes.
- Confirm no unrelated user changes, including `AGENTS.md`, were reverted or accidentally committed.

## Suggested Commit Boundaries

1. `feat(content): define canonical learning path metadata`
2. `feat(ui): establish shared Atlas visual system`
3. `feat(progress): add local learning progress`
4. `feat(lessons): integrate guided lesson chrome`
5. `feat(landing): present the guided learning route`
6. `test(ui): cover guided learning experience`

Each commit should pass the checks relevant to its phase; the final commit must pass the complete verification checklist.
