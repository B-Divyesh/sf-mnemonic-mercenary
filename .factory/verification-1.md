# Verification 1 — Mnemonic Mercenary

## Verdict

**FAIL** — 5 findings remain: 4 medium and 1 low. One public claim is
untested. A successful test run does not override these live product findings.

## Candidate reviewed

- Live URL: https://mnemonic-mercenary.sociobot.in
- Implementation candidate: `f03f3527f93bbb11e3e554f463e01cfe468e27e3`
- Documentation baseline: `5763d8e5ba9519595b4406cfd3eab73ac2327d7a`
- Review date: 2026-09-06 UTC
- Artifact: static Vite and TypeScript browser game; no backend or multiplayer
  mode is present or promised.

The live `index.html`, JavaScript, CSS, and `404.html` byte hashes match the
local build from the implementation candidate. The later baseline commit
changes only `.factory/handoff.md`, so it does not require a different product
image.

## First screen before scrolling

The fresh desktop and 390 px phone contexts both start at scroll position 0.
The page states:

- Job: “Remember symbol routes to choose combat moves.”
- Audience: players who want a short, touch-friendly roguelike with safe
  partial recall.
- First action: “Try it with sample data,” followed by “See a saved fight now.”

The active game board begins inside both initial viewports. The root page has
one `h1`, one `main`, the correct title, and a visible sample action.

## Findings

### MM-V1-01 — Demo data is not discarded when leaving demo (medium)

The privacy page says, “Demo data uses a separate local-storage name and is
discarded when you leave demo mode.” The live behavior is different.

1. Open `/demo`, reset it, and complete a Guard move.
2. Choose **Start for real**.
3. Inspect local storage or return to `/demo`.

Both `demo:mnemonic-mercenary:run` and
`demo:mnemonic-mercenary:settings` remain. Returning to `/demo` restores the
resolved Guard state while the banner still says the player is entering fight
3. Real-run storage was not changed, so isolation itself passes; cleanup and
the public privacy statement do not.

Expected: leaving demo clears its namespace, or the privacy copy accurately
states that demo progress remains until reset or site-data removal.

### MM-V1-02 — Dynamic updates lose keyboard focus (medium)

Three live paths replace the focused control without moving focus to the new
state:

- The third wrong move opens the loss screen, but **Restart this run** is not
  focused. `document.activeElement` becomes `body`.
- Changing a settings checkbox rerenders the page and moves focus to `body`.
- If the default timer hides a route while **Hide route and choose a move** is
  focused, focus moves to `body`.

The corresponding win path does focus **Start another run**, and explicit
route hiding focuses the first symbol. The defect is therefore limited to the
unhandled rerenders above, not all keyboard play.

Expected: focus moves to the loss restart control, remains on the changed
setting, and moves to the first symbol when the timer hides a route.

### MM-V1-03 — Phone link targets are shorter than 44 px (medium)

At 390 px, the primary actions are at least 44 px, but the header links measure
22 px high. **Read the rules** is 24 px; **Read offer status** is 19 px; and the
footer links are 20 px high. The wordmark is 24 px high. These do not meet the
product’s 44 px touch-target contract.

Expected: each interactive target has a clickable area of at least 44 by 44
CSS pixels without changing the readable visual scale.

### MM-V1-04 — The 404 page omits required site structure (low)

An unknown URL correctly returns HTTP 404 and a usable way back. This status is
expected and is not itself a defect. The returned page has no skip link, no
header navigation, and no footer navigation or build/version line, although
the site contract requires the common header and footer on every route. Its
`h1`, “This route does not lead to a fight,” also uses game metaphor instead of
the required plain page title.

Expected: retain HTTP 404 and the designed visual treatment while using the
standard navigation, skip link, footer, and a plain `h1` such as “Page not
found.”

### MM-V1-05 — Public claims are missing exact claim tests (medium)

The ten registered claims pass, but the public copy contains promises without
their own tagged claim entries:

- README: “A run takes about 6–10 minutes.” This quantitative promise has no
  measurement and remains the one untested claim in this review.
- README: all controls work with touch, mouse, Tab, Enter, and Space, with
  visible focus. Live spot checks pass touch, mouse, Enter, and Space, but the
  focus part is false in MM-V1-02 and no exact claim command exists.
- README: the site respects reduced motion. The live reduced-motion check
  passes, but no tagged claim exists.
- Landing and README: three wrong reads end the run. The live loss run passes,
  but no tagged claim exists.
- Privacy: demo data is discarded on exit. The live check fails as described
  in MM-V1-01, and no tagged claim exists.
- Offer copy: the complete edition includes route variations, relics, and
  accessibility settings. Those elements are present, but the registered
  price test checks only price and unavailable checkout/license status.

Expected: remove claims that should not be made, correct false ones, and give
each retained public promise one exact `@claim:<id>` test that asserts the
observable result.

Untested public claim count: **1**.

## Declared claim commands

Every command in `.factory/claims.json` was run separately after `npm ci`.
Each passed in both the desktop and phone Playwright projects.

