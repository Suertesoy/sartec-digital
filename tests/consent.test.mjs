// Componente de consentimento: padrões, paridade Aceitar/Recusar, persistência,
// revogação pelo rodapé, PT/EN, mobile, teclado/foco e site funcional sem consentimento.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startSite, newContext, mockCore, runDiagnostic, PAGES, CONSENT_KEY } from './helpers.mjs';

let site;
before(async () => { site = await startSite(); });
after(async () => { await site?.close(); });

const stored = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), CONSENT_KEY);
const bannerVisible = (page) => page.$eval('#lacConsentBanner', (b) => !b.hidden).catch(() => false);

test('padrão: opcionais desligadas, banner visível e nada gravado em todas as páginas (desktop)', async () => {
  const ctx = await newContext(site);
  const page = await ctx.newPage();
  for (const f of PAGES) {
    await page.goto(`${site.base}/${f === 'diagnostico.html' ? 'diagnostico' : f}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#lacConsentBanner');
    assert.equal(await bannerVisible(page), true, `${f}: banner`);
    assert.equal(await stored(page), null, `${f}: nada gravado antes da escolha`);
    const snap = await page.evaluate(() => window.LAC_CONSENT.get());
    assert.deepEqual(snap, { decided: false, essential: true, analytics: false, advertising: false });
    assert.equal(await page.locator('.consent-footer-link').count(), 1, `${f}: link de preferências no rodapé`);
  }
  await ctx.close();
});

test('Aceitar e Recusar têm exatamente a mesma hierarquia visual (desktop e mobile)', async () => {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    const ctx = await newContext(site, { viewport });
    const page = await ctx.newPage();
    await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#lacConsentBanner:not([hidden])');
    const styleOf = (act) => page.$eval(`#lacConsentBanner [data-act="${act}"]`, (b) => {
      const s = getComputedStyle(b); const r = b.getBoundingClientRect();
      return { bg: s.backgroundColor, color: s.color, border: s.border, font: `${s.fontSize}/${s.fontWeight}`, pad: s.padding, radius: s.borderRadius, h: Math.round(r.height), w: Math.round(r.width) };
    });
    const [rej, acc, cus] = [await styleOf('reject'), await styleOf('accept'), await styleOf('customize')];
    for (const k of ['bg', 'color', 'border', 'font', 'pad', 'radius', 'h']) {
      assert.equal(rej[k], acc[k], `${viewport.width}px: ${k} difere entre Recusar e Aceitar`);
      assert.equal(cus[k], acc[k], `${viewport.width}px: ${k} difere em Personalizar`);
    }
    if (viewport.width < 500) assert.equal(rej.w, acc.w, 'mobile: botões com a mesma largura');
    await ctx.close();
  }
});

test('mobile: banner e modal cabem na tela, sem overflow horizontal', async () => {
  const ctx = await newContext(site, { viewport: { width: 360, height: 640 }, lang: 'pt' });
  const page = await ctx.newPage();
  await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#lacConsentBanner:not([hidden])');
  const fits = async (sel) => page.$eval(sel, (n) => { const r = n.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; });
  assert.equal(await fits('.consent__inner'), true, 'banner dentro da viewport');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'sem overflow horizontal');
  await page.click('#lacConsentBanner [data-act="customize"]');
  await page.waitForSelector('#lacConsentModal:not([hidden])');
  assert.equal(await fits('.consent-modal__panel'), true, 'modal dentro da viewport');
  await ctx.close();
});

test('Aceitar: grava as duas categorias, esconde o banner e persiste entre páginas', async () => {
  const ctx = await newContext(site);
  const page = await ctx.newPage();
  await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { window.__events = []; window.addEventListener('la:consentchange', (e) => window.__events.push(e.detail)); });
  await page.click('#lacConsentBanner [data-act="accept"]');
  assert.equal(await bannerVisible(page), false);
  const s = await stored(page);
  assert.equal(s.analytics, true); assert.equal(s.advertising, true);
  assert.deepEqual(await page.evaluate(() => window.__events), [{ decided: true, essential: true, analytics: true, advertising: true }]);
  await page.goto(`${site.base}/solucoes.html`, { waitUntil: 'domcontentloaded' });
  assert.equal(await bannerVisible(page), false, 'não pergunta de novo');
  await ctx.close();
});

