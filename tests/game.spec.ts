import { expect, test, type Page } from '@playwright/test';

async function chooseSafePrefix(page: Page): Promise<void> {
  const route = page.getByTestId('shown-route');
  await expect(route).toBeVisible();
  const firstLabel = await route.getByRole('listitem').first().getAttribute('aria-label');
  const match = firstLabel?.match(/^Step 1: ([^,]+)/);
  if (!match) throw new Error('The visible route did not expose its first named symbol.');
  await page.getByRole('button', { name: 'Hide route and choose a move' }).click();
  await page.getByRole('button', { name: new RegExp(`Add ${match[1]}`) }).click();
  await page.getByRole('button', { name: 'Commit move' }).click();
}

async function finishSampleRun(page: Page): Promise<void> {
  for (let index = 0; index < 4; index += 1) {
    await chooseSafePrefix(page);
    await expect(page.locator('.outcome strong', { hasText: 'Guard holds.' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue to the next fight' }).click();
  }
}

async function readVisibleRoute(page: Page): Promise<string[]> {
  const entries = await page.getByTestId('shown-route').getByRole('listitem').evaluateAll((items) =>
    items.map((item) => item.getAttribute('aria-label')?.match(/^Step \d+: ([^,]+)/)?.[1] ?? '')
  );
  if (entries.some((entry) => !entry)) throw new Error('Every visible route step needs a named symbol.');
  return entries;
}

async function chooseWrongRoute(page: Page): Promise<void> {
  const [first] = await readVisibleRoute(page);
  const wrong = ['Sun', 'Wave', 'Peak', 'Gate', 'Star'].find((label) => label !== first);
  if (!wrong) throw new Error('No different symbol was available for the wrong-route path.');
  await page.getByRole('button', { name: 'Hide route and choose a move' }).click();
  await page.getByRole('button', { name: new RegExp(`Add ${wrong}`) }).click();
  await page.getByRole('button', { name: 'Commit move' }).click();
}

test('@claim:six-fight-end a deterministic demo run reaches its completed end screen', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Restart sample run' }).click();
  for (let index = 0; index < 6; index += 1) {
    await chooseSafePrefix(page);
    await page.getByRole('button', { name: 'Continue to the next fight' }).click();
  }
  await expect(page.getByRole('heading', { name: 'You cleared all six fights.' })).toBeVisible();
  await expect(page.getByText('Fights survived')).toBeVisible();
  await expect(page.locator('.end-screen dd').first()).toHaveText('6 / 6');
});

test('@claim:restart-reset restarting after the sample run restores fight 1 and full health', async ({ page }) => {
  await page.goto('/demo');
  await finishSampleRun(page);
  const restart = page.getByRole('button', { name: 'Start another run' });
  await expect(restart).toBeFocused();
  await restart.click();
  await expect(page.getByText('Fight 1 of 6')).toBeVisible();
  await expect(page.getByLabel('Health 6 of 6')).toBeVisible();
  await expect(page.getByText('Run complete')).not.toBeVisible();
});

test('@claim:settings-persist non-timed mode persists after a reload', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open game settings' }).click();
  const nonTimed = page.getByRole('checkbox', { name: 'Keep routes visible until I hide them' });
  await nonTimed.check();
  await page.reload();
  await page.getByRole('button', { name: 'Open game settings' }).click();
  await expect(page.getByRole('checkbox', { name: 'Keep routes visible until I hide them' })).toBeChecked();
  await expect(page.getByText('Non-timed mode removes the automatic hide.')).toBeVisible();
  await page.waitForTimeout(3_400);
  await expect(page.getByTestId('shown-route')).toBeVisible();
});

test('@claim:safe-partial-recall a correct partial route gives Guard without health loss', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByLabel('Health 4 of 6')).toBeVisible();
  await chooseSafePrefix(page);
  await expect(page.locator('.outcome strong', { hasText: 'Guard holds.' })).toBeVisible();
  await expect(page.getByLabel('Health 4 of 6')).toBeVisible();
});

test('@claim:route-curve a restarted run visibly follows the 3, 3, 4, 5, 6, 7 route curve', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Restart sample run' }).click();
  for (const expectedLength of [3, 3, 4, 5, 6, 7]) {
    await expect(page.getByText(`Route length ${expectedLength}`)).toBeVisible();
    await chooseSafePrefix(page);
    await page.getByRole('button', { name: 'Continue to the next fight' }).click();
  }
  await expect(page.getByRole('heading', { name: 'You cleared all six fights.' })).toBeVisible();
});

