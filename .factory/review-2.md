# Review 2 — Remember symbol routes to choose combat moves

## Verdict

**PASS — 0 findings, 0 untested public claims.**

This review exercised the actual six-fight browser-game loop on fresh desktop
and touch-phone browser contexts and verified the clean checkout. Product code
was not changed.

## Reviewed candidate

- Live URL: https://mnemonic-mercenary.sociobot.in
- Implementation candidate: `e53e351cc9d69634bdb5a69efc2a304c41282eb1`
- Documentation and claim-test baseline: `3e6538db6b84f5b4cf9fd7d4441066d915e37ec2`
- Review date: 2026-09-06 UTC
- Product: static Vite + TypeScript browser game; it has no backend and does
  not advertise multiplayer, offline operation, a service-worker update path,
  accounts, checkout, or license activation.

The later commits change claim coverage, tests, and review records, not the
deployed game image. A fresh production build exactly matched the live
`index.html`, hashed JavaScript, hashed CSS, and `404.html` by SHA-256.

## First screen and game runs

Fresh 1440 x 900 desktop and 390 x 844 touch-phone contexts opened `/` at
scroll position zero. Both presented the active game board, rather than a
menu wall, with no phone horizontal overflow or console/page error.

- Job: “Remember symbol routes to choose combat moves.”
- Audience: players who want a short touch-friendly roguelike where partial
  recall is a safe tactical choice.
- First action: “Try it with sample data,” followed by “See a saved fight now.”
- Facts: six fights per run, a non-timed option, and runs staying on the
  device.

A fresh desktop demo was restarted, then cleared using one correct safe prefix
in each fight. It reached the real “You cleared all six fights.” end screen
with 6 / 6 health, a 6 / 6 survival summary, and the restart action present.
A separate fresh touch-phone demo was restarted, given three wrong first
symbols, and reached “Your guard gave out.” at 0 / 6 health. The phone loss
screen retained a 44 px restart action. These runs prove a deterministic entry
through active play to both actual end states.

The one-click sample opens `/demo` at fight 3 of 6 with 4 / 6 health, Brass
compass, and two previous fights. Its persistent “Demo — sample data, nothing
is saved.” label remains present through play and reset. Reset restores the
populated snapshot. Starting for real removes the two demo storage entries,
preserves real-run storage, and a new `/demo` begins from a fresh sample.

## Claims and behavior

After `npm ci`, every exact command declared by `.factory/claims.json` was run
independently. All 15 commands passed in both desktop and phone projects.

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

The full local suite passed 48 / 48. The same suite against the live URL
passed 48 / 48. The public landing, demo, rules, privacy, terms, license page,
and README were cross-checked against the claim registry. The public offer is
US$4.99 one time, includes the stated six-fight content, route variations,
relics, and accessibility settings, and honestly says checkout and license
validation are unavailable. No subscription, purchase, activation, account,
or multiplayer success is claimed.

Normal, invalid, boundary, and recovery paths covered by the suite pass:
Guard and Strike, a two-health wrong-recall cost, three misses ending a
full-health run, route lengths 3/3/4/5/6/7, real-run refresh recovery,
malformed saved-data recovery, restart reset, and persistent non-timed mode.
Touch, mouse, Tab, Enter, Space, visible focus, 200% text, symbol names/shapes
and spoken cues, and reduced motion all pass. There is no promised offline or
update behavior to test. Backend tenant, restart, health, and 429 checks do
not apply to this static product.

## Accessibility, privacy, routes, and performance

- `npm run build` passed and produced `dist/`: 7.20 KB gzip JavaScript,
  3.18 KB gzip CSS, and 79,342 bytes total.
- `npm run verify` passed against a local production-equivalent server.
  `scripts/verify-url.sh` also passed live title, language, one main, one h1,
  image alternatives, and console checks.
- The live Playwright axe suite passed on every public route and open settings
  with no serious or critical WCAG 2 A/AA findings.
- Fresh sample-play request capture is same-origin GET assets/documents only;
  there are no analytics, ads, account calls, remote fonts, or runtime third
  party scripts. The CSP permits only product-owned resources.
- `/`, `/demo`, `/privacy`, `/terms`, `/rules`, and `/license` resolve through
  the app with correct browser-rendered titles and focusable h1s. The
  deliberate unknown-route HTTP 404 returns a complete designed 404 page with
  shared structure and a way back; its 404 status is expected, not a defect.
- Live response headers include CSP, HSTS, `X-Content-Type-Options`, and
  `Referrer-Policy`.
- In a 390 px touch context under 4x CPU throttling, 121 animation frames in
  2,001.7 ms measured 60.45 fps. This is QA evidence, not public marketing
  copy.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| MM-V1-01 demo data remained after leaving demo | Fixed: Start for real removes both demo keys without changing real data. |
| MM-V1-02 dynamic updates lost focus | Fixed: settings, timed hide, loss, win, and transitions retain or move focus to a usable control. |
| MM-V1-03 phone targets were under 44 px | Fixed: automated 390 px coverage passes all rendered links and game controls. |
| MM-V1-04 404 lacked shared structure | Fixed: the live HTTP 404 has a plain h1, skip link, header/navigation, footer, and return link. |
| MM-V1-05 public claims lacked tests | Fixed: 15 exact outcome-level claim commands cover the retained public promises. |

## Evidence

- `/work/.evidence/sf-mnemonic-mercenary-review2-desktop-first.png`
- `/work/.evidence/sf-mnemonic-mercenary-review2-phone-first.png`
- `/work/.evidence/sf-mnemonic-mercenary-review2-desktop-win.png`
- `/work/.evidence/sf-mnemonic-mercenary-review2-phone-loss.png`

## Final result

**PASS — 0 findings, 0 untested public claims.**
