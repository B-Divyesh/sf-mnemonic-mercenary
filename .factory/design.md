# Mnemonic Mercenary design system

## Direction

Mnemonic Mercenary uses a **night field manual**: a worn, high-contrast tactical
sheet for an expedition that has to be understood at a glance on a phone. The
route tiles are code-drawn symbols, not collectible fantasy art. The visual
language makes the memory task legible: named tiles sit in a measured row,
enemy tells have a warning rule, and the player's health has a green rule.
This is deliberately not a soft card-grid or a generic game landing page.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| void | `#15151c` | page background |
| night | `#211f2b` | game board |
| panel | `#2a2734` | controls and settings |
| ink | `#f8f1df` | primary text |
| muted | `#c4bda9` | supporting text |
| gold | `#f1bf62` | route and primary action |
| violet | `#d5b9ff` | navigation and demo state |
| green | `#a9e6ba` | safe state and health |
| danger | `#ffb6a5` | enemy and miss state |

All body text uses ink or muted on the void/night surfaces and exceeds 4.5:1
contrast. State always uses a word, shape, and color: the route symbols have a
glyph, a name, and a verbal cue; health and outcomes use text too.

## Type, spacing, and shape

- Display: Georgia, a locally available serif stack, gives enemy names and the
  game job a printed-field-note voice without downloading a font.
- Interface: system sans-serif stack for clear controls and mobile rendering.
- Scale: 0.78, 0.88, 1, 1.14, 1.5, 2.05–4.25rem. The interface uses an 8px
  rhythm with 44px minimum action targets.
- Shape: square tactical tiles, thin rules, and a deliberate 3px shadow. The
  board is a single field rather than a collection of unrelated cards.

## Interaction and motion

The board opens on the active fight. A route is visible, then hides after 3.2
seconds unless non-timed mode is enabled. The only optional game motion is a
180ms single miss impact; it is disabled by `prefers-reduced-motion` and can
also be switched off in settings. The simulation uses a clamped fixed 60Hz
tick and pauses its simulation accumulator while the document is hidden.

## Original assets and provenance

The five game glyphs, favicon, touch icon, and social card are original
hand-authored SVG/CSS assets in this repository. `public/og-card.png` is a
1200×630 raster export of the hand-authored social-card SVG for social readers.
No stock assets, third-party fonts, remote scripts, generated imagery, or
external audio are used. The footer discloses that the symbols are original
code-drawn work.

The repair-2 visual review inspected the 1200×630 social card at full size. Its
symbols, text, grid, and palette remain artifact-free and on-thesis, so no
generated replacement was needed.

## Difficulty curve

The run is six deterministic fights per seed. Route lengths are 3, 3, 4, 5, 6,
and 7. A correct first-symbol prefix always provides the safe Guard outcome;
the whole route gives Strike. A wrong recall costs two of six health, so three
wrong reads end a run. Every seed rotates six enemy tells and selects a relic.