test('Recusar: grava false/false e o site segue funcional (contatos e navegação)', async () => {
  const ctx = await newContext(site);
  const page = await ctx.newPage();
  await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.click('#lacConsentBanner [data-act="reject"]');
  const s = await stored(page);
  assert.equal(s.analytics, false); assert.equal(s.advertising, false);
  assert.equal(await bannerVisible(page), false);
  const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('.wa-float')]);
  assert.match(popup.url(), /^https:\/\/wa\.me\/5548991830112/);
  await popup.close();
  await page.goto(`${site.base}/cases.html`, { waitUntil: 'domcontentloaded' });
  assert.equal(await bannerVisible(page), false);
  await ctx.close();
});

test('Personalizar: toggles começam desligados; salvar só análise; revogar pelo rodapé', async () => {
  const ctx = await newContext(site);
  const page = await ctx.newPage();
  await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.click('#lacConsentBanner [data-act="customize"]');
  await page.waitForSelector('#lacConsentModal:not([hidden])');
  assert.equal(await page.isChecked('#lacConsentAnalytics'), false);
  assert.equal(await page.isChecked('#lacConsentAdvertising'), false);
  assert.equal(await page.locator('#lacConsentModal input[type=checkbox]').count(), 2, 'essenciais não é um toggle');
  await page.check('#lacConsentAnalytics');
  await page.click('#lacConsentModal [data-act="save"]');
  let s = await stored(page);
  assert.deepEqual([s.analytics, s.advertising], [true, false]);
  assert.equal(await bannerVisible(page), false);

  // Revisar e revogar pelo rodapé.
  await page.evaluate(() => { window.__events = []; window.addEventListener('la:consentchange', (e) => window.__events.push(e.detail)); });
  await page.click('.consent-footer-link');
  await page.waitForSelector('#lacConsentModal:not([hidden])');
  assert.equal(await page.isChecked('#lacConsentAnalytics'), true, 'mostra o estado salvo');
  await page.click('#lacConsentModal [data-act="rejectAll"]');
  s = await stored(page);
  assert.deepEqual([s.analytics, s.advertising], [false, false]);
  assert.deepEqual((await page.evaluate(() => window.__events)).map((e) => [e.analytics, e.advertising]), [[false, false]]);
  await ctx.close();
});

test('teclado e foco: modal com role=dialog, foco preso, Esc fecha e devolve o foco', async () => {
  const ctx = await newContext(site, { consent: { analytics: false, advertising: false } });
  const page = await ctx.newPage();
  await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  const link = page.locator('.consent-footer-link');
  await link.focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('#lacConsentModal:not([hidden])');
  assert.equal(await page.getAttribute('.consent-modal__panel', 'role'), 'dialog');
  assert.equal(await page.getAttribute('.consent-modal__panel', 'aria-modal'), 'true');
  assert.equal(await page.evaluate(() => document.activeElement.className), 'consent-modal__panel', 'foco entra no diálogo');
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('#lacConsentModal')), true, 'foco não escapa do modal');
  }
  await page.keyboard.press('Escape');
  assert.equal(await page.$eval('#lacConsentModal', (m) => m.hidden), true);
  assert.equal(await page.evaluate(() => document.activeElement.className), 'consent-footer-link', 'foco volta ao rodapé');
  await ctx.close();
});

test('PT/EN: textos nos dois idiomas e troca de idioma ao vivo', async () => {
  const ctx = await newContext(site, { lang: 'en' });
  const page = await ctx.newPage();
  await page.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#lacConsentBanner:not([hidden])');
  assert.equal(await page.textContent('#lacConsentBanner [data-act="reject"]'), 'Decline');
  assert.equal(await page.textContent('#lacConsentBanner [data-act="accept"]'), 'Accept');
  assert.equal(await page.textContent('.consent-footer-link'), 'Privacy preferences');
  await page.click('#langBtnPt');
  assert.equal(await page.textContent('#lacConsentBanner [data-act="reject"]'), 'Recusar');
  assert.equal(await page.textContent('.consent-footer-link'), 'Preferências de privacidade');
  await ctx.close();
});

test('diagnóstico: funciona normalmente com consentimento recusado e envia ao Core como antes', async () => {
  const ctx = await newContext(site, { consent: { analytics: false, advertising: false } });
  const page = await ctx.newPage();
  const core = await mockCore(page);
  await page.goto(`${site.base}/diagnostico`, { waitUntil: 'domcontentloaded' });
  await runDiagnostic(page);
  assert.equal(core.filter((c) => c.kind === 'submit').length, 1);
  assert.equal(core.filter((c) => c.kind === 'events' && c.body.eventType === 'result_viewed').length, 1);
  assert.equal(await bannerVisible(page), false);
  await ctx.close();
});
