# Handoff — Mnemonic Mercenary

## Release

- Live URL: https://mnemonic-mercenary.sociobot.in
- Artifact: static Vite + TypeScript browser game
- Implementation SHA deployed: `f03f3527f93bbb11e3e554f463e01cfe468e27e3`
- This handoff is a later documentation record; see the final Git commit after
  that implementation SHA for its documentation SHA.

## What was built

- A deterministic six-fight, touch-friendly tactical memory run. Each seed
  rotates enemy tells, chooses a relic, and uses routes of 3, 3, 4, 5, 6, and
  7 symbols.
- Full recall gives Strike. A correct route prefix gives safe Guard. A wrong
  recall costs two health, making a real loss screen possible. The run ends in
  a win or loss screen with a restart action.
- The game is visible on the first screen. It supports mouse, touch, Tab,
  Enter, and Space; route tiles have a name, shape, and verbal cue in addition
  to color. Non-timed mode and impact-motion settings persist locally.
- `/demo` and `?demo=1` open an isolated, populated fight-3 sample. The
  persistent banner has Reset demo and Start for real controls. Demo uses only
  `demo:mnemonic-mercenary:*` storage keys and never changes real-run keys.
- `/privacy`, `/terms`, `/rules`, and `/license` are real history-aware pages.
  Unknown paths return the designed `404.html` with an HTTP 404.
- Original code-drawn symbol assets, favicon, touch icon, and social card are
  included. The product uses no remote fonts, scripts, telemetry, ads, or
  account service.

## Offer and billing status

The public complete-game offer is **US$4.99 one time**, with no subscription.
Its deliverable is the six-fight expedition, route variations, relics, and
accessibility settings. Public, credential-free offer metadata is at
`/work/.evidence/billing-offer.json`; the catalog description is copied to
`/work/.evidence/catalog-description.txt`.

**Known external dependency:** the separate billing-registration operator has
not registered this offer. Consequently, this build deliberately has no
checkout redirect, entitlement assertion, or license validation claim. The
public `/license` page says this plainly. No provider credentials were added.

## Verification

From the documented Node 20+ setup:

- `npm install` — completed with no reported vulnerabilities.
- `npm test` — **28 passed**: complete run, restart, settings persistence,
  partial/full/wrong recall paths, demo isolation, local-only request check,
  keyboard focus, mobile controls, route titles, legal pages, 404 asset, and
  axe checks on desktop and a 390px phone profile.
- Every exact command listed in `.factory/claims.json` was run separately after
  the final implementation. All ten passed on both profiles.
- `npm run build` — passed; `dist/` created. Final initial assets: JavaScript
  7.04 KB gzip and CSS 3.12 KB gzip.
- `npm run verify` — passed title/lang/main/h1/alt/console smoke check.
- Axe is included in the browser suite; no serious or critical violations on
  home, demo, privacy, or open settings.
- Lighthouse 13.4.1 on local `/demo`: Performance **100**, Accessibility
  **100**.
- A scripted 390px phone run measured **60.6 fps** over one second and reached
  the win end screen. The live end-board evidence is
  `/work/.evidence/mnemonic-mercenary-live-end-board.png`.
- Fresh live desktop and phone contexts loaded over HTTPS. The live checks
  confirmed the first-screen title, demo banner, reset isolation, keyboard
  focus to the symbol control and end-screen restart, six-fight win screen,
  and zero console errors. `/privacy`, `/terms`, and `/demo` returned 200;
  an unknown route returned the designed page with HTTP 404.

## Review history and remaining work

The admitted checkout was only the factory scaffold. It had no earlier product
implementation, verification report, or review findings. During this work an
unknown route initially returned the SPA with HTTP 200; this was fixed by
rewriting only declared SPA paths and was rechecked live.

There is intentionally no multiplayer mode, backend, account progression,
offline claim, or analytics. There is no event telemetry for the brief’s
completion-rate success measure because the product is privacy-first and
local-only. If that measure is needed later, it requires a separate,
privacy-reviewed opt-in measurement decision. Billing registration is the only
current named dependency for the paid offer.
