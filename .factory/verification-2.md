# Verify the symbol-route combat game — independent QA 2

## Verdict

**PASS — 0 findings and 0 untested claims.**

The deployed game completes its real job on desktop and phone. All 15 declared
claim commands pass, every earlier finding is fixed, and no new defect of any
severity was found.

## Candidate and live output

- Live URL: https://mnemonic-mercenary.sociobot.in
- Implementation reviewed: `e53e351cc9d69634bdb5a69efc2a304c41282eb1`
- Documentation baseline reviewed: `84a94b83c5993ca6e5777f0b25de9f8685090ea4`
- Review date: 2026-09-06 UTC
- Artifact: static Vite and TypeScript browser game

The commits after the implementation change only tests and reports. Fresh
local build hashes for `index.html`, the hashed JavaScript, the hashed CSS, and
`404.html` match the live files byte for byte.

## First screen before scrolling

Fresh 1440×900 desktop and 390×844 phone contexts opened at scroll position 0.
Both showed the active game, with no menu wall.

- Job: “Remember symbol routes to choose combat moves.”
- Audience: players seeking a short, touch-friendly roguelike where partial
  recall is a safe tactical choice.
- First action: “Try it with sample data,” with “See a saved fight now.”
- Facts: six fights, a non-timed option, and local device storage.

The game board begins inside both initial viewports. The phone document is 390
CSS pixels wide with no horizontal overflow.

## Complete game runs

A deterministic phone run restarted at fight 1, used a safe remembered prefix
through all six fights, and reached “You cleared all six fights” with 6 / 6
fights survived. The restart control received focus.

A separate desktop run submitted three wrong routes. Health changed from 6 to
4, 2, then 0. The real loss screen showed “Your guard gave out,” and its
restart control received focus. Restart tests return to fight 1 with full
health.

The live phone animation loop measured 60.3 frames per second over two seconds
under 4× CPU throttling. Source inspection confirms a clamped 60 Hz fixed-step
accumulator that resets when page visibility changes.

## Demo sandbox

The root-page sample action opens `/demo` in one click. The sample is
realistically populated at fight 3 of 6, 4 / 6 health, with the Brass compass
and two prior fights. “Demo — sample data, nothing is saved” remains visible
during reset and play.

The demo uses only its two `demo:` local-storage names. Reset restores the
populated sample. Starting for real removes both demo entries, preserves a
real-run sentinel, and reopening `/demo` starts a fresh sample. No real game
data changed during the independent sample, reset, settings, Guard, or loss
paths.

## Earlier finding disposition

| Earlier finding | Current result | Evidence |
| --- | --- | --- |
| MM-V1-01 demo data was not discarded | Fixed | **Start for real** removes both demo keys, preserves real data, and a fresh `/demo` returns to fight 3. `@claim:demo-discarded` passes. |
| MM-V1-02 dynamic updates lost focus | Fixed | Loss, settings changes, timed hiding, win, and route transitions all keep or move focus to a usable control. |
| MM-V1-03 phone targets were under 44 px | Fixed | Automated 390 px checks pass every rendered link on demo, privacy, and 404 pages; play controls also meet the minimum. |
| MM-V1-04 404 lacked shared structure | Fixed | The unknown route returns HTTP 404 with plain “Page not found” copy, skip link, header, navigation, footer, and build line. |
| MM-V1-05 claims lacked exact tests | Fixed | The time estimate was removed. Input, reduced motion, loss, demo disposal, symbol cues, and paid content have outcome tests. |

The deliberate 404 status is expected. Chromium reports the document's 404
resource status in its console; the page itself is complete and usable, so
this is not a defect.

## Declared claim commands

Every exact `test` command in `.factory/claims.json` was run separately after
`npm ci`. Each command passed in both the desktop and phone projects. The full
suite also passed against the live URL.

