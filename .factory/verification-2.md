# Verification 2 — Mnemonic Mercenary

## Verdict

**PASS.** All five findings from verification 1 are repaired. All 15 declared
claim commands pass, with no untested public claim remaining.

## Candidate and live parity

- Live URL: https://mnemonic-mercenary.sociobot.in
- Failed baseline: `19cb360f89a3350c3fe1f9078fa6741ea33eee64`
- Deployed implementation: `e53e351cc9d69634bdb5a69efc2a304c41282eb1`
- Artifact: static Vite and TypeScript browser game
- Review date: 2026-09-06 UTC

The live hashed JavaScript and CSS assets and `404.html` match the final local
`dist/` files byte for byte. A later documentation-only commit records this
verification and does not require another product image.

## First screen and complete game loop

Fresh desktop and 390 px phone contexts opened at scroll position zero. Both
showed “Remember symbol routes to choose combat moves,” the player audience,
the sample action and its result, three facts, and the active game board inside
the viewport.

A deterministic phone run restarted at fight 1, completed all six fights, and
showed “You cleared all six fights” with 6 / 6 fights survived. A separate
desktop run submitted three wrong routes, reached 0 / 6 health, and showed the
loss screen. Both end screens focused their restart action. Live evidence is
listed below.

## Finding disposition

| Finding | Result | Evidence |
| --- | --- | --- |
| MM-V1-01 demo cleanup | Fixed | **Start for real** removes both demo storage keys, preserves a real-data sentinel, and reopening `/demo` starts the fight-3 sample. `@claim:demo-discarded` passes. |
| MM-V1-02 lost focus | Fixed | Loss focuses restart, a changed checkbox retains focus, and timed hiding focuses the first symbol. Keyboard tests pass on desktop and phone. |
| MM-V1-03 phone targets | Fixed | Every rendered link on demo, privacy, and 404 pages measures at least 44×44 CSS px at 390 px. |
| MM-V1-04 incomplete 404 | Fixed | An unknown live route returns HTTP 404 with a skip link, shared header navigation, plain “Page not found” h1, complete footer navigation, and build line. |
| MM-V1-05 claim gaps | Fixed | The unsupported 6–10 minute estimate was removed. Input/focus, reduced motion, three-miss loss, demo disposal, named cues, and paid content now have outcome tests. |

The 404 response remains deliberately HTTP 404; that status is expected and
was not classified as an error.

## Declared claims

Each exact command in `.factory/claims.json` was run separately after a clean
`npm ci`. Every command passed in both desktop and phone projects.

| Claim | Observable result |
| --- | --- |
| `six-fight-end` | A run started at fight 1 and reached the six-fight win screen. |
| `restart-reset` | Restart returned to fight 1 with 6 / 6 health. |
| `settings-persist` | Non-timed mode persisted after reload and kept the route visible past 3.2 seconds. |
| `local-only-data` | Demo play made only same-origin GET requests, no XHR/fetch or account request, and preserved real storage. |
| `safe-partial-recall` | A correct prefix produced Guard with no health loss. |
| `demo-isolated` | One click opened a populated fight-3 sample; reset and play kept the label and real storage unchanged. |
| `demo-discarded` | Starting for real removed both demo keys and preserved real data. |
| `route-curve` | A full run displayed lengths 3, 3, 4, 5, 6, and 7. |
| `full-recall-strike` | Selecting the complete route produced Strike. |
| `wrong-recall-cost` | A wrong route reduced health from 4 to 2. |
| `three-misses-end` | Three misses from full health reached the loss screen at 0 health. |
| `input-focus` | Pointer, touch, Tab, Enter, Space, and a 3 px focus outline worked in independent contexts. |
| `reduced-motion` | Miss motion rendered at no more than 0.01 ms with reduced motion enabled. |
| `named-symbol-cues` | Every route step exposed a visible glyph, visible name, and spoken cue. |
| `complete-price` | The game exposed route variation, a relic, accessibility settings, US$4.99 one-time terms, and no checkout or activation control. |

## Additional paths

- Null, malformed JSON, and out-of-range saved state recover to a playable
  fight 1 with full health.
- A resolved real fight survives refresh and can continue.
- Phone text enlarged to 200% keeps the play control and has no horizontal
  document overflow.
- History navigation restores the route and focuses its h1.
- `/`, `/demo`, `/privacy`, `/terms`, `/rules`, `/license`, site assets,
  `robots.txt`, and `sitemap.xml` return HTTP 200.
- The live response includes CSP, HSTS, `X-Content-Type-Options`, and
  `Referrer-Policy`. Browser checks logged no console or page errors.
- Offline play, multiplayer, accounts, a backend, and analytics are not
  advertised, so those backend and multiplayer checks are not applicable.

## Commands and measurements

- `npm ci` — passed; 0 vulnerabilities reported.
- Fifteen exact commands from `.factory/claims.json` — passed in both projects.
- `npm test -- --reporter=dot` — 48 passed locally.
- `PLAYWRIGHT_BASE_URL=https://mnemonic-mercenary.sociobot.in npm test -- --reporter=dot`
  — 48 passed against the deployed site.
- `npm run build` — passed and produced `dist/`.
- Initial assets: JavaScript 7.20 KB gzip; CSS 3.18 KB gzip; total deployment
  artifacts 79,342 bytes.
- `npm run verify` with the documented local preview — passed.
- `scripts/verify-url.sh https://mnemonic-mercenary.sociobot.in` — passed.
- Playwright axe integration across all public routes and open settings — no
  serious or critical WCAG 2 A/AA violations.
- Live Lighthouse 12.8.2 on `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100, LCP 0.8 s, CLS 0, TBT 0 ms.
- A live 390 px context under 4× CPU throttling measured 60.1 animation frames
  per second over two seconds.

## Evidence

- `/work/.evidence/sf-mnemonic-mercenary-repair2-final-claims.log`
- `/work/.evidence/sf-mnemonic-mercenary-repair2-live-observations.json`
- `/work/.evidence/sf-mnemonic-mercenary-repair2-live-lighthouse.json`
- `/work/.evidence/sf-mnemonic-mercenary-repair2-live-desktop-first-screen.png`
- `/work/.evidence/sf-mnemonic-mercenary-repair2-live-phone-first-screen.png`
- `/work/.evidence/sf-mnemonic-mercenary-repair2-live-phone-win.png`
- `/work/.evidence/sf-mnemonic-mercenary-repair2-live-desktop-loss.png`
- `/work/.evidence/sf-mnemonic-mercenary-repair2-live-phone-404.png`
- `/work/.evidence/catalog-description.txt`
- `/work/.evidence/billing-offer.json`

## Remaining dependency

The separate billing-registration operator has not registered the public
US$4.99 one-time offer. The product therefore makes no checkout, purchase,
entitlement, or license-validation claim. No provider credential is present.
The complete paid deliverable and exact terms remain documented; the playable
build remains available for product QA.
