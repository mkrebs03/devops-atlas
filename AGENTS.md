# Repository Guidelines

## Project Structure & Module Organization

This repository builds the bilingual DevOps Atlas documentation site with Astro and Starlight. Spanish pages live in `src/content/docs/`; matching English pages live under `src/content/docs/en/`. Organize learning content by module: `foundations`, `collaboration`, `server`, `containers`, `integration`, `deployment`, `scaling`, or `infrastructure`. Shared UI is in `src/components/`, site styling in `src/styles/`, and translations in `src/content/i18n/`. Playwright smoke tests are stored in `tests/`. Deployment assets belong in `deploy/`, while CI and release workflows live in `.github/workflows/`.

## Build, Test, and Development Commands

Use Node 20.11–25 and pnpm 10.29.3 (see `.node-version` and `package.json`).

- `pnpm install --frozen-lockfile` installs the exact locked dependencies.
- `pnpm dev` starts the local Astro server at `http://localhost:4321`.
- `pnpm run check` performs Astro and TypeScript checks.
- `pnpm run validate:content` validates documentation frontmatter, ES/EN file parity, and unique slugs.
- `pnpm run build` runs all source/content checks and creates the static production build.
- `pnpm run test:e2e` runs Chromium smoke tests; `pnpm run test:e2e:ui` opens Playwright's UI.
- `pnpm preview` serves the generated build locally.

## Coding Style & Content Conventions

Use two-space indentation, single quotes in TypeScript/JavaScript, and semicolons, matching existing files. Prefer descriptive kebab-case documentation names such as `lab-container-pipeline.md`; use PascalCase for Astro components, for example `AtlasLanding.astro`. Every Markdown page requires `title` and `description` frontmatter; module pages also require `type` and `module`. Allowed values are enforced in `scripts/validate-content.mjs`. Frontmatter is parsed by a minimal YAML subset (`scripts/frontmatter-parser.mjs`): quote any value that contains a colon, and avoid nested lists, objects, and multiline scalars. Canonical module pages additionally require `tools` and `prerequisites`, with identical `tools` across locales. Diagrams are authored as `mermaid` fenced code blocks and rendered client-side (see `src/components/starlight/MermaidRunner.astro`). Keep Spanish and English navigation and content counterparts synchronized when changing user-facing material — the validator requires an English counterpart file for every Spanish page and vice versa.

## Testing Guidelines

Add or update `*.spec.ts` files in `tests/` for user-visible routes and interactions. Prefer accessible Playwright locators (`getByRole`, `getByText`) and stable `data-*` hooks over CSS structure. Before submitting, run `pnpm run build` and `pnpm run test:e2e`; these mirror the pull-request validation workflow.

## Commit & Pull Request Guidelines

History follows Conventional Commit-style subjects: `feat:`, `fix:`, and `docs:` followed by a concise imperative summary. Keep commits focused. Pull requests should explain the purpose and validation performed, link related issues, and include screenshots for visual changes. Call out content-schema, deployment, or environment changes explicitly; never commit credentials or production `.env` files.
