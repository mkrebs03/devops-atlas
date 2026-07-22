# Guided Learning UI Redesign

## Purpose

DevOps Atlas will become a guided educational platform for people beginning their DevOps journey. It must remain more distinctive than a conventional documentation wiki while making learning—not decoration—the primary experience. The redesign will give every visitor an obvious starting point, a visible route through the material, and a clear next step.

The site remains bilingual, statically generated with Astro and Starlight, and usable without an account or backend.

## Current Problems

The landing and documentation pages look like separate products. The landing uses a highly editorial visual language, while lessons retain Starlight's mostly default presentation. Several decorative labels—such as `ATLAS / 001`, `ESTADO: APRENDIZAJE`, and `VALPARAÍSO / 2026`—appear meaningful but provide no useful context. The radar, simulated terminal command, arbitrary card numbers, and early catalog filters add visual complexity without helping a learner decide what to do.

Important text has insufficient contrast on some module cards. Metadata and controls are often too small, fixed card heights produce awkward composition, and the mobile layout stacks desktop elements without sufficiently reprioritizing them. Lessons lack visible objectives, route position, completion state, and a meaningful transition to the next topic.

## Experience Direction

The product will use a contemporary technical field-notebook aesthetic: warm, approachable, and precise. Its distinctive element will be a functional learning route rather than unexplained ornament.

- Use a warm light surface, near-black blue ink, and acid green for primary actions, active states, and progress.
- Reserve coral for hands-on practice and cyan for supporting information.
- Use editorial typography selectively for major headings and a highly legible sans serif for navigation, controls, and lesson content. Code remains monospaced.
- Keep meaningful interface text at a practical minimum of 14px and meet WCAG AA contrast for text and controls.
- Define shared tokens for color, type, spacing, borders, radii, shadows, and content widths.
- Use the same header, controls, cards, code blocks, and interaction language throughout landing, modules, and lessons.

## Landing Page

The landing becomes the learner's control point rather than a long promotional composition.

The compact hero explains that the platform teaches how a change moves from a terminal to production. Its primary action is **Start the route** for a new visitor and **Continue learning** when local progress exists. A secondary action opens all content. The hero states the real scope of the current curriculum: three modules, twelve learning steps, including three practical labs.

The main visual is a connected learning path with three stages:

1. **Understand the machine** — Linux, terminal, and networking.
2. **Work with changes** — Git and collaboration.
3. **Deliver with confidence** — Docker and automation.

Each stage shows its learning outcome, lesson count, estimated duration, and completion progress. Connections express order and dependency. On mobile this route becomes vertical and places the current or next lesson first.

The twelve completable steps are the four existing pages in each module. The module `index.md` page is step one and acts as its conceptual introduction; the three topic or lab pages that follow are steps two through four. English counterparts represent the same steps and do not increase the total. All twelve pages participate in ordering, completion totals, and previous/next recommendations.

A short entry section offers three useful choices: start from zero, open a lab, or resume the last lesson. The existing catalog filters are removed until the content volume justifies them. The final promotional panels are replaced with the explicit methodology: understand, practice, verify.

## Lesson Experience

Starlight's navigation foundation remains, but lesson pages adopt the shared visual system. Each lesson begins with an educational header containing:

- content type, module, and actual position in the route;
- title and description;
- estimated time and prerequisites when supplied;
- concrete learning objectives;
- pending, in-progress, or completed state.

Lesson content uses a controlled reading width, clearer type hierarchy, comfortable line height, and high-contrast code blocks. Notes, cautions, and tips use semantic styles rather than decorative color.

Every lesson ends with key takeaways, a **Mark as completed** control, and a recommended next lesson with a short explanation of the connection. Previous/next navigation remains available but visually secondary.

On mobile, module navigation is collapsible. A compact context bar exposes the module, progress, and next step without obstructing the content.

## Progress Model

Progress is functional and stored in `localStorage`; no account, analytics pipeline, or server state is introduced. The model records stable lesson identifiers, completed lessons, and the last visited lesson. Spanish and English counterparts share identifiers so changing language does not duplicate progress.

The resume target follows one rule everywhere. If no step has been visited, use the first step. If the last visited step is incomplete, resume it. If it is complete, select the first incomplete step after it; when no later step exists, select the earliest incomplete step in the route. When all twelve steps are complete, replace the resume action with **Review the route**, link it to the route summary, and present the course as completed. “In progress” means the last visited step when it is not completed; all other incomplete steps are pending. The mobile priority and landing CTA use this same target.

Progressive enhancement is required. When JavaScript or browser storage is unavailable, all content and navigation remain usable; only persistence controls and personalized resume behavior are omitted or become non-persistent.

## Technical Structure

A single typed learning-path definition owns module order, lesson order, identifiers, relationships, and localized labels. Frontmatter remains the source for lesson-specific educational metadata. Every routed page requires the existing `title`, `description`, `type`, `level`, `module`, `tools`, and `prerequisites` fields plus `estimatedTime: string`, `learningObjectives: string[]`, and `takeaways: string[]`. The path definition—not frontmatter—owns the stable identifier and numeric order, preventing locale-specific duplication.

The UI is divided into focused Astro components:

- `LearningPath.astro` renders the complete route.
- `ProgressSummary.astro` renders module and course progress.
- `LessonHeader.astro` presents lesson context and objectives.
- `LessonCompletion.astro` handles completion and the recommended next step.
- A small client script reads and writes versioned progress data.

CSS is organized into shared tokens and focused layers for the global shell, learning route, lesson content, and progress components. Fixed content heights and fragile layout selectors should be removed where practical.

## Content and Validation

Spanish and English pages must remain structurally paired. Content validation will verify that every routed lesson has a unique stable identifier, valid module and order, and required educational metadata. The learning-path definition must not reference missing pages or duplicate positions.

Existing educational prose and labs remain in scope; editing content is limited to metadata, objectives, takeaways, and wording required to support the new experience.

## Testing

Automated checks will cover:

- landing behavior with no saved progress and with prior progress;
- marking and unmarking a lesson;
- persistence after reload;
- shared progress across Spanish and English routes;
- route ordering and next-lesson recommendations;
- mobile navigation and absence of horizontal overflow;
- graceful behavior when local storage cannot be used;
- existing build, content validation, and Playwright smoke tests.

Critical color tokens and component states will be checked against WCAG AA during implementation and visual review.

## Scope Boundaries

This redesign does not add authentication, cloud synchronization, certificates, quizzes, search replacement, content authoring tools, or a backend. It does not expand the curriculum beyond the existing three modules.

The radar, fictional status labels, location/date footer, simulated `atlas` command, decorative numbering, premature catalog filters, low-contrast treatments, and rigid card heights will be removed.

## Success Criteria

The redesign is successful when a first-time visitor can understand what the platform teaches and where to begin within seconds; every learning screen exposes a clear next step; progress survives reloads and language changes; landing and lessons feel like one product; critical text and controls meet WCAG AA contrast; and desktop and mobile maintain readable hierarchy without overflow. Production build, content validation, and end-to-end tests must pass.
