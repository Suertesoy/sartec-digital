/* Google Tag (gtag.js) direto para Google Ads (sem GTM e sem GA4).
 *
 * Configurado com os identificadores oficiais da conta. Se CONFIG.tagId for
 * null o módulo volta a ser inerte: não carrega script do Google, não cria
 * dataLayer e não faz nenhuma requisição.
 *
 * Funcionamento:
 *  - só carrega após consentimento de "publicidade" (Consent Mode v2, modo
 *    BÁSICO: nada do Google é carregado antes do aceite). Ao carregar,
 *    declara o consent default = denied e em seguida o update = granted
 *    (ad_storage, ad_user_data, ad_personalization). analytics_storage
 *    permanece negado: não há GA4;
 *  - revogar volta tudo para denied, remove cookies _gcl_* e desativa conversões;
 *  - só roda no domínio de produção (site-env.js): nunca em Preview, localhost,
 *    file: nem em navegador automatizado — testes não viram conversões comerciais;
 *  - a falha ou o bloqueio da tag nunca impede a abertura dos canais de contato
 *    (nenhum preventDefault; tudo em try/catch);
 *  - enhanced conversions DESLIGADAS (allow_enhanced_conversions:false) e nenhum
 *    dado pessoal, ID do Core, valor ou moeda é enviado;
 *  - sem GA4 e sem GTM.
 *
 * Conversões (a tracking.js as aciona, uma vez por interação; sem valor monetário;
 * a contagem "Uma" é configurada na conta do Google Ads):
 *   contact          SECUNDÁRIA — evento interno contact_clicked: clique válido em
 *                    WhatsApp/telefone/e-mail (intenção, não lead)
 *   diagnostic_lead  PRINCIPAL  — evento interno lead_submitted: só após o Funnel Core
 *                    confirmar a persistência do diagnóstico
 * Se um rótulo ficar null, aquela conversão não é enviada (nada é inventado).
 * Codificação automática (auto-tagging) ativada na conta: o gclid vem na URL do anúncio.
 */
(function () {
  'use strict';

  // Identificadores oficiais (Google Ads) — preservar maiúsculas/minúsculas.
  var CONFIG = {
    tagId: 'AW-18584503044',
    conversions: {
      contact: { label: 'jZ3ACOLxxbsdEISG5J1F' },         // send_to: AW-18584503044/jZ3ACOLxxbsdEISG5J1F
      diagnostic_lead: { label: 'XR_qCOqbp78dEISG5J1F' }, // send_to: AW-18584503044/XR_qCOqbp78dEISG5J1F
    },
  };

  var TAG_RE = /^AW-\d{6,14}$/;
  var LABEL_RE = /^[A-Za-z0-9_-]{6,64}$/;
  var DENIED = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
  var GRANTED_ADS = { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' };

  var loaded = false;  // gtag.js carregado nesta página
  var enabled = false; // conversões permitidas agora (consentimento vigente)

  // Falha fechada: sem site-env.js a tag não roda.
  function blockedEnvironment() {
    return !(window.LAC_ENV && window.LAC_ENV.measurementAllowed());
  }

  function configured() { return TAG_RE.test(CONFIG.tagId || ''); }

  function gtag() { window.dataLayer.push(arguments); }

  function load() {
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    gtag('consent', 'default', DENIED);
    gtag('consent', 'update', GRANTED_ADS);
    gtag('js', new Date());
    gtag('config', CONFIG.tagId, { allow_enhanced_conversions: false, url_passthrough: false });
    try {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CONFIG.tagId);
      s.onerror = function () { /* bloqueador de anúncios: segue sem a tag */ };
      document.head.appendChild(s);
    } catch (_) { /* best-effort */ }
  }

  function clearGoogleCookies() {
    try {
      document.cookie.split(';').forEach(function (c) {
        var name = c.split('=')[0].trim();
        if (/^_gcl_/.test(name)) document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      });
    } catch (_) { /* no-op */ }
  }

  function evaluate() {
    try {
      var c = window.LAC_CONSENT ? window.LAC_CONSENT.get() : { advertising: false };
      if (c.advertising && configured() && !blockedEnvironment()) {
        if (!loaded) load();
        else gtag('consent', 'update', GRANTED_ADS);
        enabled = true;
      } else {
        enabled = false;
        if (loaded) { gtag('consent', 'update', DENIED); clearGoogleCookies(); }
      }
    } catch (_) { enabled = false; }
  }

  // Envia a conversão (sem valor, moeda, transaction_id nem dados pessoais).
  function conversion(name) {
    try {
      var def = CONFIG.conversions[name];
      if (!enabled || !def || !LABEL_RE.test(def.label || '')) return false;
      gtag('event', 'conversion', { send_to: CONFIG.tagId + '/' + def.label });
      return true;
    } catch (_) { return false; }
  }

  // Aplica uma configuração (usado ao receber os IDs reais e pelos testes).
  function configure(cfg) {
    if (!cfg) return false;
    if (TAG_RE.test(cfg.tagId || '')) CONFIG.tagId = cfg.tagId;
    Object.keys(CONFIG.conversions).forEach(function (k) {
      var l = cfg.conversions && cfg.conversions[k] && cfg.conversions[k].label;
      if (LABEL_RE.test(l || '')) CONFIG.conversions[k].label = l;
    });
    evaluate();
    return configured();
  }

  window.LAC_GOOGLE = { conversion: conversion, configure: configure, isEnabled: function () { return enabled; } };

  if (window.LAC_CONSENT) window.LAC_CONSENT.subscribe(evaluate);
  evaluate();
})();