test('@claim:full-recall-strike selecting each shown symbol produces the Strike outcome', async ({ page }) => {
  await page.goto('/demo');
  const route = await readVisibleRoute(page);
  await page.getByRole('button', { name: 'Hide route and choose a move' }).click();
  for (const label of route) await page.getByRole('button', { name: new RegExp(`Add ${label}`) }).click();
  await page.getByRole('button', { name: 'Commit move' }).click();
  await expect(page.locator('.outcome strong', { hasText: 'Strike lands.' })).toBeVisible();
  await expect(page.getByLabel('Health 4 of 6')).toBeVisible();
});

test('@claim:wrong-recall-cost a different first symbol produces a two-health miss cost', async ({ page }) => {
  await page.goto('/demo');
  await chooseWrongRoute(page);
  await expect(page.locator('.outcome strong', { hasText: 'The route breaks.' })).toBeVisible();
  await expect(page.getByLabel('Health 2 of 6')).toBeVisible();
});

test('@claim:three-misses-end three wrong reads end a full-health run and focus its restart', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Restart sample run' }).click();
  for (const health of [4, 2]) {
    await chooseWrongRoute(page);
    await expect(page.getByLabel(`Health ${health} of 6`)).toBeVisible();
    await page.getByRole('button', { name: 'Continue to the next fight' }).click();
  }
  await chooseWrongRoute(page);
  await expect(page.getByLabel('Health 0 of 6')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your guard gave out.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Restart this run' })).toBeFocused();
});

test('@claim:demo-isolated demo reset and play never change a real run value', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('mnemonic-mercenary:run', 'real-run-sentinel'));
  await page.getByRole('link', { name: /Try it with sample data/ }).click();
  await expect(page).toHaveURL('/demo');
  await page.getByRole('button', { name: 'Open game settings' }).click();
  await page.getByRole('checkbox', { name: 'Keep routes visible until I hide them' }).check();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Fight 3 of 6')).toBeVisible();
  await expect(page.getByLabel('Health 4 of 6')).toBeVisible();
  await expect(page.getByText('Brass compass')).toBeVisible();
  await chooseSafePrefix(page);
  await expect(page.locator('.outcome strong', { hasText: 'Guard holds.' })).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem('mnemonic-mercenary:run'))).resolves.toBe('real-run-sentinel');
});

test('@claim:demo-discarded leaving demo removes its run and settings without changing real data', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('mnemonic-mercenary:run', 'real-run-sentinel'));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('button', { name: 'Open game settings' }).click();
  await page.getByRole('checkbox', { name: 'Keep routes visible until I hide them' }).check();
  await expect(page.evaluate(() => localStorage.getItem('demo:mnemonic-mercenary:run'))).resolves.not.toBeNull();
  await expect(page.evaluate(() => localStorage.getItem('demo:mnemonic-mercenary:settings'))).resolves.not.toBeNull();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.evaluate(() => localStorage.getItem('demo:mnemonic-mercenary:run'))).resolves.toBeNull();
  await expect(page.evaluate(() => localStorage.getItem('demo:mnemonic-mercenary:settings'))).resolves.toBeNull();
  await expect(page.evaluate(() => localStorage.getItem('mnemonic-mercenary:run'))).resolves.toBe('real-run-sentinel');
  await page.goto('/demo');
  await expect(page.getByText('Fight 3 of 6')).toBeVisible();
  await expect(page.getByText('Study the route', { exact: true })).toBeVisible();
});

test('@claim:local-only-data demo interactions make only same-origin requests and preserve real storage', async ({ page, baseURL }) => {
  const requests: Array<{ method: string; type: string; url: string }> = [];
  page.on('request', (request) => requests.push({
    method: request.method(),
    type: request.resourceType(),
    url: request.url()
  }));
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('mnemonic-mercenary:run', 'local-only-sentinel'));
  await page.goto('/demo');
  await chooseSafePrefix(page);
  const expectedOrigin = new URL(baseURL ?? 'http://127.0.0.1:4173').origin;
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((request) => new URL(request.url).origin === expectedOrigin)).toBeTruthy();
  expect(requests.every((request) => request.method === 'GET')).toBeTruthy();
  expect(requests.filter((request) => ['fetch', 'xhr'].includes(request.type))).toEqual([]);
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await expect(page.evaluate(() => localStorage.getItem('mnemonic-mercenary:run'))).resolves.toBe('local-only-sentinel');
});

