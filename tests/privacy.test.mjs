// Política de privacidade (rascunho): estrutura PT/EN, fidelidade ao que o código faz,
// nada inventado, links no rodapé/banner/modal, exibição por idioma, mobile.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startSite, newContext, mockCore, runDiagnostic, ROOT, PAGES } from './helpers.mjs';

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const policy = read('privacidade.html');
const section = (lang) => policy.split(`data-policy-lang="${lang}"`)[1].split('<!-- ══════════════ ENGLISH')[0].split('</main>')[0];

let site;
before(async () => { site = await startSite(); });
after(async () => { await site?.close(); });

test('rascunho: noindex, aviso de revisão e pontos a confirmar marcados (PT e EN em paridade)', () => {
  assert.match(policy, /<meta name="robots" content="noindex/);
  const pt = policy.split('data-policy-lang="pt"')[1].split('data-policy-lang="en"')[0];
  const en = policy.split('data-policy-lang="en"')[1].split('</main>')[0];
  assert.match(pt, /Rascunho para revisão/);
  assert.match(en, /Draft for review/);
  const todoPt = (pt.match(/\[A CONFIRMAR/g) || []).length;
  const todoEn = (en.match(/\[TO CONFIRM/g) || []).length;
  assert.ok(todoPt >= 8, `pontos a confirmar (PT): ${todoPt}`);
  assert.equal(todoPt, todoEn, 'mesmos pontos a confirmar nos dois idiomas');
  for (const tag of ['<h2', '<h3', '<tr>', '<li>', '<table']) assert.equal((pt.match(new RegExp(tag, 'g')) || []).length, (en.match(new RegExp(tag, 'g')) || []).length, `estrutura PT/EN diverge em ${tag}`);
});

test('nada inventado: sem prazos de retenção, sem encarregado nem base legal afirmados', () => {
  const text = policy.replace(/<[^>]+>/g, ' ');
  // Únicos números de duração permitidos são os técnicos que o código define (12 meses, 30 minutos).
  const durations = [...text.matchAll(/\b(\d+)\s*(dias|meses|anos|days|months|years|minutos|minutes|horas|hours)\b/gi)].map((m) => `${m[1]} ${m[2].toLowerCase()}`);
  for (const d of durations) assert.ok(['12 meses', '12 months', '30 minutos', '30 minutes'].includes(d), `duração não verificável: ${d}`);
  assert.ok(!/\bDPO\s*:\s*[A-Z][a-z]+ /.test(text), 'nome de encarregado inventado');
  assert.ok(!/prazo de (retenção|guarda)\s+de\s+\d/i.test(text));
});

test('fidelidade ao código: toda chave de armazenamento usada está descrita; cookie e validade do Core; e-mail oficial', () => {
  const used = new Set();
  for (const f of ['consent.js', 'attribution.js', 'tracking.js', 'diagnostic.js', 'script.js', 'analytics.js']) {
    for (const m of read(f).matchAll(/['"`](lac_[a-z0-9_]+|sartec_lang)['"`]/g)) used.add(m[1]);
  }
  assert.ok(used.size >= 5, [...used].join(','));
  for (const k of used) assert.ok(policy.includes(`<code>${k}</code>`), `chave ${k} não descrita na política`);
  assert.ok(policy.includes('lac_funnel_session') && /30 minutos/.test(policy) && /30 minutes/.test(policy));
  // E-mail único e igual ao da configuração central.
  const cfg = read('contact-config.js').match(/address: '([^']+)'/)[1];
  assert.equal(cfg, 'contato.lacabral@gmail.com');
  for (const m of policy.matchAll(/mailto:([^"]+)"/g)) assert.equal(m[1], cfg);
  // Terceiros descritos = terceiros realmente usados.
  for (const t of ['PostHog', 'Google', 'Vercel', 'Supabase', 'WhatsApp']) assert.ok(policy.includes(t), t);
  // Não promete o que o código não faz.
  assert.ok(!/gravamos (as )?sess/i.test(policy.replace(/não gravamos/gi, '')), 'replay não existe');
});

test('links: rodapé estático em todas as páginas (inclusive diagnóstico), sem JS', () => {
  for (const f of PAGES) {
    const html = read(f);
    assert.match(html, /<a href="privacidade\.html"[^>]*class="footer__privacy"[^>]*data-i18n="footerPrivacyPolicy"/, `${f}: link no rodapé`);
  }
});

test('banner e modal de consentimento linkam a política (PT/EN)', async () => {
  for (const lang of ['pt', 'en']) {
    const ctx = await newContext(site, { lang });
    const page = await ctx.newPage();
    await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#lacConsentBanner:not([hidden])');
    const banner = page.locator('#lacConsentBanner a.consent__link');
    assert.equal(await banner.getAttribute('href'), 'privacidade.html');
    assert.equal(await banner.textContent(), lang === 'en' ? 'Privacy Policy' : 'Política de Privacidade');
    await page.click('#lacConsentBanner [data-act="customize"]');
    assert.equal(await page.locator('#lacConsentModal a.consent__link').getAttribute('href'), 'privacidade.html');
    await ctx.close();
  }
});

test('página renderiza um idioma por vez, traduz título e rodapé, sem erros de script', async () => {
  const ctx = await newContext(site, { consent: { analytics: false, advertising: false } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${site.base}/privacidade.html`, { waitUntil: 'load' });
  const vis = () => page.$$eval('[data-policy-lang]', (els) => els.map((e) => [e.dataset.policyLang, getComputedStyle(e).display !== 'none']));
  assert.deepEqual(await vis(), [['pt', true], ['en', false]]);
  assert.equal(await page.title(), 'Política de Privacidade — L A Cabral');
  assert.match(await page.textContent('h1:visible'), /Política de Privacidade/);
  await page.click('#langBtnEn');
  assert.deepEqual(await vis(), [['pt', false], ['en', true]]);
  assert.equal(await page.title(), 'Privacy Policy — L A Cabral');
  assert.equal(await page.textContent('.footer__privacy'), 'Privacy Policy');
  assert.match(await page.textContent('h1:visible'), /Privacy Policy/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('mobile: sem overflow horizontal (tabela rola dentro do próprio contêiner); wrapper focável', async () => {
  const ctx = await newContext(site, { consent: { analytics: false, advertising: false }, viewport: { width: 360, height: 740 } });
  const page = await ctx.newPage();
  await page.goto(`${site.base}/privacidade.html`, { waitUntil: 'load' });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.equal(await page.getAttribute('.policy__tablewrap:visible', 'tabindex'), '0');
  await ctx.close();
});

test('diagnóstico: link da política no rodapé muda de idioma', async () => {
  const ctx = await newContext(site, { consent: { analytics: false, advertising: false } });
  const page = await ctx.newPage();
  await mockCore(page);
  await page.goto(`${site.base}/diagnostico`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
  assert.equal(await page.textContent('.footer__privacy'), 'Política de Privacidade');
  await page.click('#langBtnEn');
  assert.equal(await page.textContent('.footer__privacy'), 'Privacy Policy');
  // "Preferências" convive no mesmo bloco do rodapé.
  assert.equal(await page.locator('.footer__policy .consent-footer-link').count(), 1);
  await ctx.close();
});

test('sem consentimento nada do envio do diagnóstico é gravado no navegador pelo contador de leads', async () => {
  const ctx = await newContext(site, { consent: { analytics: false, advertising: false } });
  const page = await ctx.newPage();
  await mockCore(page);
  await page.goto(`${site.base}/diagnostico`, { waitUntil: 'domcontentloaded' });
  await runDiagnostic(page);
  assert.equal(await page.evaluate(() => sessionStorage.getItem('lac_lead_sent')), null);
  await ctx.close();

  const ctx2 = await newContext(site, { consent: { analytics: true, advertising: false } });
  const p2 = await ctx2.newPage();
  await mockCore(p2);
  await p2.goto(`${site.base}/diagnostico`, { waitUntil: 'domcontentloaded' });
  await runDiagnostic(p2);
  assert.ok(await p2.evaluate(() => sessionStorage.getItem('lac_lead_sent')), 'com consentimento o guard persiste');
  await ctx2.close();
});
