// Validação integrada contra um deployment Preview REAL (fora do `npm test`).
//   PREVIEW_URL=https://<preview>.vercel.app PREVIEW_SHARE=<token de acesso> PH_SDK_PATH=<posthog array.js local> \
//     node tests/preview-validation.mjs
//
// - O Funnel Core é o REAL (o rewrite do site aponta para ele): usa DADOS SINTÉTICOS claramente
//   identificados (nome "TESTE SINTETICO...", e-mail @example.invalid, utm_source=lac-preview-validation).
//   Só 2 envios de diagnóstico (desktop/PT e mobile/EN).
// - PostHog e Google são SEMPRE simulados por interceptação de rede: nada chega às contas reais
//   (a medição já é bloqueada em Preview por site-env.js; aqui a lógica é liberada só no navegador de teste).
import fs from 'node:fs';
import zlib from 'node:zlib';
import { chromium } from 'playwright-core';

const BASE = (process.env.PREVIEW_URL || '').replace(/\/$/, '');
const SHARE = process.env.PREVIEW_SHARE || '';
const SDK = process.env.PH_SDK_PATH ? fs.readFileSync(process.env.PH_SDK_PATH, 'utf8') : null;
if (!BASE || !SHARE || !SDK) { console.error('faltam PREVIEW_URL, PREVIEW_SHARE ou PH_SDK_PATH'); process.exit(2); }

const STAMP = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
const SYN = {
  name: `TESTE SINTETICO PREVIEW ${STAMP}`,
  email: `teste.sintetico.${STAMP}@example.invalid`,
  phone: '(11) 91234-5678',
  company: 'TESTE SINTETICO - NAO CONTATAR',
};
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const OFFICIAL = { e164: '5548991830112', display: '(48) 99183-0112', email: 'contato.lacabral@gmail.com' };
// Contatos antigos (montados por partes para este arquivo não carregar o e-mail por extenso).
const OLD = [
  new RegExp(['5512', '997863832'].join('')),
  new RegExp(['99786', '[-. ]?', '3832'].join('')),
  new RegExp(['lac\\.lucas', 'cabral@gmail\\.com'].join(''), 'i'),
];
const PAGES = ['index.html', 'solucoes.html', 'cases.html', 'sobre.html', 'como-trabalhamos.html', 'case-pesca.html', 'case-sartec.html', 'case-almeida.html', 'case-uniedu.html', 'privacidade.html', 'diagnostico'];

const results = [];
const check = (scenario, name, ok, detail = '') => { results.push({ scenario, name, ok: !!ok, detail: String(detail).slice(0, 220) }); };

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome', headless: true });

// Cookie de acesso do Preview (protegido por login da Vercel).
const warm = await browser.newContext({ userAgent: UA });
const wp = await warm.newPage();
const warmRes = await wp.goto(`${BASE}/?_vercel_share=${SHARE}`, { waitUntil: 'domcontentloaded' });
check('acesso', 'Preview acessível com o link de compartilhamento', warmRes && warmRes.status() === 200, `status ${warmRes && warmRes.status()}`);
const storage = await warm.storageState();
await warm.close();

