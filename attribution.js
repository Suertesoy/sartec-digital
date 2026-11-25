/* Atribuição de marketing — first-touch no navegador, sob consentimento.
 *
 * Objetivo: quando o visitante abrir /diagnostico, o POST /session do Funnel
 * Core receber a ORIGEM da visita (path de entrada, UTMs, identificadores de
 * clique e referrer), mesmo que ele tenha navegado por outras páginas antes.
 * O Core já extrai e persiste isso da landingUrl/referrer; nada muda lá, e
 * nenhuma sessão do Core é criada fora do diagnóstico.
 *
 * Regras:
 *  - só parâmetros da allowlist (nunca a query string inteira);
 *  - path original sem query/hash; referrer externo sanitizado (origin + path);
 *  - first-touch: o primeiro registro da aba/sessão nunca é sobrescrito;
 *  - storage: sessionStorage (some ao fechar a aba) e SÓ conforme consentimento:
 *      UTMs + path + referrer .... análise OU publicidade
 *      gclid/gbraid/wbraid/fbclid  publicidade
 *    sem consentimento, nada é gravado e o diagnóstico envia só o path;
 *  - aceite tardio: se o documento de entrada ainda está aberto, o registro é
 *    criado/completado no aceite; revogar remove o que deixou de ser permitido;
 *  - identificadores de anúncio NUNCA vão ao PostHog (este módulo não o chama).
 *
 * Limite conhecido: o Core mantém o primeiro toque por cookie de sessão. Se o
 * visitante aceitar o consentimento já DENTRO do /diagnostico, depois do
 * /session, a atribuição não pode mais ser enviada (o Core já fixou o toque).
 */
(function () {
  'use strict';

  var KEY = 'lac_attribution_v1';
  var CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var AD_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid'];
  var MAX_VALUE = 256;
  var MAX_PATH = 512;

  function rand() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (_) { /* no-op */ }
    return String(Date.now()) + Math.random().toString(36).slice(2);
  }

  // ── entrada deste documento (apenas em memória) ────────────────────
  function readParams(keys) {
    var out = {};
    var params;
    try { params = new URLSearchParams(location.search); } catch (_) { return out; }
    keys.forEach(function (k) {
      var v = params.get(k);
      if (v === null) return;
      v = v.trim();
      if (v && v.length <= MAX_VALUE) out[k] = v;
    });
    return out;
  }

  function externalReferrer() {
    if (!document.referrer) return null;
    try {
      var u = new URL(document.referrer);
      if (u.origin === location.origin) return null; // navegação interna não é origem
      return (u.origin + u.pathname).slice(0, MAX_PATH);
    } catch (_) { return null; }
  }

  function isEntryDocument() {
    if (!document.referrer) return true;
    try { return new URL(document.referrer).origin !== location.origin; } catch (_) { return true; }
  }

  var memory = isEntryDocument() ? {
    id: rand(),
    path: (location.pathname || '/').slice(0, MAX_PATH),
    referrer: externalReferrer(),
    campaign: readParams(CAMPAIGN_KEYS),
    ads: readParams(AD_KEYS),
  } : null;

  // ── consentimento ──────────────────────────────────────────────────
  function allowed() {
    var c = window.LAC_CONSENT ? window.LAC_CONSENT.get() : { analytics: false, advertising: false };
    return { campaign: !!(c.analytics || c.advertising), ads: !!c.advertising };
  }

  // ── storage ────────────────────────────────────────────────────────
  function readStored() {
    try {
      var o = JSON.parse(sessionStorage.getItem(KEY));
      return o && typeof o === 'object' && typeof o.path === 'string' ? o : null;
    } catch (_) { return null; }
  }
  function writeStored(rec) {
    try {
      if (rec) sessionStorage.setItem(KEY, JSON.stringify(rec));
      else sessionStorage.removeItem(KEY);
    } catch (_) { /* storage indisponível: segue só em memória */ }
  }

  // Reconcilia o storage com o consentimento atual (chamado no load e a cada mudança).
  function sync() {
    var a = allowed();
    var rec = readStored();

    if (rec) {
      if (!a.campaign) { writeStored(null); return; }          // revogou tudo
      if (!a.ads && rec.ads && Object.keys(rec.ads).length) {   // revogou só publicidade
        rec.ads = {};
        writeStored(rec);
      }
      // Aceite tardio de publicidade no documento de entrada: completa os IDs.
      if (a.ads && memory && rec.id === memory.id && (!rec.ads || !Object.keys(rec.ads).length) && Object.keys(memory.ads).length) {
        rec.ads = memory.ads;
        writeStored(rec);
      }
      return;
    }

    // Sem registro: só o documento de entrada pode criá-lo (first-touch real).
    if (!memory || !a.campaign) return;
    writeStored({
      id: memory.id,
      path: memory.path,
      referrer: memory.referrer,
      campaign: memory.campaign,
      ads: a.ads ? memory.ads : {},
      ts: Date.now(),
    });
  }

  // ── payload para POST /session ─────────────────────────────────────
  function buildQuery(campaign, ads) {
    var pairs = [];
    CAMPAIGN_KEYS.forEach(function (k) { if (campaign && campaign[k]) pairs.push(k + '=' + encodeURIComponent(campaign[k])); });
    AD_KEYS.forEach(function (k) { if (ads && ads[k]) pairs.push(k + '=' + encodeURIComponent(ads[k])); });
    return pairs.length ? '?' + pairs.join('&') : '';
  }

  function getSessionPayload() {
    var a = allowed();
    var rec = readStored() || memory; // registro da sessão do navegador, ou a entrada deste documento
    if (!rec || !a.campaign) {
      // Sem consentimento (ou sem origem conhecida): apenas o path atual.
      return { landingUrl: (location.pathname || '/').slice(0, MAX_PATH), referrer: null };
    }
    return {
      landingUrl: rec.path + buildQuery(rec.campaign, a.ads ? rec.ads : null),
      referrer: rec.referrer || null,
    };
  }

  window.LAC_ATTRIBUTION = { getSessionPayload: getSessionPayload };

  if (window.LAC_CONSENT) window.LAC_CONSENT.subscribe(sync);
  sync();
})();
