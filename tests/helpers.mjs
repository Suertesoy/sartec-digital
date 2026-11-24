// Utilitários compartilhados pelos testes de navegador (servidor estático + Chrome).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PAGES = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
export const REGISTRY = fs.readFileSync(path.join(ROOT, 'tests/fixtures/registry.json'), 'utf8');
export const CONSENT_KEY = 'lac_consent_v1';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.svg': 'image/svg+xml', '.json': 'application/json' };

// Servidor estático. `host` "real" (lacabral.test) evita o bloqueio de localhost dos scripts de analytics.
export async function startSite() {
  const server = http.createServer((req, res) => {
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
  const port = server.address().port;
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || 'chrome',
    headless: true,
    args: ['--host-resolver-rules=MAP lacabral.test 127.0.0.1'],
  });
  return {
    port,
    base: `http://lacabral.test:${port}`,
    localBase: `http://127.0.0.1:${port}`,
    browser,
    async close() { await browser.close(); server.close(); },
  };
}

// Contexto com consentimento pré-gravado e idioma; `consent` = null | {analytics, advertising}.
export async function newContext(site, { consent = null, lang = 'pt', viewport = { width: 1280, height: 800 }, automation = true, extraInit } = {}) {
  const ctx = await site.browser.newContext({ viewport });
  await ctx.addInitScript(([c, l, key, allowAutomation]) => {
    try {
      if (l) localStorage.setItem('sartec_lang', l);
      if (c && !sessionStorage.getItem('__seeded')) {
        localStorage.setItem(key, JSON.stringify({ v: 1, analytics: !!c.analytics, advertising: !!c.advertising, ts: Date.now() }));
        sessionStorage.setItem('__seeded', '1');
      }
    } catch (_) { /* no-op */ }
    // Os scripts de analytics não rodam sob automação; os testes liberam explicitamente.
    if (allowAutomation) window.__LAC_ALLOW_AUTOMATION__ = true;
  }, [consent, lang, CONSENT_KEY, automation]);
  if (extraInit) await ctx.addInitScript(extraInit);
  // Nada externo real: PostHog/Google/WhatsApp interceptados.
  await ctx.route(/posthog\.com/, (r) => r.abort('failed'));
  await ctx.route(/googletagmanager\.com|google-analytics\.com|doubleclick\.net/, (r) => r.abort('failed'));
  await ctx.route('https://wa.me/**', (r) => r.fulfill({ status: 200, body: 'ok' }));
  return ctx;
}

// Mock do Funnel Core. Retorna o log das chamadas.
export async function mockCore(page, { submitBody = '{"contractVersion":"1","recommendationPath":"optimization","outcomeMode":"standard"}', submitStatus = 200 } = {}) {
  const log = [];
  await page.route('**/api/funnel/v1/**', async (route) => {
    const req = route.request();
    const name = new URL(req.url()).pathname.split('/').pop();
    const body = req.postData() ? JSON.parse(req.postData()) : null;
    log.push({ kind: name, body, method: req.method() });
    if (name === 'registry') return route.fulfill({ status: 200, contentType: 'application/json', body: REGISTRY });
    if (name === 'submit') return route.fulfill({ status: submitStatus, contentType: 'application/json', body: submitBody });
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  return log;
}

export const PII = { name: 'Zeferino Quaresma', email: 'zeferino.pii@example.com', phone: '(11) 98877-6655', company: 'Empresa Sigilosa' };

// Percorre o diagnóstico inteiro até o resultado (sem clicar no WhatsApp).
export async function runDiagnostic(page) {
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
}
