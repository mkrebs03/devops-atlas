# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone who looks up a DevOps topic and reads Spanish or English. The pages assume the reader already writes code.

## Product Purpose

DevOps Atlas is one person's DevOps notes, shared and organized as a reference. Martín Sanhueza Krebs, a computer engineering student at Universidad de La Frontera, writes them while learning, to share that knowledge and to keep a record of it. A reader comes to look something up: a concept, a tool, or a written walkthrough.

## Positioning

Personal notes, arranged for lookup. The site makes no comparison with other resources and no claim about what a reader will be able to do after reading.

- The author appears on the site by name. The About page (`/about/`) states which topics the author runs on real systems, which were used in a project, and which were only studied.
- Pages on topics the author has only studied carry a short note at the top that says so.
- The walkthroughs are written, not run end to end, and each one says so. Their output is illustrative.
- It stays a reference: modules by topic, a glossary, an A–Z of tools. It is not a chronological blog.

## Operating Context

- Static site built with Astro + Starlight; static output, no account and no backend.
- No reader state. The theme preference, stored under Starlight's own `starlight-theme` key, is the only thing the site writes to the browser.
- Bilingual: Spanish pages at `src/content/docs/`, English counterparts under `src/content/docs/en/`. Navigation and content counterparts must stay synchronized.
- Content is organized as modules of ordered pages (`src/data/curriculum.mjs`), a suggested reading order. Module ids: `foundations`, `collaboration`, `server`, `containers`, `integration`, `deployment`, `scaling`, `infrastructure`. Page kinds: `overview`, `concept`, `tool`, `practice`, `cheatsheet`.
- Modules are grouped by the state of the system a page describes (one server, containers, automated checks), so the order explains why each tool exists.
- Every Markdown page carries enforced frontmatter (`title`, `description`; module pages also `type` and `module`, and canonical pages additionally `tools` and `prerequisites`), validated by `scripts/validate-content.mjs`.
- Diagrams are authored as `mermaid` fenced blocks and rendered client-side.

## Capabilities and Constraints

- Eight modules: Foundations, Collaboration, One server, Containers, Continuous integration, Continuous deployment, Operating and scaling, Infrastructure as code. Testing lives inside Continuous integration, and load balancing inside Continuous deployment because blue-green and canary are defined by what they change in the balancer.
- Not written yet: public clouds, security, and Kubernetes beyond an introduction.
- No backend, no auth, no user data collection.
- Spanish/English parity is a hard constraint.
- WCAG-AA contrast for text and controls; meaningful interface text at a practical minimum of ~14px.

## Brand Commitments

- Name: **DevOps Atlas**.
- Attribution: the author's full name, university and GitHub appear on the landing and on the About page. The groups and projects the author works for are described generically, not named.
- The visual identity lives in `DESIGN.md`: the "quiet reading room" world, implemented in `src/styles/tokens.css`.

## Evidence on Hand

- Bilingual content across all eight modules, including six written walkthroughs on one sample application (`/sample-app/`).
- ES/EN parity enforced by `scripts/validate-content.mjs`: every Spanish file needs its English counterpart and vice versa, and canonical pairs must agree on `tools` in the same order. It checks files and frontmatter, not prose equivalence.
- The author's hands-on experience is the one recorded on the About page. Nothing beyond it should be claimed or implied.
- No testimonials, reader counts, or endorsements exist, and none should be invented.

## Product Principles

1. **Say where it comes from.** First person where the author talks about personal experience, and a plain statement wherever a page goes past it.
2. **Describe the pages, not the reader.** No learning objectives, levels, or promised outcomes.
3. **Keep it easy to look up.** A reader should know what a page is, which module it belongs to, and what is around it.
4. **Plain prose.** A closing aphorism stays only when it teaches something.
5. **Both languages complete.** Every page exists in Spanish and in English.

## Accessibility & Inclusion

WCAG-AA contrast for text and controls; practical minimum ~14px for meaningful interface text; progressive enhancement so the site is usable without JavaScript-dependent features blocking core reading and navigation.
