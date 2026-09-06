import { chromium } from '@playwright/test';

const url = process.argv[2];
if (!url) throw new Error('Usage: node scripts/verify-url.mjs <url>');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures = [];
page.on('console', (message) => {
  if (message.type() === 'error') failures.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
await page.goto(url, { waitUntil: 'networkidle' });
if (!(await page.locator('html[lang]').count())) failures.push('missing html lang');
if (!(await page.title())) failures.push('missing title');
if ((await page.locator('main').count()) !== 1) failures.push('expected exactly one main');
if ((await page.locator('h1').count()) !== 1) failures.push('expected exactly one h1');
const images = page.locator('img');
for (let index = 0; index < await images.count(); index += 1) {
  if ((await images.nth(index).getAttribute('alt')) === null) failures.push(`image ${index} has no alt`);
}
await browser.close();
if (failures.length) throw new Error(failures.join('\n'));
console.log(`Verified ${url}: title, lang, main, h1, alt attributes, and console.`);
