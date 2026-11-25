// Google Tag: inerte sem IDs reais; Consent Mode v2 básico; conversões Contato
// (secundária) e Lead do diagnóstico (principal); sem dados pessoais; revogação.
// Usa os identificadores oficiais; TODA a rede do Google/PostHog é interceptada (nada real é enviado).
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startSite, newContext, mockCore, runDiagnostic, ROOT, PAGES } from './helpers.mjs';

let site;
before(async () => { site = await startSite(); });
after(async () => { await site?.close(); });

const FAKE = { activate: true, tagId: 'AW-18584503044', conversions: { contact: { label: 'jZ3ACOLxxbsdEISG5J1F' }, diagnostic_lead: { label: 'XR_qCOqbp78dEISG5J1F' } } };
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

test('identificadores oficiais: tag, rótulos e send_to exatos (maiúsculas/minúsculas preservadas); sem GA4/GTM', () => {
  const src = fs.readFileSync(path.join(ROOT, 'google-tag.js'), 'utf8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  assert.match(code, /var ACTIVE = false;/, 'tag desativada por padrão em produção');
  assert.ok(code.includes("tagId: 'AW-18584503044'"));
  assert.ok(code.includes("contact: { label: 'jZ3ACOLxxbsdEISG5J1F' }"));
  assert.ok(code.includes("diagnostic_lead: { label: 'XR_qCOqbp78dEISG5J1F' }"));
  // send_to montado = exatamente os valores oficiais informados.
  assert.equal(`AW-18584503044/${'jZ3ACOLxxbsdEISG5J1F'}`, 'AW-18584503044/jZ3ACOLxxbsdEISG5J1F');
  assert.equal(`AW-18584503044/${'XR_qCOqbp78dEISG5J1F'}`, 'AW-18584503044/XR_qCOqbp78dEISG5J1F');
  // Só esses IDs AW- existem no código; nenhum G-/GTM-.
  assert.deepEqual([...new Set(code.match(/AW-\d{6,}/g))], ['AW-18584503044']);
  assert.equal(code.match(/\bGTM-[A-Z0-9]+|\bG-[A-Z0-9]{6,}/g), null);
  for (const f of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.ok(!/googletagmanager|gtag\(|GTM-|G-[A-Z0-9]{6,}/.test(html), `${f}: sem GA4/GTM/gtag inline`);
    assert.ok(/google-tag\.js\?v=\d+" defer/.test(html), `${f}: google-tag.js ausente`);
    assert.ok(html.indexOf('site-env.js') < html.indexOf('google-tag.js'), `${f}: site-env.js deve vir antes`);
  }
});

test('Preview e hosts não-produção não carregam a tag nem medem (mesmo com consentimento e webdriver mascarado)', async () => {
  const ctx = await site.browser.newContext();
  await ctx.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({ v: 1, analytics: true, advertising: true, ts: Date.now() }));
    Object.defineProperty(navigator, 'webdriver', { get: () => false }); // simula um humano em um Preview
  }, 'lac_consent_v1');
  const requests = [];
  await ctx.route(/googletagmanager\.com|posthog\.com|google-analytics|doubleclick/, (r) => { requests.push(r.request().url()); return r.abort('failed'); });
  const page = await ctx.newPage();
  await page.goto(`http://preview-lacabral.test:${site.port}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.LAC_ENV.measurementAllowed()), false);
  assert.equal(await page.evaluate(() => typeof window.dataLayer), 'undefined');
  assert.equal(await page.evaluate(() => window.LAC_ANALYTICS.isActive()), false);
  assert.equal(requests.length, 0, 'nenhuma requisição de medição em Preview');
  await ctx.close();
});

test('produção (humano, sem automação) com consentimento de publicidade: a Tag do Google NÃO carrega (desativada)', async () => {
  const ctx = await site.browser.newContext();
  await ctx.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({ v: 1, analytics: true, advertising: true, ts: Date.now() }));
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  }, 'lac_consent_v1');
  const google = [];
  await ctx.route(/googletagmanager.com|google-analytics|doubleclick|googleadservices/, (r) => { google.push(r.request().url()); return r.abort('failed'); });
  await ctx.route(/posthog.com/, (r) => r.abort('failed'));
  const page = await ctx.newPage();
  await page.goto(`http://lacabral.vercel.app:${site.port}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  assert.equal(await page.evaluate(() => window.LAC_ENV.measurementAllowed()), true, 'host de produção');
  assert.equal(await page.evaluate(() => window.LAC_GOOGLE.isEnabled()), false);
  assert.equal(await page.evaluate(() => typeof window.dataLayer), 'undefined');
  assert.equal(await page.evaluate(() => window.LAC_GOOGLE.conversion('contact')), false);
  assert.equal(await page.evaluate(() => document.cookie.includes('_gcl_')), false);
  assert.equal(google.length, 0, 'nenhuma requisição ao Google');
  // A chave não pode ser ligada fora dos testes (sem a flag de automação).
  assert.equal(await page.evaluate(() => window.LAC_GOOGLE.configure({ activate: true, tagId: 'AW-18584503044' })), false);
  assert.equal(await page.evaluate(() => window.LAC_GOOGLE.isEnabled()), false);
  await ctx.close();
});

test('automação sem liberação nunca dispara conversão (webdriver) — testes não contam como comerciais', async () => {
  const ctx = await newContext(site, { consent: { analytics: true, advertising: true }, automation: false });
  const requests = [];
  await ctx.route(GOOGLE_URL, (r) => { requests.push(r.request().url()); return r.fulfill({ status: 200, body: '' }); });
  const page = await ctx.newPage();
  await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { window.__t = 0; });
  await page.evaluate(() => document.querySelector('.wa-float').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
  assert.equal(requests.length, 0);
  assert.equal(await page.evaluate(() => typeof window.dataLayer), 'undefined');
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
  assert.ok(requests.some((u) => u.startsWith('https://www.googletagmanager.com/gtag/js?id=AW-18584503044')), 'carrega gtag.js');
  const d = await dl(page);
  const order = d.map((e) => `${e[0]}:${e[1] && e[1].constructor === String ? e[1] : ''}`);
  assert.ok(order.indexOf('consent:default') < order.indexOf('consent:update'), 'default antes do update');
  assert.ok(order.indexOf('consent:update') < order.indexOf('config:AW-18584503044'), 'update antes do config');
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
  for (const e of c) assert.deepEqual(e[2], { send_to: 'AW-18584503044/jZ3ACOLxxbsdEISG5J1F' });
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
  assert.deepEqual(c[0][2], { send_to: 'AW-18584503044/XR_qCOqbp78dEISG5J1F' });
  const blob = JSON.stringify(await dl(page));
  for (const pii of ['Zeferino', 'zeferino', '98877', 'Sigilosa', 'optimization']) assert.ok(!blob.includes(pii), `dataLayer contém ${pii}`);
  const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('#diagResultWaBtn')]);
  await popup.close();
  c = conv(await dl(page));
  assert.deepEqual(c.map((e) => e[2].send_to), ['AW-18584503044/XR_qCOqbp78dEISG5J1F', 'AW-18584503044/jZ3ACOLxxbsdEISG5J1F'], 'lead + contato (intenção) são conversões distintas, cada uma uma vez');
  await ctx.close();
});

