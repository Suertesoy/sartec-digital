// Google Tag: inerte sem IDs reais; Consent Mode v2 básico; conversões Contato
// (secundária) e Lead do diagnóstico (principal); sem dados pessoais; revogação.
// Os IDs usados aqui são FALSOS e existem só dentro destes testes.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startSite, newContext, mockCore, runDiagnostic, ROOT, PAGES } from './helpers.mjs';

let site;
before(async () => { site = await startSite(); });
after(async () => { await site?.close(); });

const FAKE = { tagId: 'AW-0000000000', conversions: { contact: { label: 'TESTCONTACTLBL' }, diagnostic_lead: { label: 'TESTLEADLBL' } } };
const GOOGLE_URL = /googletagmanager\.com|google-analytics\.com|doubleclick\.net|googleadservices\.com/;

async function open(consent, { path: p = '/index.html', configure = false } = {}) {
  const ctx = await newContext(site, { consent });
  const requests = [];
  // O helper aborta os hosts do Google; aqui respondemos para o gtag.js "carregar".
  await ctx.route(GOOGLE_URL, (r) => { requests.push(r.request().url()); return r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }); });
  const page = await ctx.newPage();
  await page.goto(`${site.base}${p}`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { window.addEventListener('click', (e) => e.preventDefault()); window.__t = 0; const b = Date.now(); Date.now = () => b + window.__t; });
  if (configure) await page.evaluate((c) => window.LAC_GOOGLE.configure(c), FAKE);
  return { ctx, page, requests };
}
const dl = (page) => page.evaluate(() => (window.dataLayer || []).map((a) => Array.from(a)));
const conv = (entries) => entries.filter((e) => e[0] === 'event' && e[1] === 'conversion');
const clickWa = (page) => page.evaluate(() => { window.__t += 5000; document.querySelector('.wa-float').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); });

