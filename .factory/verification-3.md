# Verify symbol-route combat across browser engines

## Verdict

**PASS — 0 findings and 0 untested public claims.**

The deployed game completes its six-fight job in Chromium, Firefox, and
WebKit at desktop and phone viewports. Product code was not changed.

## Candidate and live output

- Live URL: https://mnemonic-mercenary.sociobot.in
- Implementation reviewed: `e53e351cc9d69634bdb5a69efc2a304c41282eb1`
- Documentation baseline reviewed: `e6d724629cc32a0239c85dd1f1aa7ede7f515d37`
- Review date: 2026-09-06 UTC
- Product: static Vite and TypeScript browser game

The commits after the implementation change update tests and reports, not the
deployed game. A clean build produced byte-identical live and local copies of
`index.html`, the hashed JavaScript, the hashed CSS, and `404.html`.

The game has no backend, multiplayer, account, checkout, activation, service
worker, or offline promise. Those paths are not presented as tested features.

## First screen before scrolling

Fresh 1440×900 desktop and 390×844 touch contexts opened `/` at scroll
position zero in every engine. Each showed the active game board in the first
viewport rather than a menu wall.

- Job: “Remember symbol routes to choose combat moves.”
- Audience: players wanting a short touch-friendly roguelike where partial
  recall is a safe tactical choice.
- First action: “Try it with sample data,” with “See a saved fight now.”
- Facts: six fights, a non-timed option, and runs staying on this device.

Each page had one `h1`, one `main`, the route-specific title, and no phone
horizontal overflow.

## Browser engines and support boundary

Playwright 1.58.2 supplied these exact headless engines:

| Engine | Version | Desktop | 390×844 touch | Result |
| --- | --- | --- | --- | --- |
| Chromium | 145.0.7632.6 | Tested | Tested with mobile emulation | PASS |
| Firefox | 146.0.1 | Tested | Tested with touch and phone viewport | PASS |
| WebKit | 26.0 | Tested | Tested with mobile emulation | PASS |

The public site does not name Chrome, Firefox, Safari, iOS, Android, or a
minimum version. This report qualifies only the exact browser engines above.
Playwright Firefox does not support its `isMobile` context option, so the
Firefox phone check used a real Firefox engine with touch enabled and a phone
viewport. It is not a Firefox Android binary. Playwright WebKit on Linux is
not branded Safari or an iOS device. Physical phones, Safari/iOS, and Firefox
Android were unavailable in this worker. Their absence is test-infrastructure
scope, not a defect or an untested public claim.

The product contains no audio API, audio element, sound control, or audio
claim. Audio startup is therefore not a supported path and was not represented
as a PASS. Pointer, touch, keyboard, reduced-motion, and non-timed inputs were
tested in the supported paths.

## Complete runs and end screens

A fresh demo was restarted at fight 1 in every desktop and phone context. One
correct remembered prefix cleared each of six fights. All six contexts reached
the actual “You cleared all six fights.” end screen with 6 / 6 fights
survived, then restored a resolved Guard result after reload.

A separate run submitted three wrong routes in every context. Health changed
from 6 to 4, 2, then 0. Every engine reached “Your guard gave out.” and focused
the restart action. The isolated WebKit desktop evidence rerun also passed
after one non-reproducing automation click miss.

Desktop actions used pointer clicks. Phone actions used Playwright touch taps.
Each context also used Enter and Space on focused game controls. The phone
captures show active play on the first screen and real win and loss endings.

## Demo, save, reset, and recovery

- The root action entered `/demo` in one click.
- The populated sample showed fight 3 of 6, 4 / 6 health, Brass compass, and
  two previous fights.
- “Demo — sample data, nothing is saved.” stayed visible through play, reset,
  settings changes, and reload.
- Reset restored the populated fight-3 sample.
- Real-run storage remained unchanged during demo play in every engine.
- Starting for real removed both demo keys while preserving real data in the
  declared claim test.
- A resolved real fight survived reload and continued to fight 2.
- Null, malformed JSON, and out-of-range saved state recovered to a playable
  fight 1 with full health.
- Non-timed mode persisted after reload and kept the route visible beyond the
  normal 3.2-second hide time.
- Win and loss restarts returned to fight 1 with 6 / 6 health.

## Declared claims

After `npm ci`, every command recorded in `.factory/claims.json` was run
separately from the clean checkout. Each exact command passed in the repository
desktop and phone projects.

| Claim | Result | Observed outcome |
| --- | --- | --- |
| `six-fight-end` | PASS | Six safe fights reached the real win screen. |
| `restart-reset` | PASS | Restart restored fight 1 and full health. |
| `settings-persist` | PASS | Non-timed mode survived reload and kept the route visible. |
| `local-only-data` | PASS | Requests stayed same-origin and real storage stayed unchanged. |
| `safe-partial-recall` | PASS | A correct prefix produced Guard without damage. |
| `demo-isolated` | PASS | The populated sample, reset, label, and real-data isolation passed. |
| `demo-discarded` | PASS | Starting for real cleared both demo keys only. |
| `route-curve` | PASS | Route lengths were 3, 3, 4, 5, 6, and 7. |
| `full-recall-strike` | PASS | The complete route produced Strike. |
| `wrong-recall-cost` | PASS | A wrong prefix removed exactly 2 health. |
| `three-misses-end` | PASS | Three misses reached the loss screen at 0 health. |
| `input-focus` | PASS | Pointer, touch, Tab, Enter, Space, and visible focus worked. |
| `reduced-motion` | PASS | Reduced motion suppressed the miss movement. |
| `named-symbol-cues` | PASS | Each symbol exposed a name, glyph, and spoken cue. |
| `complete-price` | PASS | US$4.99 one time, included content, and unavailable checkout/validation were accurate. |

