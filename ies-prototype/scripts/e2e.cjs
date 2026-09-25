// End-to-end smoke test of all hero journeys. Requires `npm i -D playwright-core` and a Chromium (set CHROME_PATH).
// Usage: BASE=http://localhost:3000 node scripts/e2e.cjs
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://localhost:3000';
(async () => {
  require('fs').mkdirSync('e2e-shots', { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) errors.push(m.text().slice(0, 300)); });
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  const step = async (name, fn) => { try { await fn(); console.log('OK  ', name); } catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); await page.screenshot({ path: 'e2e-shots/' + 'fail-' + name.replace(/\W+/g,'_') + '.png' }); } };
  const click = (t, opts={}) => page.getByRole('button', { name: t, ...opts }).first().click();

  await step('landing -> demo', async () => { await page.goto(BASE + '/'); await click('Start guided demo'); await page.waitForURL('**/command-center/**'); await page.getByText('Guided demo · 1 / 10').waitFor(); });
  await step('collections sprint', async () => { await click('Start collections sprint'); await page.getByText('Above covenant with sprint').waitFor(); });
  await page.screenshot({ path: 'e2e-shots/' + 'e-cc.png' });
  await step('demo next -> close', async () => { await click('Next'); await page.waitForURL('**/close/**'); });
  await step('autopilot + run', async () => { await page.getByRole('button', { name: /Autopilot/ }).first().click(); await click('Run Close Agent'); await page.getByRole('button', { name: 'Re-run Close Agent' }).waitFor({ timeout: 20000 }); });
  await page.screenshot({ path: 'e2e-shots/' + 'e-close.png' });
  await step('open IC item + approve', async () => { await page.getByText('Intercompany US ↔ UK').first().click(); await page.locator('aside').getByRole('button', { name: /^Evidence/ }).click(); await page.locator('aside').getByRole('button', { name: /^Policy/ }).click(); await page.screenshot({ path: 'e2e-shots/' + 'e-drawer.png' }); await click('Approve & post'); });
  await step('rollback auto item', async () => { await page.getByText('US operating account').first().click(); await click('Roll back'); });
  await step('escalated spend review', async () => { await page.getByText('marketing software').first().click(); await click('Confirm: annual prepayment'); });
  await step('escalate harborview', async () => { await page.getByText('Harborview Hotels').first().click(); await click(/Escalate to expert/); await page.waitForURL('**/experts/**'); });
  await step('send case + apply', async () => { await click(/Send context pack/); await page.getByRole('button', { name: 'Apply guidance to close' }).waitFor({ timeout: 10000 }); await page.screenshot({ path: 'e2e-shots/' + 'e-expert.png' }); await click('Apply guidance to close'); await page.getByText('Applied & logged').waitFor(); });
  await step('exit demo', async () => { await page.getByRole('button', { name: 'Exit demo' }).click(); });
  await step('scenario', async () => { await page.goto(BASE + '/scenarios/'); await page.getByRole('button', { name: /What if Q4 revenue drops/ }).click(); await page.getByText('I understood:').waitFor({ timeout: 8000 }); await page.waitForTimeout(800); await page.screenshot({ path: 'e2e-shots/' + 'e-scen.png' }); });
  await step('marketplace install', async () => { await page.goto(BASE + '/marketplace/'); await click('View agent'); await click(/^Install agent/); await page.getByLabel(/I grant these scopes/).check(); await click('Continue'); await click(/Install with/); await page.getByText('is installed').waitFor({ timeout: 8000 }); await page.screenshot({ path: 'e2e-shots/' + 'e-install.png' }); await click('Done'); });
  await step('freight insight in CC', async () => { await page.goto(BASE + '/command-center/'); await page.getByText('FreightAudit AI found').waitFor(); await click('Approve 3 dispute drafts'); });
  await step('trust thresholds', async () => { await page.goto(BASE + '/trust/'); await page.getByRole('button', { name: 'Thresholds & policies' }).click(); await page.locator('input[type=range]').first().fill('50000'); await click('Save policy'); await page.getByRole('button', { name: /Agents & autonomy/ }).click(); await page.getByRole('switch', { name: 'Pause Spend Agent' }).click(); await page.screenshot({ path: 'e2e-shots/' + 'e-trust.png' }); });
  await step('audit', async () => { await page.goto(BASE + '/audit/'); await page.getByText('Applied expert guidance').first().waitFor(); await page.screenshot({ path: 'e2e-shots/' + 'e-audit.png' }); });
  await step('studio generate', async () => { await page.goto(BASE + '/developer/studio/'); await click(/Generate agent/); await page.getByText('Agent generated').first().waitFor({ timeout: 8000 }); await page.getByRole('button', { name: /Approval gate/ }).first().click(); await page.screenshot({ path: 'e2e-shots/' + 'e-studio.png' }); });
  await step('tests fail then fix', async () => { await page.goto(BASE + '/developer/test/'); await click(/Run evaluation suite/); await page.getByText('1 critical failure').first().waitFor({ timeout: 10000 }); await page.screenshot({ path: 'e2e-shots/' + 'e-test-fail.png' }); await click(/Apply fix/); await page.getByText('All tests pass').first().waitFor({ timeout: 10000 }); await page.getByText('Insufficient data').first().click(); await page.screenshot({ path: 'e2e-shots/' + 'e-test-pass.png' }); });
  await step('publish', async () => { await page.goto(BASE + '/developer/publish/'); await click('Run certification'); await page.getByRole('button', { name: 'Certified' }).waitFor({ timeout: 6000 }); await click('Publish to marketplace'); await page.getByText('Live in the IES Marketplace').waitFor(); await page.screenshot({ path: 'e2e-shots/' + 'e-publish.png' }); });
  await step('dev agent in marketplace', async () => { await page.goto(BASE + '/marketplace/'); await page.getByText('Cash Recovery Agent').first().waitFor(); });
  await step('palette', async () => { await page.keyboard.press('Control+k'); await page.waitForTimeout(300); await page.keyboard.type('trust'); await page.waitForTimeout(200); await page.keyboard.press('Enter'); await page.waitForURL('**/trust/**'); });
  await step('onboarding call', async () => { await page.goto(BASE + '/developer/onboarding/'); await click('Run in sandbox'); await page.getByText('200 OK').waitFor(); });
  await step('api try', async () => { await page.goto(BASE + '/developer/apis/'); await click('Try in sandbox'); await page.getByText('200 OK').waitFor(); });
  await step('compliance', async () => { await page.goto(BASE + '/compliance/'); await click('Review & approve'); await click('Apply fix'); });
  await step('demo reset', async () => { await page.goto(BASE + '/vision/'); await click(/Restart demo/); await page.waitForURL('**/command-center/**'); await page.getByText('Guided demo · 1 / 10').waitFor(); });
  for (const r of ['/workflows/','/strategy/','/developer/','/developer/analytics/','/experts/']) await step('visit '+r, async()=>{ await page.goto(BASE + r); await page.waitForTimeout(500); });
  console.log('ERRORS:', JSON.stringify(errors, null, 1));
  await browser.close();
})();
