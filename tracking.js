/* Instrumentação — taxonomia central + delegação de eventos.
 *
 * Três camadas (propriedade event_layer em todo evento):
 *   behavior        o que o visitante viu/fez (páginas, cases, demos, CTAs, etapas do diagnóstico)
 *   contact_intent  clicou num canal de contato (WhatsApp, telefone, e-mail) — INTENÇÃO,
 *                   nunca um lead confirmado
 *   conversion      lead_submitted: o Funnel Core confirmou a persistência do diagnóstico
 *
 * Destinos (cada interação chega UMA vez a cada destino):
 *   PostHog  — comportamento; só com consentimento de análise (LAC_ANALYTICS)
 *   Google   — conversões; só com consentimento de publicidade e tag configurada (LAC_GOOGLE)
 *   Funnel Core — eventos legados do diagnóstico continuam em diagnostic.js (/events);
 *                 o clique de WhatsApp do resultado vai ao Core como whatsapp_clicked e
 *                 ao PostHog como contact_clicked (nunca os dois no PostHog).
 *
 * Privacidade: só propriedades da allowlist de cada evento, valores restritos a
 * identificadores curtos [A-Za-z0-9_.-]; nada de nome/e-mail/telefone/respostas/
 * score/IDs do Core; sem identify().
 */
