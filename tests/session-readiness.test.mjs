// Gate de session readiness do diagnóstico (Checkpoint 9.5F).
// Roda diagnostic.js num Chrome real contra um servidor estático local; todas
// as chamadas /api/funnel/v1/* são interceptadas — nada toca Production.
//   npm test
//   DIAG_JS=/caminho/para/outra/versao.js npm test   (compara com outra versão do script)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIAG_JS = process.env.DIAG_JS ? path.resolve(process.env.DIAG_JS) : path.join(ROOT, 'diagnostic.js');
const REGISTRY = fs.readFileSync(path.join(ROOT, 'tests/fixtures/registry.json'), 'utf8');
const SESSION_DELAY = 2500;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };

let server, base, browser;

before(async () => {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p === '/diagnostico') p = '/diagnostico.html';
    const file = p === '/diagnostic.js' ? DIAG_JS : path.join(ROOT, p);
    if (!file.startsWith(ROOT) && file !== DIAG_JS) { res.writeHead(403).end(); return; }
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

// mode: 'ok' | 'http500' | 'abort'. `log` guarda a ordem real das chamadas.
async function openPage({ sessionMode = 'ok', sessionDelay = 0, draft = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const log = [];
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  await ctx.route('https://wa.me/**', (r) => r.fulfill({ status: 200, body: 'ok' }));
  await page.route('**/api/funnel/v1/**', async (route) => {
    const req = route.request();
    const name = new URL(req.url()).pathname.split('/').pop();
    if (name === 'registry') return route.fulfill({ status: 200, contentType: 'application/json', body: REGISTRY });
    if (name === 'session') {
      log.push({ kind: 'session-req' });
      if (sessionDelay) await new Promise((r) => setTimeout(r, sessionDelay));
      log.push({ kind: 'session-done' }); // registrado antes de a resposta chegar ao browser
      if (sessionMode === 'abort') return route.abort('failed');
      if (sessionMode === 'http500') return route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"contractVersion":"1","ok":true}' });
    }
    if (name === 'events') {
      log.push({ kind: 'event', body: JSON.parse(req.postData()) });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"contractVersion":"1","ok":true}' });
    }
    if (name === 'submit') {
      log.push({ kind: 'submit' });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"contractVersion":"1","recommendationPath":"optimization","outcomeMode":"guarded"}' });
    }
    return route.fulfill({ status: 404, body: '{}' });
  });
  if (draft) await page.addInitScript((d) => sessionStorage.setItem('lac_diag_draft', JSON.stringify(d)), draft);
  await page.goto(`${base}/diagnostico?utm_campaign=test`, { waitUntil: 'domcontentloaded' });
  return { ctx, page, log, pageErrors };
}

const events = (log) => log.filter((e) => e.kind === 'event').map((e) => e.body);
const count = (log, type) => events(log).filter((b) => b.eventType === type).length;
const sessionDoneIndex = (log) => log.findIndex((e) => e.kind === 'session-done');
const eventsBeforeSession = (log) => {
  const i = sessionDoneIndex(log);
  return log.slice(0, i === -1 ? log.length : i).filter((e) => e.kind === 'event');
};

async function answerAndContinue(page, n) {
  for (let i = 0; i < n; i++) {
    await page.locator('#diagOptions .diag-option').first().click();
    await page.waitForFunction(() => !document.getElementById('diagNextBtn').disabled);
    await page.click('#diagNextBtn');
  }
}

test('session lento: nenhum /events sai antes de /session; depois todos saem, sem duplicar', async () => {
  const { ctx, page, log, pageErrors } = await openPage({ sessionDelay: SESSION_DELAY });
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
  await page.click('#diagStartBtn'); // imediatamente: UI não espera a sessão
  await page.waitForSelector('#diagQuestion:not([hidden])');
  await answerAndContinue(page, 2);
  await page.waitForTimeout(SESSION_DELAY / 2);
  assert.equal(sessionDoneIndex(log), -1, 'o /session ainda deveria estar pendente');
  assert.equal(events(log).length, 0, 'nenhum /events pode sair enquanto /session está pendente');

  await page.waitForFunction(() => document.getElementById('diagProgressLabel').textContent.includes('3 '));
  await page.waitForTimeout(SESSION_DELAY + 800);
  assert.deepEqual(eventsBeforeSession(log), [], 'nenhum evento antes de /session resolver');
  assert.equal(log.filter((e) => e.kind === 'session-req').length, 1, '/session chamado uma vez');
  assert.equal(count(log, 'diagnostic_viewed'), 1);
  assert.equal(count(log, 'diagnostic_started'), 1);
  assert.equal(count(log, 'question_answered'), 2);
  assert.equal(count(log, 'question_viewed'), 3); // Q1, Q2, Q3
  const ids = events(log).map((b) => b.eventId);
  assert.equal(new Set(ids).size, ids.length, 'eventIds únicos');
  assert.deepEqual(pageErrors, []);
  await ctx.close();
});

