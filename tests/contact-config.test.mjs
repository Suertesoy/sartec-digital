// Consistência entre contact-config.js (fonte única) e todos os fallbacks HTML.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const PAGES = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));

// Carrega o contact-config.js real num sandbox mínimo (sem DOM).
function loadConfig() {
  const win = {};
  const ctx = vm.createContext({ window: win, document: { readyState: 'complete', querySelectorAll: () => [], addEventListener() {} } });
  vm.runInContext(read('contact-config.js'), ctx);
  return win.LAC_CONTACT;
}
const C = loadConfig();

function anchors(html) {
  return [...html.matchAll(/<a\b[^>]*>/g)].map((m) => {
    const tag = m[0];
    const attr = (n) => (tag.match(new RegExp(`\\s${n}="([^"]*)"`)) || [])[1];
    return { tag, href: attr('href'), key: attr('data-wa-key'), contact: attr('data-contact') };
  });
}

test('config: formato do número e do telefone coerentes', () => {
  assert.match(C.config.whatsapp.e164, /^55\d{10,11}$/);
  assert.equal('+' + C.config.whatsapp.e164, C.config.phone.href);
  assert.equal(C.config.phone.display.replace(/\D/g, ''), C.config.whatsapp.e164.slice(2));
  assert.deepEqual(Object.keys(C.config.messages.pt).sort(), Object.keys(C.config.messages.en).sort(), 'PT e EN com as mesmas chaves');
});

test('fallbacks HTML == config: wa.me, mensagem PT, tel e mailto (todas as páginas)', () => {
  const usedKeys = new Set();
  for (const page of PAGES) {
    for (const a of anchors(read(page))) {
      if (!a.href) continue;
      const isWa = /^https:\/\/wa\.me\//.test(a.href);
      const isTel = a.href.startsWith('tel:');
      const isMail = a.href.startsWith('mailto:');
      if (!(isWa || isTel || isMail)) continue;

      if (isWa) {
        const url = new URL(a.href);
        assert.equal(url.pathname.slice(1), C.config.whatsapp.e164, `${page}: número`);
        if (a.key) {
          usedKeys.add(a.key);
          assert.equal(url.searchParams.get('text'), C.config.messages.pt[a.key], `${page}: mensagem de ${a.key}`);
        } else {
          assert.equal(a.contact, 'whatsapp', `${page}: link wa.me sem data-wa-key nem data-contact: ${a.href}`);
          assert.equal(a.href, `https://wa.me/${C.config.whatsapp.e164}`);
        }
      }
      if (isTel) {
        assert.equal(a.contact, 'phone', `${page}: tel: sem data-contact`);
        assert.equal(a.href, `tel:${C.config.phone.href}`);
      }
      if (isMail) {
        assert.equal(a.contact, 'email', `${page}: mailto: sem data-contact`);
        assert.equal(a.href, `mailto:${C.config.email.address}`);
      }
    }
    // Texto visível do telefone/e-mail também espelha a config.
    for (const m of read(page).matchAll(/data-contact="phone"[^>]*>([^<]*)</g)) assert.equal(m[1], C.config.phone.display, `${page}: telefone exibido`);
    for (const m of read(page).matchAll(/data-contact="email"[^>]*>([^<]*)</g)) assert.equal(m[1], C.config.email.address, `${page}: e-mail exibido`);
  }
  // Toda chave da config é usada por algum CTA (sem mensagens órfãs) e vice-versa.
  assert.deepEqual([...usedKeys].sort(), Object.keys(C.config.messages.pt).sort());
});

test('script.js e diagnostic.js não duplicam número nem mensagens de contato', () => {
  for (const f of ['script.js', 'diagnostic.js']) {
    const src = read(f);
    assert.ok(!/wa\.me\/\d/.test(src), `${f}: número hardcoded em wa.me`);
    assert.ok(!/\b55\d{10,11}\b/.test(src), `${f}: número hardcoded`);
    for (const lang of ['pt', 'en']) for (const msg of Object.values(C.config.messages[lang])) assert.ok(!src.includes(msg), `${f}: mensagem duplicada: ${msg.slice(0, 40)}`);
  }
});

test('todas as páginas carregam contact-config.js antes do script que o consome', () => {
  for (const page of PAGES) {
    const html = read(page);
    const cfg = html.indexOf('contact-config.js');
    const consumer = Math.max(html.indexOf('src="script.js'), html.indexOf('src="diagnostic.js'));
    assert.ok(cfg > 0 && cfg < consumer, `${page}: contact-config.js ausente ou depois do consumidor`);
  }
});

// ── navegador: JS reescreve conforme idioma, sem quebrar acessibilidade ──
let server, base, browser;
before(async () => {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p === '/') p = '/index.html';
    if (p === '/diagnostico') p = '/diagnostico.html';
    const file = path.join(ROOT, p);
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

for (const lang of ['pt', 'en']) {
  test(`links de WhatsApp renderizados (${lang}) == config; aria-label e target preservados`, async () => {
    const ctx = await browser.newContext();
    await ctx.addInitScript((l) => { try { localStorage.setItem('sartec_lang', l); } catch (_) {} }, lang);
    const page = await ctx.newPage();
    for (const f of PAGES.filter((p) => p !== 'diagnostico.html')) {
      await page.goto(`${base}/${f}`, { waitUntil: 'domcontentloaded' });
      const rows = await page.$$eval('a[data-wa-key]', (as) => as.map((a) => ({ key: a.dataset.waKey, href: a.getAttribute('href'), target: a.target, rel: a.rel, aria: a.getAttribute('aria-label') })));
      assert.ok(rows.length >= 2, `${f}: CTAs de WhatsApp`);
      for (const r of rows) {
        assert.equal(r.href, C.waHref(r.key, lang), `${f} ${r.key} (${lang})`);
        assert.equal(r.target, '_blank');
        assert.match(r.rel, /noopener/);
      }
      const float = rows.find((r) => r.key === 'waFloatGeneral');
      assert.ok(float.aria && float.aria.length > 3, `${f}: botão flutuante sem aria-label`);
    }
    await ctx.close();
  });
}

test('rodapé: telefone e e-mail mantêm href e texto vindos da config', async () => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${base}/index.html`, { waitUntil: 'domcontentloaded' });
  assert.equal(await page.getAttribute('[data-contact="phone"]', 'href'), `tel:${C.config.phone.href}`);
  assert.equal(await page.textContent('[data-contact="phone"]'), C.config.phone.display);
  assert.equal(await page.getAttribute('[data-contact="email"]', 'href'), `mailto:${C.config.email.address}`);
  await ctx.close();
});
