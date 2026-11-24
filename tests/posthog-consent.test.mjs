// PostHog sob consentimento: nada carrega/inicializa sem aceite; aceite tardio;
// revogação; ambiente local/automação; configuração; sanitização do autocapture.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startSite, newContext, mockCore, runDiagnostic, CONSENT_KEY } from './helpers.mjs';

let site;
before(async () => { site = await startSite(); });
after(async () => { await site?.close(); });

// Stub do posthog que registra init/capture/opt_*; não toca a rede.
const STUB = () => {
  window.__ph = { inits: [], captures: [], optOut: 0, optIn: 0, identifies: 0 };
  window.posthog = {
    __loaded: true,
    init: (token, cfg) => window.__ph.inits.push({ token, cfg }),
    capture: (name, props) => window.__ph.captures.push({ name, props }),
    opt_out_capturing: () => { window.__ph.optOut++; },
    opt_in_capturing: () => { window.__ph.optIn++; },
    has_opted_out_capturing: () => false,
    identify: () => { window.__ph.identifies++; },
  };
};

async function open(consent, path = '/index.html', opts = {}) {
  const ctx = await newContext(site, { consent, extraInit: STUB, ...opts });
  const page = await ctx.newPage();
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto(`${site.base}${path}`, { waitUntil: 'domcontentloaded' });
  return { ctx, page, requests };
}
const ph = (page) => page.evaluate(() => window.__ph);

