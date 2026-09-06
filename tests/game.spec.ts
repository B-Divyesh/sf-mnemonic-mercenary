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

test('@claim:six-fight-end a deterministic demo run reaches its completed end screen', async ({ page }) => {
  await page.goto('/demo');
  await finishSampleRun(page);
  await expect(page.getByRole('heading', { name: 'You cleared all six fights.' })).toBeVisible();
  await expect(page.getByText('Fights survived')).toBeVisible();
  await expect(page.getByText('6 / 6')).toBeVisible();
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
  const [first] = await readVisibleRoute(page);
  const wrong = ['Sun', 'Wave', 'Peak', 'Gate', 'Star'].find((label) => label !== first);
  if (!wrong) throw new Error('No different symbol was available for the wrong-route path.');
  await page.getByRole('button', { name: 'Hide route and choose a move' }).click();
  await page.getByRole('button', { name: new RegExp(`Add ${wrong}`) }).click();
  await page.getByRole('button', { name: 'Commit move' }).click();
  await expect(page.locator('.outcome strong', { hasText: 'The route breaks.' })).toBeVisible();
  await expect(page.getByLabel('Health 2 of 6')).toBeVisible();
});

test('@claim:demo-isolated demo reset and play never change a real run value', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('mnemonic-mercenary:run', 'real-run-sentinel'));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await chooseSafePrefix(page);
  await expect(page.locator('.outcome strong', { hasText: 'Guard holds.' })).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem('mnemonic-mercenary:run'))).resolves.toBe('real-run-sentinel');
});

test('@claim:local-only-data demo interactions make only same-origin requests and preserve real storage', async ({ page, baseURL }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('mnemonic-mercenary:run', 'local-only-sentinel'));
  await page.goto('/demo');
  await chooseSafePrefix(page);
  const expectedOrigin = new URL(baseURL ?? 'http://127.0.0.1:4173').origin;
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === expectedOrigin)).toBeTruthy();
  await expect(page.evaluate(() => localStorage.getItem('mnemonic-mercenary:run'))).resolves.toBe('local-only-sentinel');
});

test('@claim:complete-price the public offer route states its exact one-time price and unavailable validation', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Offer status', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Check the complete game offer status' })).toBeVisible();
  await expect(page.getByText('The public complete-game offer is US$4.99 one time.')).toBeVisible();
  await expect(page.getByText('checkout and license validation are unavailable.')).toBeVisible();
  await expect(page.getByRole('button', { name: /checkout|buy|activate/i })).toHaveCount(0);
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

test('legal pages and designed not-found page have correct titles and a way back', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Mnemonic Mercenary');
  await expect(page.getByRole('main')).toHaveCount(1);
  await page.goto('/terms');
  await expect(page).toHaveTitle('Terms — Mnemonic Mercenary');
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Mnemonic Mercenary');
  await expect(page.getByRole('link', { name: 'Return to the game' })).toHaveAttribute('href', '/');
});
