/* PostHog — comportamento/CRO, SOB CONSENTIMENTO.
 *
 * O Funnel Core continua sendo a fonte de verdade de negócio; o PostHog só
 * recebe comportamento. Regras (decisões do Checkpoint 10.0A, mantidas):
 *  - NUNCA chamar posthog.identify() (person_profiles: identified_only);
 *  - nenhum dado do diagnóstico (nome, e-mail, telefone, respostas, score,
 *    qualificação) nem ID do Core sai daqui; allowlist de eventos/propriedades;
 *  - best-effort: se o PostHog falhar ou for bloqueado, o site segue normalmente.
 *
 * Regras desta versão:
 *  - NÃO carrega nem inicializa nada até haver consentimento de "análise
 *    comportamental" (window.LAC_CONSENT). Revogar para a captura e apaga os
 *    dados locais do PostHog;
 *  - só mede no domínio de PRODUÇÃO (site-env.js): não inicializa em Preview,
 *    localhost, file: nem em navegador automatizado — assim deploys de Preview e
 *    testes não contaminam o projeto real. Os testes liberam a lógica com
 *    window.__LAC_ALLOW_AUTOMATION__ e interceptam a rede;
 *  - Session Replay desligado nesta versão;
 *  - persistência em localStorage (compatível com navegação entre documentos
 *    HTML e atrelada ao consentimento; sem cookies);
 *  - a captura automática (pageview, cliques) é sanitizada em before_send e
 *    pelas opções de máscara do SDK: identificadores de clique de anúncios
 *    (gclid, gbraid, wbraid, fbclid…) nunca saem, nem em URLs, referrers,
 *    propriedades ou elementos; cliques em canais de contato (wa.me, tel:,
 *    mailto:) não são autocapturados (cobertos por contact_clicked).
 *
 * PENDENTE antes de publicar: confirmar que o token abaixo é o do projeto
 * PostHog US 654330.
 */
