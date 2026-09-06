# Review 1 — Mnemonic Mercenary

## Verdict

**PASS — 0 findings, 0 untested public claims.**

This is a fresh strict review of the deployed product. The result is based on
new desktop and phone browser runs, a clean local install, every declared
claim command, and a live-suite rerun. No product code was changed.

## Reviewed candidate

- Live URL: https://mnemonic-mercenary.sociobot.in
- Implementation candidate: `e53e351cc9d69634bdb5a69efc2a304c41282eb1`
- Documentation and verification baseline: `04e7b2dcb95754dcf1940511762e16e6580dc3c0`
- Review date: 2026-09-06 UTC
- Artifact: static Vite + TypeScript browser game; it has no backend and does
  not advertise multiplayer.

Fresh SHA-256 comparisons show the live `index.html`, hashed JavaScript,
hashed CSS, and `404.html` exactly match a local build of the reviewed
implementation. The later baseline supplies verification records and claim
test documentation; it does not change the deployed game implementation.

## First screen before scrolling

Fresh 1440×900 desktop and 390×844 touch-phone contexts opened `/` at scroll
position zero. Both showed the active game board, not a menu wall.

- Job: “Remember symbol routes to choose combat moves.”
- Audience: players wanting a short touch-friendly roguelike where partial
  recall is a safe tactical choice.
- First action: “Try it with sample data” and its immediate result, “See a
  saved fight now.”
- Facts: six fights per run, a non-timed option, and device-local runs.

The phone document width was 390 CSS pixels with no horizontal overflow.

## Game and demo evidence

- A fresh desktop sample was restarted at fight 1. Six correct safe prefixes
  reached the actual win screen, “You cleared all six fights,” with 6 / 6
  health; **Start another run** received focus.
- A separate fresh touch-phone sample used three wrong recalls and reached the
  actual loss screen at 0 / 6 health. Restart then returns a run to fight 1
  with full health. Keyboard-loss focus is covered by the passing desktop and
  phone claim tests; touch activation itself does not impose a keyboard focus
  target.
- The one-click `/demo` sample starts at fight 3 with 4 / 6 health, the Brass
  compass, and two completed fights. Its “Demo — sample data, nothing is
  saved” label remains present through play and reset.
- Demo reset restores that populated snapshot. Starting for real removes both
  demo storage entries and leaves a real-run sentinel unchanged. The demo
  never reads or writes the real-run storage names.
- Normal, wrong, boundary, and recovery paths pass: Guard and Strike outcomes,
  exactly two health lost on a wrong prefix, the 3/3/4/5/6/7 route curve, three
  misses ending the run, malformed saved data recovery, and refresh recovery.
- Non-timed mode persists and keeps the route visible. Reduced motion removes
  the impact movement. No offline, update, multiplayer, backend, account, or
  checkout behavior is promised, so those are not treated as untested claims.
- An independent 390 px phone context throttled 4× measured 121 animation
  frames in 2,012.7 ms: 60.12 fps. This is an observed quality measurement,
  not public marketing copy.

Fresh screenshots and audit files are in `/work/.evidence/`:

- `sf-mnemonic-mercenary-review1-desktop-first.png`
- `sf-mnemonic-mercenary-review1-phone-first.png`
- `sf-mnemonic-mercenary-review1-desktop-win.png`
- `sf-mnemonic-mercenary-review1-phone-loss.png`
- `sf-mnemonic-mercenary-review1-lighthouse-12.json`

## Claim commands

After `npm ci`, all exact commands registered by `.factory/claims.json` were
run independently. Each passed in both desktop and phone projects (two tests
per command):

| Claim ID | Result |
| --- | --- |
| `six-fight-end` | PASS |
| `restart-reset` | PASS |
| `settings-persist` | PASS |
| `local-only-data` | PASS |
| `safe-partial-recall` | PASS |
| `demo-isolated` | PASS |
| `demo-discarded` | PASS |
| `route-curve` | PASS |
| `full-recall-strike` | PASS |
| `wrong-recall-cost` | PASS |
| `three-misses-end` | PASS |
| `input-focus` | PASS |
| `reduced-motion` | PASS |
| `named-symbol-cues` | PASS |
| `complete-price` | PASS |

Landing, demo, rules, privacy, terms, offer, and README statements were
cross-checked with the registry. The one-time offer has the exact public price
of US$4.99, includes the stated six-fight content, route variations, relics,
and accessibility settings, and honestly says checkout and license validation
are unavailable. No subscription, purchase, activation, account, or
multiplayer success is claimed.

## Accessibility, privacy, routes, and quality gates

- `npm ci` passed with 0 vulnerabilities.
- `npm run build` passed and produced `dist/`: 7.20 KB gzip JavaScript and
  3.18 KB gzip CSS.
- Local `npm test -- --reporter=dot` passed: 48/48.
- Live `PLAYWRIGHT_BASE_URL=https://mnemonic-mercenary.sociobot.in npm test
  -- --reporter=dot` passed: 48/48.
- `npm run verify` passed against a local production preview. The same live
  verifier passed title, language, exactly one main, exactly one h1, image
  alternatives, and console checks.
- The live Playwright axe integration found no serious or critical WCAG 2 A/AA
  violations on all public routes and open settings. Keyboard, pointer, touch,
  visible focus, 44 px phone targets, 200% text, and reduced motion all pass.
- Captured demo requests were same-origin GET asset/document requests only;
  there are no analytics, ads, account requests, remote fonts, or third-party
  runtime scripts.
- All public routes and internal links under test returned 200. An unknown
  route correctly returned the designed 404 page with shared header, skip
  link, navigation, footer, and a way back. HTTP 404 is expected, not a
  finding.
- Live CSP, HSTS, `X-Content-Type-Options`, and `Referrer-Policy` headers are
  present. The CSP permits only self-hosted product resources.
- Lighthouse 12.8.2 emitted a valid live audit with Performance 100,
  Accessibility 100, Best Practices 100, and SEO 100 (LCP 0.8 s, CLS 0, TBT
  0 ms). Its local Chromium process then reported a tab-shutdown crash and
  exited nonzero after writing the completed JSON. Repeating with Lighthouse
  13.4.1 yielded the same complete 100-score audit before the same local
  shutdown. This is runner cleanup, not a missing audit result or product
  failure; it is recorded here rather than represented as a successful command.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| MM-V1-01 demo data remained after leaving demo | Fixed: Start for real clears demo run and settings while preserving real data. |
| MM-V1-02 dynamic updates lost keyboard focus | Fixed: settings, timed hide, win, loss, and transitions keep or move focus to a usable control in the desktop and phone claim suites. |
| MM-V1-03 phone targets were under 44 px | Fixed: all rendered phone links and primary play controls meet the 44×44 CSS px requirement. |
| MM-V1-04 404 lacked the common structure | Fixed: live unknown routes retain HTTP 404 and have a plain h1, skip link, header, navigation, footer, and return link. |
| MM-V1-05 claim coverage was incomplete | Fixed: 15 exact outcome-level claim commands now cover retained public promises; the unmeasured duration copy was removed. |

## Final result

**PASS — 0 findings, 0 untested public claims.**