test('@claim:complete-price the public offer has its exact one-time price, complete content, and unavailable validation', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Relic:')).toBeVisible();
  const firstRoute = await readVisibleRoute(page);
  await chooseSafePrefix(page);
  await page.getByRole('button', { name: 'Continue to the next fight' }).click();
  const nextRoute = await readVisibleRoute(page);
  expect(nextRoute.length).toBeGreaterThan(firstRoute.length);
  await page.getByRole('button', { name: 'Open game settings' }).click();
  await expect(page.getByRole('checkbox', { name: 'Keep routes visible until I hide them' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Show a small impact movement after a miss' })).toBeVisible();
  await page.getByRole('link', { name: 'Offer status', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Check the complete game offer status' })).toBeVisible();
  await expect(page.getByText('The public complete-game offer is US$4.99 one time.')).toBeVisible();
  await expect(page.getByText('The paid deliverable is the complete six-fight expedition, its route variations, relics, and accessibility settings.')).toBeVisible();
  await expect(page.getByText('checkout and license validation are unavailable.')).toBeVisible();
  await expect(page.getByRole('button', { name: /checkout|buy|activate/i })).toHaveCount(0);
});

test('@claim:input-focus pointer, touch, and keyboard play keep a visible focus target', async ({ page, browser, baseURL }) => {
  await page.goto('/demo');
  const hide = page.getByRole('button', { name: 'Hide route and choose a move' });
  await hide.focus();
  await page.keyboard.press('Enter');
  const sun = page.getByRole('button', { name: /Add Sun/ });
  await expect(sun).toBeFocused();
  await page.keyboard.press('Tab');
  const wave = page.getByRole('button', { name: /Add Wave/ });
  await expect(wave).toBeFocused();
  await page.keyboard.press('Space');
  await expect(wave).toBeFocused();
  const focusStyle = await wave.evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: parseFloat(style.outlineWidth), style: style.outlineStyle };
  });
  expect(focusStyle.width).toBeGreaterThanOrEqual(3);
  expect(focusStyle.style).not.toBe('none');
  await page.getByRole('button', { name: 'Remove last' }).click();
  await expect(page.getByText('No symbols selected.')).toBeVisible();

  const touchContext = await browser.newContext({
    baseURL,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 }
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto('/demo');
  const first = (await readVisibleRoute(touchPage))[0];
  await touchPage.getByRole('button', { name: 'Hide route and choose a move' }).tap();
  await touchPage.getByRole('button', { name: new RegExp(`Add ${first}`) }).tap();
  await touchPage.getByRole('button', { name: 'Commit move' }).tap();
  await expect(touchPage.locator('.outcome strong', { hasText: 'Guard holds.' })).toBeVisible();
  await touchContext.close();
});

test('@claim:reduced-motion reduced-motion preference suppresses the miss movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo');
  await chooseWrongRoute(page);
  const durationSeconds = await page.locator('.game-board').evaluate((element) =>
    parseFloat(getComputedStyle(element).animationDuration)
  );
  expect(durationSeconds).toBeLessThanOrEqual(0.00001);
});

test('@claim:named-symbol-cues every route step has a visible name, glyph, and spoken cue', async ({ page }) => {
  await page.goto('/demo');
  const steps = page.getByTestId('shown-route').getByRole('listitem');
  const count = await steps.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const step = steps.nth(index);
    await expect(step.locator('span')).toHaveCount(2);
    await expect(step.locator('span').nth(0)).not.toHaveText('');
    await expect(step.locator('span').nth(1)).not.toHaveText('');
    await expect(step).toHaveAttribute('aria-label', /^Step \d+: [^,]+, .+/);
  }
});

