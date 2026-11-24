/* Google Tag (gtag.js) para Google Ads — PREPARADO, INERTE ATÉ HAVER IDs REAIS.
 *
 * Enquanto CONFIG.tagId for null este módulo não carrega nenhum script do
 * Google, não cria dataLayer e não faz nenhuma requisição.
 *
 * Quando configurado:
 *  - só carrega após consentimento de "publicidade" (Consent Mode v2, modo
 *    BÁSICO: nada do Google é carregado antes do aceite). Ao carregar,
 *    declara o consent default = denied e em seguida o update = granted
 *    (ad_storage, ad_user_data, ad_personalization). analytics_storage
 *    permanece negado: não há GA4;
 *  - revogar volta tudo para denied, remove cookies _gcl_* e desativa conversões;
 *  - não roda em localhost/file: nem em navegador automatizado
 *    (liberável com window.__LAC_ALLOW_AUTOMATION__ nos testes);
 *  - enhanced conversions DESLIGADAS (allow_enhanced_conversions:false) e nenhum
 *    dado pessoal, ID do Core, valor ou moeda é enviado;
 *  - sem GA4 e sem GTM.
 *
 * Conversões previstas (a tracking.js as aciona, uma vez por interação):
 *   contact          SECUNDÁRIA — clique em WhatsApp/telefone/e-mail (intenção)
 *   diagnostic_lead  PRINCIPAL  — lead do diagnóstico com persistência confirmada pelo Core
 *
 * PARA ATIVAR (depois de criar as ações de conversão no Google Ads):
 *   tagId:  'AW-<número do Google Ads>'
 *   conversions.contact.label / conversions.diagnostic_lead.label: rótulos de cada ação
 * Não inventar valores: se um rótulo ficar null, aquela conversão não é enviada.
 */
(function () {
  'use strict';

  var CONFIG = {
    tagId: null, // ex.: 'AW-1234567890' — PENDENTE (painel do Google Ads)
    conversions: {
      contact: { label: null },         // PENDENTE
      diagnostic_lead: { label: null }, // PENDENTE
    },
  };

  var TAG_RE = /^AW-\d{6,14}$/;
  var LABEL_RE = /^[A-Za-z0-9_-]{6,64}$/;
  var DENIED = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
  var GRANTED_ADS = { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' };

  var loaded = false;  // gtag.js carregado nesta página
  var enabled = false; // conversões permitidas agora (consentimento vigente)

  function blockedEnvironment() {
    var host = location.hostname;
    if (location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1') return true;
    if (navigator.webdriver === true && !window.__LAC_ALLOW_AUTOMATION__) return true;
    return false;
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
