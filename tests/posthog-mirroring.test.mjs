// Gate do espelhamento PostHog (Checkpoint 10.0A).
// Chrome real + servidor estático local. Todas as chamadas /api/funnel/v1/* e
// todos os hosts do PostHog são interceptados — nada toca Production nem o PostHog.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY = fs.readFileSync(path.join(ROOT, 'tests/fixtures/registry.json'), 'utf8');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const TOKEN = 'phc_nEyRVjJ37Lo6SH97PYKbMVGZjBNQHfQ5h7ww37QButBp';
const PII = { name: 'Zeferino Quaresma', email: 'zeferino.pii@example.com', phone: '(11) 98877-6655', company: 'Empresa Sigilosa' };
const SUBMIT_RESPONSE = '{"contractVersion":"1","recommendationPath":"optimization","outcomeMode":"guarded","leadId":"LEAD-ID-INTERNO","score":87,"tier":"A"}';
// Propriedades permitidas por evento (espelha a allowlist de diagnostic.js).
const ALLOWED = {
  diagnostic_viewed: ['language'],
  diagnostic_started: ['language'],
  question_viewed: ['language', 'question_id', 'question_order', 'question_count'],
  question_answered: ['language', 'question_id', 'question_order', 'question_count'],
  identity_viewed: ['language'],
  diagnostic_completed: ['language', 'recommendation_path', 'outcome_mode', 'answer_count'],
  result_viewed: ['language', 'recommendation_path', 'outcome_mode'],
  whatsapp_clicked: ['language', 'recommendation_path', 'outcome_mode'],
};

let server, base, browser;

before(async () => {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p === '/') p = '/index.html';
    if (p === '/diagnostico') p = '/diagnostico.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(buf);
    });
  }).listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome', headless: true });
});

after(async () => {
  await browser?.close();
  server?.close();
});

