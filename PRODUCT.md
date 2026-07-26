# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user: someone who wants to move **into** a DevOps role and already has software-development fundamentals. The archetype is the author's own path — a computer/informatics-engineering background (Chile) where the degree centers on software development, project management, and requirements gathering, and DevOps is skimmed as a concept but never taught in depth.

The audience is defined by intent and prerequisite, not by enrollment status: self-taught learners, career switchers, and students are all in scope as long as they hold basic software-development knowledge and want to become job-ready in DevOps. Bilingual: Spanish (primary) and English learners are first-class equals.

## Product Purpose

DevOps Atlas is a bilingual DevOps **reference**: the place a developer moving into DevOps goes to understand a concept, look up a tool, or follow a practical walkthrough. Reading and finding — not tracking — is the primary experience. Every visitor gets an obvious way in, a clear map of what exists, and a fast path back to a page they already read.

## Positioning

**Settled: a reference wiki that is better than the alternatives, not a course.**

An earlier framing tried to differentiate through a guided route with progress, stations, and labs-as-checkpoints. That mechanic was hollow — progress was self-marked in `localStorage` and could be filled in without doing anything, and "labs" were prose asking the learner to run commands with nothing verifying them. It has been removed rather than propped up.

The differentiator is now **content quality, coverage, and navigation**:

- Breadth across the full DevOps lifecycle, in Spanish and English as equals — a combination that barely exists.
- Explanations that build a mental model (where a boundary is, what evidence distinguishes two failure modes), not definitions to memorize.
- Practical, runnable walkthroughs presented honestly as walkthroughs: real commands, real output, no claim that the site checked anything.
- Reference ergonomics: strong search, an A–Z of tools and terms, cheatsheets, cross-links between related pages.

Hard constraint: Atlas makes **no claim it cannot back**. No progress percentages, no completion badges, no "verified" state, no fabricated outcomes.

## Operating Context

- Static site built with Astro + Starlight; static output, no account and no backend.
- No reader state: no accounts, no progress, no personalization. The theme preference, stored under Starlight's own `starlight-theme` key, is the only thing the site ever writes to the browser.
- Bilingual by construction: Spanish pages at `src/content/docs/`, English counterparts under `src/content/docs/en/`. Navigation and content counterparts must stay synchronized.
- Content is organized as modules of ordered pages (`src/data/curriculum.mjs`) — a suggested reading order, not a gated path. Module ids: `foundations`, `collaboration`, `delivery`, `testing`, `deployment`. Page kinds: `overview`, `concept`, `tool`, `practice`, `cheatsheet`.
- Every Markdown page carries enforced frontmatter (`title`, `description`; module pages also `type`, `level`, `module`, and canonical pages additionally `tools`, `prerequisites`, `learningObjectives`, `takeaways`), validated by `scripts/validate-content.mjs`. Spanish/English objective and takeaway counts must match.
- Diagrams authored as `mermaid` fenced blocks, rendered client-side.
- Usable without an account or backend; must degrade gracefully (progressive enhancement).

## Capabilities and Constraints

- **Prerequisite:** assumes the learner already has software-development basics; Atlas does not teach programming from zero.
- **Scope roadmap (committed):** grow toward the full DevOps lifecycle. Five modules shipped (Foundations, Collaboration, Delivery, Testing, Deployment); Infrastructure as Code, cloud, Kubernetes, observability, and security are planned lifecycle coverage the product is committed to reaching.
- No backend, no auth, no user data collection, no stored reader state beyond the theme preference (see Operating Context).
- Bilingual parity is a hard constraint, not a nice-to-have.
- WCAG-AA contrast for text and controls; meaningful interface text at a practical minimum of ~14px.

## Brand Commitments

- Name: **DevOps Atlas**.
- A personal project / portfolio piece by the author. Public attribution style (whether the author's name appears on the surface) is undecided.
- The visual identity is committed and lives in `DESIGN.md`: the "quiet reading room" world, implemented in `src/styles/tokens.css`. Both prior worlds — the "technical navigation chart" cartographic system and the "Learning Line" transit strip-map — are retired anti-references: the transit world encoded stations-as-checkpoints, a mechanic the product no longer has. The one open brand decision is the attribution style noted above.

## Evidence on Hand

- Real, shipped bilingual content across all five modules (`src/content/docs/` and `.../en/`), including five hands-on walkthroughs.
- Enforced ES/EN parity via `scripts/validate-content.mjs`: every Spanish file must have its English counterpart file and vice versa (standalone pages included), and canonical pairs must agree on `level`, on `tools` (same order), and on objective/takeaway counts. It checks files and frontmatter — not prose equivalence.
- No testimonials, enrollment numbers, learner counts, employer outcomes, or endorsements exist — future work must not fabricate them.
- The guided-route/progress machinery once shipped here was removed deliberately (see Positioning); it is the project's anti-reference and must not be reintroduced.

## Product Principles

1. **Orientation is the point.** A reader should always know what this page is, which module it belongs to, what exists around it, and how to find it again. Navigation beats catalog.
2. **Do, don't memorize.** Prefer explanations that build a mental model and walkthroughs the reader can actually run over walls of definitions. Practical pages stay honest: the site never claims to have checked the reader's work.
3. **Job-readiness is the bar.** Content earns its place by moving the reader toward performing in a real DevOps role, not by completeness for its own right.
4. **Bilingual equals.** Spanish and English are peers; neither is a translation afterthought.
5. **No lock-in, no gatekeeping.** Free, accountless, static, accessible — nothing between a motivated learner and the material.

## Accessibility & Inclusion

WCAG-AA contrast for text and controls; practical minimum ~14px for meaningful interface text; progressive enhancement so the site is usable without JavaScript-dependent features blocking core reading and navigation.
