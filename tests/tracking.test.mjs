// Instrumentação: taxonomia, delegação de cliques (contato, diagnóstico, demos),
// posição/página de cada CTA, deduplicação, case_viewed e lead_submitted idempotente.
//   npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { startSite, newContext, mockCore, runDiagnostic, ROOT, PAGES } from './helpers.mjs';

let site;
before(async () => { site = await startSite(); });
after(async () => { await site?.close(); });

const STUB = () => {
  window.__ph = { captures: [], inits: [] };
  window.posthog = {
    __loaded: true,
    init: (t, c) => window.__ph.inits.push(c),
    capture: (name, props) => window.__ph.captures.push({ name, props }),
    opt_out_capturing() {}, opt_in_capturing() {}, has_opted_out_capturing: () => false,
  };
};
const ACCEPT = { analytics: true, advertising: false };
const caps = (page) => page.evaluate(() => window.__ph.captures);
const urlOf = (p) => `${site.base}/${p === 'diagnostico.html' ? 'diagnostico' : p}`;

async function open(page, p) {
  await page.goto(urlOf(p), { waitUntil: 'domcontentloaded' });
  // Clique sintético sem navegar + relógio controlado (o debounce usa Date.now()).
  await page.evaluate(() => {
    window.addEventListener('click', (e) => e.preventDefault());
    window.addEventListener('auxclick', (e) => e.preventDefault());
    window.__t = 0;
    const base = Date.now();
    Date.now = () => base + window.__t;
  });
}
const clickEl = (page, index, selector) => page.evaluate(([i, sel]) => {
  window.__t += 5000;
  const el = document.querySelectorAll(sel)[i];
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
}, [index, selector]);

// ── taxonomia ────────────────────────────────────────────────────────
test('taxonomia: camadas válidas, intenção ≠ conversão, sem propriedades sensíveis', () => {
  const win = { LAC_CONSENT: { subscribe() {}, get: () => ({}) } };
  const doc = { documentElement: { getAttribute: () => 'pt-BR' }, addEventListener() {} };
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'tracking.js'), 'utf8'), vm.createContext({ window: win, document: doc, location: { pathname: '/' }, setTimeout, URL, Date, JSON, sessionStorage: {} }));
  const T = win.LAC_TRACK.taxonomy;
  const layers = new Set(['behavior', 'contact_intent', 'conversion']);
  for (const [name, spec] of Object.entries(T)) {
    assert.ok(layers.has(spec.layer), `${name}: camada ${spec.layer}`);
    for (const k of spec.props) assert.ok(!/(email|phone|whatsapp|name$|score|tier|qualif|submission|session|lead_?id|gclid|gbraid|wbraid|fbclid|href|url)/i.test(k), `${name}: propriedade sensível ${k}`);
  }
  assert.equal(T.contact_clicked.layer, 'contact_intent');
  assert.equal(T.lead_submitted.layer, 'conversion');
  assert.ok(!('whatsapp_clicked' in T), 'whatsapp_clicked é legado do Core, não existe no PostHog');
  for (const n of ['case_viewed', 'demo_clicked', 'diagnostic_cta_clicked', 'contact_clicked', 'lead_submitted', 'diagnostic_viewed', 'result_viewed']) assert.ok(T[n], `falta ${n}`);
});

