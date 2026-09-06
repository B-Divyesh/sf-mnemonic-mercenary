# Handoff — Mnemonic Mercenary repair 2

## Result

Repair 2 passes. All five independent-verification findings are closed, all 15
declared claims pass, and the final product is deployed at
https://mnemonic-mercenary.sociobot.in.

- Failed baseline: `19cb360f89a3350c3fe1f9078fa6741ea33eee64`
- Deployed implementation: `e53e351cc9d69634bdb5a69efc2a304c41282eb1`
- Detailed verification: `.factory/verification-2.md`

## What changed

- Starting for real now deletes both demo storage entries without changing real
  run data.
- Timed route hiding, settings changes, and the loss screen now place focus on
  the next usable control.
- Header, content, offer, and footer links now provide at least 44×44 CSS px
  targets on a 390 px phone. The wordmark wraps at 200% text size.
- The real HTTP 404 keeps its status and now has the common skip link, header
  navigation, plain h1, complete footer, metadata, and product styling.
- The unmeasured 6–10 minute statement was removed. Five missing claim areas
  received tagged, outcome-based coverage, and the paid-offer check now
  exercises route variation, relics, and accessibility settings.
- Invalid saved state now recovers safely to a playable first fight.
- The existing hand-authored art was visually reviewed and preserved; no new
  image generation was needed.

## How to verify

```sh
npm ci
npm test
npm run build
```

Run each command in `.factory/claims.json` independently. For a local smoke
check, start the documented preview and run `npm run verify`. Set
`PLAYWRIGHT_BASE_URL=https://mnemonic-mercenary.sociobot.in` to run the browser
suite against live without starting a local server.

Final results: 48/48 browser tests passed locally and live. All 15 exact claim
commands passed on desktop and phone. The build produced 7.20 KB gzip
JavaScript and 3.18 KB gzip CSS. Live Lighthouse scored 100 in every category,
with 0.8 s LCP and zero layout shift. The throttled phone check measured 60.1
frames per second.

## Offer and privacy

The complete offer remains **US$4.99 one time**, never a subscription. Public
metadata is in `.factory/billing-offer.json` and
`/work/.evidence/billing-offer.json`. Billing registration remains an external
dependency, so checkout and license validation are accurately unavailable.
No credential was added or recorded.

Runs and settings remain local. Demo data uses only its prefixed namespace and
is removed by **Start for real**. There is no analytics, account, multiplayer,
backend, or offline claim.

## Known gaps and next step

There is no product-code gap from verification 1. The only external next step
is for the authorised billing-registration operator to register the existing
one-time offer. Product QA must recheck checkout and entitlement before either
is advertised as available.
