/* Ambiente de medição — fonte única para "este navegador pode enviar medição real?".
 *
 * PostHog e Google Ads só enviam dados reais no domínio de PRODUÇÃO. Em
 * Preview/branches da Vercel, localhost, file: e em navegadores automatizados
 * (navigator.webdriver) a medição fica desligada, para que testes, revisões e
 * deploys de Preview nunca contaminem as métricas comerciais.
 *
 * Os testes automatizados liberam a lógica com window.__LAC_ALLOW_AUTOMATION__
 * e interceptam a rede (nada real é enviado). Localhost/file: nunca medem.
 *
 * Se este arquivo falhar ao carregar, analytics.js e google-tag.js ficam
 * desligados (falha fechada).
 *
 * Ao adicionar um domínio próprio, inclua-o em PRODUCTION_HOSTS.
 */
(function () {
  'use strict';

  var PRODUCTION_HOSTS = ['lacabral.vercel.app'];

  function isLocal() {
    var h = location.hostname;
    return location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1';
  }

  window.LAC_ENV = {
    isProductionHost: function () { return PRODUCTION_HOSTS.indexOf(location.hostname) > -1; },
    measurementAllowed: function () {
      if (isLocal()) return false;
      if (window.__LAC_ALLOW_AUTOMATION__) return true; // só os testes (rede interceptada)
      if (navigator.webdriver === true) return false;
      return PRODUCTION_HOSTS.indexOf(location.hostname) > -1;
    },
  };
})();
