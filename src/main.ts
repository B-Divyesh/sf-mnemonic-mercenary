import './styles.css';
import {
  getFight,
  getRoute,
  isCorrectPrefix,
  makeSeed,
  symbols,
  symbolById,
  type SymbolId
} from './game';

type Phase = 'memorize' | 'recall' | 'result' | 'won' | 'lost';
type Outcome = 'full' | 'partial' | 'miss';

type RunState = {
  seed: string;
  fightIndex: number;
  hp: number;
  relic: string;
  phase: Phase;
  selected: SymbolId[];
  completed: number;
  lastOutcome?: Outcome;
  routeVisible: boolean;
};

type Settings = {
  nonTimed: boolean;
  impactMotion: boolean;
};

type AppState = {
  route: string;
  demo: boolean;
  run: RunState;
  settings: Settings;
  settingsOpen: boolean;
  announcement: string;
};

const productOrigin = 'https://mnemonic-mercenary.sociobot.in';
const realRunKey = 'mnemonic-mercenary:run';
const realSettingsKey = 'mnemonic-mercenary:settings';
const demoRunKey = 'demo:mnemonic-mercenary:run';
const demoSettingsKey = 'demo:mnemonic-mercenary:settings';
const demoSeed = 'field-204';
const relics = ['Brass compass', 'Threaded lantern', 'Inkstone shield', 'Sable map'];
const routeNames: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Mnemonic Mercenary — Remember routes in six fights',
    description: 'Remember symbol routes to choose combat moves in a six-fight browser run.'
  },
  '/demo': {
    title: 'Demo — Mnemonic Mercenary',
    description: 'Try a saved sample of a six-fight symbol-route run.'
  },
  '/privacy': {
    title: 'Privacy — Mnemonic Mercenary',
    description: 'How Mnemonic Mercenary keeps game settings and runs on your device.'
  },
  '/terms': {
    title: 'Terms — Mnemonic Mercenary',
    description: 'Terms for using Mnemonic Mercenary.'
  },
  '/rules': {
    title: 'How to play — Mnemonic Mercenary',
    description: 'How to remember routes and choose moves in Mnemonic Mercenary.'
  },
  '/license': {
    title: 'License status — Mnemonic Mercenary',
    description: 'Public status for the Mnemonic Mercenary one-time offer.'
  }
};

let hideTimer: number | undefined;
let app: AppState;
let pendingFocus: string | undefined;

function defaultSettings(): Settings {
  return { nonTimed: false, impactMotion: true };
}

function makeRun(seed = makeSeed()): RunState {
  return {
    seed,
    fightIndex: 0,
    hp: 6,
    relic: relics[seed.length % relics.length],
    phase: 'memorize',
    selected: [],
    completed: 0,
    routeVisible: true
  };
}

function makeDemoSnapshot(): RunState {
  return {
    seed: demoSeed,
    fightIndex: 2,
    hp: 4,
    relic: 'Brass compass',
    phase: 'memorize',
    selected: [],
    completed: 2,
    routeVisible: true
  };
}

