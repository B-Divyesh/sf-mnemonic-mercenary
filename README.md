# Mnemonic Mercenary

Mnemonic Mercenary is a touch-friendly browser game for players who want a
short roguelike break. Remember 3–7 named symbols, choose a safe partial
combat move or a full strike, and finish a run of six fights.

Live: https://mnemonic-mercenary.sociobot.in

## Play

- Open `/` to start a real local run. The active fight is on the first screen.
- Open `/demo` or `/?demo=1` for a one-click, isolated sample at fight 3.
  It shows a persistent demo label and never changes a real run. Choosing
  **Start for real** discards the demo run and demo settings.
- Choose **Open game settings** to enable non-timed mode. Routes then stay
  visible until you hide them, and the setting persists in this browser.

Use the displayed symbols to enter a route prefix. A correct partial prefix is
Guard and is safe. The complete route is Strike. A wrong prefix costs 2 health;
three wrong reads end a run. Restarting begins fight 1 with 6 health.

## Privacy and accessibility

The game stores the current run and settings only in browser local storage.
During play, it makes no analytics or account requests. Every route symbol has
a visible name, shape, and spoken cue. Core play controls work with touch,
mouse, Tab, Enter, and Space with visible focus. The game respects the
browser’s reduced-motion preference. Read [Privacy](https://mnemonic-mercenary.sociobot.in/privacy) and
[Terms](https://mnemonic-mercenary.sociobot.in/terms).

## Complete game offer

The public complete-game offer is **US$4.99 one time**, with no subscription.
It covers the six-fight expedition, route variations, relics, and accessibility
settings. Billing registration is not yet available, so there is no checkout or
license activation claim in this build. See `/license` for the public status.

## Develop and verify

Requires Node.js 20+ and npm. Playwright Chromium is preinstalled in the
factory image; on another machine run `npx playwright install chromium` after
installing dependencies.

```sh
npm install
npm test
npm run build
```

`npm test` starts Vite and runs game paths, demo cleanup, input and focus,
phone targets, route pages, privacy requests, and axe checks. Every public
behavioral claim is in `.factory/claims.json` and may be run alone with its
listed `--grep` command. For a separate title/lang/main/alt/console smoke check,
start `npm run dev -- --host 127.0.0.1 --port 4173` and run:

```sh
npm run verify
```

Build output is `dist/`. Deploy the static build with the factory-owned command:

```sh
/opt/fleet/lib/deploy-static.sh mnemonic-mercenary dist
```

## Product records

- `.factory/brief.json` — researched product scope
- `.factory/design.md` — visual system and original-asset provenance
- `.factory/demo.md` — demo isolation and reset behavior
- `.factory/claims.json` — testable public claims