const CONSENT_KEY = 'lac_consent_v1';
async function newCtx({ consent, lang = 'pt', viewport = { width: 1280, height: 800 }, block = false, js = true }) {
  const ctx = await browser.newContext({ storageState: storage, userAgent: UA, viewport, javaScriptEnabled: js });
  if (js) {
    await ctx.addInitScript(([c, l, key]) => {
      try {
        if (l) localStorage.setItem('sartec_lang', l);
        if (c && !localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ v: 1, analytics: !!c.analytics, advertising: !!c.advertising, ts: Date.now() }));
      } catch (_) { /* no-op */ }
      Object.defineProperty(navigator, 'webdriver', { get: () => false }); // o SDK real descarta navegadores automatizados
      window.__LAC_ALLOW_AUTOMATION__ = true; // libera só a LÓGICA; a rede de medição é interceptada abaixo
    }, [consent, lang, CONSENT_KEY]);
  }
  const net = { ph: [], google: [], phRequests: [], googleRequests: [], core: [] };
  await ctx.route(/posthog\.com/, async (route) => {
    const req = route.request();
    net.phRequests.push(req.url());
    if (block) return route.abort('blockedbyclient');
    if (/array\.js/.test(req.url())) return route.fulfill({ status: 200, contentType: 'text/javascript', body: SDK });
    if (req.method() === 'POST') {
      const buf = req.postDataBuffer();
      let t = '';
      try { t = buf ? (buf[0] === 0x1f && buf[1] === 0x8b ? zlib.gunzipSync(buf).toString() : buf.toString()) : ''; } catch (_) { t = ''; }
      net.ph.push(decodeURIComponent(t));
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await ctx.route(/googletagmanager\.com|google-analytics\.com|doubleclick\.net|googleadservices\.com/, (route) => {
    net.googleRequests.push(route.request().url());
    return block ? route.abort('blockedbyclient') : route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
  });
  await ctx.route('https://wa.me/**', (r) => r.fulfill({ status: 200, body: 'ok' }));
  const page = await ctx.newPage();
  page.on('request', (r) => { if (/\/api\/funnel\/v1\//.test(r.url()) && r.method() === 'POST') net.core.push({ key: `${r.url()}|${r.postData()}`, path: new URL(r.url()).pathname.split('/').pop(), body: r.postData() }); });
  page.on('response', async (r) => {
    if (!/\/api\/funnel\/v1\//.test(r.url()) || r.request().method() !== 'POST') return;
    const rec = net.core.find((c) => c.key === `${r.url()}|${r.request().postData()}`); // URL + corpo (eventId é único)
    if (!rec) return;
    rec.status = r.status();
    rec.setCookie = (await r.allHeaders())['set-cookie'] || null;
    if (rec.path === 'submit') { try { rec.resp = await r.json(); } catch (_) { /* no-op */ } }
  });
  page.on('requestfailed', (r) => { const rec = net.core.find((c) => c.key === `${r.url()}|${r.postData()}`); if (rec) rec.failed = r.failure()?.errorText || true; });
  page.on('pageerror', (e) => { (net.errors = net.errors || []).push(String(e)); });
  return { ctx, page, net };
}
const dataLayer = (page) => page.evaluate(() => (window.dataLayer || []).map((a) => Array.from(a))).catch(() => []);
const phEvents = (net) => net.ph.join('\n').match(/"event"\s*:\s*"[^"]+"/g)?.map((m) => m.split('"')[3]) || [];
const clickLink = (page, sel) => page.evaluate((s) => { const el = document.querySelector(s); el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); }, sel);
async function internalNav(page, href) {
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.evaluate((h) => { const a = document.createElement('a'); a.href = h; document.body.appendChild(a); a.click(); }, href)]);
}
// NO_SUBMIT=1 percorre o diagnóstico até a tela de identidade e NÃO envia (não cria lead no Core real).
const SUBMIT = process.env.NO_SUBMIT !== '1';
async function runDiagnostic(page) {
  await page.waitForSelector('#diagStartBtn', { state: 'visible', timeout: 30000 });
  await page.click('#diagStartBtn');
  await page.waitForSelector('#diagQuestion:not([hidden])');
  for (let i = 0; i < 11; i++) {
    await page.locator('#diagOptions .diag-option').first().click();
    await page.waitForFunction(() => !document.getElementById('diagNextBtn').disabled);
    await page.click('#diagNextBtn');
  }
  await page.waitForSelector('#diagIdentity:not([hidden])');
  if (!SUBMIT) return;
  await page.fill('#diagName', SYN.name); await page.fill('#diagEmail', SYN.email);
  await page.fill('#diagWhatsapp', SYN.phone); await page.fill('#diagCompany', SYN.company);
  await page.click('#diagSubmitBtn');
}
const MARKERS = [SYN.name, SYN.email, 'example.invalid', '91234', 'NAO CONTATAR', 'TESTE SINTETICO'];

// ── A. Contatos oficiais em todas as páginas (JS ligado PT/EN e JS desligado) ──
for (const [label, opts] of [['JS ligado PT', { lang: 'pt' }], ['JS ligado EN', { lang: 'en' }], ['JS desligado', { js: false }]]) {
  const { ctx, page } = await newCtx({ consent: { analytics: false, advertising: false }, ...opts });
  let bad = [], total = 0;
  for (const p of PAGES) {
    await page.goto(`${BASE}/${p}`, { waitUntil: 'domcontentloaded' });
    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')).filter((h) => /wa\.me|^tel:|^mailto:/.test(h)));
    total += links.length;
    for (const h of links) {
      const okLink = h.startsWith('mailto:') ? h === `mailto:${OFFICIAL.email}` : h.startsWith('tel:') ? h === `tel:+${OFFICIAL.e164}` : h.startsWith(`https://wa.me/${OFFICIAL.e164}`);
      if (!okLink || OLD.some((re) => re.test(h))) bad.push(`${p}: ${h}`);
    }
    const html = await page.content();
    if (OLD.some((re) => re.test(html))) bad.push(`${p}: referência antiga no HTML`);
  }
  check('A contatos', `${label}: ${total} links oficiais em ${PAGES.length} páginas, nenhum antigo`, total > 40 && bad.length === 0, bad.slice(0, 3).join(' | '));
  await ctx.close();
}

// ── B. Consentimento e revogação (sem tocar PostHog/Google reais) ──
{
  const { ctx, page, net } = await newCtx({ consent: null });
  await page.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  await page.waitForSelector('#lacConsentBanner:not([hidden])');
  check('B consentimento', 'padrão: banner visível e zero requisições a PostHog/Google', net.phRequests.length === 0 && net.googleRequests.length === 0);
  const labels = await page.$$eval('#lacConsentBanner [data-act]', (b) => b.map((x) => x.textContent.trim()));
  check('B consentimento', 'três ações com mesmo peso (Recusar/Aceitar/Personalizar)', labels.length === 3, labels.join('/'));
  await page.click('#lacConsentBanner [data-act="reject"]');
  await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(500);
  check('B consentimento', 'recusa persiste: sem banner e sem requisições de medição', net.phRequests.length === 0 && net.googleRequests.length === 0 && !(await page.$('#lacConsentBanner:not([hidden])')));
  await page.click('.consent-footer-link'); await page.check('#lacConsentAnalytics'); await page.check('#lacConsentAdvertising');
  await page.click('#lacConsentModal [data-act="save"]'); await page.waitForTimeout(1500);
  check('B consentimento', 'aceite tardio pelo rodapé carrega PostHog e a tag do Google (rede simulada)', net.phRequests.some((u) => /array\.js/.test(u)) && net.googleRequests.some((u) => /gtag\/js\?id=AW-18584503044/.test(u)), `ph=${net.phRequests.length} g=${net.googleRequests.length}`);
  await page.click('.consent-footer-link'); await page.click('#lacConsentModal [data-act="rejectAll"]');
  const after = await page.evaluate(() => ({ ph: Object.keys(localStorage).filter((k) => /^ph_/.test(k)), analytics: window.LAC_ANALYTICS.isActive(), dl: (window.dataLayer || []).filter((a) => a[0] === 'consent' && a[1] === 'update').pop()?.[2] }));
  check('B consentimento', 'revogação: PostHog parado, ph_* apagado, Google consent=denied', after.ph.length === 0 && after.analytics === false && after.dl && after.dl.ad_storage === 'denied', JSON.stringify(after).slice(0, 160));
  check('B consentimento', 'política de privacidade linkada no rodapé', (await page.locator('.footer__privacy').count()) === 1);
  await ctx.close();
}

// ── C. Fluxo completo desktop/PT com Core real ──
const ENTRY_C = `/?utm_source=lac-preview-validation&utm_medium=synthetic&utm_campaign=preview_validation_${STAMP}&gclid=TESTE_PREVIEW_GCLID_${STAMP}`;
{
  const { ctx, page, net } = await newCtx({ consent: { analytics: true, advertising: true }, lang: 'pt' });
  await page.goto(`${BASE}${ENTRY_C}`, { waitUntil: 'load', referer: 'https://www.google.com/search?q=termo-privado' });
  await page.waitForTimeout(1200);
  const g1 = await dataLayer(page);
  check('C fluxo desktop PT', 'Google Tag carregada com Consent Mode (default denied → update granted) e config sem enhanced conversions', g1.findIndex((e) => e[1] === 'default') > -1 && g1.findIndex((e) => e[1] === 'default') < g1.findIndex((e) => e[1] === 'update') && g1.find((e) => e[0] === 'config')?.[2]?.allow_enhanced_conversions === false);
  check('C fluxo desktop PT', 'nenhuma conversão por simples carregamento de página', g1.filter((e) => e[1] === 'conversion').length === 0);
  await internalNav(page, '/solucoes.html');
  await page.evaluate(() => { window.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('a[href^="https://wa.me"]')) e.preventDefault(); }); });
  await clickLink(page, '.wa-float');
  await page.waitForTimeout(4000); // deixa o PostHog descarregar o lote antes de trocar de página
  const g2 = await dataLayer(page);
  const contactConv = g2.filter((e) => e[1] === 'conversion' && e[2].send_to === 'AW-18584503044/jZ3ACOLxxbsdEISG5J1F');
  check('C fluxo desktop PT', 'clique em WhatsApp = 1 conversão Contato (send_to oficial, sem valor)', contactConv.length === 1 && !('value' in contactConv[0][2]) && !('currency' in contactConv[0][2]));
  await internalNav(page, '/diagnostico');
  await page.waitForSelector('#diagStartBtn', { state: 'visible', timeout: 30000 });
  for (let i = 0; i < 40 && !net.core.find((c) => c.path === 'session' && c.status); i++) await page.waitForTimeout(250); // o diagnóstico não espera o /session
  const sess = net.core.find((c) => c.path === 'session');
  const sb = sess ? JSON.parse(sess.body) : {};
  const q = Object.fromEntries(new URL(sb.landingUrl || '/', 'http://x').searchParams);
  check('C atribuição → Core', '/session real respondeu 200', sess && sess.status === 200, `status ${sess && sess.status}`);
  check('C atribuição → Core', 'landingUrl = path de ENTRADA + UTMs + gclid (first-touch, após navegar por outra página)', new URL(sb.landingUrl || '/', 'http://x').pathname === '/' && q.utm_source === 'lac-preview-validation' && q.gclid === `TESTE_PREVIEW_GCLID_${STAMP}`, sb.landingUrl);
  check('C atribuição → Core', 'referrer enviado sanitizado (sem query)', sb.referrer === 'https://www.google.com/search', sb.referrer);
  const cookies = await ctx.cookies();
  const sc = cookies.find((c) => c.name === 'lac_funnel_session');
  check('C atribuição → Core', 'cookie de sessão do Core criado (httpOnly, lax)', sc && sc.httpOnly && /lax/i.test(sc.sameSite), sc ? `httpOnly=${sc.httpOnly} sameSite=${sc.sameSite}` : `ausente; cookies=${cookies.map((c) => c.name).join(',')}; set-cookie no /session=${!!(sess && sess.setCookie)}`);
  await runDiagnostic(page);
  let g4 = await dataLayer(page);
  if (SUBMIT) {
    await page.waitForSelector('#diagResult:not([hidden])', { timeout: 60000 });
    await page.waitForTimeout(800);
    const sub = net.core.find((c) => c.path === 'submit');
    check('C Core real', '/submit real respondeu 200 com recomendação (persistência confirmada)', sub && sub.status === 200 && typeof sub.resp?.recommendationPath === 'string', `status ${sub && sub.status} keys=${Object.keys(sub?.resp || {}).join(',')}`);
    const g3 = await dataLayer(page);
    check('C conversões', 'Lead = exatamente 1 conversão, só depois do /submit 200', g3.filter((e) => e[1] === 'conversion' && e[2].send_to === 'AW-18584503044/XR_qCOqbp78dEISG5J1F').length === 1);
    const [pop] = await Promise.all([ctx.waitForEvent('page'), page.click('#diagResultWaBtn')]);
    await pop.close(); await page.waitForTimeout(400);
    g4 = await dataLayer(page);
    // O dataLayer vale por documento: aqui (página do diagnóstico) há 1 Lead + 1 Contato (o Contato da página anterior ficou no documento anterior).
    check('C conversões', 'WhatsApp do resultado: +1 Contato; Lead continua 1 (clique ≠ lead)', g4.filter((e) => e[1] === 'conversion' && /jZ3ACOLxxbsdEISG5J1F/.test(e[2].send_to)).length === 1 && g4.filter((e) => e[1] === 'conversion' && /XR_qCOqbp78dEISG5J1F/.test(e[2].send_to)).length === 1);
    check('C Core real', 'legado whatsapp_clicked enviado ao Core 1x', net.core.filter((c) => c.path === 'events' && /whatsapp_clicked/.test(c.body || '')).length === 1);
  }
  const ev = net.core.filter((c) => c.path === 'events');
  check('C Core real', 'eventos do diagnóstico enviados ao Core (≥ 14), nenhum falhou nem respondeu erro (o Playwright não reporta respostas de fetch keepalive; ver sonda do /events 200)', ev.length >= 14 && ev.every((e) => !e.failed && !(e.status >= 300)) , `n=${ev.length} com-resposta=${ev.filter((e) => e.status).length} falhas=${ev.filter((e) => e.failed).length} nao2xx=${ev.filter((e) => e.status >= 300).length}`);
  // PostHog (SDK real, rede simulada) — espera o flush em lote antes de contar
  await page.waitForTimeout(4000);
  const names = phEvents(net);
  const cnt = (n) => names.filter((x) => x === n).length;
  check('C PostHog', `pageviews, contact_clicked (${SUBMIT ? 2 : 1}), lead_submitted (${SUBMIT ? 1 : 0}), etapas do diagnóstico`, cnt('$pageview') >= 3 && cnt('contact_clicked') === (SUBMIT ? 2 : 1) && cnt('lead_submitted') === (SUBMIT ? 1 : 0) && cnt('question_viewed') === 11 && cnt('identity_viewed') === 1 && cnt('result_viewed') === (SUBMIT ? 1 : 0), JSON.stringify(names.reduce((a, n) => ((a[n] = (a[n] || 0) + 1), a), {})).slice(0, 200));
  check('C PostHog', 'whatsapp_clicked legado NÃO vai ao PostHog (sem contagem dupla)', cnt('whatsapp_clicked') === 0);
  const phBlob = net.ph.join('\n');
  const ggBlob = JSON.stringify(g4);
  check('C privacidade', 'PostHog sem dados pessoais sintéticos', MARKERS.every((m) => !phBlob.includes(m)), MARKERS.filter((m) => phBlob.includes(m)).join(','));
  check('C privacidade', 'PostHog sem identificadores de anúncio (gclid) e sem número/wa.me', !/TESTE_PREVIEW_GCLID/.test(phBlob) && !/gclid=/.test(phBlob) && !/5548991830112|wa\.me/.test(phBlob));
  check('C privacidade', 'PostHog sem IDs do Core (submissionId/eventId)', !net.core.filter((c) => c.path === 'events').some((c) => { const b = JSON.parse(c.body); return phBlob.includes(b.submissionId) || phBlob.includes(b.eventId); }));
  check('C privacidade', 'Google (dataLayer) sem dados pessoais nem valor/moeda', MARKERS.every((m) => !ggBlob.includes(m)) && !/"value"|"currency"|"user_data"|"email"|"phone_number"/.test(ggBlob));
  if (SUBMIT) {
    await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(800);
    check('C duplicidade', 'reload não recontabiliza o lead', (await dataLayer(page)).filter((e) => e[1] === 'conversion' && /XR_qCOqbp78dEISG5J1F/.test(e[2].send_to)).length === 0);
  }
  check('C geral', 'sem erros de script na página', !(net.errors || []).length, (net.errors || []).join('|'));
  await ctx.close();
}