function storageFor(demo: boolean): { run: string; settings: string } {
  return demo
    ? { run: demoRunKey, settings: demoSettingsKey }
    : { run: realRunKey, settings: realSettingsKey };
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeRun(value: RunState, fallback: RunState): RunState {
  if (
    typeof value !== 'object' ||
    typeof value.seed !== 'string' ||
    !Number.isInteger(value.fightIndex) ||
    value.fightIndex < 0 ||
    value.fightIndex > 5 ||
    !Number.isInteger(value.hp) ||
    value.hp < 0 ||
    value.hp > 6 ||
    !Array.isArray(value.selected)
  ) {
    return fallback;
  }
  return { ...fallback, ...value, selected: value.selected.filter((item): item is SymbolId => symbols.some((symbol) => symbol.id === item)) };
}

function loadState(demo: boolean): AppState {
  const keys = storageFor(demo);
  const fallback = demo ? makeDemoSnapshot() : makeRun();
  const loadedRun = loadJson(keys.run, fallback);
  const loadedSettings = loadJson(keys.settings, defaultSettings());
  return {
    route: demo ? '/demo' : normalizePath(location.pathname),
    demo,
    run: normalizeRun(loadedRun, fallback),
    settings: { ...defaultSettings(), ...loadedSettings },
    settingsOpen: false,
    announcement: demo ? 'Demo loaded. This sample never changes your real run.' : 'A new run is ready.'
  };
}

function persist(): void {
  const keys = storageFor(app.demo);
  localStorage.setItem(keys.run, JSON.stringify(app.run));
  localStorage.setItem(keys.settings, JSON.stringify(app.settings));
}

function normalizePath(path: string): string {
  const clean = path.replace(/\/$/, '') || '/';
  return routeNames[clean] ? clean : '/';
}

function isGameRoute(): boolean {
  return app.route === '/' || app.route === '/demo';
}

function setMetadata(): void {
  const metadata = routeNames[app.route] ?? routeNames['/'];
  document.title = metadata.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${productOrigin}${app.route}`);
}

function routeTokenMarkup(symbol: SymbolId, index: number): string {
  const item = symbolById(symbol);
  return `<li class="route-token" aria-label="Step ${index + 1}: ${item.label}, ${item.cue}"><span aria-hidden="true">${item.glyph}</span><span>${item.label}</span></li>`;
}

function renderHeader(): string {
  return `<header class="site-header">
    <a class="wordmark" href="/" data-link aria-label="Mnemonic Mercenary home"><span aria-hidden="true">✦</span> Mnemonic Mercenary</a>
    <nav aria-label="Main navigation">
      <a href="/" data-link>Game</a>
      <a href="/demo" data-link>Demo</a>
      <a href="/rules" data-link>How to play</a>
      <a href="/privacy" data-link>Privacy</a>
    </nav>
  </header>`;
}

function renderFooter(): string {
  return `<footer class="site-footer">
    <p>Six short fights where memory chooses your move.</p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="/license" data-link>Offer status</a></nav>
    <p>Built by Param Factory · build 1.0.0 · Original code-drawn symbols.</p>
  </footer>`;
}

function renderDemoBanner(): string {
  if (!app.demo) return '';
  return `<aside class="demo-banner" aria-label="Demo controls">
    <p><strong>Demo — sample data, nothing is saved.</strong> You are entering fight 3 with a relic and two prior fights recorded.</p>
    <div><button type="button" data-action="reset-demo">Reset demo</button><button type="button" data-action="start-real">Start for real</button></div>
  </aside>`;
}

function renderSymbolControls(): string {
  const selected = app.run.selected;
  const controlButtons = symbols.map((symbol) => {
    const number = selected.filter((entry) => entry === symbol.id).length;
    return `<button type="button" class="symbol-control symbol-${symbol.id}" data-symbol="${symbol.id}" aria-label="Add ${symbol.label}; ${symbol.cue}">
      <span aria-hidden="true">${symbol.glyph}</span><span>${symbol.label}</span>${number ? `<b aria-label="selected ${number} times">${number}</b>` : ''}
    </button>`;
  }).join('');
  return `<section class="move-controls" aria-labelledby="move-heading">
    <div class="section-label"><h3 id="move-heading">Choose a route prefix</h3><p>Match any first steps. A correct partial route uses Guard. The whole route uses Strike.</p></div>
    <div class="symbol-grid" role="group" aria-label="Symbol choices">${controlButtons}</div>
    <p class="selection" aria-live="polite">${selected.length ? `Selected: ${selected.map((symbol) => symbolById(symbol).label).join(', ')}.` : 'No symbols selected.'}</p>
    <div class="control-row"><button type="button" data-action="undo-symbol" ${selected.length ? '' : 'disabled'}>Remove last</button><button type="button" class="primary" data-action="commit" ${selected.length ? '' : 'disabled'}>Commit move</button></div>
  </section>`;
}

function renderFight(): string {
  const run = app.run;
  const fight = getFight(run.seed, run.fightIndex);
  const route = getRoute(run.seed, run.fightIndex);
  const stateLabel = run.phase === 'memorize' ? 'Study the route' : run.phase === 'recall' ? 'Choose your move' : 'Fight resolved';
  const routeContents = run.routeVisible
    ? `<ol class="route-list" data-testid="shown-route">${route.map(routeTokenMarkup).join('')}</ol>`
    : `<p class="route-hidden"><span aria-hidden="true">◌</span> The route is hidden. Choose the first symbols you remember.</p>`;
  const timerNote = app.settings.nonTimed ? 'This route stays visible until you hide it.' : 'This route hides after a short pause. You can hide it now.';
  let actionSection = '';
  if (run.phase === 'memorize') {
    actionSection = `<div class="route-action"><p>${timerNote}</p><button type="button" class="primary" data-action="hide-route">Hide route and choose a move</button></div>`;
  } else if (run.phase === 'recall') {
    actionSection = renderSymbolControls();
  } else if (run.phase === 'result') {
    const result = run.lastOutcome === 'full'
      ? '<strong>Strike lands.</strong> You recalled every symbol and avoid the counterattack.'
      : run.lastOutcome === 'partial'
        ? '<strong>Guard holds.</strong> Your correct prefix reads the attack and keeps you safe.'
        : '<strong>The route breaks.</strong> You still clear the foe, but take 2 damage.';
    actionSection = `<section class="outcome ${run.lastOutcome === 'miss' ? 'outcome-miss' : ''}" aria-live="polite"><p>${result}</p><button type="button" class="primary" data-action="next-fight">Continue to the next fight</button></section>`;
  } else if (run.phase === 'won') {
    actionSection = `<section class="end-screen" aria-labelledby="win-heading"><p class="eyebrow">Run complete</p><h3 id="win-heading">You cleared all six fights.</h3><p>You finished with ${run.hp} of 6 health and carried the ${run.relic}.</p><dl><div><dt>Fights survived</dt><dd>6 / 6</dd></div><div><dt>Seed</dt><dd>${run.seed}</dd></div></dl><button type="button" class="primary" data-action="restart-run">Start another run</button></section>`;
  } else {
    actionSection = `<section class="end-screen loss" aria-labelledby="loss-heading"><p class="eyebrow">Run ended</p><h3 id="loss-heading">Your guard gave out.</h3><p>You reached fight ${run.fightIndex + 1} of 6. A new route will give you another way through.</p><button type="button" class="primary" data-action="restart-run">Restart this run</button></section>`;
  }
  return `<section class="game-board ${run.lastOutcome === 'miss' && app.settings.impactMotion ? 'impact' : ''}" aria-labelledby="fight-heading">
    <div class="game-status"><p class="eyebrow">${stateLabel}</p><p class="seed">Seed <code>${run.seed}</code></p></div>
    <div class="combat-grid">
      <section class="combatant player" aria-label="Your expedition status"><p class="eyebrow">Mercenary</p><p class="health" aria-label="Health ${run.hp} of 6"><span aria-hidden="true">♥</span> ${run.hp} / 6</p><p>Relic: <strong>${run.relic}</strong></p></section>
      <section class="enemy" aria-labelledby="fight-heading"><p class="eyebrow">Fight ${run.fightIndex + 1} of 6</p><h2 id="fight-heading">${fight.enemy}</h2><p class="tell"><strong>Tell:</strong> ${fight.tell}</p></section>
    </div>
    <section class="route-panel" aria-labelledby="route-heading"><div><p class="eyebrow">Route length ${fight.routeLength}</p><h3 id="route-heading">Remember the symbol route</h3></div>${routeContents}</section>
    ${actionSection}
  </section>`;
}

function renderSettings(): string {
  return `<section class="settings-panel" aria-labelledby="settings-heading" ${app.settingsOpen ? '' : 'hidden'}>
    <div class="settings-title"><h2 id="settings-heading" tabindex="-1">Game settings</h2><button type="button" data-action="close-settings">Close settings</button></div>
    <label class="toggle"><input type="checkbox" data-setting="nonTimed" ${app.settings.nonTimed ? 'checked' : ''} /><span>Keep routes visible until I hide them</span><small>Non-timed mode removes the automatic hide.</small></label>
    <label class="toggle"><input type="checkbox" data-setting="impactMotion" ${app.settings.impactMotion ? 'checked' : ''} /><span>Show a small impact movement after a miss</span><small>System reduced-motion preferences always stop this movement.</small></label>
  </section>`;
}

function renderGamePage(): string {
  const demoTitle = app.demo ? 'Try a saved symbol-route fight' : 'Remember symbol routes to choose combat moves';
  const demoDescription = app.demo
    ? 'For players testing the game. Start from a real fight with a relic and two fights already recorded.'
    : 'For players who want a short touch-friendly roguelike where partial recall is a safe tactical choice.';
  const actions = app.demo
    ? '<a class="button-link" href="/" data-link>Start a new real run</a>'
    : '<a class="button-link primary" href="/demo" data-link>Try it with sample data <span>See a saved fight now</span></a>';
  const runAction = app.demo
    ? '<button type="button" data-action="restart-run">Restart sample run <span>Begin at fight 1</span></button>'
    : '<button type="button" data-action="new-run">Start a new run <span>Begin at fight 1</span></button>';
  return `${renderHeader()}<main id="main" tabindex="-1">
    <section class="first-screen">
      <div class="intro-copy"><p class="eyebrow">Six-fight tactical memory game</p><h1 tabindex="-1">${demoTitle}</h1><p class="lede">${demoDescription}</p><div class="hero-actions">${actions}${runAction}</div>
      <ul class="plain-facts"><li>Six fights per run</li><li>Non-timed option</li><li>Runs stay on this device</li></ul></div>
      ${renderDemoBanner()}
      ${renderFight()}
      <div class="game-tools"><button type="button" data-action="open-settings" aria-expanded="${app.settingsOpen}">Open game settings</button><a href="/rules" data-link>Read the rules</a></div>
      ${renderSettings()}
    </section>
    <section class="how-it-works" aria-labelledby="how-heading"><h2 id="how-heading">How to play a six-fight run</h2><ol><li><strong>Study the route.</strong> Each fight shows 3 to 7 named symbols.</li><li><strong>Choose a prefix.</strong> Match the first symbol for Guard or all symbols for Strike.</li><li><strong>Finish the run.</strong> Clear six foes. Three wrong reads end the expedition.</li></ol></section>
    <section class="limits" aria-labelledby="limits-heading"><h2 id="limits-heading">What this game does not do</h2><p>It has no speed typing, endless mode, ads between fights, accounts, or account progression. It stores a run and settings only in this browser.</p></section>
    <section class="offer" aria-labelledby="offer-heading"><h2 id="offer-heading">Complete game offer</h2><p><strong>US$4.99 one time.</strong> The complete edition includes the six-fight expedition, route variations, relics, and accessibility settings.</p><p>Billing registration is not available yet, so this build has no checkout or activation claim. The playable run remains available for product testing.</p><a href="/license" data-link>Read offer status</a></section>
    <p class="sr-only" aria-live="polite">${app.announcement}</p>
  </main>${renderFooter()}`;
}

function renderInfoPage(): string {
  const info: Record<string, { h1: string; body: string }> = {
    '/privacy': {
      h1: 'Keep your game data on your device',
      body: `<p>Mnemonic Mercenary stores a current run and your settings in this browser’s local storage. It sends no analytics, ads, account data, or game events to another service.</p><h2>What is stored</h2><ul><li>Current fight, health, seed, relic, and result</li><li>Non-timed and movement settings</li></ul><h2>How to remove it</h2><p>Use your browser’s site-data controls to clear this site. Demo data uses a separate local-storage name and is discarded when you leave demo mode.</p>`
    },
    '/terms': {
      h1: 'Use the game for personal play',
      body: `<p>You may play Mnemonic Mercenary in a supported browser. Do not use it to disrupt the site or misrepresent access to a paid offer.</p><h2>Local game data</h2><p>Your browser stores the run locally. Clearing browser site data removes it. The game has no account recovery.</p><h2>Offer status</h2><p>The US$4.99 one-time offer is awaiting billing registration. No purchase path or license activation is available in this build.</p>`
    },
    '/rules': {
      h1: 'Choose a combat move from a remembered route',
      body: `<p>Each enemy shows a route of named symbols. After it hides, choose the first symbols you remember.</p><h2>Use a safe partial recall</h2><p>A correct prefix uses Guard and clears the fight without damage. Recalling every symbol uses Strike. A wrong prefix clears the foe but costs 2 health. At 0 health, the run ends.</p><h2>Use non-timed mode</h2><p>Open game settings and choose “Keep routes visible until I hide them.” Symbols have names and shapes, so color is never the only cue.</p>`
    },
    '/license': {
      h1: 'Check the complete game offer status',
      body: `<p>The public complete-game offer is US$4.99 one time. Billing registration has not been completed, so checkout and license validation are unavailable.</p><h2>What is included</h2><p>The paid deliverable is the complete six-fight expedition, its route variations, relics, and accessibility settings.</p><h2>License validation path</h2><p>This page is the public license status path. It does not accept or validate license keys until the authorised billing registration is complete.</p>`
    }
  };
  const page = info[app.route] ?? info['/rules'];
  return `${renderHeader()}<main id="main" tabindex="-1" class="content-page"><article><p class="eyebrow">Mnemonic Mercenary</p><h1 tabindex="-1">${page.h1}</h1>${page.body}<p><a href="/" data-link>Return to the game</a></p></article><p class="sr-only" aria-live="polite">${app.announcement}</p></main>${renderFooter()}`;
}

function render(): void {
  clearHideTimer();
  setMetadata();
  const root = document.querySelector<HTMLDivElement>('#app');
  if (!root) return;
  root.innerHTML = isGameRoute() ? renderGamePage() : renderInfoPage();
  if (pendingFocus) {
    const selector = pendingFocus;
    pendingFocus = undefined;
    requestAnimationFrame(() => document.querySelector<HTMLElement>(selector)?.focus());
  }
  if (isGameRoute() && app.run.phase === 'memorize' && !app.settings.nonTimed) {
    hideTimer = window.setTimeout(() => {
      if (app.run.phase === 'memorize') {
        app.run.phase = 'recall';
        app.run.routeVisible = false;
        app.announcement = 'The route is hidden. Choose a move.';
        persist();
        render();
      }
    }, 3200);
  }
}

function focusAfterRender(selector: string): void {
  pendingFocus = selector;
}

function clearHideTimer(): void {
  if (hideTimer !== undefined) window.clearTimeout(hideTimer);
  hideTimer = undefined;
}

function startRun(demo = app.demo, snapshot = false): void {
  app.demo = demo;
  app.route = demo ? '/demo' : '/';
  app.run = demo && snapshot ? { ...makeDemoSnapshot(), selected: [] } : makeRun(demo ? demoSeed : makeSeed());
  app.settings = demo ? loadJson(demoSettingsKey, defaultSettings()) : loadJson(realSettingsKey, defaultSettings());
  app.announcement = demo && snapshot ? 'Demo reset to its saved fight.' : 'New run started at fight 1.';
  focusAfterRender('[data-action="hide-route"]');
  persist();
  render();
}

function hideRoute(): void {
  if (app.run.phase !== 'memorize') return;
  app.run.phase = 'recall';
  app.run.routeVisible = false;
  app.announcement = 'The route is hidden. Choose a move.';
  focusAfterRender('[data-symbol="sun"]');
  persist();
  render();
}

function commitMove(): void {
  const run = app.run;
  if (run.phase !== 'recall' || !run.selected.length) return;
  const route = getRoute(run.seed, run.fightIndex);
  const prefix = isCorrectPrefix(route, run.selected);
  const full = prefix && run.selected.length === route.length;
  run.lastOutcome = full ? 'full' : prefix ? 'partial' : 'miss';
  if (!prefix) run.hp = Math.max(0, run.hp - 2);
  run.completed += 1;
  run.selected = [];
  run.phase = run.hp === 0 ? 'lost' : 'result';
  app.announcement = full ? 'Strike lands.' : prefix ? 'Guard holds.' : 'The route breaks. You take 2 damage.';
  focusAfterRender('[data-action="next-fight"]');
  persist();
  render();
}

function nextFight(): void {
  if (app.run.phase !== 'result') return;
  if (app.run.fightIndex === 5) {
    app.run.phase = 'won';
    app.announcement = 'Run complete. You cleared all six fights.';
  } else {
    app.run.fightIndex += 1;
    app.run.phase = 'memorize';
    app.run.routeVisible = true;
    app.run.lastOutcome = undefined;
    app.announcement = `Fight ${app.run.fightIndex + 1} is ready.`;
  }
  focusAfterRender(app.run.phase === 'won' ? '[data-action="restart-run"]' : '[data-action="hide-route"]');
  persist();
  render();
}

function navigate(path: string, push = true): void {
  clearHideTimer();
  const next = normalizePath(path);
  const nextDemo = next === '/demo';
  if (nextDemo !== app.demo) {
    app = loadState(nextDemo);
  }
  app.route = next;
  if (push) history.pushState({}, '', next);
  app.announcement = `Opened ${routeNames[next].title}.`;
  render();
  requestAnimationFrame(() => document.querySelector<HTMLElement>('h1')?.focus());
}

function bindEvents(): void {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest<HTMLAnchorElement>('a[data-link]');
    if (link) {
      event.preventDefault();
      navigate(new URL(link.href).pathname);
      return;
    }
    const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
    if (!action) {
      const symbol = target.closest<HTMLButtonElement>('[data-symbol]')?.dataset.symbol as SymbolId | undefined;
      if (symbol && app.run.phase === 'recall') {
        app.run.selected.push(symbol);
        app.announcement = `${symbolById(symbol).label} added.`;
        focusAfterRender(`[data-symbol="${symbol}"]`);
        persist();
        render();
      }
      return;
    }
    if (action === 'hide-route') hideRoute();
    if (action === 'undo-symbol') {
      app.run.selected.pop();
      app.announcement = 'Removed last symbol.';
      focusAfterRender(app.run.selected.length ? '[data-action="undo-symbol"]' : '[data-symbol="sun"]');
      persist();
      render();
    }
    if (action === 'commit') commitMove();
    if (action === 'next-fight') nextFight();
    if (action === 'restart-run') startRun(app.demo);
    if (action === 'new-run') startRun(false);
    if (action === 'reset-demo') startRun(true, true);
    if (action === 'start-real') navigate('/');
    if (action === 'open-settings') {
      app.settingsOpen = true;
      render();
      requestAnimationFrame(() => document.querySelector<HTMLElement>('#settings-heading')?.focus());
    }
    if (action === 'close-settings') {
      app.settingsOpen = false;
      render();
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-action="open-settings"]')?.focus());
    }
  });
  document.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    const setting = input.dataset.setting as keyof Settings | undefined;
    if (!setting) return;
    app.settings[setting] = input.checked;
    app.announcement = input.checked ? 'Setting enabled.' : 'Setting disabled.';
    persist();
    render();
  });
  window.addEventListener('popstate', () => navigate(location.pathname, false));
}

function runFixedTimestep(): void {
  const step = 1000 / 60;
  let last = performance.now();
  let accumulator = 0;
  let active = !document.hidden;
  document.addEventListener('visibilitychange', () => {
    active = !document.hidden;
    last = performance.now();
    accumulator = 0;
  });
  const frame = (now: number) => {
    const delta = Math.min(now - last, 250);
    last = now;
    if (active) {
      accumulator += delta;
      while (accumulator >= step) accumulator -= step;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function initialize(): void {
  const requestedDemo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  app = loadState(requestedDemo);
  app.route = requestedDemo ? '/demo' : normalizePath(location.pathname);
  bindEvents();
  runFixedTimestep();
  render();
}

initialize();
