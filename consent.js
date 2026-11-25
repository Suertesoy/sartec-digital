/* Consentimento de privacidade (LGPD) — componente próprio, sem CMP externa.
 *
 * Categorias:
 *   essential   sempre ativa (idioma, rascunho/sessão do diagnóstico, esta preferência)
 *   analytics   análise comportamental (PostHog) — desligada por padrão
 *   advertising publicidade e mensuração de campanhas (Google Ads, atribuição) — desligada por padrão
 *
 * Regras: opcionais desativadas até escolha explícita; Recusar e Aceitar têm o
 * mesmo peso visual; preferências persistem (localStorage) e são revisáveis/
 * revogáveis pelo rodapé. O site funciona igual com tudo recusado.
 *
 * API: window.LAC_CONSENT = { get, subscribe, openPreferences, set, acceptAll, rejectAll }
 * Evento: window 'la:consentchange' (detail = snapshot).
 */
(function () {
  'use strict';

  var KEY = 'lac_consent_v1';
  var VERSION = 1;
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // pergunta de novo após 12 meses

  var state = readStored();
  var listeners = [];
  var ui = null; // referências do DOM, criadas sob demanda

  // ── persistência ───────────────────────────────────────────────────
  function readStored() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || o.v !== VERSION || typeof o.analytics !== 'boolean' || typeof o.advertising !== 'boolean') return null;
      if (typeof o.ts !== 'number' || Date.now() - o.ts > MAX_AGE_MS) return null;
      return o;
    } catch (_) { return null; }
  }

  function snapshot() {
    return { decided: !!state, essential: true, analytics: !!(state && state.analytics), advertising: !!(state && state.advertising) };
  }

  function emit() {
    var snap = snapshot();
    listeners.slice().forEach(function (cb) { try { cb(snap); } catch (_) { /* um assinante nunca derruba os outros */ } });
    try { window.dispatchEvent(new CustomEvent('la:consentchange', { detail: snap })); } catch (_) { /* no-op */ }
  }

  function set(analytics, advertising) {
    state = { v: VERSION, analytics: !!analytics, advertising: !!advertising, ts: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* storage indisponível: vale só nesta página */ }
    emit();
    syncBanner();
  }

  // ── textos (PT/EN) ─────────────────────────────────────────────────
  var COPY = {
    pt: {
      bannerLabel: 'Aviso de privacidade',
      title: 'Privacidade e cookies',
      body: 'Usamos tecnologias essenciais para o site funcionar. Com a sua permissão, também usamos análise de comportamento para melhorar o site e a mensuração de campanhas de publicidade. Essas tecnologias opcionais enviam dados a servidores nos Estados Unidos. Você pode recusar sem perder nenhuma função, inclusive o diagnóstico e os contatos.',
      reject: 'Recusar',
      accept: 'Aceitar',
      customize: 'Personalizar',
      modalTitle: 'Preferências de privacidade',
      modalIntro: 'Escolha quais tecnologias opcionais podem ser usadas. Você pode mudar isso quando quiser, pelo rodapé.',
      essentialTitle: 'Essenciais',
      essentialDesc: 'Necessárias para o site funcionar: idioma, rascunho e sessão do diagnóstico e o registro destas preferências. Sempre ativas.',
      analyticsTitle: 'Análise comportamental',
      analyticsDesc: 'Mede páginas visitadas e cliques para entendermos o que melhorar (PostHog). Ao permitir, seus dados de navegação são tratados em servidores nos Estados Unidos. Não coletamos nome, e-mail, telefone nem respostas do diagnóstico, e não gravamos sessões.',
      advertisingTitle: 'Publicidade e mensuração de campanhas',
      advertisingDesc: 'Permite medir o resultado de campanhas (Google Ads) e guardar a origem da visita (UTMs e identificadores de clique) enquanto você navega. Ao permitir, os dados podem ser tratados nos Estados Unidos e em outros países (Google).',
      alwaysOn: 'Sempre ativas',
      rejectAll: 'Recusar opcionais',
      save: 'Salvar preferências',
      acceptAll: 'Aceitar todas',
      close: 'Fechar',
      footerLink: 'Preferências de privacidade',
      policy: 'Política de Privacidade',
    },
    en: {
      bannerLabel: 'Privacy notice',
      title: 'Privacy and cookies',
      body: 'We use essential technologies to make the site work. With your permission, we also use behavior analytics to improve the site and advertising campaign measurement. These optional technologies send data to servers in the United States. You can decline without losing any feature, including the diagnostic and contact options.',
      reject: 'Decline',
      accept: 'Accept',
      customize: 'Customize',
      modalTitle: 'Privacy preferences',
      modalIntro: 'Choose which optional technologies may be used. You can change this at any time from the footer.',
      essentialTitle: 'Essential',
      essentialDesc: 'Required for the site to work: language, diagnostic draft and session, and the record of these preferences. Always on.',
      analyticsTitle: 'Behavior analytics',
      analyticsDesc: 'Measures pages visited and clicks so we can understand what to improve (PostHog). If you allow it, your browsing data is processed on servers in the United States. We do not collect name, e-mail, phone or diagnostic answers, and we do not record sessions.',
      advertisingTitle: 'Advertising and campaign measurement',
      advertisingDesc: 'Lets us measure campaign results (Google Ads) and remember where your visit came from (UTMs and click identifiers) while you browse. If you allow it, data may be processed in the United States and other countries (Google).',
      alwaysOn: 'Always on',
      rejectAll: 'Decline optional',
      save: 'Save preferences',
      acceptAll: 'Accept all',
      close: 'Close',
      footerLink: 'Privacy preferences',
      policy: 'Privacy Policy',
    },
  };

  // Idioma inicial: preferência salva do site. Depois, o evento la:languagechange
  // (disparado por script.js/diagnostic.js já com <html lang> atualizado) é a verdade.
  var liveLang = null;
  function currentLang() {
    if (liveLang) return liveLang;
    try { if (localStorage.getItem('sartec_lang') === 'en') return 'en'; } catch (_) { /* no-op */ }
    return (document.documentElement.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'pt';
  }
  function T() { return COPY[currentLang()]; }

  // ── DOM ────────────────────────────────────────────────────────────
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function toggleRow(id, name) {
    var input = el('input', { type: 'checkbox', id: id, role: 'switch', class: 'consent-switch__input' });
    var track = el('span', { class: 'consent-switch__track', 'aria-hidden': 'true' });
    var label = el('label', { class: 'consent-switch', for: id }, [input, track]);
    var title = el('span', { class: 'consent-row__title', 'data-k': name + 'Title' });
    var desc = el('p', { class: 'consent-row__desc', 'data-k': name + 'Desc' });
    var head = el('div', { class: 'consent-row__head' }, [title, label]);
    return { row: el('div', { class: 'consent-row' }, [head, desc]), input: input };
  }

  function build() {
    if (ui) return ui;

    var banner = el('div', { class: 'consent', id: 'lacConsentBanner', role: 'region', 'aria-labelledby': 'lacConsentTitle', hidden: '' }, [
      el('div', { class: 'consent__inner' }, [
        el('div', { class: 'consent__text' }, [
          el('h2', { class: 'consent__title', id: 'lacConsentTitle', 'data-k': 'title' }),
          el('p', { class: 'consent__body', 'data-k': 'body' }),
          el('a', { class: 'consent__link', href: 'privacidade.html', 'data-k': 'policy' }),
        ]),
        el('div', { class: 'consent__actions' }, [
          el('button', { type: 'button', class: 'consent__btn', 'data-act': 'reject', 'data-k': 'reject' }),
          el('button', { type: 'button', class: 'consent__btn', 'data-act': 'accept', 'data-k': 'accept' }),
          el('button', { type: 'button', class: 'consent__btn', 'data-act': 'customize', 'data-k': 'customize' }),
        ]),
      ]),
    ]);

    var essential = el('div', { class: 'consent-row' }, [
      el('div', { class: 'consent-row__head' }, [
        el('span', { class: 'consent-row__title', 'data-k': 'essentialTitle' }),
        el('span', { class: 'consent-row__fixed', 'data-k': 'alwaysOn' }),
      ]),
      el('p', { class: 'consent-row__desc', 'data-k': 'essentialDesc' }),
    ]);
    var analytics = toggleRow('lacConsentAnalytics', 'analytics');
    var advertising = toggleRow('lacConsentAdvertising', 'advertising');

    var dialog = el('div', { class: 'consent-modal__panel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'lacConsentModalTitle', tabindex: '-1' }, [
      el('div', { class: 'consent-modal__top' }, [
        el('h2', { class: 'consent-modal__title', id: 'lacConsentModalTitle', 'data-k': 'modalTitle' }),
        el('button', { type: 'button', class: 'consent-modal__close', 'data-act': 'close', 'data-k': 'close', 'aria-label': 'Fechar' }),
      ]),
      el('p', { class: 'consent-modal__intro', 'data-k': 'modalIntro' }),
      el('a', { class: 'consent__link', href: 'privacidade.html', 'data-k': 'policy' }),
      essential, analytics.row, advertising.row,
      el('div', { class: 'consent__actions consent-modal__actions' }, [
        el('button', { type: 'button', class: 'consent__btn', 'data-act': 'rejectAll', 'data-k': 'rejectAll' }),
        el('button', { type: 'button', class: 'consent__btn', 'data-act': 'acceptAll', 'data-k': 'acceptAll' }),
        el('button', { type: 'button', class: 'consent__btn', 'data-act': 'save', 'data-k': 'save' }),
      ]),
    ]);
    var modal = el('div', { class: 'consent-modal', id: 'lacConsentModal', hidden: '' }, [dialog]);

    document.body.appendChild(banner);
    document.body.appendChild(modal);

    ui = { banner: banner, modal: modal, dialog: dialog, analytics: analytics.input, advertising: advertising.input, opener: null };

    banner.addEventListener('click', function (e) {
      var act = e.target.closest && e.target.closest('[data-act]');
      if (!act) return;
      var a = act.getAttribute('data-act');
      if (a === 'accept') set(true, true);
      else if (a === 'reject') set(false, false);
      else if (a === 'customize') openPreferences(act);
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) { closeModal(); return; }
      var act = e.target.closest && e.target.closest('[data-act]');
      if (!act) return;
      var a = act.getAttribute('data-act');
      if (a === 'close') closeModal();
      else if (a === 'acceptAll') { set(true, true); closeModal(); }
      else if (a === 'rejectAll') { set(false, false); closeModal(); }
      else if (a === 'save') { set(ui.analytics.checked, ui.advertising.checked); closeModal(); }
    });

    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); closeModal(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.slice.call(dialog.querySelectorAll('button, input:not([disabled]), [href]'));
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    applyCopy();
    return ui;
  }

  function applyCopy() {
    if (!ui) return;
    var t = T();
    [ui.banner, ui.modal].forEach(function (root) {
      root.querySelectorAll('[data-k]').forEach(function (n) { if (t[n.getAttribute('data-k')] !== undefined) n.textContent = t[n.getAttribute('data-k')]; });
    });
    ui.banner.setAttribute('aria-label', t.bannerLabel);
    ui.modal.querySelector('.consent-modal__close').setAttribute('aria-label', t.close);
    document.querySelectorAll('.consent-footer-link').forEach(function (b) { b.textContent = t.footerLink; });
  }

  function syncBanner() {
    if (!document.body) return;
    build();
    ui.banner.hidden = !!state;
  }

  function openPreferences(opener) {
    build();
    ui.opener = opener || document.activeElement;
    var snap = snapshot();
    ui.analytics.checked = snap.analytics;
    ui.advertising.checked = snap.advertising;
    ui.modal.hidden = false;
    document.documentElement.classList.add('consent-open');
    ui.dialog.focus();
  }

  function closeModal() {
    if (!ui || ui.modal.hidden) return;
    ui.modal.hidden = true;
    document.documentElement.classList.remove('consent-open');
    var back = ui.opener && document.contains(ui.opener) && !ui.opener.closest('[hidden]') ? ui.opener : document.querySelector('.consent-footer-link');
    if (back && back.focus) back.focus();
  }

  // Link permanente no rodapé (revisar/revogar).
  function injectFooterLink() {
    var host = document.querySelector('.footer__policy') || document.querySelector('.footer__legal') || document.querySelector('.diag-footer .container');
    if (!host || host.querySelector('.consent-footer-link')) return;
    var btn = el('button', { type: 'button', class: 'consent-footer-link' });
    btn.addEventListener('click', function () { openPreferences(btn); });
    host.appendChild(btn);
  }

  function boot() {
    injectFooterLink();
    syncBanner();
    applyCopy();
  }

  window.addEventListener('la:languagechange', function () {
    liveLang = (document.documentElement.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'pt';
    applyCopy();
  });

  window.LAC_CONSENT = {
    get: snapshot,
    subscribe: function (cb) { listeners.push(cb); },
    openPreferences: function () { openPreferences(); },
    set: set,
    acceptAll: function () { set(true, true); },
    rejectAll: function () { set(false, false); },
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