| Claim | Result | Observed outcome |
| --- | --- | --- |
| `six-fight-end` | PASS | A run reached the real six-fight win screen. |
| `restart-reset` | PASS | Restart restored fight 1 and 6 / 6 health. |
| `settings-persist` | PASS | Non-timed mode survived reload and kept the route visible past 3.2 seconds. |
| `local-only-data` | PASS | Play made only same-origin GET requests, no XHR/fetch or account request, and preserved real storage. |
| `safe-partial-recall` | PASS | A correct prefix produced Guard without health loss. |
| `demo-isolated` | PASS | One click loaded the populated sample; reset and play kept the label and real data unchanged. |
| `demo-discarded` | PASS | Starting for real cleared demo run and settings while preserving real data. |
| `route-curve` | PASS | The six route lengths were 3, 3, 4, 5, 6, and 7. |
| `full-recall-strike` | PASS | A complete correct route produced Strike. |
| `wrong-recall-cost` | PASS | A wrong first symbol reduced health from 4 to 2. |
| `three-misses-end` | PASS | Three misses from full health reached the loss screen at 0. |
| `input-focus` | PASS | Pointer, touch, Tab, Enter, Space, and a visible 3 px focus outline worked in independent contexts. |
| `reduced-motion` | PASS | Reduced motion suppressed the miss movement to at most 0.01 ms. |
| `named-symbol-cues` | PASS | Every route step exposed a visible name, glyph, and spoken cue. |
| `complete-price` | PASS | The offer shows US$4.99 one time, included content, and unavailable checkout and activation. |

Landing, README, rules, privacy, terms, demo, and offer copy were cross-checked
against the claim registry. No missing, false, incomplete, or untested public
claim remains.

## Normal, boundary, and recovery paths

- Correct partial and full recall produce Guard and Strike respectively.
- An incorrect route costs exactly 2 health; health stops at 0 and ends play.
- Route lengths follow the documented six-fight boundary curve.
- Null, malformed JSON, and out-of-range saved state recover to fight 1 with
  full health and a usable first action.
- A completed real fight survives reload and can continue.
- Win and loss restart paths reset state correctly.
- Settings persist in real play; demo settings stay in the demo namespace.
- Address-bar navigation, history back, and route focus work.
- Offline/update behavior is not promised. No service worker claim exists.
- Multiplayer is not advertised. No bot or simulated client is presented as
  another player.
- There is no product backend, so tenant, restart, health, and 429 checks do
  not apply.

## Accessibility, privacy, routes, and security

- The live URL verifier passed title, language, one main landmark, one `h1`,
  image alternatives, and console checks.
- Playwright axe integration found no serious or critical WCAG 2 A/AA issues
  on all public routes or open settings.
- Keyboard, touch, 200% text, focus recovery, reduced motion, and 44 px phone
  target tests pass.
- Each SPA route has its own title, plain `h1`, canonical URL, header, main,
  footer, and `lang="en"`.
- Every crawled internal link returns HTTP 200. The designed unknown route
  correctly returns HTTP 404.
- CSP, HSTS, `X-Content-Type-Options`, and `Referrer-Policy` are live.
- During sample play, requests remain same-origin and real local data remains
  unchanged. There are no analytics, ads, accounts, remote fonts, or runtime
  third-party scripts.

AI features are not implied by the researched memory-game job, so adding a
model call would not improve the core play loop. No missed AI leverage finding
applies.

## Performance and quality gates

- `npm ci` — passed; 0 vulnerabilities.
- `npm run build` — passed; `dist/` contains 79,342 bytes.
- Initial JavaScript — 7.20 KB gzip.
- Initial CSS — 3.18 KB gzip.
- `npm test -- --reporter=dot` — 48/48 passed locally.
- Live full suite — 48/48 passed in an isolated rerun.
- Fifteen exact claim commands — all passed in desktop and phone projects.
- `npm run verify` against the local production preview — passed.
- Live URL verifier — passed.
- Live axe suite — 2/2 passed.
- Lighthouse 12.8.2 on live `/demo` — Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; LCP 0.88 s, CLS 0,
  TBT 5 ms.

One initial full live run overlapped another Playwright run and caused an
attachment-file collision after the tested Guard interaction had succeeded.
The isolated rerun passed all 48 tests. This was verifier harness interference,
not a product failure or a failed declared claim command.

## Offer and evidence

The complete paid content remains **US$4.99 one time**, with no subscription.
Its public metadata contains only the slug, name, price, return URL, included
content, and license status path. Billing registration remains external, so
checkout, purchase, entitlement, and activation are unavailable and are not
claimed as working.

Fresh evidence:

- `/work/.evidence/sf-mnemonic-mercenary-verify2-desktop-first-screen.png`
- `/work/.evidence/sf-mnemonic-mercenary-verify2-phone-first-screen.png`
- `/work/.evidence/sf-mnemonic-mercenary-verify2-phone-win.png`
- `/work/.evidence/sf-mnemonic-mercenary-verify2-desktop-loss.png`
- `/work/.evidence/sf-mnemonic-mercenary-verify2-phone-404.png`
- `/work/.evidence/sf-mnemonic-mercenary-verify2-lighthouse.json`

## Final result

**PASS — 0 findings, 0 untested claims.**