(function () {
  'use strict';

  var SAFE = /^[A-Za-z0-9_.-]{1,64}$/;
  var BASE = ['language'];

  // ── taxonomia ──────────────────────────────────────────────────────
  var TAXONOMY = {
    // behavior — site
    case_viewed: { layer: 'behavior', props: BASE.concat(['page', 'case_slug']) },
    demo_clicked: { layer: 'behavior', props: BASE.concat(['page', 'position', 'case_slug', 'demo_host']) },
    diagnostic_cta_clicked: { layer: 'behavior', props: BASE.concat(['page', 'position']) },
    // behavior — diagnóstico (espelho dos eventos do Core)
    diagnostic_viewed: { layer: 'behavior', props: BASE },
    diagnostic_started: { layer: 'behavior', props: BASE },
    question_viewed: { layer: 'behavior', props: BASE.concat(['question_id', 'question_order', 'question_count']) },
    question_answered: { layer: 'behavior', props: BASE.concat(['question_id', 'question_order', 'question_count']) },
    identity_viewed: { layer: 'behavior', props: BASE },
    diagnostic_completed: { layer: 'behavior', props: BASE.concat(['recommendation_path', 'outcome_mode', 'answer_count']) },
    result_viewed: { layer: 'behavior', props: BASE.concat(['recommendation_path', 'outcome_mode']) },
    // intenção de contato
    contact_clicked: { layer: 'contact_intent', props: BASE.concat(['page', 'position', 'channel', 'cta_key']) },
    // conversão efetiva (persistência confirmada pelo Core)
    lead_submitted: { layer: 'conversion', props: BASE.concat(['recommendation_path', 'outcome_mode']) },
  };

  // Posição do CTA: primeiro seletor que casar (mais específico primeiro).
  var POSITIONS = [
    ['#diagResultWaBtn', 'diagnostic_result'],
    ['.diag-fatal__actions', 'diagnostic_error'],
    ['.wa-float', 'floating'],
    ['.hero__actions', 'hero'],
    ['.case-hero__actions, .case-hero__visual', 'case_hero'],
    ['.pricing-card', 'solution_card'],
    ['.proj-scroll__actions, .proj-scroll__frame', 'home_projects'],
    ['.showcase__actions, .showcase-primary, .showcase-secondary', 'case_list'],
    ['.case-why__cta', 'case_body'],
    ['.mid-page-cta', 'mid_page'],
    ['.policy', 'policy_body'],
    ['.cta-final', 'final_cta'],
    ['.footer, .diag-footer', 'footer'],
  ];

  var DEMO_HOSTS = {
    'pescadelivery.vercel.app': 'pesca',
    'www.sartecpapelaria.com.br': 'sartec',
    'projeto-uniedu.vercel.app': 'uniedu',
    'case-app-uniedu.vercel.app': 'uniedu',
    'almeidaambiental.vercel.app': 'almeida',
  };

  // ── utilidades ─────────────────────────────────────────────────────
  function language() {
    return (document.documentElement.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'pt';
  }

  function pageId() {
    var p = (location.pathname || '/').replace(/\/+$/, '').replace(/\.html$/, '').replace(/^\//, '');
    if (!p || p === 'index') return 'home';
    return SAFE.test(p) ? p : 'other';
  }

  function caseSlugOfPage() {
    var m = pageId().match(/^case-([a-z0-9]+)$/);
    return m ? m[1] : null;
  }

  function positionOf(el) {
    for (var i = 0; i < POSITIONS.length; i++) {
      try { if (el.closest(POSITIONS[i][0])) return POSITIONS[i][1]; } catch (_) { /* seletor inválido */ }
    }
    return 'content';
  }

  // ── emissão (PostHog) ──────────────────────────────────────────────
  function sanitize(name, props) {
    var spec = TAXONOMY[name];
    if (!spec) return null;
    var out = { event_layer: spec.layer };
    spec.props.forEach(function (k) {
      var v = props && props[k];
      if (typeof v === 'number' && isFinite(v)) out[k] = v;
      else if (typeof v === 'string' && SAFE.test(v)) out[k] = v;
    });
    return out;
  }

  function emit(name, props) {
    try {
      var safe = sanitize(name, props);
      if (!safe || !window.LAC_ANALYTICS) return false;
      return window.LAC_ANALYTICS.capture(name, safe);
    } catch (_) { return false; } // instrumentação nunca interrompe a experiência
  }

  function googleConversion(name) {
    try { return !!(window.LAC_GOOGLE && window.LAC_GOOGLE.conversion(name)); } catch (_) { return false; }
  }

  // ── cliques (delegação) ────────────────────────────────────────────
  var recent = {}; // chave -> timestamp: ignora clique repetido logo em seguida (duplo clique)
  var DEBOUNCE_MS = 1200;

  function firstOfBurst(key) {
    var now = Date.now();
    if (recent[key] && now - recent[key] < DEBOUNCE_MS) return false;
    recent[key] = now;
    return true;
  }

  function classify(a) {
    var raw = a.getAttribute('href') || '';
    if (/^https:\/\/wa\.me\//i.test(raw)) return { type: 'contact', channel: 'whatsapp' };
    if (/^tel:/i.test(raw)) return { type: 'contact', channel: 'phone' };
    if (/^mailto:/i.test(raw)) return { type: 'contact', channel: 'email' };
    var url;
    try { url = new URL(a.href, location.href); } catch (_) { return null; }
    if (/^\/diagnostico(\.html)?\/?$/.test(url.pathname) && (url.host === location.host || url.host === 'lacabral.vercel.app')) return { type: 'diagnostic' };
    if (DEMO_HOSTS[url.host]) return { type: 'demo', host: url.host };
    return null;
  }

  function ctaKeyOf(a, kind) {
    if (a.id === 'diagResultWaBtn') return 'diagnostic_result';
    if (a.getAttribute('data-wa-key')) return a.getAttribute('data-wa-key');
    return kind.channel === 'whatsapp' ? 'whatsapp_direct' : kind.channel;
  }

  function onClick(ev) {
    try {
      if (ev.type === 'auxclick' && ev.button !== 1) return;
      if (ev.type === 'click' && ev.button > 0) return;
      var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
      if (!a) return;
      var kind = classify(a);
      if (!kind) return;
      var position = positionOf(a);
      var page = pageId();

      if (kind.type === 'contact') {
        var key = ctaKeyOf(a, kind);
        if (!firstOfBurst('c|' + kind.channel + '|' + position + '|' + key)) return;
        emit('contact_clicked', { language: language(), page: page, position: position, channel: kind.channel, cta_key: key });
        googleConversion('contact');
      } else if (kind.type === 'diagnostic') {
        if (!firstOfBurst('d|' + position)) return;
        emit('diagnostic_cta_clicked', { language: language(), page: page, position: position });
      } else if (kind.type === 'demo') {
        if (!firstOfBurst('m|' + kind.host + '|' + position)) return;
        emit('demo_clicked', { language: language(), page: page, position: position, case_slug: DEMO_HOSTS[kind.host], demo_host: kind.host });
      }
    } catch (_) { /* no-op */ }
  }

  document.addEventListener('click', onClick, true);
  document.addEventListener('auxclick', onClick, true);

  // ── visualização de case (uma vez por carregamento de página) ──────
  function viewedCase() {
    var slug = caseSlugOfPage();
    if (slug) emit('case_viewed', { language: language(), page: pageId(), case_slug: slug });
  }
  var caseSent = false;
  function maybeViewedCase() {
    if (caseSent || !caseSlugOfPage()) return;
    if (window.LAC_ANALYTICS && window.LAC_ANALYTICS.isActive()) { caseSent = true; viewedCase(); }
  }
  maybeViewedCase();
  // Aceite tardio na própria página de case: registra a visualização atual.
  if (window.LAC_CONSENT) window.LAC_CONSENT.subscribe(function () { setTimeout(maybeViewedCase, 0); });

  // ── conversão: lead confirmado pelo Core ───────────────────────────
  var LEAD_KEY = 'lac_lead_sent'; // submissionIds já contabilizados — só local, nunca transmitido
  function leadAlreadyCounted(id) {
    try { return (JSON.parse(sessionStorage.getItem(LEAD_KEY)) || []).indexOf(id) > -1; } catch (_) { return false; }
  }
  function markLeadCounted(id) {
    try {
      // Só persiste no navegador com consentimento de análise ou publicidade;
      // sem ele a deduplicação vale apenas em memória (nada é gravado).
      var c = window.LAC_CONSENT ? window.LAC_CONSENT.get() : null;
      if (!c || !(c.analytics || c.advertising)) return;
      var list = JSON.parse(sessionStorage.getItem(LEAD_KEY)) || [];
      list.push(id);
      sessionStorage.setItem(LEAD_KEY, JSON.stringify(list.slice(-20)));
    } catch (_) { /* storage indisponível: o guard em memória abaixo ainda evita repetição na página */ }
  }
  var countedInMemory = {};

  // Chamar SOMENTE após resposta de sucesso do POST /submit (Core persistiu).
  // Idempotente por submissionId: reenvios, reloads e respostas de sucesso repetidas não recontam.
  function leadSubmitted(props, submissionId) {
    try {
      var id = typeof submissionId === 'string' && submissionId ? submissionId : null;
      if (id) {
        if (countedInMemory[id] || leadAlreadyCounted(id)) return false;
        countedInMemory[id] = true;
        markLeadCounted(id);
      }
      emit('lead_submitted', props);
      googleConversion('diagnostic_lead');
      return true;
    } catch (_) { return false; }
  }

  window.LAC_TRACK = {
    emit: emit,
    leadSubmitted: leadSubmitted,
    taxonomy: TAXONOMY,
    positions: POSITIONS.map(function (p) { return p[1]; }).concat(['content']),
  };
})();