// ── D. Mobile/EN com consentimento só de análise (publicidade recusada) ──
if (SUBMIT) {
  const { ctx, page, net } = await newCtx({ consent: { analytics: true, advertising: false }, lang: 'en', viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/?utm_source=lac-preview-validation&utm_medium=synthetic&utm_campaign=preview_validation_mobile_${STAMP}&gclid=TESTE_PREVIEW_GCLID_MOBILE_${STAMP}`, { waitUntil: 'load', referer: 'https://www.google.com/' });
  await page.waitForTimeout(800);
  check('D mobile EN', 'sem consentimento de publicidade: nenhuma requisição ao Google', net.googleRequests.length === 0 && (await dataLayer(page)).length === 0);
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  check('D mobile EN', 'sem overflow horizontal na Home (mobile)', noOverflow);
  await internalNav(page, '/diagnostico');
  await page.waitForSelector('#diagStartBtn', { state: 'visible', timeout: 30000 });
  const sess = net.core.find((c) => c.path === 'session');
  const sb = JSON.parse(sess.body);
  const q = Object.fromEntries(new URL(sb.landingUrl, 'http://x').searchParams);
  check('D atribuição → Core', 'só análise: UTMs vão, gclid NÃO vai', q.utm_source === 'lac-preview-validation' && !('gclid' in q), sb.landingUrl);
  await runDiagnostic(page);
  await page.waitForSelector('#diagResult:not([hidden])', { timeout: 60000 });
  await page.waitForTimeout(3500);
  const sub = net.core.find((c) => c.path === 'submit');
  check('D Core real', '/submit real 200 (mobile/EN)', sub && sub.status === 200, `status ${sub && sub.status}`);
  const names = phEvents(net);
  check('D PostHog', 'lead_submitted 1x; nenhuma conversão do Google sem consentimento', names.filter((n) => n === 'lead_submitted').length === 1 && net.googleRequests.length === 0);
  const blob = net.ph.join('\n');
  check('D privacidade', 'PostHog sem PII nem gclid', MARKERS.every((m) => !blob.includes(m)) && !/TESTE_PREVIEW_GCLID/.test(blob));
  await ctx.close();
}

// ── E. Recusa: nada de terceiros, atribuição só com o path ──
{
  const { ctx, page, net } = await newCtx({ consent: { analytics: false, advertising: false }, lang: 'pt' });
  await page.goto(`${BASE}/?utm_source=lac-preview-validation&gclid=TESTE_PREVIEW_GCLID_RECUSA`, { waitUntil: 'load', referer: 'https://www.google.com/' });
  await internalNav(page, '/diagnostico');
  await page.waitForSelector('#diagStartBtn', { state: 'visible', timeout: 30000 });
  const sb = JSON.parse(net.core.find((c) => c.path === 'session').body);
  check('E recusa', '/session leva só o path (sem UTMs, gclid nem referrer)', sb.landingUrl === '/diagnostico' && sb.referrer === null, JSON.stringify(sb).slice(0, 140));
  check('E recusa', 'zero requisições a PostHog/Google', net.phRequests.length === 0 && net.googleRequests.length === 0);
  await ctx.close();
}

// ── F. Analytics bloqueado: diagnóstico e contatos funcionam ──
{
  const { ctx, page, net } = await newCtx({ consent: { analytics: true, advertising: true }, block: true });
  await page.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  const [pop] = await Promise.all([ctx.waitForEvent('page'), page.click('.wa-float')]);
  check('F bloqueio', 'WhatsApp abre com PostHog/Google bloqueados', /^https:\/\/wa\.me\/5548991830112/.test(pop.url()), pop.url().slice(0, 60));
  await pop.close();
  await page.goto(`${BASE}/diagnostico`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#diagStartBtn', { state: 'visible', timeout: 30000 });
  await page.click('#diagStartBtn'); await page.waitForSelector('#diagQuestion:not([hidden])');
  check('F bloqueio', 'diagnóstico carrega e navega com analytics bloqueado; sem erros de script', !(net.errors || []).length, (net.errors || []).join('|'));
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'} | ${r.scenario} | ${r.name}${r.ok ? '' : ` | ${r.detail}`}`);
console.log(`\nTOTAL ${results.length} · PASS ${results.length - failed.length} · FAIL ${failed.length}`);
console.log(`Identificadores sintéticos desta execução: carimbo=${STAMP}; utm_source=lac-preview-validation; e-mails teste.sintetico.${STAMP}@example.invalid`);
fs.writeFileSync(process.env.PREVIEW_REPORT || 'preview-validation-report.json', JSON.stringify({ stamp: STAMP, results }, null, 2));
process.exit(failed.length ? 1 : 0);