// ph: 'stub' | 'throwing' | 'none' | 'real'
async function openDiagnostic({ ph }) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const core = [];
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  await ctx.route('https://wa.me/**', (r) => r.fulfill({ status: 200, body: 'ok' }));
  await ctx.route(/posthog\.com/, (r) => r.abort('failed'));
  if (ph === 'none') await ctx.route('**/analytics.js*', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  if (ph === 'stub' || ph === 'throwing') {
    await page.addInitScript((throwing) => {
      window.__ph = { captures: [], identifies: 0, inits: [] };
      window.posthog = {
        __loaded: true,
        init: (token, cfg) => window.__ph.inits.push({ token, cfg }),
        capture: (name, props) => {
          if (throwing) throw new Error('posthog quebrado');
          window.__ph.captures.push({ name, props });
        },
        identify: () => { window.__ph.identifies++; },
      };
    }, ph === 'throwing');
  }
  await page.route('**/api/funnel/v1/**', async (route) => {
    const req = route.request();
    const name = new URL(req.url()).pathname.split('/').pop();
    if (name === 'registry') return route.fulfill({ status: 200, contentType: 'application/json', body: REGISTRY });
    if (name === 'events') {
      core.push({ kind: 'event', body: JSON.parse(req.postData()) });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    }
    if (name === 'submit') {
      core.push({ kind: 'submit', body: JSON.parse(req.postData()) });
      return route.fulfill({ status: 200, contentType: 'application/json', body: SUBMIT_RESPONSE });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto(`${base}/diagnostico?utm_campaign=test`, { waitUntil: 'domcontentloaded' });
  return { ctx, page, core, pageErrors };
}

async function runFullFlow(ctx, page) {
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
  await page.click('#diagStartBtn');
  await page.waitForSelector('#diagQuestion:not([hidden])');
  for (let i = 0; i < 11; i++) {
    await page.locator('#diagOptions .diag-option').first().click();
    await page.waitForFunction(() => !document.getElementById('diagNextBtn').disabled);
    await page.click('#diagNextBtn');
  }
  await page.waitForSelector('#diagIdentity:not([hidden])');
  await page.fill('#diagName', PII.name);
  await page.fill('#diagEmail', PII.email);
  await page.fill('#diagWhatsapp', PII.phone);
  await page.fill('#diagCompany', PII.company);
  await page.click('#diagSubmitBtn');
  await page.waitForSelector('#diagResult:not([hidden])');
  const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('#diagResultWaBtn')]);
  await popup.close();
  await page.waitForTimeout(400);
}

const coreEvents = (core) => core.filter((e) => e.kind === 'event').map((e) => e.body);
const countBy = (arr, f) => arr.filter(f).length;

test('A/B/E/F: Core intacto + PostHog recebe os mesmos eventos, só com propriedades da allowlist', async () => {
  const { ctx, page, core, pageErrors } = await openDiagnostic({ ph: 'stub' });
  await runFullFlow(ctx, page);
  const ph = await page.evaluate(() => window.__ph);
  const ev = coreEvents(core);

  // Core: contagem e formato exatamente como antes.
  assert.equal(countBy(ev, (b) => b.eventType === 'diagnostic_viewed'), 1);
  assert.equal(countBy(ev, (b) => b.eventType === 'question_viewed'), 11);
  assert.equal(countBy(ev, (b) => b.eventType === 'result_viewed'), 1);
  for (const b of ev) {
    const keys = Object.keys(b).sort().join(',');
    assert.ok(['eventId,eventType,submissionId', 'eventId,eventType,questionId,submissionId'].includes(keys), `payload do Core mudou: ${keys}`);
  }

  // PostHog: mesmos nomes, nada além da allowlist.
  const names = ph.captures.map((c) => c.name);
  const n = (name) => countBy(names, (x) => x === name);
  assert.equal(n('diagnostic_viewed'), 1);
  assert.equal(n('diagnostic_started'), 1);
  assert.equal(n('question_viewed'), 11);
  assert.equal(n('question_answered'), 11);
  assert.equal(n('identity_viewed'), 1);
  assert.equal(n('diagnostic_completed'), 1);
  assert.equal(n('result_viewed'), 1);
  assert.equal(n('whatsapp_clicked'), 1);
  assert.equal(names.length, 1 + 1 + 11 + 11 + 1 + 1 + 1 + 1);
  for (const c of ph.captures) {
    assert.ok(ALLOWED[c.name], `evento fora da lista: ${c.name}`);
    for (const k of Object.keys(c.props)) assert.ok(ALLOWED[c.name].includes(k), `${c.name}: propriedade fora da allowlist: ${k}`);
    assert.ok(['pt', 'en'].includes(c.props.language));
  }
  const q = ph.captures.filter((c) => c.name === 'question_viewed');
  assert.deepEqual(q.map((c) => c.props.question_order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  assert.equal(q[0].props.question_id, 'acquisition_sources');
  assert.equal(q[0].props.question_count, 11);
  const rv = ph.captures.find((c) => c.name === 'result_viewed').props;
  assert.deepEqual({ p: rv.recommendation_path, m: rv.outcome_mode }, { p: 'optimization', m: 'guarded' });
  const dc = ph.captures.find((c) => c.name === 'diagnostic_completed').props;
  assert.equal(dc.answer_count, 11);
  assert.equal(ph.identifies, 0, 'identify() nunca é chamado');
  assert.deepEqual(pageErrors, []);
  await ctx.close();
});

test('D: nenhuma PII, ID interno, score/tier ou metadata chega ao PostHog', async () => {
  const { ctx, page, core, pageErrors } = await openDiagnostic({ ph: 'stub' });
  await runFullFlow(ctx, page);
  const ph = await page.evaluate(() => window.__ph);
  const blob = JSON.stringify(ph.captures) + JSON.stringify(ph.inits);
  for (const v of [PII.name, PII.email, PII.phone, PII.company, '98877', 'zeferino', 'LEAD-ID-INTERNO']) {
    assert.ok(!blob.toLowerCase().includes(v.toLowerCase()), `vazou: ${v}`);
  }
  for (const b of coreEvents(core)) {
    assert.ok(!blob.includes(b.submissionId), 'submissionId vazou');
    assert.ok(!blob.includes(b.eventId), 'eventId vazou');
  }
  assert.ok(!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(blob), 'UUID vazou');
  const allKeys = Object.keys(Object.assign({}, ...ph.captures.map((c) => c.props)));
  for (const forbidden of ['score', 'tier', 'priority', 'qualification', 'dimension', 'guardrail', 'fingerprint', 'metadata', 'submission', 'visitor', 'lead', 'diagnostic_id', 'email', 'whatsapp', 'name']) {
    assert.ok(!allKeys.some((k) => k.toLowerCase().includes(forbidden)), `chave proibida: ${forbidden}`);
  }
  assert.deepEqual(pageErrors, []);
  await ctx.close();
});

test('D: campos de identidade levam ph-no-capture e a config mascara inputs', async () => {
  const { ctx, page } = await openDiagnostic({ ph: 'stub' });
  await page.waitForSelector('#diagStartBtn');
  for (const id of ['diagName', 'diagEmail', 'diagWhatsapp', 'diagCompany']) {
    assert.ok(await page.$eval(`#${id}`, (el) => el.classList.contains('ph-no-capture')), `${id} sem ph-no-capture`);
  }
  const init = await page.evaluate(() => window.__ph.inits[0]);
  assert.equal(init.token, TOKEN);
  assert.equal(init.cfg.api_host, 'https://us.i.posthog.com');
  assert.equal(init.cfg.defaults, '2026-05-30');
  assert.equal(init.cfg.person_profiles, 'identified_only');
  assert.equal(init.cfg.session_recording.maskAllInputs, true);
  await ctx.close();
});

test('C: sem PostHog (bloqueado/ausente) o diagnóstico e o Core funcionam normalmente', async () => {
  const { ctx, page, core, pageErrors } = await openDiagnostic({ ph: 'none' });
  assert.equal(await page.evaluate(() => typeof window.posthog), 'undefined');
  await runFullFlow(ctx, page);
  const ev = coreEvents(core);
  assert.equal(countBy(ev, (b) => b.eventType === 'question_viewed'), 11);
  assert.equal(countBy(ev, (b) => b.eventType === 'result_viewed'), 1);
  assert.equal(countBy(ev, (b) => b.eventType === 'whatsapp_clicked'), 1);
  assert.equal(countBy(core, (e) => e.kind === 'submit'), 1);
  assert.deepEqual(pageErrors, []);
  await ctx.close();
});

test('C: posthog.capture lançando erro não quebra UI nem o envio ao Core', async () => {
  const { ctx, page, core, pageErrors } = await openDiagnostic({ ph: 'throwing' });
  await runFullFlow(ctx, page);
  const ev = coreEvents(core);
  assert.equal(countBy(ev, (b) => b.eventType === 'question_answered'), 11);
  assert.equal(countBy(ev, (b) => b.eventType === 'result_viewed'), 1);
  assert.equal(countBy(core, (e) => e.kind === 'submit'), 1);
  assert.deepEqual(pageErrors, []);
  await ctx.close();
});

test('snippet real: analytics.js inicializa com token/host/config corretos e a rede do PostHog falhando não gera erro', async () => {
  const { ctx, page, pageErrors } = await openDiagnostic({ ph: 'real' });
  await page.waitForSelector('#diagStartBtn');
  const init = await page.evaluate(() => window.posthog._i.map((a) => ({ token: a[0], cfg: a[1] })));
  assert.equal(init.length, 1);
  assert.equal(init[0].token, TOKEN);
  assert.deepEqual(init[0].cfg, { api_host: 'https://us.i.posthog.com', defaults: '2026-05-30', person_profiles: 'identified_only', session_recording: { maskAllInputs: true } });
  assert.deepEqual(pageErrors, []);
  await ctx.close();
});

test('todas as páginas públicas carregam analytics.js no <head>, antes dos demais scripts externos', () => {
  const htmls = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
  assert.ok(htmls.length >= 10, `esperava >=10 páginas, achei ${htmls.length}`);
  const tag = '<script src="analytics.js?v=1"></script>';
  for (const f of htmls) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const head = html.slice(0, html.indexOf('</head>'));
    assert.equal(html.split(tag).length - 1, 1, `${f}: analytics.js deve aparecer 1 vez`);
    assert.ok(head.includes(tag), `${f}: fora do <head>`);
    const firstScript = html.indexOf('<script src=');
    assert.equal(html.indexOf(tag), firstScript, `${f}: analytics.js não é o primeiro script externo`);
  }
  // Ignora comentários: a regra "nunca chamar identify()" está documentada neles.
  const js = fs.readFileSync(path.join(ROOT, 'analytics.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!/posthog\.identify\(/.test(js), 'analytics.js não deve chamar identify()');
});
