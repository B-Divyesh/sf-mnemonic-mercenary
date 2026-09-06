# Review 3 — Remember symbol routes to choose combat moves

## Verdict

**PASS — 0 findings and 0 untested public claims.**

This strict review exercised the released six-fight browser game from fresh desktop and touch-phone contexts, then ran the clean-checkout quality and claim suite. Product code was not changed.

## Candidate and evidence basis

- Live URL: https://mnemonic-mercenary.sociobot.in
- Implementation candidate: `e53e351cc9d69634bdb5a69efc2a304c41282eb1`
- Documentation/report baseline: `c4ec797e45262bf485a6c9d1b102a56c6487deb3`
- Review date: 2026-09-06 UTC
- Product: static Vite and TypeScript browser game; it has no backend, multiplayer, account, service-worker, checkout, or activation path.

`c4ec797` changes claim tests and reports after the implementation candidate; it does not change product source. A fresh build matched the live `index.html`, hashed JavaScript, hashed CSS, and `404.html` byte for byte by SHA-256.

The available QA history was read in full from `.factory/verification-1.md`, `.factory/verification-2.md`, `.factory/verification-3.md`, `.factory/review-1.md`, and `.factory/review-2.md`. The separately named `factory-evidence/mnemonic-mercenary-verify-3/qa-report.md` mount was not present in this disposable worker; fresh independent evidence below is the basis for this review.

## First screen and real game paths

Fresh Chromium 145 desktop (1440×900) and touch-phone (390×844) contexts opened the live `/` page at scroll position zero. Both showed active play, not a menu wall.

- Job: “Remember symbol routes to choose combat moves.”
- Audience: players who want a short touch-friendly roguelike where partial recall is a safe tactical choice.
- First action: “Try it with sample data,” followed by “See a saved fight now.”
- Facts: six fights per run, a non-timed option, and runs staying on this device.

In each fresh context the action entered `/demo` in one tap/click. The populated sample showed fight 3 of 6, 4 / 6 health, the Brass compass, and two previous fights. “Demo — sample data, nothing is saved.” remained present. Reset restored that populated sample.

Each context restarted at fight 1, used a correct remembered prefix through six fights, and reached the real “You cleared all six fights.” end screen. Each then used three deliberately wrong first symbols and reached “Your guard gave out.” at 0 / 6 health. No console or page errors occurred during these four end-state runs.

Fresh phone demo-disposal evidence set a real-run sentinel, changed demo settings, reset the sample, and chose Start for real. The sentinel remained; both demo storage entries were absent; three captured requests were all same-origin GET document/asset requests with no fetch or XHR.

## Declared claims

After `npm ci`, `npm run build` passed and `npm test -- --reporter=dot` passed **48 / 48**. Every exact command listed in `.factory/claims.json` was run independently from the clean checkout and passed in both desktop and phone projects:

| Claim IDs with passing exact commands |
| --- |
| `six-fight-end`, `restart-reset`, `settings-persist`, `local-only-data`, `safe-partial-recall` |
| `demo-isolated`, `demo-discarded`, `route-curve`, `full-recall-strike`, `wrong-recall-cost` |
| `three-misses-end`, `input-focus`, `reduced-motion`, `named-symbol-cues`, `complete-price` |

The outcomes cover the real end screen, restart reset, persistent non-timed mode, local-only request behavior, Guard and Strike, populated/demo isolation and disposal, 3/3/4/5/6/7 route lengths, two-health misses, three-miss loss, keyboard/pointer/touch focus, reduced motion, non-color symbol cues, and the US$4.99 one-time offer with checkout and license validation accurately marked unavailable.

No public unlisted or untested claim was found in the landing, demo, rules, privacy, terms, license page, README, or offer metadata. The offer remains US$4.99 one time for the complete six-fight content, route variations, relics, and accessibility settings; it does not claim a working purchase, activation, or subscription.

## Earlier findings

| Earlier finding | Current disposition |
| --- | --- |
| MM-V1-01 demo data remained after leaving demo | Fixed: Start for real clears both demo keys while preserving real data; `demo-discarded` passes. |
| MM-V1-02 dynamic updates lost keyboard focus | Fixed: the independent input/focus and full suites pass settings, timer, result, win, and loss focus paths. |
| MM-V1-03 phone targets were under 44 px | Fixed: the clean suite covers every rendered phone link and game control. |
| MM-V1-04 404 lacked shared structure | Fixed: the live designed 404 has its own title, plain h1, header, navigation, footer, and return link. |
| MM-V1-05 claim coverage was incomplete | Fixed: fifteen exact outcome-level commands cover all retained public promises. |

No later review or verification recorded a new finding, and this review found no regression.

## Accessibility, privacy, routes, and quality gates

- `npm ci` passed with 0 vulnerabilities.
- `npm run build` produced `dist/`: 20.09 KB JavaScript (7.20 KB gzip), 9.96 KB CSS (3.18 KB gzip), and 79,342 bytes total.
- Live `bash scripts/verify-url.sh https://mnemonic-mercenary.sociobot.in` passed title, `lang`, one `main`, one `h1`, image alternatives, and console checks.
- Live axe checks passed in desktop and phone projects with no serious or critical WCAG 2 A/AA violations, including open settings.
- Fresh browser checks passed route-specific titles, a single h1/main on `/`, `/demo`, `/privacy`, `/terms`, `/rules`, and `/license`. The unknown path returned the designed page with HTTP 404; that deliberate status is expected, not a defect.
- Live CSP, HSTS, `X-Content-Type-Options`, and `Referrer-Policy` are present. The CSP permits only product-owned resources. No analytics, remote fonts, third-party scripts, accounts, or data collection were observed.
- The game has no public offline/update, audio, browser-version, multiplayer, backend, health endpoint, rate-limit, checkout, or activation promise. Those checks are not applicable and were not represented as passing product features.
- A fresh live 390×844 headless phone observation measured 60.18 `requestAnimationFrame` callbacks per second over two seconds. This is QA evidence, not a public performance claim or physical-device measurement.

## Evidence

- `/work/.evidence/sf-mnemonic-mercenary-review3-desktop-first.png`
- `/work/.evidence/sf-mnemonic-mercenary-review3-desktop-win.png`
- `/work/.evidence/sf-mnemonic-mercenary-review3-desktop-loss.png`
- `/work/.evidence/sf-mnemonic-mercenary-review3-phone-first.png`
- `/work/.evidence/sf-mnemonic-mercenary-review3-phone-win.png`
- `/work/.evidence/sf-mnemonic-mercenary-review3-phone-loss.png`

No credentials, access tokens, or cookie values were collected or recorded.

## Final result

**PASS — 0 findings and 0 untested public claims.**
