/* PostHog — bootstrap global (Checkpoint 10.0A).
 *
 * Camada de comportamento/CRO (Web Analytics, Product Analytics, Session Replay).
 * O Funnel Core continua sendo a fonte de verdade de negócio.
 *
 * Regras:
 *  - visitantes anônimos: NUNCA chamar posthog.identify() (person_profiles: identified_only);
 *  - nenhum dado do diagnóstico (nome, e-mail, telefone, IDs do Core, score…) sai daqui;
 *  - o Project Token é público/frontend por natureza;
 *  - best-effort: se o PostHog falhar ou for bloqueado, o site segue normalmente;
 *  - não inicializa em desenvolvimento local (localhost, 127.0.0.1, ::1, file:) para
 *    não poluir o projeto real; Preview Vercel e Production continuam capturando.
 *
 * Carregado no <head> de todas as páginas públicas, antes dos demais scripts,
 * para que pageview, UTMs e Session Replay iniciem cedo.
 */
(function () {
  try {
    var host = location.hostname;
    if (location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1') return;

    // Snippet oficial do PostHog (HTML / Web JavaScript), sem alterações.
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="gu mu yu bu ku init Qu Zu Wu Vu Yu el Gu ec zu lc uc cc hc dc vc capture getExtension Ju fu mc calculateEventProperties gc register register_once register_for_session unregister unregister_for_session wc Uu yc getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys onActiveMatchingSurveysChanged renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync kc identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset Sc shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty bc rc createPersonProfile setInternalOrTestUser Cu xu opt_in_capturing opt_out_capturing $u has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing nc debug il Os getPageViewId captureTraceFeedback captureTraceMetric Nu".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

    window.posthog.init('phc_nEyRVjJ37Lo6SH97PYKbMVGZjBNQHfQ5h7ww37QButBp', {
      api_host: 'https://us.i.posthog.com',
      defaults: '2026-05-30',
      person_profiles: 'identified_only',
      // Autocapture e pageview ficam no padrão do PostHog.
      session_recording: {
        // Já é o default; explícito para não depender dele. Nome, e-mail e
        // telefone do diagnóstico também levam .ph-no-capture (diagnostico.html).
        maskAllInputs: true,
      },
    });
  } catch (_) { /* best-effort: o site não depende do PostHog */ }
})();
