import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('public routes and settings have no serious accessibility violations', async ({ page }) => {
  for (const route of ['/', '/demo', '/privacy', '/terms', '/rules', '/license', '/404.html']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious, `${route}: ${serious.map((violation) => violation.id).join(', ')}`).toEqual([]);
  }
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open game settings' }).click();
  const settingsResults = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const seriousSettings = settingsResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(seriousSettings, seriousSettings.map((violation) => violation.id).join(', ')).toEqual([]);
});
