/* Configuração central dos canais de contato.
 *
 * Fonte única de número, telefone, e-mail e mensagens pré-preenchidas.
 * Carregado (síncrono) antes de script.js e diagnostic.js.
 *
 * Os HTMLs mantêm links estáticos como fallback (sem JS continuam
 * funcionando); tests/contact-config.test.mjs garante que esses fallbacks
 * nunca divirjam deste arquivo. Para trocar um contato: edite aqui, replique
 * nos fallbacks HTML (o teste aponta o que faltou) e incremente o ?v= dos scripts.
 */
(function () {
  'use strict';

  var CONFIG = {
    whatsapp: { e164: '5548991830112' }, // formato wa.me
    phone: { href: '+5548991830112', display: '(48) 99183-0112' },
    email: { address: 'contato.lacabral@gmail.com' },

    // Mensagens pré-preenchidas por CTA (chave = data-wa-key no HTML).
    messages: {
      pt: {
        waGeneral: 'Olá, vim pelo site da L A Cabral e quero conversar sobre um projeto.',
        waFloatGeneral: 'Olá, vim pelo site da L A Cabral.',
        waAutomacao: 'Olá, vim pelo site da L A Cabral e quero conversar sobre um site ou uma experiência web.',
        waConectada: 'Olá, vim pelo site da L A Cabral e quero conversar sobre um produto digital ou aplicativo.',
        waSistemas: 'Olá, vim pelo site da L A Cabral e quero entender se minha operação precisa de um sistema, automação ou integração.',
        waAquisicao: 'Olá, vim pelo site da L A Cabral e quero entender como organizar a jornada entre o primeiro contato e o comercial.',
      },
      en: {
        waGeneral: "Hi, I found you through the L A Cabral website and I'd like to talk about a project.",
        waFloatGeneral: 'Hi, I found you through the L A Cabral website.',
        waAutomacao: "Hi, I found you through the L A Cabral website and I'd like to talk about a website or a web experience.",
        waConectada: "Hi, I found you through the L A Cabral website and I'd like to talk about a digital product or app.",
        waSistemas: "Hi, I found you through the L A Cabral website and I'd like to understand if my operation needs a system, automation or integration.",
        waAquisicao: "Hi, I found you through the L A Cabral website and I'd like to understand how to organize the journey between the first contact and the sales team.",
      },
    },

    // Botão de WhatsApp da tela de resultado do diagnóstico.
    diagnosticResult: {
      pt: {
        standard: 'Olá, acabei de fazer o diagnóstico da L A Cabral e quero conversar sobre o resultado.',
        guarded: 'Olá, fiz o diagnóstico da L A Cabral e quero entender melhor o resultado antes de decidir qualquer coisa.',
      },
      en: {
        standard: "Hi, I just completed L A Cabral's diagnostic and would like to talk about my results.",
        guarded: "Hi, I completed L A Cabral's diagnostic and would like to understand my results better before deciding anything.",
      },
    },
  };

  function pickLang(lang) { return lang === 'en' ? 'en' : 'pt'; }

  function waBase() { return 'https://wa.me/' + CONFIG.whatsapp.e164; }

  function waHref(key, lang) {
    var msg = CONFIG.messages[pickLang(lang)][key];
    return msg === undefined ? waBase() : waBase() + '?text=' + encodeURIComponent(msg);
  }

  function diagnosticWaHref(lang, guarded) {
    var set = CONFIG.diagnosticResult[pickLang(lang)];
    return waBase() + '?text=' + encodeURIComponent(guarded ? set.guarded : set.standard);
  }

  // Reaplica a configuração aos elementos marcados com data-contact
  // (whatsapp sem mensagem, phone, email). Idempotente.
  function applyContactLinks(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-contact]').forEach(function (el) {
      var kind = el.getAttribute('data-contact');
      if (kind === 'whatsapp') {
        el.setAttribute('href', waBase());
      } else if (kind === 'phone') {
        el.setAttribute('href', 'tel:' + CONFIG.phone.href);
        el.textContent = CONFIG.phone.display;
      } else if (kind === 'email') {
        el.setAttribute('href', 'mailto:' + CONFIG.email.address);
        el.textContent = CONFIG.email.address;
      }
    });
  }

  window.LAC_CONTACT = {
    config: CONFIG,
    waHref: waHref,
    diagnosticWaHref: diagnosticWaHref,
    applyContactLinks: applyContactLinks,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyContactLinks(document); });
  } else {
    applyContactLinks(document);
  }
})();
