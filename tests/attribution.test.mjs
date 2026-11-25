// Atribuição: first-touch, allowlist, consentimento (aceite tardio, recusa,
// revogação), navegação interna, retorno ao diagnóstico, nenhuma sessão fora do diagnóstico.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startSite, newContext, mockCore } from './helpers.mjs';

let site;
before(async () => { site = await startSite(); });
after(async () => { await site?.close(); });

const ENTRY = '/?utm_source=google&utm_medium=cpc&utm_campaign=c1&utm_term=t1&utm_content=a1&gclid=G1&gbraid=GB1&wbraid=WB1&fbclid=FB1';
const REF = 'https://www.google.com/search?q=privado&hl=pt';
const sessions = (core) => core.filter((c) => c.kind === 'session').map((c) => c.body);
const qs = (landingUrl) => Object.fromEntries(new URL(landingUrl, 'http://x').searchParams);
const stored = (page) => page.evaluate(() => sessionStorage.getItem('lac_attribution_v1'));

async function visit(consent, { entry = ENTRY, referer = REF, extraInit } = {}) {
  const ctx = await newContext(site, { consent, extraInit });
  const page = await ctx.newPage();
  const core = await mockCore(page);
  await page.goto(`${site.base}${entry}`, { waitUntil: 'domcontentloaded', referer });
  return { ctx, page, core };
}
// Navegação interna por clique (mantém o referrer same-origin, como um visitante real).
async function clickTo(page, href) {
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.evaluate((h) => { const a = document.createElement('a'); a.href = h; document.body.appendChild(a); a.click(); }, href).catch(() => {})]);
}
async function openDiagnostic(page) {
  await clickTo(page, '/diagnostico');
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
}

test('com publicidade aceita: entrada, navegação interna e diagnóstico levam a atribuição original ao /session', async () => {
  const { ctx, page, core } = await visit({ analytics: true, advertising: true });
  await clickTo(page, '/solucoes.html');
  await clickTo(page, '/cases.html');
  assert.equal(sessions(core).length, 0, 'nenhuma sessão do Core fora do diagnóstico');
  await openDiagnostic(page);
  const [s] = sessions(core);
  assert.equal(sessions(core).length, 1);
  assert.equal(new URL(s.landingUrl, 'http://x').pathname, '/', 'path de ENTRADA (não o do diagnóstico)');
  assert.deepEqual(qs(s.landingUrl), { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'c1', utm_term: 't1', utm_content: 'a1', gclid: 'G1', gbraid: 'GB1', wbraid: 'WB1', fbclid: 'FB1' });
  assert.equal(s.referrer, 'https://www.google.com/search', 'referrer sanitizado (sem query)');
  assert.ok(!s.landingUrl.includes('http'), 'landingUrl é path+query, sem host');
  await ctx.close();
});

test('allowlist: parâmetros fora dela nunca são guardados nem enviados', async () => {
  const { ctx, page, core } = await visit({ analytics: true, advertising: true }, { entry: '/?utm_source=g&email=a%40b.com&foo=bar&utm_weird=1&token=SEGREDO&gclid=G1#hash' });
  assert.ok(!(await stored(page)).match(/email|foo|bar|utm_weird|SEGREDO|token|hash/), 'storage só com a allowlist');
  await openDiagnostic(page);
  const [s] = sessions(core);
  assert.deepEqual(qs(s.landingUrl), { utm_source: 'g', gclid: 'G1' });
  await ctx.close();
});

test('first-touch: um segundo toque na mesma sessão não sobrescreve o primeiro', async () => {
  const { ctx, page, core } = await visit({ analytics: true, advertising: true });
  await page.goto(`${site.base}/solucoes.html?utm_source=outro&utm_campaign=segundo&gclid=SEGUNDO`, { waitUntil: 'domcontentloaded', referer: 'https://www.bing.com/search?q=x' });
  await openDiagnostic(page);
  const [s] = sessions(core);
  assert.equal(qs(s.landingUrl).utm_source, 'google');
  assert.equal(qs(s.landingUrl).gclid, 'G1');
  assert.equal(s.referrer, 'https://www.google.com/search');
  await ctx.close();
});

test('recusa: nada é gravado e o diagnóstico envia só o path (sem query nem referrer)', async () => {
  const { ctx, page, core } = await visit({ analytics: false, advertising: false });
  assert.equal(await stored(page), null);
  await openDiagnostic(page);
  const [s] = sessions(core);
  assert.equal(s.landingUrl, '/diagnostico');
  assert.equal(s.referrer, null);
  assert.equal(await stored(page), null);
  await ctx.close();
});