test('sem consentimento: PostHog não inicializa nem faz requisição (todas as páginas)', async () => {
  const ctx = await newContext(site, { extraInit: STUB });
  const page = await ctx.newPage();
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  for (const p of ['/index.html', '/solucoes.html', '/case-pesca.html', '/diagnostico']) {
    await page.goto(`${site.base}${p}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);
    assert.equal((await ph(page)).inits.length, 0, `${p}: init sem consentimento`);
    assert.equal(requests.filter((u) => /posthog/.test(u)).length, 0, `${p}: requisição ao PostHog`);
  }
  await ctx.close();
});

test('recusa explícita: continua sem PostHog; só publicidade aceita também não inicializa', async () => {
  for (const consent of [{ analytics: false, advertising: false }, { analytics: false, advertising: true }]) {
    const { ctx, page } = await open(consent);
    assert.equal((await ph(page)).inits.length, 0);
    await ctx.close();
  }
});

test('análise aceita: inicializa uma vez, com token/host US e sem identify()', async () => {
  const { ctx, page } = await open({ analytics: true, advertising: false });
  const s = await ph(page);
  assert.equal(s.inits.length, 1);
  assert.equal(s.inits[0].cfg.api_host, 'https://us.i.posthog.com');
  assert.match(s.inits[0].token, /^phc_/);
  assert.equal(s.identifies, 0);
  await ctx.close();
});

test('aceite tardio: nada antes do clique; init logo depois; revogar para a captura e limpa dados locais', async () => {
  const { ctx, page } = await open(null);
  assert.equal((await ph(page)).inits.length, 0);
  await page.evaluate(() => { localStorage.setItem('ph_phc_x_posthog', '{"distinct_id":"abc"}'); });
  await page.click('#lacConsentBanner [data-act="accept"]');
  assert.equal((await ph(page)).inits.length, 1, 'init após o aceite');
  assert.equal(await page.evaluate(() => window.LAC_ANALYTICS.isActive()), true);

  await page.click('.consent-footer-link');
  await page.click('#lacConsentModal [data-act="rejectAll"]');
  const s = await ph(page);
  assert.equal(s.optOut, 1, 'opt_out_capturing ao revogar');
  assert.equal(await page.evaluate(() => window.LAC_ANALYTICS.isActive()), false);
  assert.equal(await page.evaluate(() => window.LAC_ANALYTICS.capture('x', {})), false, 'capture bloqueado após revogar');
  assert.equal(await page.evaluate(() => Object.keys(localStorage).filter((k) => /^ph_/.test(k)).length), 0, 'dados locais ph_* apagados');

  // Reaceitar na mesma página reabilita sem reinicializar.
  await page.click('.consent-footer-link');
  await page.click('#lacConsentModal [data-act="acceptAll"]');
  assert.equal((await ph(page)).inits.length, 1);
  assert.equal(await page.evaluate(() => window.LAC_ANALYTICS.isActive()), true);
  await ctx.close();
});

test('revogação em uma página vale na próxima (preferência persistida)', async () => {
  const { ctx, page } = await open({ analytics: true, advertising: false });
  await page.click('.consent-footer-link');
  await page.click('#lacConsentModal [data-act="rejectAll"]');
  await page.goto(`${site.base}/sobre.html`, { waitUntil: 'domcontentloaded' });
  assert.equal(JSON.parse(await page.evaluate((k) => localStorage.getItem(k), CONSENT_KEY)).analytics, false);
  assert.equal(await page.evaluate(() => window.LAC_ANALYTICS.isActive()), false, 'nova página não reativa a captura');
  assert.equal((await ph(page)).inits.length, 0, 'sem novo init');
  await ctx.close();
});

test('localhost, 127.0.0.1 e automação sem liberação explícita não inicializam', async () => {
  const local = await newContext(site, { consent: { analytics: true, advertising: false }, extraInit: STUB });
  const p1 = await local.newPage();
  await p1.goto(`${site.localBase}/index.html`, { waitUntil: 'domcontentloaded' });
  assert.equal((await ph(p1)).inits.length, 0, '127.0.0.1');
  await local.close();

  const auto = await newContext(site, { consent: { analytics: true, advertising: false }, extraInit: STUB, automation: false });
  const p2 = await auto.newPage();
  await p2.goto(`${site.base}/index.html`, { waitUntil: 'domcontentloaded' });
  assert.equal(await p2.evaluate(() => navigator.webdriver), true);
  assert.equal((await ph(p2)).inits.length, 0, 'navegador automatizado sem a liberação de teste');
  await auto.close();
});

test('configuração: replay off, sem cookies, máscara de dados pessoais e superfície mínima', async () => {
  const { ctx, page } = await open({ analytics: true, advertising: false });
  const cfg = await page.evaluate(() => {
    const c = window.__ph.inits[0].cfg;
    return Object.fromEntries(Object.entries(c).filter(([, v]) => typeof v !== 'function').concat([['has_before_send', typeof c.before_send === 'function']]));
  });
  assert.equal(cfg.disable_session_recording, true);
  assert.equal(cfg.persistence, 'localStorage');
  assert.equal(cfg.cross_subdomain_cookie, false);
  assert.equal(cfg.person_profiles, 'identified_only');
  assert.equal(cfg.mask_personal_data_properties, true);
  assert.equal(cfg.mask_all_text, true);
  assert.equal(cfg.mask_all_element_attributes, true);
  assert.equal(cfg.capture_heatmaps, false);
  assert.equal(cfg.capture_dead_clicks, false);
  assert.equal(cfg.disable_surveys, true);
  assert.equal(cfg.has_before_send, true);
  for (const id of ['gclid', 'gbraid', 'wbraid', 'fbclid']) assert.ok(cfg.property_denylist.includes(id), `denylist sem ${id}`);
  await ctx.close();
});

test('autocapture/propriedades automáticas: IDs de anúncio e dados de contato não saem', async () => {
  const { ctx, page } = await open({ analytics: true, advertising: false });
  const out = await page.evaluate(() => {
    const bs = window.LAC_ANALYTICS.__beforeSend;
    const mk = (event, properties, extra) => Object.assign({ event, properties }, extra || {});
    const pv = bs(mk('$pageview', {
      $current_url: 'https://lacabral.test/solucoes.html?utm_source=google&gclid=ABC123&gbraid=G1&wbraid=W1&fbclid=F1&utm_campaign=x#top',
      $referrer: 'https://www.google.com/search?q=x&gclid=ZZZ',
      $initial_current_url: 'https://lacabral.test/?gclid=INIT',
      $initial_referrer: 'https://ads.example.com/?fbclid=FB',
      $session_entry_url: 'https://lacabral.test/?wbraid=WW&utm_medium=cpc',
      $pathname: '/solucoes.html',
      gclid: 'ABC123', fbclid: 'F1', $initial_gclid: 'INIT', utm_source: 'google',
    }, { $set_once: { $initial_current_url: 'https://lacabral.test/?gclid=Q&utm_term=t', $initial_gbraid: 'G' } }));
    const click = bs(mk('$autocapture', {
      $event_type: 'click',
      $elements: [{ tag_name: 'a', attr__href: 'https://lacabral.test/diagnostico?gclid=LEAK', $el_text: 'Fazer diagnóstico' }],
      $elements_chain: 'a.btn:href="/diagnostico?gclid=LEAK&utm_source=g"text="x"',
    }));
    const wa = bs(mk('$autocapture', { $elements: [{ tag_name: 'a', attr__href: 'https://wa.me/5548991830112?text=Ol%C3%A1' }], $elements_chain: 'a:href="https://wa.me/5548991830112"' }));
    const tel = bs(mk('$autocapture', { $elements_chain: 'a:href="tel:+5548991830112"' }));
    const mail = bs(mk('$autocapture', { $elements: [{ attr__href: 'mailto:alguem@example.com' }] }));
    return { pv, click, wa, tel, mail, broken: bs(null) };
  });
  const p = out.pv.properties;
  assert.equal(p.$current_url, 'https://lacabral.test/solucoes.html?utm_source=google&utm_campaign=x#top', 'UTMs mantidas, IDs de clique removidos');
  assert.equal(p.$referrer, 'https://www.google.com/search?q=x');
  assert.equal(p.$initial_current_url, 'https://lacabral.test/');
  assert.equal(p.$initial_referrer, 'https://ads.example.com/');
  assert.equal(p.$session_entry_url, 'https://lacabral.test/?utm_medium=cpc');
  for (const k of ['gclid', 'fbclid', '$initial_gclid']) assert.ok(!(k in p), `propriedade ${k} vazou`);
  assert.equal(out.pv.$set_once.$initial_current_url, 'https://lacabral.test/?utm_term=t');
  assert.ok(!('$initial_gbraid' in out.pv.$set_once));
  assert.ok(!JSON.stringify(out.click).includes('LEAK'), 'gclid no autocapture de elemento');
  assert.equal(out.wa, null, 'clique em wa.me não é autocapturado');
  assert.equal(out.tel, null, 'clique em tel: não é autocapturado');
  assert.equal(out.mail, null, 'clique em mailto: não é autocapturado');
  assert.equal(out.broken, null, 'falha fechada');
  await ctx.close();
});

test('diagnóstico: eventos só chegam ao PostHog com consentimento; Core recebe sempre', async () => {
  for (const [consent, expectPh] of [[{ analytics: false, advertising: false }, false], [{ analytics: true, advertising: false }, true]]) {
    const ctx = await newContext(site, { consent, extraInit: STUB });
    const page = await ctx.newPage();
    const core = await mockCore(page);
    await page.goto(`${site.base}/diagnostico`, { waitUntil: 'domcontentloaded' });
    await runDiagnostic(page);
    await page.waitForTimeout(300);
    const s = await ph(page);
    assert.equal(s.captures.length > 0, expectPh, `capturas no PostHog (consent=${JSON.stringify(consent)})`);
    assert.ok(core.filter((c) => c.kind === 'events').length >= 14, 'Core segue recebendo os eventos');
    assert.equal(core.filter((c) => c.kind === 'submit').length, 1);
    const blob = JSON.stringify(s.captures);
    for (const pii of ['Zeferino', 'zeferino.pii', '98877', 'Sigilosa']) assert.ok(!blob.includes(pii), `PII no PostHog: ${pii}`);
    await ctx.close();
  }
});

test('PostHog quebrado/bloqueado não afeta o site (aceite + rede do PostHog falhando, SDK real)', async () => {
  const ctx = await newContext(site, { consent: { analytics: true, advertising: false } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const core = await mockCore(page);
  await page.goto(`${site.base}/diagnostico`, { waitUntil: 'domcontentloaded' });
  await runDiagnostic(page);
  assert.deepEqual(errors, []);
  assert.equal(core.filter((c) => c.kind === 'submit').length, 1);
  await ctx.close();
});