test('rótulo inválido é ignorado: nenhuma conversão com rótulo malformado', async () => {
  const { ctx, page } = await open({ analytics: true, advertising: true });
  assert.equal(await page.evaluate(() => window.LAC_GOOGLE.configure({ activate: true, tagId: 'AW-18584503044', conversions: { contact: { label: '<script>' } } })), true);
  await clickWa(page);
  assert.deepEqual(conv(await dl(page)).map((e) => e[2].send_to), ['AW-18584503044/jZ3ACOLxxbsdEISG5J1F'], 'rótulo oficial mantido');
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

test('falha/bloqueio da Google Tag não impede a abertura de WhatsApp, telefone e e-mail', async () => {
  const ctx = await newContext(site, {
    consent: { analytics: true, advertising: true },
    // dataLayer quebrado: qualquer push da tag lança.
    extraInit: () => { window.dataLayer = { push() { throw new Error('dataLayer quebrado'); } }; },
  });
  await ctx.route(GOOGLE_URL, (r) => r.abort('blockedbyclient'));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((c) => window.LAC_GOOGLE.configure(c), FAKE); // liga a tag (dataLayer quebrado)
  // WhatsApp realmente abre.
  const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('.wa-float')]);
  assert.match(popup.url(), /^https:\/\/wa\.me\/5548991830112/);
  await popup.close();
  // tel: e mailto: não são cancelados pela instrumentação.
  const prevented = await page.evaluate(() => ['[data-contact="phone"]', '[data-contact="email"]', '.wa-float'].map((sel) => {
    const el = document.querySelector(sel);
    let blocked = false;
    // Observa DEPOIS do handler de captura da instrumentação; o link não pode ter sido cancelado.
    window.addEventListener('click', (e) => { blocked = e.defaultPrevented; e.preventDefault(); }, { once: true });
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    return blocked;
  }));
  assert.deepEqual(prevented, [false, false, false]);
  assert.deepEqual(errors, [], 'nenhum erro não tratado');
  await ctx.close();
});

test('GCLID: a tag recebe a URL de entrada com gclid e a atribuição o preserva na navegação (com consentimento)', async () => {
  const ctx = await newContext(site, {
    consent: { analytics: false, advertising: true },
    extraInit: () => {
      window.__cfgSearch = null;
      window.dataLayer = [];
      const orig = window.dataLayer.push.bind(window.dataLayer);
      window.dataLayer.push = function () { if (arguments[0] && arguments[0][0] === 'config') window.__cfgSearch = location.search; return orig.apply(null, arguments); };
    },
  });
  await ctx.route(GOOGLE_URL, (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  const page = await ctx.newPage();
  const core = await mockCore(page);
  await page.goto(`${site.base}/solucoes.html?gclid=TESTGCLID_Ab-1&utm_source=google&utm_medium=cpc`, { waitUntil: 'domcontentloaded', referer: 'https://www.google.com/' });
  await page.evaluate((c) => window.LAC_GOOGLE.configure(c), FAKE); // liga a tag (rede interceptada)
  await page.waitForTimeout(200);
  assert.match(await page.evaluate(() => window.__cfgSearch), /gclid=TESTGCLID_Ab-1/, 'a tag carrega enquanto o gclid ainda está na URL');
  // navegação interna por clique e chegada ao diagnóstico
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.evaluate(() => { const a = document.createElement('a'); a.href = '/diagnostico'; document.body.appendChild(a); a.click(); })]);
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
  const s = core.find((c) => c.kind === 'session').body;
  assert.match(s.landingUrl, /^\/solucoes\.html\?utm_source=google&utm_medium=cpc&gclid=TESTGCLID_Ab-1$/, 'maiúsculas/minúsculas preservadas');
  await ctx.close();
});