test('settings and automatic route changes preserve keyboard focus', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open game settings' }).click();
  const nonTimed = page.getByRole('checkbox', { name: 'Keep routes visible until I hide them' });
  await nonTimed.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('checkbox', { name: 'Keep routes visible until I hide them' })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('checkbox', { name: 'Keep routes visible until I hide them' })).toBeFocused();
  await page.getByRole('button', { name: 'Close settings' }).click();
  const hide = page.getByRole('button', { name: 'Hide route and choose a move' });
  await hide.focus();
  await page.waitForTimeout(3_400);
  await expect(page.getByRole('button', { name: /Add Sun/ })).toBeFocused();
});

test('invalid saved state recovers to a playable first fight', async ({ page }) => {
  await page.goto('/');
  for (const invalid of ['null', '{bad json', JSON.stringify({ fightIndex: 99, hp: -4, phase: 'broken' })]) {
    await page.evaluate((stored) => {
      localStorage.setItem('mnemonic-mercenary:run', stored);
      localStorage.setItem('mnemonic-mercenary:settings', stored);
    }, invalid);
    await page.reload();
    await expect(page.getByText('Fight 1 of 6')).toBeVisible();
    await expect(page.getByLabel('Health 6 of 6')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hide route and choose a move' })).toBeVisible();
  }
});

test('a resolved real fight survives refresh and can continue', async ({ page }) => {
  await page.goto('/');
  await chooseSafePrefix(page);
  await expect(page.locator('.outcome strong', { hasText: 'Guard holds.' })).toBeVisible();
  await page.reload();
  await expect(page.locator('.outcome strong', { hasText: 'Guard holds.' })).toBeVisible();
  await expect(page.getByLabel('Health 6 of 6')).toBeVisible();
  await page.getByRole('button', { name: 'Continue to the next fight' }).click();
  await expect(page.getByText('Fight 2 of 6')).toBeVisible();
});

test('keyboard play, route pages, and demo label work on the first screen', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1, name: 'Try a saved symbol-route fight' })).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  const hide = page.getByRole('button', { name: 'Hide route and choose a move' });
  await hide.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Choose a route prefix' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Add Sun/ })).toBeFocused();
  await page.getByRole('link', { name: 'Read the rules' }).click();
  await expect(page).toHaveTitle('How to play — Mnemonic Mercenary');
  const rulesHeading = page.getByRole('heading', { level: 1, name: 'Choose a combat move from a remembered route' });
  await expect(rulesHeading).toBeVisible();
  await expect(rulesHeading).toBeFocused();
  await page.goBack();
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
});

test('mobile first screen keeps the game board and touch controls usable', async ({ page }) => {
  await page.goto('/demo');
  const board = page.locator('.game-board');
  const primary = page.getByRole('button', { name: 'Hide route and choose a move' });
  await expect(board).toBeVisible();
  await expect(primary).toBeVisible();
  const box = await primary.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  expect(box?.width).toBeGreaterThanOrEqual(44);
});

test('every phone link has at least a 44 by 44 CSS pixel target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/demo', '/privacy', '/404.html']) {
    await page.goto(route);
    const undersized = await page.locator('a').evaluateAll((links) => links.flatMap((link) => {
      const box = link.getBoundingClientRect();
      if (!box.width || !box.height) return [];
      return box.width < 44 || box.height < 44
        ? [`${link.textContent?.trim()}: ${box.width.toFixed(1)}×${box.height.toFixed(1)}`]
        : [];
    }));
    expect(undersized, `${route}: ${undersized.join(', ')}`).toEqual([]);
  }
});

test('phone layout keeps play controls without horizontal overflow at 200 percent text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.evaluate(() => {
    document.documentElement.style.setProperty('font-size', '200%', 'important');
    document.body.style.setProperty('font-size', '1rem', 'important');
  });
  await expect(page.getByRole('button', { name: 'Hide route and choose a move' })).toBeVisible();
  const layout = await page.evaluate(() => ({ pageWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth }));
  expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth);
});

test('legal pages and designed not-found page have titles and the complete shared structure', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Mnemonic Mercenary');
  await expect(page.getByRole('main')).toHaveCount(1);
  await page.goto('/terms');
  await expect(page).toHaveTitle('Terms — Mnemonic Mercenary');
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Mnemonic Mercenary');
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Footer navigation' })).toBeVisible();
  await expect(page.getByText(/build 1\.0\.1/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the game' })).toHaveAttribute('href', '/');
});
