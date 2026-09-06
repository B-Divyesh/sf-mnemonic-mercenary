# Mnemonic Mercenary

Mnemonic Mercenary is a touch-friendly browser game for players who want a
short roguelike break. Remember 3–7 named symbols, choose a safe partial
combat move or a full strike, and finish a deterministic run of six fights.
A run takes about 6–10 minutes with no typing or reflex test.

Live: https://mnemonic-mercenary.sociobot.in

## Play

- Open `/` to start a real local run. The active fight is on the first screen.
- Open `/demo` or `/?demo=1` for a one-click, isolated sample at fight 3.
  It shows a persistent demo label and never changes a real run.
- Choose **Open game settings** to enable non-timed mode. Routes then stay
  visible until you hide them.

Use the displayed symbols to enter a route prefix. A correct partial prefix is
Guard and is safe. The complete route is Strike. A wrong prefix costs 2 health;
three wrong reads end a run. Restarting begins fight 1 with 6 health.

## Privacy and accessibility

The game stores the current run and settings only in browser local storage. It
has no accounts, analytics, ads, third-party fonts, remote scripts, or audio.
Symbols are named and shaped, not color-only. All controls work with touch,
mouse, keyboard Tab/Enter/Space, and visible focus. The site respects reduced
motion. Read [Privacy](https://mnemonic-mercenary.sociobot.in/privacy) and
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

`npm test` starts Vite and runs the game paths, demo isolation, keyboard,
mobile, route pages, privacy request check, and axe accessibility check. Every
public behavioral claim is in `.factory/claims.json` and may be run alone with
its listed `--grep` command. For a separate title/lang/main/alt/console smoke
check, start `npm run dev -- --host 127.0.0.1 --port 4173` and run:

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