// ── cliques em todas as páginas ──────────────────────────────────────
test('todo CTA de contato, diagnóstico e demo gera exatamente 1 evento correto (todas as páginas)', async () => {
  const ctx = await newContext(site, { consent: ACCEPT, extraInit: STUB });
  const page = await ctx.newPage();
  const seen = { contact: 0, diagnostic: 0, demo: 0 };
  const positions = new Set();
  for (const p of PAGES) {
    await open(page, p);
    const valid = await page.evaluate(() => window.LAC_TRACK.positions);
    const links = await page.$$eval('a[href]', (as) => as.map((a, i) => {
      const raw = a.getAttribute('href');
      let kind = null;
      if (/^https:\/\/wa\.me\//.test(raw)) kind = 'whatsapp';
      else if (/^tel:/.test(raw)) kind = 'phone';
      else if (/^mailto:/.test(raw)) kind = 'email';
      else if (/(^|\/)diagnostico(\.html)?$/.test(raw)) kind = 'diagnostic';
      else if (/^https:\/\/(pescadelivery\.vercel\.app|www\.sartecpapelaria\.com\.br|projeto-uniedu\.vercel\.app|case-app-uniedu\.vercel\.app|almeidaambiental\.vercel\.app)/.test(raw)) kind = 'demo';
      return kind ? { i, kind, key: a.dataset.waKey || null } : null;
    }).filter(Boolean));
    for (const l of links) {
      const before = (await caps(page)).length;
      await clickEl(page, l.i, 'a[href]');
      const all = await caps(page);
      assert.equal(all.length, before + 1, `${p}: link #${l.i} (${l.kind}) deveria gerar exatamente 1 evento`);
      const ev = all[all.length - 1];
      const pageId = p === 'index.html' ? 'home' : p.replace('.html', '');
      if (['whatsapp', 'phone', 'email'].includes(l.kind)) {
        assert.equal(ev.name, 'contact_clicked'); assert.equal(ev.props.channel, l.kind); assert.equal(ev.props.event_layer, 'contact_intent');
        if (l.key) assert.equal(ev.props.cta_key, l.key);
        seen.contact++;
      } else if (l.kind === 'diagnostic') {
        assert.equal(ev.name, 'diagnostic_cta_clicked'); assert.equal(ev.props.event_layer, 'behavior'); seen.diagnostic++;
      } else {
        assert.equal(ev.name, 'demo_clicked'); assert.match(ev.props.case_slug, /^(pesca|sartec|uniedu|almeida)$/); assert.ok(ev.props.demo_host); seen.demo++;
      }
      assert.equal(ev.props.page, pageId, `${p}: page`);
      assert.ok(valid.includes(ev.props.position), `${p}: posição ${ev.props.position}`);
      if (l.kind !== 'demo') assert.notEqual(ev.props.position, 'content', `${p}: CTA ${l.kind} sem posição mapeada (${l.key || ''})`);
      positions.add(ev.props.position);
      for (const k of Object.keys(ev.props)) assert.ok(!/href|url|number|phone$|email$/.test(k), `propriedade ${k}`);
      for (const v of Object.values(ev.props)) assert.match(String(v), /^[A-Za-z0-9_.-]{1,64}$/);
    }
  }
  assert.ok(seen.contact > 30 && seen.diagnostic >= 9 && seen.demo >= 10, JSON.stringify(seen));
  for (const pos of ['hero', 'floating', 'footer', 'final_cta', 'solution_card']) assert.ok(positions.has(pos), `posição ${pos} nunca observada`);
  await ctx.close();
});

test('deduplicação: duplo clique = 1 evento; clique do meio conta; botão direito não', async () => {
  const ctx = await newContext(site, { consent: ACCEPT, extraInit: STUB });
  const page = await ctx.newPage();
  await open(page, 'index.html');
  const sel = '.wa-float';
  await page.evaluate((s) => {
    const el = document.querySelector(s);
    window.__t += 5000;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
    window.__t += 100;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); // duplo clique
    window.__t += 5000;
    el.dispatchEvent(new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 })); // meio
    window.__t += 5000;
    el.dispatchEvent(new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 2 })); // direito
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 2 }));
  }, sel);
  assert.equal((await caps(page)).length, 2);
  await ctx.close();
});

test('sem consentimento de análise: nenhum evento, mas o link funciona normalmente', async () => {
  const ctx = await newContext(site, { consent: { analytics: false, advertising: false }, extraInit: STUB });
  const page = await ctx.newPage();
  await page.goto(urlOf('index.html'), { waitUntil: 'domcontentloaded' });
  const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('.wa-float')]);
  assert.match(popup.url(), /wa\.me\/5548991830112/);
  await popup.close();
  assert.equal((await caps(page)).length, 0);
  await ctx.close();
});

test('posições esperadas em CTAs conhecidos', async () => {
  const ctx = await newContext(site, { consent: ACCEPT, extraInit: STUB });
  const page = await ctx.newPage();
  await open(page, 'index.html');
  await clickEl(page, (await page.$$eval('a[href]', (as) => as.findIndex((a) => a.closest('.hero__actions')))), 'a[href]');
  await clickEl(page, (await page.$$eval('a[href]', (as) => as.findIndex((a) => a.closest('.cta-final') && /wa\.me/.test(a.href)))), 'a[href]');
  const c = await caps(page);
  assert.deepEqual(c.map((e) => [e.name, e.props.position]), [['diagnostic_cta_clicked', 'hero'], ['contact_clicked', 'final_cta']]);
  await open(page, 'solucoes.html');
  const idx = await page.$$eval('a[href]', (as) => as.findIndex((a) => a.closest('.pricing-card')));
  await clickEl(page, idx, 'a[href]');
  assert.equal((await caps(page)).pop().props.position, 'solution_card');
  await ctx.close();
});