Landing, demo, rules, privacy, terms, offer status, README, and offer metadata
were cross-checked against the registry. No missing, false, incomplete, or
untested public claim remains.

The public offer remains **US$4.99 one time**, not a subscription. It covers
the complete six-fight expedition, route variations, relics, and accessibility
settings. Billing registration, checkout, and license activation remain
unavailable and are not claimed as working.

## Accessibility, privacy, routes, and performance

- The live URL verifier passed title, language, one `main`, one `h1`, image
  alternatives, and console checks.
- The live axe suite passed every public route and open settings in all three
  engines at both viewport sizes with no serious or critical WCAG 2 A/AA
  violations.
- Keyboard focus survived settings changes, automatic route hiding, result
  changes, win, and loss.
- Every tested phone link and play control met the 44×44 CSS-pixel target.
- The phone layout retained play controls without horizontal overflow at 200%
  text size.
- Reduced motion and the separate non-timed setting worked in every engine.
- Demo-play requests were same-origin GET requests only. No analytics,
  accounts, remote fonts, third-party scripts, XHR, or fetch calls appeared.
- `/`, `/demo`, `/privacy`, `/terms`, `/rules`, `/license`, `robots.txt`, and
  `sitemap.xml` returned 200. A deliberate unknown route returned the complete
  designed page with HTTP 404; that status is expected.
- Live CSP, HSTS, `X-Content-Type-Options`, and `Referrer-Policy` were present.
- A plain WebKit load and full play path logged no console or page errors.
- Two-second phone-viewport animation observations measured 60.12 fps in
  Chromium, 59.74 fps in Firefox, and 59.38 fps in WebKit. These are headless
  worker measurements, not physical-phone or public performance claims.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| MM-V1-01 demo data remained after leaving demo | Fixed in all tested engines: Start for real clears both demo keys and preserves real data. |
| MM-V1-02 dynamic updates lost keyboard focus | Fixed: settings, timed hiding, results, win, and loss retain or move focus. |
| MM-V1-03 phone targets were under 44 px | Fixed: all rendered phone links and game controls pass the size check. |
| MM-V1-04 404 lacked shared structure | Fixed: the HTTP 404 has a plain title, skip link, header, navigation, footer, build line, and return link. |
| MM-V1-05 claim coverage was incomplete | Fixed: 15 outcome-level commands cover every retained public claim. |

The two later reviews reported no additional findings. This engine extension
found no regression or new finding of any severity.

## Quality gates and evidence

- `npm ci` — passed; 0 vulnerabilities.
- `npm run build` — passed; `dist/` is 79,342 bytes.
- JavaScript — 7.20 KB gzip; CSS — 3.19 KB gzip.
- Local configured suite — 48 / 48 passed.
- Fifteen exact claim commands — 15 / 15 passed in both configured projects.
- Live six-context matrix — Chromium and WebKit 48 / 48 each; Firefox 46 / 46
  compatible matrix checks plus isolated input, win, loss, and recovery checks.
- Live engine evidence — 6 / 6 complete-win runs and 6 / 6 loss runs passed.
- `scripts/verify-url.sh` against live — passed.

Evidence captures:

- `/work/.evidence/sf-mnemonic-mercenary-verify3-{chromium,firefox,webkit}-{desktop,phone}-first.png`
- `/work/.evidence/sf-mnemonic-mercenary-verify3-{chromium,firefox,webkit}-{desktop,phone}-win.png`
- `/work/.evidence/sf-mnemonic-mercenary-verify3-{chromium,firefox,webkit}-{desktop,phone}-loss.png`

## Test-infrastructure observations

These did not become product findings:

- The first Firefox matrix attempt produced 25 harness failures because
  Playwright rejects `isMobile` for Firefox. The supported touch-plus-viewport
  rerun passed 46 / 46 applicable checks. The input claim then passed in a
  Firefox-compatible isolated check.
- An early evidence script expected stale title text and later used an
  ambiguous “Guard holds.” locator. Both errors reproduced across every
  engine and were corrected in the verifier.
- WebKit logs a CSP refusal only when Playwright injects an inline stylesheet
  for `page.screenshot()`. A controlled plain load logged zero errors before
  capture and the known message immediately after capture. Gameplay outside
  screenshot instrumentation logged no errors.
- One WebKit desktop loss capture missed one automated symbol click. The same
  path passed in the full matrix and passed immediately in an isolated rerun.

No credential, access token, or cookie value was collected or recorded.

## Final result

**PASS — 0 findings and 0 untested public claims.**