for (const mode of ['http500', 'abort']) {
  test(`falha de /session (${mode}): UI segue e os eventos ainda são enviados`, async () => {
    const { ctx, page, log, pageErrors } = await openPage({ sessionMode: mode, sessionDelay: 800 });
    await page.waitForSelector('#diagStartBtn', { state: 'visible' });
    await page.click('#diagStartBtn');
    await page.waitForSelector('#diagQuestion:not([hidden])');
    await answerAndContinue(page, 1);
    await page.waitForFunction(() => document.getElementById('diagProgressLabel').textContent.includes('2 '));
    await page.waitForTimeout(1500);
    assert.deepEqual(eventsBeforeSession(log), []);
    assert.equal(count(log, 'diagnostic_viewed'), 1);
    assert.equal(count(log, 'diagnostic_started'), 1);
    assert.equal(count(log, 'question_viewed'), 2);
    assert.equal(count(log, 'question_answered'), 1);
    assert.deepEqual(pageErrors, [], 'sem unhandled rejection');
    await ctx.close();
  });
}

test('draft restaurado: question_viewed inicial espera a readiness', async () => {
  const draft = {
    draftVersion: 1, questionnaireVersion: '1.0', submissionId: '11111111-1111-4111-8111-111111111111', currentStep: 2,
    answers: { acquisition_sources: ['referral'], presence_representation: 'represents_well_and_facilitates_contact' },
  };
  const { ctx, page, log, pageErrors } = await openPage({ sessionDelay: SESSION_DELAY, draft });
  await page.waitForSelector('#diagQuestion:not([hidden])'); // renderiza sem esperar a sessão
  await page.waitForTimeout(SESSION_DELAY / 2);
  assert.equal(events(log).length, 0, 'nenhum evento antes de /session');
  await page.waitForTimeout(SESSION_DELAY);
  assert.deepEqual(eventsBeforeSession(log), []);
  const qv = events(log).filter((b) => b.eventType === 'question_viewed');
  assert.equal(qv.length, 1);
  assert.equal(qv[0].questionId, 'contact_entry_process');
  assert.equal(qv[0].submissionId, draft.submissionId);
  assert.equal(count(log, 'diagnostic_viewed'), 1);
  assert.deepEqual(pageErrors, []);
  await ctx.close();
});

test('regressão (sessão rápida): fluxo completo sem duplicar eventos', async () => {
  const { ctx, page, log, pageErrors } = await openPage();
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
  await page.click('#diagStartBtn');
  await page.waitForSelector('#diagQuestion:not([hidden])');
  await answerAndContinue(page, 11);
  await page.waitForSelector('#diagIdentity:not([hidden])');
  await page.fill('#diagName', 'Teste Sessao');
  await page.fill('#diagEmail', 'teste@example.com');
  await page.fill('#diagWhatsapp', '(11) 90000-0000');
  await page.click('#diagSubmitBtn');
  await page.waitForSelector('#diagResult:not([hidden])');
  const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('#diagResultWaBtn')]);
  await popup.close();
  await page.waitForTimeout(500);

  assert.equal(log.filter((e) => e.kind === 'session-req').length, 1);
  assert.equal(count(log, 'diagnostic_viewed'), 1);
  assert.equal(count(log, 'diagnostic_started'), 1);
  assert.equal(count(log, 'question_viewed'), 11);
  assert.equal(count(log, 'question_answered'), 11);
  assert.equal(count(log, 'identity_viewed'), 1);
  assert.equal(count(log, 'result_viewed'), 1);
  assert.equal(count(log, 'whatsapp_clicked'), 1);
  const ids = events(log).map((b) => b.eventId);
  assert.equal(new Set(ids).size, ids.length, 'eventIds únicos');
  const subs = new Set(events(log).map((b) => b.submissionId));
  assert.equal(subs.size, 1, 'um único submissionId');
  for (const b of events(log)) {
    const keys = Object.keys(b).sort().join(',');
    assert.ok(['eventId,eventType,submissionId', 'eventId,eventType,questionId,submissionId'].includes(keys), `payload inesperado: ${keys}`);
  }
  assert.deepEqual(pageErrors, []);
  await ctx.close();
});