// ── case_viewed ──────────────────────────────────────────────────────
test('case_viewed: 1 por carregamento nas páginas de case (slug correto); nenhuma nas demais', async () => {
  const ctx = await newContext(site, { consent: ACCEPT, extraInit: STUB });
  const page = await ctx.newPage();
  for (const [file, slug] of [['case-pesca.html', 'pesca'], ['case-sartec.html', 'sartec'], ['case-almeida.html', 'almeida'], ['case-uniedu.html', 'uniedu']]) {
    await page.goto(urlOf(file), { waitUntil: 'domcontentloaded' });
    const c = (await caps(page)).filter((e) => e.name === 'case_viewed');
    assert.equal(c.length, 1, file);
    assert.equal(c[0].props.case_slug, slug);
    assert.equal(c[0].props.event_layer, 'behavior');
  }
  for (const f of ['index.html', 'cases.html', 'solucoes.html', 'sobre.html']) {
    await page.goto(urlOf(f), { waitUntil: 'domcontentloaded' });
    assert.equal((await caps(page)).filter((e) => e.name === 'case_viewed').length, 0, f);
  }
  await ctx.close();
});

test('case_viewed: aceite tardio na própria página registra a visualização atual uma vez', async () => {
  const ctx = await newContext(site, { extraInit: STUB });
  const page = await ctx.newPage();
  await page.goto(urlOf('case-pesca.html'), { waitUntil: 'domcontentloaded' });
  assert.equal((await caps(page)).length, 0);
  await page.click('#lacConsentBanner [data-act="accept"]');
  await page.waitForTimeout(100);
  assert.equal((await caps(page)).filter((e) => e.name === 'case_viewed').length, 1);
  await ctx.close();
});

// ── diagnóstico: lead_submitted ──────────────────────────────────────
async function flow(submit, { stubs = true } = {}) {
  const ctx = await newContext(site, { consent: ACCEPT, extraInit: STUB });
  const page = await ctx.newPage();
  const core = await mockCore(page, submit);
  await page.goto(urlOf('diagnostico.html'), { waitUntil: 'domcontentloaded' });
  return { ctx, page, core };
}
const leads = async (page) => (await caps(page)).filter((e) => e.name === 'lead_submitted');

test('lead_submitted: 1 evento após sucesso do Core; WhatsApp do resultado = contact_clicked no PostHog e whatsapp_clicked só no Core', async () => {
  const { ctx, page, core } = await flow({});
  await runDiagnostic(page);
  assert.equal((await leads(page)).length, 1);
  const l = (await leads(page))[0].props;
  assert.deepEqual(Object.keys(l).sort(), ['event_layer', 'language', 'outcome_mode', 'recommendation_path']);
  assert.equal(l.event_layer, 'conversion');
  const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('#diagResultWaBtn')]);
  await popup.close();
  await page.waitForTimeout(300);
  const all = await caps(page);
  assert.equal(all.filter((e) => e.name === 'contact_clicked').length, 1);
  assert.equal(all.filter((e) => e.name === 'whatsapp_clicked').length, 0);
  assert.equal(core.filter((c) => c.kind === 'events' && c.body.eventType === 'whatsapp_clicked').length, 1, 'Core mantém o legado');
  assert.equal(all.filter((e) => e.name === 'lead_submitted').length, 1, 'clicar em WhatsApp não gera lead');
  await ctx.close();
});

test('lead_submitted: falhas do Core (500, 409, validação, 200 malformado) NÃO contam como lead', async () => {
  for (const submit of [
    { submitStatus: 500, submitBody: '{"error":{"code":"server_error"}}' },
    { submitStatus: 409, submitBody: '{"error":{"code":"submission_conflict"}}' },
    { submitStatus: 400, submitBody: '{"error":{"code":"validation_error"}}' },
    { submitStatus: 200, submitBody: '{"contractVersion":"1"}' },
  ]) {
    const { ctx, page } = await flow(submit);
    await page.waitForSelector('#diagStartBtn', { state: 'visible' });
    await page.click('#diagStartBtn');
    await page.waitForSelector('#diagQuestion:not([hidden])');
    for (let i = 0; i < 11; i++) {
      await page.locator('#diagOptions .diag-option').first().click();
      await page.waitForFunction(() => !document.getElementById('diagNextBtn').disabled);
      await page.click('#diagNextBtn');
    }
    await page.fill('#diagName', 'A B'); await page.fill('#diagEmail', 'a@b.co'); await page.fill('#diagWhatsapp', '(11) 98877-6655');
    await page.click('#diagSubmitBtn');
    await page.waitForTimeout(1200);
    assert.equal((await leads(page)).length, 0, `status ${submit.submitStatus}`);
    await ctx.close();
  }
});