test('categorias: análise leva UTMs sem IDs de clique; publicidade leva tudo', async () => {
  const a = await visit({ analytics: true, advertising: false });
  await openDiagnostic(a.page);
  assert.deepEqual(Object.keys(qs(sessions(a.core)[0].landingUrl)).sort(), ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term']);
  assert.ok(!(await stored(a.page)).includes('G1'), 'IDs de clique não gravados sem publicidade');
  await a.ctx.close();

  const b = await visit({ analytics: false, advertising: true });
  await openDiagnostic(b.page);
  assert.equal(qs(sessions(b.core)[0].landingUrl).gclid, 'G1');
  await b.ctx.close();
});

test('aceite tardio no documento de entrada: grava no aceite e chega ao diagnóstico', async () => {
  const { ctx, page, core } = await visit(null);
  assert.equal(await stored(page), null, 'nada antes do aceite');
  await page.click('#lacConsentBanner [data-act="accept"]');
  assert.ok(await stored(page), 'registro criado no aceite');
  await openDiagnostic(page);
  assert.equal(qs(sessions(core)[0].landingUrl).gclid, 'G1');
  await ctx.close();
});

test('aceite tardio parcial: análise primeiro, publicidade depois completa os IDs (mesma entrada)', async () => {
  const { ctx, page, core } = await visit(null);
  await page.click('#lacConsentBanner [data-act="customize"]');
  await page.check('#lacConsentAnalytics');
  await page.click('#lacConsentModal [data-act="save"]');
  assert.ok(!(await stored(page)).includes('G1'));
  await page.click('.consent-footer-link');
  await page.check('#lacConsentAdvertising');
  await page.click('#lacConsentModal [data-act="save"]');
  assert.ok((await stored(page)).includes('G1'), 'IDs completados no aceite posterior');
  await openDiagnostic(page);
  assert.equal(qs(sessions(core)[0].landingUrl).gclid, 'G1');
  await ctx.close();
});

test('navegar antes de decidir não inventa um first-touch (nada é gravado fora da entrada)', async () => {
  const { ctx, page, core } = await visit(null);
  await clickTo(page, '/solucoes.html'); // documento interno, sem decisão ainda
  await page.click('#lacConsentBanner [data-act="accept"]');
  assert.equal(await stored(page), null, 'documento interno não é entrada');
  await openDiagnostic(page);
  assert.equal(sessions(core)[0].landingUrl, '/diagnostico');
  await ctx.close();
});

test('revogação: remove o registro; revogar só publicidade remove só os IDs de clique', async () => {
  const { ctx, page, core } = await visit({ analytics: true, advertising: true });
  assert.ok((await stored(page)).includes('G1'));
  await page.click('.consent-footer-link');
  await page.check('#lacConsentAnalytics');
  await page.uncheck('#lacConsentAdvertising');
  await page.click('#lacConsentModal [data-act="save"]');
  const mid = await stored(page);
  assert.ok(mid.includes('google') && !mid.includes('G1'), 'só os IDs saem');

  await page.click('.consent-footer-link');
  await page.click('#lacConsentModal [data-act="rejectAll"]');
  assert.equal(await stored(page), null, 'tudo removido');
  await openDiagnostic(page);
  assert.equal(sessions(core)[0].landingUrl, '/diagnostico');
  await ctx.close();
});

test('retorno ao diagnóstico (reload): o /session leva a mesma atribuição de novo', async () => {
  const { ctx, page, core } = await visit({ analytics: true, advertising: true });
  await openDiagnostic(page);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
  const all = sessions(core);
  assert.equal(all.length, 2);
  assert.deepEqual(all[1], all[0]);
  await ctx.close();
});

test('entrada direta no /diagnostico com parâmetros: respeita o consentimento vigente', async () => {
  const withConsent = await visit({ analytics: true, advertising: true }, { entry: '/diagnostico?utm_source=google&gclid=DIRETO' });
  await withConsent.page.waitForSelector('#diagStartBtn', { state: 'visible' });
  assert.deepEqual(qs(sessions(withConsent.core)[0].landingUrl), { utm_source: 'google', gclid: 'DIRETO' });
  assert.equal(new URL(sessions(withConsent.core)[0].landingUrl, 'http://x').pathname, '/diagnostico');
  await withConsent.ctx.close();

  const refused = await visit({ analytics: false, advertising: false }, { entry: '/diagnostico?utm_source=google&gclid=DIRETO' });
  await refused.page.waitForSelector('#diagStartBtn', { state: 'visible' });
  assert.equal(sessions(refused.core)[0].landingUrl, '/diagnostico');
  assert.equal(sessions(refused.core)[0].referrer, null);
  await refused.ctx.close();
});

test('attribution.js indisponível: o diagnóstico segue e envia só o path', async () => {
  const ctx = await newContext(site, { consent: { analytics: true, advertising: true } });
  await ctx.route('**/attribution.js*', (r) => r.abort('failed'));
  const page = await ctx.newPage();
  const core = await mockCore(page);
  await page.goto(`${site.base}/diagnostico?utm_source=google&gclid=X`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
  assert.equal(sessions(core)[0].landingUrl, '/diagnostico');
  await ctx.close();
});

test('IDs de anúncio nunca chegam ao PostHog (nem ao stub de captura)', async () => {
  const stub = () => {
    window.__ph = { captures: [], inits: [] };
    window.posthog = { __loaded: true, init: (t, c) => window.__ph.inits.push(c), capture: (n, p) => window.__ph.captures.push({ n, p }), opt_out_capturing() {}, opt_in_capturing() {}, has_opted_out_capturing: () => false };
  };
  const { ctx, page } = await visit({ analytics: true, advertising: true }, { extraInit: stub });
  await openDiagnostic(page);
  const blob = JSON.stringify(await page.evaluate(() => window.__ph.captures)); // eventos capturados (a config de init guarda a denylist de nomes, não valores)
  for (const id of ['G1', 'GB1', 'WB1', 'FB1', 'gclid', 'fbclid']) assert.ok(!blob.includes(`"${id}"`) && !blob.includes(`${id}=`), `PostHog recebeu ${id}`);
  await ctx.close();
});

test('mobile: o mesmo fluxo funciona em viewport pequena', async () => {
  const ctx = await newContext(site, { consent: { analytics: true, advertising: true }, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const core = await mockCore(page);
  await page.goto(`${site.base}${ENTRY}`, { waitUntil: 'domcontentloaded', referer: REF });
  await openDiagnostic(page);
  assert.equal(qs(sessions(core)[0].landingUrl).gclid, 'G1');
  await ctx.close();
});
