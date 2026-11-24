// Regressão do número comercial: nenhum direcionamento ativo pode usar o número
// antigo, e todos os canais devem usar o número oficial — inclusive com JS desativado.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SELF = path.relative(ROOT, fileURLToPath(import.meta.url)).replace(/\\/g, '/');

const NEW_E164 = '5548991830112';
const NEW_DISPLAY = '(48) 99183-0112';
// Padrões do número antigo, montados por partes para este arquivo não se acusar.
const OLD_PATTERNS = [
  new RegExp(['5512', '997863832'].join('')),
  new RegExp(['99786', '[-. ]?', '3832'].join('')),
  new RegExp(['\\+?55\\s?12\\s?9\\s?9786'].join('')),
];

const TRACKED = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
  .split('\n').filter(Boolean)
  .filter((f) => /\.(html|js|mjs|json|md|css)$/.test(f) && f !== 'package-lock.json' && f !== SELF);
const PAGES = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));

test('nenhum arquivo versionado contém o número antigo', () => {
  const hits = [];
  for (const f of TRACKED) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const re of OLD_PATTERNS) if (re.test(text)) hits.push(`${f} ~ ${re}`);
  }
  assert.deepEqual(hits, [], `número antigo encontrado:\n${hits.join('\n')}`);
});

test('fallbacks HTML estáticos (sem JS): todo wa.me e tel: usa o número oficial', () => {
  let waCount = 0;
  let telCount = 0;
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    for (const m of html.matchAll(/href="(https?:\/\/(?:wa\.me|api\.whatsapp\.com)[^"]*)"/g)) {
      waCount++;
      assert.ok(m[1].startsWith(`https://wa.me/${NEW_E164}`), `${page}: ${m[1]}`);
    }
    for (const m of html.matchAll(/href="tel:([^"]*)"/g)) {
      telCount++;
      assert.equal(m[1], `+${NEW_E164}`, `${page}: tel:${m[1]}`);
    }
    for (const m of html.matchAll(/>\(\d{2}\) \d{5}-\d{4}</g)) {
      assert.equal(m[0], `>${NEW_DISPLAY}<`, `${page}: telefone exibido`);
    }
  }
  assert.ok(waCount >= 20, `esperava vários links wa.me, achei ${waCount}`);
  assert.ok(telCount >= 9, `esperava tel: nas páginas, achei ${telCount}`);
});

// ── navegador real: JS desativado e JS ativo ─────────────────────────
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
      const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(buf);
    });
  }).listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome', headless: true });
});
after(async () => { await browser?.close(); server?.close(); });

async function collectLinks(page) {
  return page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')).filter((h) => /wa\.me|whatsapp|^tel:/.test(h)));
}

for (const javaScriptEnabled of [false, true]) {
  for (const lang of ['pt', 'en']) {
    if (!javaScriptEnabled && lang === 'en') continue; // sem JS não há troca de idioma
    test(`links ativos (JS ${javaScriptEnabled ? 'ligado' : 'desligado'}, ${lang}): só o número oficial`, async () => {
      const ctx = await browser.newContext({ javaScriptEnabled });
      if (javaScriptEnabled) await ctx.addInitScript((l) => { try { localStorage.setItem('sartec_lang', l); } catch (_) {} }, lang);
      const page = await ctx.newPage();
      for (const p of [...PAGES.map((f) => `/${f}`), '/diagnostico']) {
        await page.goto(`${base}${p}`, { waitUntil: 'domcontentloaded' });
        const links = await collectLinks(page);
        for (const href of links) {
          assert.ok(!OLD_PATTERNS.some((re) => re.test(href)), `${p}: número antigo em ${href}`);
          assert.ok(href.includes(NEW_E164), `${p}: link sem o número oficial: ${href}`);
        }
      }
      await ctx.close();
    });
  }
}

test('botão do resultado do diagnóstico e fallback de erro usam o número oficial', async () => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  // Registry indisponível → painel de erro fatal com o link de WhatsApp de fallback.
  await page.route('**/api/funnel/v1/**', (r) => r.abort('failed'));
  await page.goto(`${base}/diagnostico`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#diagFatalError:not([hidden])');
  const fallback = await page.getAttribute('#diagFatalError a[href*="wa.me"]', 'href');
  assert.ok(fallback.includes(NEW_E164), fallback);
  // O botão do resultado é montado por JS: o código-fonte também não pode ter o antigo.
  // (o número vive em contact-config.js e o diagnóstico o consome de lá)
  assert.ok(fs.readFileSync(path.join(ROOT, 'contact-config.js'), 'utf8').includes(NEW_E164));
  assert.ok(fs.readFileSync(path.join(ROOT, 'diagnostic.js'), 'utf8').includes('LAC_CONTACT.diagnosticWaHref'));
  await ctx.close();
});
