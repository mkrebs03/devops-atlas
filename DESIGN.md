# Design

<!-- impeccable:design-schema 1 -->

## World

**Quiet reading room.** A near-black ground, warm bone text instead of white,
borders at the edge of visibility, one coral accent spent sparingly, small
radii, and no shadows anywhere. The character is carried by colour and
restraint, not by ornament or metaphor.

The direction was chosen from a reference the author picked deliberately:
`docs.zen-browser.app`. What was taken from it is the system — ground and
surface relationship, bone-on-black text, coral used only for links and current
state, hairline borders, 6px radii, no elevation — not its layout or copy.

Two previous worlds are retired and must not be revived, whole or in fragments:

1. *Nautical / cartographic chart* — drafting film, coordinate graticule, amber
   accent, double chart frames, map/survey framing.
2. *Learning Line transit strip-map* — vertical rail, module line segments,
   "stations" (labs) and "stops", a "you are here" marker, service-board
   readouts. It encoded a checkpoint mechanic the product no longer has.

Two surfaces, one world:

- **The landing** (`/`, `/en/`) is its own surface, built by
  `src/components/AtlasLanding.astro`. It answers what this is, what is inside,
  and what a page actually looks like — then stops. Its display line is the
  only place type goes large.
- **The reference** (every other page) is a reading surface: sidebar, content,
  table of contents, all on one continuous ground with no raised panels.

## Color

Strategy: **Restrained** — a near-monochrome ground with a single accent. Dark
is the default and the designed state; light is a real warm-paper counterpart,
not an inversion.

Exact values live in `src/styles/tokens.css` and are the source of truth. The
durable rules:

- `--atlas-bone` (`#D1CFC0`) is the text constant in dark. Never pure white.
- `--atlas-coral` (`#F76F53`) is the only accent: links, current sidebar item,
  current TOC item, the landing's primary action, the A–Z letter headings.
  It never fills a region and never marks state the site cannot know.
- Cards sit **darker** than the ground in dark (`#161616` on `#1F1F1F`), lighter
  in light. Borders are `#2E2E2E` / `#DEDACF` — visible only on inspection.
- No shadows. `--sl-shadow-*` are set to `none` on purpose.
- Contrast is binding and was measured in both themes: interface text ≥4.5:1,
  accent text ≥5.6:1. Coral text on paper uses `--atlas-coral-ink` (`#A63F27`),
  because the raw coral fails against a light ground.

## Type

- **Inter** (variable, self-hosted OFL, latin + latin-ext subsets) — interface
  and reading voice, matching the reference. Body 1rem, page titles 1.875rem/600.
- **Martian Mono** (self-hosted OFL) — code, terminal output, tool names,
  numerals, and the A–Z letters. Never prose.
- **Overpass** (self-hosted OFL) — reserved for the landing's display line only.

Binding: **0.875rem (14px) floor for every meaningful interface label**, body
measure 72ch, and `overflow-x: auto` on code blocks and tables so the page
itself never scrolls sideways.

## Form language

- Vocabulary matches reality. There are no stations, stops, checkpoints, or
  completed steps. Pages are pages; modules group them; practical pages are
  walkthroughs the reader runs themselves.
- Reading order inside a module is a **suggestion** (prev/next), never a gate.
- The header is three zones: wordmark (the way home), search owning the whole
  free middle column, and a controls cluster at the end. There is no separate
  "index" link — the wordmark is it.
- Language is a **segmented ES | EN pair**, never a dropdown: the two editions
  are peers, and the control shows which one you are reading. It links to the
  same path in the other language.
- Theme is a **two-state toggle**, not a three-option select. First visit
  follows the system; pressing it stores an explicit choice under Starlight's
  own `starlight-theme` key. That display preference is the only thing this
  site ever writes to the browser — nothing about the reader is stored.
- Cross-links are derived, never hand-maintained — the module's other pages,
  pages sharing a tool, and the A–Z entries for this page's tools.
- Terminal blocks show real commands and the output they really print; nothing
  illustrative is presented as a transcript.
- Radii: 6px for controls and cards, 10px for the landing's terminal figure.
- **Rules are structural, never decorative.** A divider is allowed only where it
  separates regions of the page: the header, the two sidebar edges, the line
  under the title block, the one above the page-foot links, and rows inside
  tables and the A–Z. Headings carry hierarchy with size, weight, and the space
  above them — never with an underline.
- The heading anchor is a 0.75rem icon, optically centred against the heading
  (the space above lives on `.sl-heading-wrapper`, not on the heading, or the
  icon centres against the margin box), revealed on hover or keyboard focus.
- Sidebar and table of contents share one grammar: group labels in small caps,
  nested items hanging off a hairline rail, the current item a filled chip with
  a 2px coral marker on that rail.
- Code blocks are Expressive Code, themed through its own `--ec-*` variables so
  the frame, its terminal title bar, and the code body stay a single object.

## Motion

Movement covers the seam between two states and does nothing else. It is there
when a change would otherwise read as a glitch — the sidebar arriving on a
phone, the search panel opening, the current item moving down the table of
contents as you scroll, the theme icon changing which state it offers — and it
is absent everywhere else. Nothing enters on scroll, nothing parallaxes, nothing
moves to draw attention to itself.

- Three durations and one curve, all in `src/styles/tokens.css`: `120ms` for an
  item in a list, `150ms` for a control, `220ms` for a surface that arrives
  whole, on a decelerated curve that answers immediately and settles.
- Only colour, opacity, and small translations move. There is no elevation to
  animate and no blur to fade — the search backdrop dims the page rather than
  blurring it, for the same reason the header does not.
- Nothing travels further than the edge it belongs to: the mobile sidebar comes
  in from its own edge by a fraction of its width, the search panel by half a
  line.
- In-page jumps scroll rather than teleport, so a heading's position stays
  legible relative to the one you left.
- Keyboard focus draws a coral ring offset from the control. It is the one
  place the accent marks something no other cue is carrying.
- `prefers-reduced-motion` is honoured in the token layer: the durations
  collapse and every animation on the page, including those that arrive with
  Starlight, Expressive Code, and Pagefind, becomes instant. No stylesheet
  downstream repeats that rule.

## Where the identity lives

`src/styles/tokens.css` holds every colour, size, rhythm, and timing decision
and also feeds Starlight's own `--sl-color-*` variables. `shell.css` (chrome),
`page.css` (reading surface and A–Z), and `landing.css` (landing only) consume
those tokens and add no raw values of their own. Changing the world means
rewriting those files — not the components or the content.

## Constraints

Bilingual ES/EN parity, WCAG-AA, ≥14px meaningful text, static Astro + Starlight,
no backend, **no reader state** (the only stored value is the theme preference,
under Starlight's `starlight-theme` key), self-hosted OFL
fonts (no CDN at runtime), and full function with JavaScript disabled — search
and Mermaid diagrams are the only JS-dependent enhancements, and neither may
block reading or navigation.