| Claim | Result | Observable result |
| --- | --- | --- |
| `six-fight-end` | PASS | Demo run reached “You cleared all six fights” with 6 / 6 survived. |
| `restart-reset` | PASS | Restart returned to fight 1 and 6 / 6 health. |
| `settings-persist` | PASS | Non-timed setting remained checked after reload. |
| `local-only-data` | PASS | Requests stayed same-origin and the real-data sentinel stayed unchanged. |
| `safe-partial-recall` | PASS | Correct prefix produced Guard without health loss. |
| `demo-isolated` | PASS | Demo play did not change the real-run storage key. |
| `route-curve` | PASS | Route lengths were 3, 3, 4, 5, 6, and 7. |
| `full-recall-strike` | PASS | Complete route produced Strike. |
| `wrong-recall-cost` | PASS | Wrong first symbol reduced health from 4 to 2. |
| `complete-price` | PASS | US$4.99 one time is public; checkout and validation are unavailable. |

The demo cleanup defect does not contradict `demo-isolated`: demo and real
namespaces remain separate. It contradicts the separate privacy statement
that demo data is discarded on exit.

## End-to-end and recovery evidence

- One-click sample: fight 3 of 6, 4 / 6 health, Brass compass, two prior fights.
- Persistent sample label: remained visible after play and reset.
- Win: restarted the demo and used six safe prefixes to reach the real win
  screen.
- Loss: used three wrong routes in a fresh phone context to reach the real loss
  screen at 0 / 6 health.
- Restart recovery: loss restart returned to fight 1 with 6 / 6 health.
- Refresh recovery: a real run kept its seed, Guard result, and health.
- Invalid local data: malformed run and settings JSON recovered to fight 1 and
  full health without an error.
- Default timing: route hid after the short pause. Non-timed mode kept it
  visible after 3.5 seconds and persisted after reload.
- Touch and keyboard: a real touchscreen tap entered recall; Enter and Space
  operated route controls. The focus failures are listed above.
- Text at 200%: no horizontal document overflow at 390 px.
- Reduced motion: miss animation duration was reduced to `0.01ms`.
- Privacy requests: 27 captured page and asset requests were all same-origin;
  there were no console errors or page errors.
- Offline and update behavior: not promised, so no offline claim was accepted.
- Backend, tenant isolation, persistence after server restart, health, and 429
  checks: not applicable to this static product.
- Multiplayer: not advertised and therefore not tested as a mode.

## Accessibility, routes, and performance

- Live Playwright axe checks found no WCAG 2 A/AA violations on `/`, `/demo`,
  `/privacy`, `/terms`, `/rules`, `/license`, the active game, win screen, or
  phone loss screen.
- `scripts/verify-url.sh` passed against the live root for title, language,
  main landmark, one `h1`, alt attributes, and console output.
- All links crawled from the six public routes returned HTTP 200. The deliberate
  unknown route returned HTTP 404 with the correct title and a return link.
- Each public SPA route has its own title, one `h1`, one `main`, `lang="en"`,
  and the correct canonical URL.
- Security headers include CSP, HSTS, `X-Content-Type-Options`, and
  `Referrer-Policy`.
- Live Lighthouse on `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 0.8 s, CLS 0, total blocking time 10 ms.
- A 390 px phone context under 4× CPU throttling measured 60.0 request-animation
  frames per second over two seconds.
- Build assets: 7.04 KB gzip JavaScript, 3.12 KB gzip CSS, 116 KB total `dist/`.

Automated audits do not detect the small target areas or the focus-loss cases,
so their perfect scores do not clear MM-V1-02 or MM-V1-03.

## Prior finding disposition

No earlier formal review or verification report exists in the repository. The
handoff and implementation history identify three earlier fixes:

| Earlier issue | Current disposition |
| --- | --- |
| Unknown routes returned the SPA with HTTP 200 | Resolved: unknown live route returns the designed page with HTTP 404. |
| Focus did not move into active symbol controls | Resolved for explicit route hiding: the first symbol receives focus. |
| Win restart did not receive focus | Resolved: **Start another run** receives focus on the win screen. |

MM-V1-02 is a separate uncovered loss/settings/timer focus problem, not a
regression of the verified win behavior.

The legacy screenshot, billing-offer JSON, and catalog copy referenced by the
baseline handoff were not present in this disposable worker’s evidence mount.
That absence is not classified as a live product defect; fresh first-screen,
win, loss, observation, and performance evidence was recorded for this review.

## Commands and evidence

- Setup: `npm ci` — passed, 0 vulnerabilities.
- Full suite: `npm test -- --reporter=dot` — 28 passed.
- Build: `npm run build` — passed and produced `dist/`.
- Live smoke: `bash scripts/verify-url.sh https://mnemonic-mercenary.sociobot.in`
  — passed.
- Each of the ten exact claim commands — passed on desktop and phone.
- Screenshots:
  - `/work/.evidence/sf-mnemonic-mercenary-verify1-desktop-first-screen.png`
  - `/work/.evidence/sf-mnemonic-mercenary-verify1-phone-first-screen.png`
  - `/work/.evidence/sf-mnemonic-mercenary-verify1-win-end.png`
  - `/work/.evidence/sf-mnemonic-mercenary-verify1-loss-end.png`
- Detailed live observations:
  `/work/.evidence/sf-mnemonic-mercenary-live-observations.json`
- Lighthouse JSON:
  `/work/.evidence/sf-mnemonic-mercenary-lighthouse.json`

## Final result

**FAIL — 5 findings, 1 untested public claim.**