(function () {
  'use strict';

  var TOKEN = 'phc_nEyRVjJ37Lo6SH97PYKbMVGZjBNQHfQ5h7ww37QButBp'; // token público (frontend)
  var API_HOST = 'https://us.i.posthog.com';

  var started = false; // posthog.init já foi chamado nesta página
  var active = false;  // captura permitida agora (consentimento vigente)

  // ── ambiente ───────────────────────────────────────────────────────
  // Só o domínio de produção mede (site-env.js). Preview, localhost, file: e navegador
  // automatizado ficam de fora. Falha fechada se site-env.js não carregar.
  function blockedEnvironment() {
    return !(window.LAC_ENV && window.LAC_ENV.measurementAllowed());
  }

  // ── sanitização (autocapture e propriedades automáticas) ───────────
  var CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'dclid', 'gclsrc', 'gad_source', 'gad_campaignid', 'msclkid', 'ttclid', 'twclid', 'li_fat_id', 'igshid', 'yclid', 'epik', 'rdt_cid', 'sccid', 'mc_eid', '_gl'];
  var CLICK_ID_QUERY = new RegExp('([?&])(?:' + CLICK_ID_KEYS.join('|') + ')=[^&#\\s"\']*', 'gi');
  var CLICK_ID_KEY_RE = new RegExp('(^|[_$.])(?:' + CLICK_ID_KEYS.join('|') + ')$', 'i');
  var URL_PROP_RE = /(^|\.|\$)(current_url|referrer|initial_current_url|initial_referrer|session_entry_url|session_entry_referrer|external_click_url|el_href|href)$/i;

  function scrubString(s) {
    if (typeof s !== 'string' || s.indexOf('=') === -1) return s;
    return s.replace(CLICK_ID_QUERY, function (m, sep) { return sep === '?' ? '?' : ''; }).replace(/\?&/, '?').replace(/\?(?=#|$)/, '');
  }

  function isContactHref(h) {
    return typeof h === 'string' && (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(h) || /^(tel|mailto):/i.test(h));
  }

  function touchesContactLink(p) {
    if (typeof p.$elements_chain === 'string' && /href="(https?:\/\/(wa\.me|api\.whatsapp\.com)\/|tel:|mailto:)/i.test(p.$elements_chain)) return true;
    return Array.isArray(p.$elements) && p.$elements.some(function (e) { return e && isContactHref(e.attr__href); });
  }

  function scrubBag(bag) {
    if (!bag || typeof bag !== 'object') return;
    Object.keys(bag).forEach(function (k) {
      if (CLICK_ID_KEY_RE.test(k)) { delete bag[k]; return; }
      if (typeof bag[k] === 'string' && (URL_PROP_RE.test(k) || bag[k].indexOf('://') > -1 || bag[k].charAt(0) === '/')) bag[k] = scrubString(bag[k]);
    });
  }

  // Falha fechada: se algo der errado ao sanitizar, o evento é descartado.
  function beforeSend(ev) {
    try {
      if (!ev) return null;
      var p = ev.properties || (ev.properties = {});
      if (ev.event === '$autocapture' && touchesContactLink(p)) return null;
      scrubBag(p);
      scrubBag(ev.$set);
      scrubBag(ev.$set_once);
      scrubBag(p.$set);
      scrubBag(p.$set_once);
      if (Array.isArray(p.$elements)) {
        p.$elements.forEach(function (e) { if (e && e.attr__href) e.attr__href = scrubString(e.attr__href); });
      }
      if (typeof p.$elements_chain === 'string') p.$elements_chain = scrubString(p.$elements_chain);
      return ev;
    } catch (_) { return null; }
  }

  // ── ciclo de vida ──────────────────────────────────────────────────
  function config() {
    return {
      api_host: API_HOST,
      defaults: '2026-05-30',
      person_profiles: 'identified_only',
      persistence: 'localStorage',
      cross_subdomain_cookie: false,
      // Replay desligado nesta primeira versão.
      disable_session_recording: true,
      // Autocapture continua, mas sem texto/atributos de elementos e com URLs mascaradas.
      mask_all_text: true,
      mask_all_element_attributes: true,
      mask_personal_data_properties: true,
      property_denylist: CLICK_ID_KEYS.concat(CLICK_ID_KEYS.map(function (k) { return '$initial_' + k; })),
      before_send: beforeSend,
      // Superfície mínima: sem heatmaps, dead clicks, exceções, performance, surveys nem feature flags.
      capture_heatmaps: false,
      capture_dead_clicks: false,
      capture_exceptions: false,
      capture_performance: false,
      disable_surveys: true,
      advanced_disable_flags: true,
      advanced_disable_feature_flags: true,
      loaded: function (ph) {
        // Reaceite depois de uma revogação anterior: libera a captura.
        try { if (ph.has_opted_out_capturing && ph.has_opted_out_capturing()) ph.opt_in_capturing({ captureEventName: false }); } catch (_) { /* best-effort */ }
      },
    };
  }

  function start() {
    try {
      if (blockedEnvironment()) return;
      if (started) {
        try { if (window.posthog && window.posthog.opt_in_capturing) window.posthog.opt_in_capturing({ captureEventName: false }); } catch (_) { /* no-op */ }
        active = true;
        return;
      }
      started = true;

      // Snippet oficial do PostHog (HTML / Web JavaScript), sem alterações.
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="gu mu yu bu ku init Qu Zu Wu Vu Yu el Gu ec zu lc uc cc hc dc vc capture getExtension Ju fu mc calculateEventProperties gc register register_once register_for_session unregister unregister_for_session wc Uu yc getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys onActiveMatchingSurveysChanged renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync kc identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset Sc shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty bc rc createPersonProfile setInternalOrTestUser Cu xu opt_in_capturing opt_out_capturing $u has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing nc debug il Os getPageViewId captureTraceFeedback captureTraceMetric Nu".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

      window.posthog.init(TOKEN, config());
      active = true;
    } catch (_) { /* best-effort: o site não depende do PostHog */ }
  }

  function clearLocalData() {
    try {
      Object.keys(localStorage).forEach(function (k) { if (/^ph_/.test(k)) localStorage.removeItem(k); });
    } catch (_) { /* no-op */ }
    try {
      document.cookie.split(';').forEach(function (c) {
        var name = c.split('=')[0].trim();
        if (/^ph_/.test(name)) document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      });
    } catch (_) { /* no-op */ }
  }

  function stop() {
    active = false;
    if (!started) return;
    try { if (window.posthog && window.posthog.opt_out_capturing) window.posthog.opt_out_capturing(); } catch (_) { /* no-op */ }
    clearLocalData();
  }

  function onConsent(snap) {
    if (snap && snap.analytics) start(); else stop();
  }

  // API para o restante do site: capture() respeita consentimento e nunca lança.
  window.LAC_ANALYTICS = {
    capture: function (name, props) {
      try {
        if (!active || !window.posthog || typeof window.posthog.capture !== 'function') return false;
        window.posthog.capture(name, props);
        return true;
      } catch (_) { return false; }
    },
    isActive: function () { return active; },
    // Exposto só para testes de configuração/sanitização.
    __config: config,
    __beforeSend: beforeSend,
  };

  if (window.LAC_CONSENT) {
    window.LAC_CONSENT.subscribe(onConsent);
    onConsent(window.LAC_CONSENT.get());
  }
})();