test('lead_submitted: erro de rede e reenvio bem-sucedido contam UMA vez; repetição do mesmo submissionId não recontam', async () => {
  const ctx = await newContext(site, { consent: ACCEPT, extraInit: STUB });
  const page = await ctx.newPage();
  let attempts = 0;
  await mockCore(page);
  await page.route('**/api/funnel/v1/submit', (r) => { attempts++; return attempts === 1 ? r.abort('failed') : r.fulfill({ status: 200, contentType: 'application/json', body: '{"contractVersion":"1","recommendationPath":"optimization","outcomeMode":"standard"}' }); });
  await page.goto(urlOf('diagnostico.html'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
  await page.click('#diagStartBtn');
  await page.waitForSelector('#diagQuestion:not([hidden])');
  for (let i = 0; i < 11; i++) {
    await page.locator('#diagOptions .diag-option').first().click();
    await page.waitForFunction(() => !document.getElementById('diagNextBtn').disabled);
    await page.click('#diagNextBtn');
  }
  await page.fill('#diagName', 'A B'); await page.fill('#diagEmail', 'a@b.co'); await page.fill('#diagWhatsapp', '(11) 98877-6655');
  await page.click('#diagSubmitBtn');
  await page.waitForSelector('#diagSubmitErrorAction:not([hidden])');
  assert.equal((await leads(page)).length, 0, 'falha de rede não é lead');
  await page.click('#diagSubmitErrorAction'); // tenta de novo (mesmo submissionId)
  await page.waitForSelector('#diagResult:not([hidden])');
  assert.equal((await leads(page)).length, 1);

  // Mesma submissão confirmada de novo (replay idempotente do Core): não recontar.
  const again = await page.evaluate(() => window.LAC_TRACK.leadSubmitted({ language: 'pt', recommendation_path: 'optimization', outcome_mode: 'standard' }, JSON.parse(sessionStorage.getItem('lac_lead_sent'))[0]));
  assert.equal(again, false);
  assert.equal((await leads(page)).length, 1);
  // Reload: o resultado não é restaurado e nada é recontado.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#diagStartBtn', { state: 'visible' });
  assert.equal((await leads(page)).length, 0, 'novo documento não emite lead sem novo envio');
  await ctx.close();
});

test('sem consentimento: o diagnóstico conclui, o Core persiste e nenhum lead_submitted sai para PostHog/Google', async () => {
  const ctx = await newContext(site, { consent: { analytics: false, advertising: false }, extraInit: STUB });
  const page = await ctx.newPage();
  const core = await mockCore(page);
  await page.goto(urlOf('diagnostico.html'), { waitUntil: 'domcontentloaded' });
  await runDiagnostic(page);
  assert.equal(core.filter((c) => c.kind === 'submit').length, 1);
  assert.equal((await caps(page)).length, 0);
  await ctx.close();
});

test('mobile: contato e diagnóstico instrumentados em viewport pequena', async () => {
  const ctx = await newContext(site, { consent: ACCEPT, extraInit: STUB, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await open(page, 'index.html');
  await clickEl(page, (await page.$$eval('a[href]', (as) => as.findIndex((a) => a.classList.contains('wa-float')))), 'a[href]');
  assert.equal((await caps(page)).pop().props.position, 'floating');
  await ctx.close();
});

test('en: language=en nos eventos', async () => {
  const ctx = await newContext(site, { consent: ACCEPT, extraInit: STUB, lang: 'en' });
  const page = await ctx.newPage();
  await open(page, 'index.html');
  await clickEl(page, (await page.$$eval('a[href]', (as) => as.findIndex((a) => a.classList.contains('wa-float')))), 'a[href]');
  assert.equal((await caps(page)).pop().props.language, 'en');
  await ctx.close();
});