test('padrão do repositório: nenhum ID real — tag e rótulos nulos', () => {
  const src = fs.readFileSync(path.join(ROOT, 'google-tag.js'), 'utf8');
  assert.match(src, /tagId:\s*null/);
  assert.equal((src.match(/label:\s*null/g) || []).length, 2);
  assert.ok(!/AW-\d/.test(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/'AW-<[^']*'/g, '')) || true);
  const real = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').match(/AW-\d{6,}/g);
  assert.equal(real, null, 'não pode haver ID AW- real no código');
  for (const f of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.ok(!/googletagmanager|gtag\(|GTM-|G-[A-Z0-9]{6,}/.test(html), `${f}: sem GA4/GTM/gtag inline`);
    assert.ok(html.includes('google-tag.js?v=1'), `${f}: google-tag.js ausente`);
  }
});

test('sem IDs (estado atual): mesmo com publicidade aceita não há requisição, dataLayer nem conversão', async () => {
  const { ctx, page, requests } = await open({ analytics: true, advertising: true });
  await page.waitForTimeout(300);
  assert.equal(requests.length, 0);
  assert.equal(await page.evaluate(() => typeof window.dataLayer), 'undefined');
  assert.equal(await page.evaluate(() => window.LAC_GOOGLE.conversion('contact')), false);
  assert.equal(await page.evaluate(() => window.LAC_GOOGLE.isEnabled()), false);
  await ctx.close();
});

test('configurado mas sem consentimento de publicidade: nada carrega (Consent Mode básico)', async () => {
  for (const consent of [null, { analytics: true, advertising: false }, { analytics: false, advertising: false }]) {
    const { ctx, page, requests } = await open(consent, { configure: true });
    await page.waitForTimeout(200);
    assert.equal(requests.length, 0, `consent=${JSON.stringify(consent)}`);
    assert.equal(await page.evaluate(() => typeof window.dataLayer), 'undefined');
    assert.equal(await page.evaluate(() => window.LAC_GOOGLE.conversion('contact')), false);
    await ctx.close();
  }
});

test('com publicidade aceita: carrega gtag.js; consent default=denied antes do update=granted; sem GA e sem enhanced conversions', async () => {
  const { ctx, page, requests } = await open({ analytics: false, advertising: true }, { configure: true });
  await page.waitForTimeout(200);
  assert.ok(requests.some((u) => u.startsWith('https://www.googletagmanager.com/gtag/js?id=AW-0000000000')), 'carrega gtag.js');
  const d = await dl(page);
  const order = d.map((e) => `${e[0]}:${e[1] && e[1].constructor === String ? e[1] : ''}`);
  assert.ok(order.indexOf('consent:default') < order.indexOf('consent:update'), 'default antes do update');
  assert.ok(order.indexOf('consent:update') < order.indexOf('config:AW-0000000000'), 'update antes do config');
  assert.deepEqual(d.find((e) => e[1] === 'default')[2], { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
  assert.deepEqual(d.find((e) => e[1] === 'update')[2], { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' }, 'analytics_storage fica negado');
  const cfg = d.find((e) => e[0] === 'config');
  assert.equal(cfg[2].allow_enhanced_conversions, false);
  assert.ok(!requests.some((u) => /G-[A-Z0-9]{6,}|GTM-/.test(u)), 'sem GA4/GTM');
  await ctx.close();
});

test('Contato (secundária): clique em WhatsApp/telefone/e-mail = 1 conversão cada, sem dados pessoais, valor ou moeda', async () => {
  const { ctx, page } = await open({ analytics: true, advertising: true }, { configure: true });
  await clickWa(page);
  await page.evaluate(() => { window.__t += 5000; document.querySelector('[data-contact="phone"]').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); window.__t += 5000; document.querySelector('[data-contact="email"]').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); });
  const c = conv(await dl(page));
  assert.equal(c.length, 3);
  for (const e of c) assert.deepEqual(e[2], { send_to: 'AW-0000000000/TESTCONTACTLBL' });
  const blob = JSON.stringify(await dl(page));
  for (const forbidden of ['5548991830112', '99183', 'lac.lucascabral', 'wa.me', 'mailto', 'value', 'currency', 'transaction_id', '"user_data"', '"email"', '"phone_number"']) assert.ok(!blob.includes(forbidden), `dataLayer contém ${forbidden}`);
  await ctx.close();
});

test('duplo clique no mesmo CTA = 1 conversão (e 1 evento PostHog, não somados)', async () => {
  const { ctx, page } = await open({ analytics: true, advertising: true }, { configure: true });
  await page.evaluate(() => { const el = document.querySelector('.wa-float'); window.__t += 5000; el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); window.__t += 50; el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); });
  assert.equal(conv(await dl(page)).length, 1);
  await ctx.close();
});

test('Lead do diagnóstico (principal): 1 conversão só após o Core confirmar; clicar em WhatsApp depois não gera lead', async () => {
  const ctx = await newContext(site, { consent: { analytics: true, advertising: true } });
  await ctx.route(GOOGLE_URL, (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  const page = await ctx.newPage();
  await mockCore(page);
  await page.goto(`${site.base}/diagnostico`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((c) => window.LAC_GOOGLE.configure(c), FAKE);
  await runDiagnostic(page);
  let c = conv(await dl(page));
  assert.equal(c.length, 1);
  assert.deepEqual(c[0][2], { send_to: 'AW-0000000000/TESTLEADLBL' });
  const blob = JSON.stringify(await dl(page));
  for (const pii of ['Zeferino', 'zeferino', '98877', 'Sigilosa', 'optimization']) assert.ok(!blob.includes(pii), `dataLayer contém ${pii}`);
  const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('#diagResultWaBtn')]);
  await popup.close();
  c = conv(await dl(page));
  assert.deepEqual(c.map((e) => e[2].send_to), ['AW-0000000000/TESTLEADLBL', 'AW-0000000000/TESTCONTACTLBL'], 'lead + contato (intenção) são conversões distintas, cada uma uma vez');
  await ctx.close();
});

test('rótulo ausente: aquela conversão não é enviada (nada inventado)', async () => {
  const { ctx, page } = await open({ analytics: true, advertising: true });
  await page.evaluate(() => window.LAC_GOOGLE.configure({ tagId: 'AW-0000000000', conversions: { diagnostic_lead: { label: 'TESTLEADLBL' } } }));
  await clickWa(page);
  assert.equal(conv(await dl(page)).length, 0);
  await ctx.close();
});

test('revogação: consent update=denied, cookies _gcl_ removidos, novas conversões bloqueadas; reaceite reativa', async () => {
  const { ctx, page } = await open({ analytics: true, advertising: true }, { configure: true });
  await page.evaluate(() => { document.cookie = '_gcl_aw=abc; path=/'; });
  await page.click('.consent-footer-link');
  await page.click('#lacConsentModal [data-act="rejectAll"]');
  const d = await dl(page);
  assert.deepEqual(d.filter((e) => e[0] === 'consent' && e[1] === 'update').pop()[2], { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
  assert.equal(await page.evaluate(() => document.cookie.includes('_gcl_aw')), false);
  await clickWa(page);
  assert.equal(conv(await dl(page)).length, 0, 'sem conversão após revogar');
  await page.click('.consent-footer-link');
  await page.click('#lacConsentModal [data-act="acceptAll"]');
  await clickWa(page);
  assert.equal(conv(await dl(page)).length, 1, 'reativa após reaceitar');
  await ctx.close();
});

test('localhost e automação sem liberação não carregam a tag', async () => {
  const ctx = await newContext(site, { consent: { analytics: true, advertising: true }, automation: false });
  const requests = [];
  await ctx.route(GOOGLE_URL, (r) => { requests.push(r.request().url()); return r.fulfill({ status: 200, body: '' }); });
  const page = await ctx.newPage();
  await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((c) => window.LAC_GOOGLE.configure(c), FAKE);
  assert.equal(requests.length, 0);
  assert.equal(await page.evaluate(() => typeof window.dataLayer), 'undefined');
  await ctx.close();
});

test('tag bloqueada (bloqueador de anúncios): site e diagnóstico seguem funcionando', async () => {
  const ctx = await newContext(site, { consent: { analytics: true, advertising: true } });
  await ctx.route(GOOGLE_URL, (r) => r.abort('blockedbyclient'));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const core = await mockCore(page);
  await page.goto(`${site.base}/diagnostico`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((c) => window.LAC_GOOGLE.configure(c), FAKE);
  await runDiagnostic(page);
  assert.deepEqual(errors, []);
  assert.equal(core.filter((c) => c.kind === 'submit').length, 1);
  await ctx.close();
});
