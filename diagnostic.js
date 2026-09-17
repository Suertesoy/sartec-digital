// ── Diagnóstico L A Cabral — fluxo funcional ───────────────────
// Integra com o Funnel Core exclusivamente via /api/funnel/v1/* (mesmo
// domínio, ponte validada no Checkpoint 9.3A). O Registry é a única
// fonte de verdade para ids/ordem/tipo/opções das perguntas — a copy
// pública (perguntas, opções, resultado) vive só aqui no site.
(() => {
  'use strict';

  const API_BASE = '/api/funnel/v1';
  const DRAFT_KEY = 'lac_diag_draft';
  const DRAFT_VERSION = 1;
  const LANG_KEY = 'sartec_lang'; // mesma chave usada pelo resto do site

  // ── i18n · chrome estático da página (mesmo padrão data-i18n do site) ──
  const DIAG_UI = {
    pt: {
      docTitle: 'Diagnóstico — L A Cabral',
      metaDescription: 'Responda 11 perguntas sobre sua operação e receba uma orientação inicial sobre onde vale mais a pena organizar primeiro.',

      loadingText: 'Carregando diagnóstico…',

      fatalTitle: 'Não foi possível carregar o diagnóstico agora.',
      fatalMessage: 'Isso pode ser uma instabilidade momentânea. Tente recarregar a página em alguns instantes ou fale com a gente diretamente.',
      fatalConfigMessage: 'Estamos com um problema de configuração neste diagnóstico. Já fomos avisados — tente novamente mais tarde ou fale com a gente diretamente.',
      fatalRetry: 'Tentar novamente',
      fatalHome: 'Voltar para a Home',
      fatalWhatsapp: 'Falar no WhatsApp',

      introTag: 'Diagnóstico rápido',
      introTitle: 'Entenda onde sua operação está perdendo tempo, vendas ou clareza.',
      introBody: 'Em poucos minutos, respondendo algumas perguntas sobre como sua empresa atende, vende e se organiza hoje, você recebe uma orientação inicial sobre qual área merece atenção primeiro.',
      introPoint1: 'Entender onde a operação está perdendo eficiência',
      introPoint2: 'Responder algumas perguntas objetivas sobre o dia a dia do negócio',
      introPoint3: 'Receber uma orientação sobre por onde começar',
      introNote: 'Não é um teste com nota nem um resultado definitivo — é um ponto de partida para a conversa.',
      startBtn: 'Começar diagnóstico',

      progressLabel: 'Pergunta {current} de {total}',
      backBtn: '← Voltar',
      nextBtn: 'Continuar',
      selectAtLeastOne: 'Selecione ao menos uma opção para continuar.',

      identityTag: 'Quase lá',
      identityTitle: 'Para onde enviamos sua orientação?',
      identityBody: 'Só precisamos de alguns dados para te mostrar o resultado e, se fizer sentido, continuar a conversa.',
      nameLabel: 'Nome',
      emailLabel: 'Email',
      whatsappLabel: 'WhatsApp',
      whatsappHint: 'Com DDD. Ex.: (11) 91234-5678',
      companyLabel: 'Empresa (opcional)',
      identityBackBtn: '← Voltar às perguntas',
      submitBtn: 'Ver meu resultado',
      submittingBtn: 'Enviando…',

      errNameRequired: 'Digite seu nome.',
      errEmailRequired: 'Digite um email.',
      errEmailInvalid: 'Digite um email válido.',
      errWhatsappRequired: 'Digite seu WhatsApp.',
      errWhatsappInvalid: 'Digite um WhatsApp válido, com DDD.',

      errValidation: 'Não conseguimos confirmar seus dados. Revise os campos e tente novamente.',
      errNetwork: 'Não conseguimos enviar agora — verifique sua conexão e tente novamente.',
      errServer: 'Algo deu errado do nosso lado. Você pode tentar novamente.',
      errRetryBtn: 'Tentar novamente',
      errVersionMismatch: 'Atualizamos este diagnóstico enquanto você respondia. Vamos recomeçar com a versão mais recente — suas respostas anteriores não serão usadas.',
      errVersionMismatchBtn: 'Recomeçar diagnóstico',
      errConflict: 'Essa tentativa já foi registrada com outras respostas. Vamos reiniciar o diagnóstico de forma segura.',
      errConflictBtn: 'Reiniciar diagnóstico',

      resultTag: 'Resultado',
      resultNextLabel: 'O que faz sentido agora',
      resultWaBtn: 'Conversar sobre isso no WhatsApp',
      resultHomeBtn: 'Voltar para a Home',

      footerText: 'L A CABRAL LTDA · Diagnóstico gratuito, sem compromisso.',
    },
    en: {
      docTitle: 'Diagnostic — L A Cabral',
      metaDescription: 'Answer 11 questions about your operation and get an initial pointer on where it is worth organizing first.',

      loadingText: 'Loading diagnostic…',

      fatalTitle: "We couldn't load the diagnostic right now.",
      fatalMessage: 'This might be a temporary issue. Try reloading the page in a moment, or talk to us directly.',
      fatalConfigMessage: "We're having a configuration issue with this diagnostic. We've already been notified — try again later or talk to us directly.",
      fatalRetry: 'Try again',
      fatalHome: 'Back to Home',
      fatalWhatsapp: 'Talk on WhatsApp',

      introTag: 'Quick diagnostic',
      introTitle: 'Understand where your operation is losing time, sales or clarity.',
      introBody: "In a few minutes, by answering some questions about how your company serves, sells and organizes itself today, you'll get an initial pointer on which area deserves attention first.",
      introPoint1: 'Understand where the operation is losing efficiency',
      introPoint2: 'Answer a few objective questions about the day-to-day of the business',
      introPoint3: 'Get a pointer on where to start',
      introNote: "It's not a graded test or a definitive result — it's a starting point for the conversation.",
      startBtn: 'Start diagnostic',

      progressLabel: 'Question {current} of {total}',
      backBtn: '← Back',
      nextBtn: 'Continue',
      selectAtLeastOne: 'Select at least one option to continue.',

      identityTag: 'Almost there',
      identityTitle: 'Where should we send your pointer?',
      identityBody: "We just need a few details to show you the result and, if it makes sense, continue the conversation.",
      nameLabel: 'Name',
      emailLabel: 'Email',
      whatsappLabel: 'WhatsApp',
      whatsappHint: 'With area code. E.g.: (11) 91234-5678',
      companyLabel: 'Company (optional)',
      identityBackBtn: '← Back to the questions',
      submitBtn: 'See my result',
      submittingBtn: 'Sending…',

      errNameRequired: 'Enter your name.',
      errEmailRequired: 'Enter an email.',
      errEmailInvalid: 'Enter a valid email.',
      errWhatsappRequired: 'Enter your WhatsApp number.',
      errWhatsappInvalid: 'Enter a valid WhatsApp number, with area code.',

      errValidation: "We couldn't confirm your details. Please review the fields and try again.",
      errNetwork: "We couldn't send this right now — check your connection and try again.",
      errServer: 'Something went wrong on our end. You can try again.',
      errRetryBtn: 'Try again',
      errVersionMismatch: 'We updated this diagnostic while you were answering. Let\'s restart with the latest version — your previous answers will not be used.',
      errVersionMismatchBtn: 'Restart diagnostic',
      errConflict: 'This attempt was already registered with different answers. Let\'s restart the diagnostic safely.',
      errConflictBtn: 'Restart diagnostic',

      resultTag: 'Result',
      resultNextLabel: 'What makes sense now',
      resultWaBtn: 'Talk about this on WhatsApp',
      resultHomeBtn: 'Back to Home',

      footerText: 'L A CABRAL LTDA · Free diagnostic, no commitment.',
    },
  };

  // ── i18n · copy das 11 perguntas (Registry é fonte de ids/ordem/tipo;
  // a copy pública vive aqui) ─────────────────────────────────────────
  const QUESTION_COPY = {
    acquisition_sources: {
      pt: { title: 'Hoje, de onde vêm os novos contatos e oportunidades do seu negócio?', help: 'Selecione todas as opções que se aplicam.' },
      en: { title: 'Today, where do new contacts and opportunities for your business come from?', help: 'Select all that apply.' },
    },
    presence_representation: {
      pt: { title: 'Sua presença digital (site, redes, catálogo) representa bem o negócio hoje?', help: '' },
      en: { title: 'Does your digital presence (site, social media, catalog) represent your business well today?', help: '' },
    },
    contact_entry_process: {
      pt: { title: 'Quando alguém entra em contato, como esse atendimento é organizado?', help: '' },
      en: { title: 'When someone reaches out, how is that first contact handled?', help: '' },
    },
    response_time: {
      pt: { title: 'Em geral, quanto tempo leva até o primeiro retorno para um novo contato?', help: '' },
      en: { title: 'In general, how long does it take to get back to a new contact?', help: '' },
    },
    followup_process: {
      pt: { title: 'Como funciona o acompanhamento de quem já demonstrou interesse, mas ainda não fechou?', help: '' },
      en: { title: 'How do you follow up with people who showed interest but haven\'t closed yet?', help: '' },
    },
    pipeline_visibility: {
      pt: { title: 'Quanta visibilidade você tem sobre as oportunidades em andamento?', help: '' },
      en: { title: 'How much visibility do you have over opportunities currently in progress?', help: '' },
    },
    operational_symptoms: {
      pt: { title: 'Quais destes sintomas aparecem na sua operação no dia a dia?', help: 'Selecione todas as opções que se aplicam.' },
      en: { title: 'Which of these symptoms show up in your day-to-day operation?', help: 'Select all that apply.' },
    },
    perceived_problem: {
      pt: { title: 'Se você tivesse que apontar UM problema principal hoje, qual seria?', help: '' },
      en: { title: 'If you had to point to ONE main problem today, what would it be?', help: '' },
    },
    monthly_leads: {
      pt: { title: 'Aproximadamente quantos novos contatos/oportunidades chegam por mês?', help: '' },
      en: { title: 'Roughly how many new contacts/opportunities come in per month?', help: '' },
    },
    timing: {
      pt: { title: 'Se a resposta fizer sentido, qual seria o momento para agir?', help: '' },
      en: { title: 'If the answer makes sense, when would be the right moment to act?', help: '' },
    },
    authority: {
      pt: { title: 'Qual é o seu papel numa decisão como essa?', help: '' },
      en: { title: 'What is your role in a decision like this?', help: '' },
    },
  };

  const OPTION_COPY = {
    acquisition_sources: {
      referral: { pt: 'Indicação', en: 'Referral' },
      google_search: { pt: 'Busca no Google', en: 'Google search' },
      social_media: { pt: 'Redes sociais', en: 'Social media' },
      paid_ads: { pt: 'Anúncios pagos', en: 'Paid ads' },
      outbound_prospecting: { pt: 'Prospecção ativa', en: 'Outbound prospecting' },
      partners: { pt: 'Parceiros', en: 'Partners' },
      other: { pt: 'Outra fonte', en: 'Other source' },
      no_clear_or_consistent_source: { pt: 'Não há uma fonte clara ou constante', en: 'No clear or consistent source' },
    },
    presence_representation: {
      represents_well_and_facilitates_contact: { pt: 'Representa bem e facilita o contato', en: 'Represents it well and makes contact easy' },
      works_but_could_represent_better: { pt: 'Funciona, mas poderia representar melhor', en: 'It works, but could represent us better' },
      outdated_or_limited: { pt: 'Está desatualizada ou limitada', en: 'It\'s outdated or limited' },
      no_structured_digital_presence: { pt: 'Não temos uma presença digital estruturada', en: 'We don\'t have a structured digital presence' },
      unsure: { pt: 'Não sei dizer', en: 'Not sure' },
    },
    contact_entry_process: {
      organized_channel_with_owner: { pt: 'Canal organizado, com responsável definido', en: 'Organized channel, with a clear owner' },
      whatsapp_manual_distribution: { pt: 'WhatsApp com distribuição manual', en: 'WhatsApp with manual distribution' },
      multiple_channels: { pt: 'Vários canais ao mesmo tempo', en: 'Multiple channels at the same time' },
      direct_to_specific_person: { pt: 'Vai direto para uma pessoa específica', en: 'Goes straight to a specific person' },
      depends_on_day_or_recipient: { pt: 'Depende do dia ou de quem recebe', en: 'Depends on the day or who receives it' },
      no_defined_process: { pt: 'Não há um processo definido', en: 'There is no defined process' },
    },
    response_time: {
      almost_immediate: { pt: 'Quase imediato', en: 'Almost immediate' },
      within_30_minutes: { pt: 'Em até 30 minutos', en: 'Within 30 minutes' },
      between_30_minutes_and_2_hours: { pt: 'Entre 30 minutos e 2 horas', en: 'Between 30 minutes and 2 hours' },
      within_few_hours: { pt: 'Em algumas horas', en: 'Within a few hours' },
      sometimes_next_day: { pt: 'Às vezes só no dia seguinte', en: 'Sometimes only the next day' },
      not_tracked: { pt: 'Não acompanhamos esse tempo', en: 'We don\'t track this' },
    },
    followup_process: {
      defined_followup_process: { pt: 'Processo de acompanhamento definido', en: 'Defined follow-up process' },
      person_dependent_followup: { pt: 'Depende da pessoa responsável', en: 'Depends on the person in charge' },
      followup_when_remembered_or_time_available: { pt: 'Acontece quando alguém lembra ou tem tempo', en: 'Happens when someone remembers or has time' },
      conversation_usually_stalls: { pt: 'A conversa geralmente esfria', en: 'The conversation usually stalls' },
      cannot_identify_contacts_needing_followup: { pt: 'Não conseguimos identificar quem precisa de retorno', en: 'We can\'t identify who needs follow-up' },
    },
    pipeline_visibility: {
      clear_pipeline_visibility: { pt: 'Visibilidade clara de tudo em andamento', en: 'Clear visibility of everything in progress' },
      spreadsheet_or_manual_control: { pt: 'Controle manual ou por planilha', en: 'Manual or spreadsheet-based control' },
      approximate_visibility: { pt: 'Visibilidade aproximada', en: 'Approximate visibility' },
      scattered_across_people_or_tools: { pt: 'Espalhado entre pessoas ou ferramentas', en: 'Scattered across people or tools' },
      no_clear_visibility: { pt: 'Sem visibilidade clara', en: 'No clear visibility' },
    },
    operational_symptoms: {
      repetitive_admin_tasks: { pt: 'Tarefas administrativas repetitivas', en: 'Repetitive administrative tasks' },
      manual_information_copying: { pt: 'Cópia manual de informação entre sistemas', en: 'Manually copying information between systems' },
      parallel_spreadsheets: { pt: 'Planilhas paralelas fazendo papel de sistema', en: 'Parallel spreadsheets acting as a system' },
      whatsapp_important_to_operation: { pt: 'WhatsApp é parte importante da operação', en: 'WhatsApp is an important part of the operation' },
      disconnected_tools: { pt: 'Ferramentas que não conversam entre si', en: 'Tools that don\'t talk to each other' },
      person_dependent_processes: { pt: 'Processos que dependem de pessoas específicas', en: 'Processes that depend on specific people' },
      difficulty_tracking_indicators: { pt: 'Dificuldade em acompanhar indicadores', en: 'Difficulty tracking indicators' },
      rework_due_to_missing_context: { pt: 'Retrabalho por falta de contexto', en: 'Rework due to missing context' },
      none_relevant: { pt: 'Nenhum desses é relevante', en: 'None of these are relevant' },
    },
    perceived_problem: {
      insufficient_opportunities: { pt: 'Poucas oportunidades chegando', en: 'Not enough opportunities coming in' },
      presence_underrepresents_business: { pt: 'Nossa presença não representa o negócio', en: 'Our presence undersells the business' },
      contact_handling_needs_organization: { pt: 'O atendimento ao contato precisa de organização', en: 'Contact handling needs organizing' },
      opportunities_get_lost: { pt: 'Oportunidades se perdem pelo caminho', en: 'Opportunities get lost along the way' },
      internal_processes_consume_too_much_time: { pt: 'Processos internos consomem tempo demais', en: 'Internal processes take up too much time' },
      lack_of_visibility: { pt: 'Falta de visibilidade sobre a operação', en: 'Lack of visibility over the operation' },
      unsure_primary_problem: { pt: 'Não sei dizer qual é o problema principal', en: 'Not sure what the main problem is' },
    },
    monthly_leads: {
      up_to_10: { pt: 'Até 10', en: 'Up to 10' },
      '11_to_30': { pt: 'De 11 a 30', en: '11 to 30' },
      '31_to_100': { pt: 'De 31 a 100', en: '31 to 100' },
      '101_to_300': { pt: 'De 101 a 300', en: '101 to 300' },
      over_300: { pt: 'Mais de 300', en: 'Over 300' },
      unknown: { pt: 'Não sei dizer', en: 'Not sure' },
    },
    timing: {
      now: { pt: 'Agora', en: 'Now' },
      next_weeks: { pt: 'Nas próximas semanas', en: 'In the coming weeks' },
      one_to_three_months: { pt: 'Entre 1 e 3 meses', en: 'Between 1 and 3 months' },
      later: { pt: 'Mais adiante', en: 'Later on' },
      exploring: { pt: 'Ainda estou só explorando', en: 'Just exploring for now' },
    },
    authority: {
      sole_decider: { pt: 'Decido sozinho(a)', en: 'I decide on my own' },
      co_decider: { pt: 'Decido junto com outra pessoa', en: 'I decide together with someone else' },
      influencer: { pt: 'Eu influencio a decisão, mas não decido sozinho(a)', en: 'I influence the decision, but don\'t decide alone' },
      researching_for_someone: { pt: 'Estou pesquisando para outra pessoa decidir', en: 'I\'m researching for someone else to decide' },
      exploring: { pt: 'Ainda estou só explorando', en: 'Just exploring for now' },
    },
  };

  // ── i18n · tradução humana dos 9 caminhos de recomendação ──────────
  const RESULT_COPY = {
    presence_foundation: {
      pt: { label: 'Presença digital', body: 'O principal ponto de atenção parece estar na base: sua presença digital hoje não está representando o negócio do jeito que ele já opera. Antes de investir em atrair mais contatos, vale fortalecer essa porta de entrada.', next: 'Faz sentido revisar site, catálogo ou redes para que a primeira impressão condiga com o que a empresa realmente entrega.' },
      en: { label: 'Digital presence', body: 'The main point of attention seems to be the foundation: your digital presence today isn\'t representing the business the way it already operates. Before investing in attracting more contacts, it\'s worth strengthening this entry point.', next: 'It makes sense to review your site, catalog or social presence so the first impression matches what the business actually delivers.' },
    },
    acquisition_structure: {
      pt: { label: 'Estrutura de aquisição', body: 'O ponto de atenção está em como novas oportunidades chegam até você. Hoje isso parece pouco estruturado ou dependente de poucas fontes, o que deixa a operação mais vulnerável.', next: 'Vale organizar e diversificar os canais de entrada, para que novas oportunidades cheguem de forma mais previsível.' },
      en: { label: 'Acquisition structure', body: 'The point of attention is how new opportunities reach you. Today this seems under-structured or dependent on very few sources, which makes the operation more vulnerable.', next: 'It\'s worth organizing and diversifying the entry channels, so new opportunities arrive more predictably.' },
    },
    service_organization: {
      pt: { label: 'Organização do atendimento', body: 'O principal ponto de atenção está em como o primeiro contato é recebido e distribuído. Hoje isso parece pouco organizado, o que custa tempo e pode custar oportunidades.', next: 'Vale desenhar um processo mais claro de entrada e distribuição de contatos, com responsáveis definidos.' },
      en: { label: 'Service organization', body: 'The main point of attention is how the first contact is received and routed. Today this seems poorly organized, which costs time and can cost opportunities.', next: 'It\'s worth designing a clearer process for receiving and routing contacts, with clear ownership.' },
    },
    conversion_process: {
      pt: { label: 'Processo de conversão', body: 'O ponto de atenção está entre o primeiro contato e o fechamento: o acompanhamento de quem já demonstrou interesse parece inconsistente, e isso tende a custar oportunidades já conquistadas.', next: 'Vale estruturar um processo de acompanhamento mais consistente, para que menos oportunidades esfriem pelo caminho.' },
      en: { label: 'Conversion process', body: 'The point of attention is between the first contact and closing: following up with people who already showed interest seems inconsistent, which tends to cost opportunities you\'ve already earned.', next: 'It\'s worth structuring a more consistent follow-up process, so fewer opportunities go cold along the way.' },
    },
    operational_efficiency: {
      pt: { label: 'Eficiência operacional', body: 'O principal ponto de atenção está na operação por trás do atendimento: tarefas repetitivas, retrabalho e ferramentas desconectadas parecem estar consumindo tempo que poderia ir para o que importa.', next: 'Vale mapear esses processos e entender onde organização, integração ou automação simplificariam o dia a dia da equipe.' },
      en: { label: 'Operational efficiency', body: 'The main point of attention is the operation behind the service: repetitive tasks, rework and disconnected tools seem to be consuming time that could go toward what matters.', next: 'It\'s worth mapping these processes and understanding where organization, integration or automation would simplify the team\'s day-to-day.' },
    },
    commercial_flow: {
      pt: { label: 'Fluxo comercial', body: 'O ponto de atenção está no fluxo completo, do primeiro contato até a decisão: existe volume e potencial reais, mas a jornada entre essas pontas ainda não está bem costurada.', next: 'Vale desenhar esse fluxo de ponta a ponta, conectando atendimento, acompanhamento e visibilidade do que está em andamento.' },
      en: { label: 'Commercial flow', body: 'The point of attention is the full flow, from first contact to decision: there is real volume and potential, but the journey between those points isn\'t well connected yet.', next: 'It\'s worth designing this flow end to end, connecting service, follow-up and visibility over what\'s in progress.' },
    },
    commercial_operations: {
      pt: { label: 'Operação comercial', body: 'O principal ponto de atenção está na operação comercial como um todo: a base já parece sólida, mas os processos que sustentam vendas e atendimento ainda têm espaço para ganhar estrutura.', next: 'Vale organizar essa operação de forma mais conectada, para sustentar o volume que já existe com menos esforço manual.' },
      en: { label: 'Commercial operations', body: 'The main point of attention is the commercial operation as a whole: the foundation already looks solid, but the processes that support sales and service still have room to gain structure.', next: 'It\'s worth organizing this operation in a more connected way, to sustain the volume that already exists with less manual effort.' },
    },
    service_operations: {
      pt: { label: 'Operação de atendimento', body: 'O ponto de atenção está na operação de atendimento: o volume de contato já é relevante, mas os processos que sustentam esse atendimento ainda dependem bastante de esforço manual.', next: 'Vale organizar e, onde fizer sentido, automatizar partes desse atendimento para sustentar o volume com mais consistência.' },
      en: { label: 'Service operations', body: 'The point of attention is the service operation: contact volume is already meaningful, but the processes that support this service still rely heavily on manual effort.', next: 'It\'s worth organizing and, where it makes sense, automating parts of this service to sustain the volume more consistently.' },
    },
    optimization: {
      pt: { label: 'Otimização', body: 'Sua operação já parece relativamente organizada. O ponto de atenção aqui é mais fino: pequenos ajustes têm potencial de destravar ganhos de eficiência, sem exigir uma reestruturação grande.', next: 'Vale uma conversa para identificar esses ajustes pontuais e priorizar o que traria o ganho mais rápido.' },
      en: { label: 'Optimization', body: 'Your operation already looks relatively organized. The point of attention here is finer-grained: small adjustments have the potential to unlock efficiency gains, without requiring a large restructuring.', next: 'It\'s worth a conversation to identify these specific adjustments and prioritize whichever brings the fastest gain.' },
    },
  };

  // ── estado ───────────────────────────────────────────────────────
  let lang = 'pt';
  let registry = null;
  let draft = null; // { draftVersion, questionnaireVersion, submissionId, currentStep, answers }
  let lastSubmitPayload = null;
  let submitting = false;
  let fatalIsConfigError = false;

  // ── DOM refs ─────────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const panels = {};

  // ── utilidades ───────────────────────────────────────────────────
  function t(key, vars) {
    const dict = DIAG_UI[lang] || DIAG_UI.pt;
    let str = dict[key] !== undefined ? dict[key] : (DIAG_UI.pt[key] || key);
    if (vars) {
      Object.keys(vars).forEach((k) => { str = str.replace(`{${k}}`, vars[k]); });
    }
    return str;
  }

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    // Fallback simples (ambientes sem crypto.randomUUID) — só usado como
    // último recurso; não é usado para nada sensível a colisão criptográfica.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function applyTranslations() {
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en-US' : 'pt-BR');
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (DIAG_UI[lang] && DIAG_UI[lang][key] !== undefined) el.textContent = DIAG_UI[lang][key];
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.getAttribute('data-i18n-attr').split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key && DIAG_UI[lang] && DIAG_UI[lang][key] !== undefined) el.setAttribute(attr, DIAG_UI[lang][key]);
      });
    });
    const btnPt = $('langBtnPt');
    const btnEn = $('langBtnEn');
    if (btnPt && btnEn) {
      const isEn = lang === 'en';
      btnPt.classList.toggle('is-active', !isEn);
      btnEn.classList.toggle('is-active', isEn);
      btnPt.setAttribute('aria-pressed', String(!isEn));
      btnEn.setAttribute('aria-pressed', String(isEn));
    }
  }

  function setLang(newLang) {
    lang = newLang === 'en' ? 'en' : 'pt';
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* privacidade/quota do navegador — segue sem persistir */ }
    applyTranslations();
    rerenderCurrentStep();
  }

  // ── sessionStorage draft ─────────────────────────────────────────
  function loadDraftFromStorage() {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      if (parsed.draftVersion !== DRAFT_VERSION) return null;
      if (typeof parsed.submissionId !== 'string' || !parsed.submissionId) return null;
      if (typeof parsed.questionnaireVersion !== 'string') return null;
      if (typeof parsed.answers !== 'object' || parsed.answers === null) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function persistDraft() {
    if (!draft) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        draftVersion: draft.draftVersion,
        questionnaireVersion: draft.questionnaireVersion,
        submissionId: draft.submissionId,
        currentStep: draft.currentStep,
        answers: draft.answers,
      }));
    } catch (_) { /* sessionStorage indisponível (privado/cota) — a tentativa em memória segue funcionando */ }
  }

  function clearDraftStorage() {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch (_) { /* no-op */ }
  }

  function newDraft() {
    return {
      draftVersion: DRAFT_VERSION,
      questionnaireVersion: registry.questionnaireVersion,
      submissionId: uuid(),
      currentStep: 'intro',
      answers: {},
    };
  }

  // ── rede ─────────────────────────────────────────────────────────
  async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
    return res.json();
  }

  async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    let json = null;
    try { json = await res.json(); } catch (_) { /* corpo vazio/ inválido */ }
    return { ok: res.ok, status: res.status, json };
  }

  function sendEvent(eventType, extra) {
    // Best-effort: nunca bloqueia nem interrompe a experiência.
    if (!draft) return;
    const body = Object.assign({ eventType, eventId: uuid(), submissionId: draft.submissionId }, extra || {});
    try {
      fetch(`${API_BASE}/events`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    } catch (_) { /* no-op */ }
  }

  // ── validação de cobertura do Registry contra a copy do site ──────
  function validateRegistryCoverage(reg) {
    for (const q of reg.questions) {
      if (!QUESTION_COPY[q.id]) return false;
      if (!OPTION_COPY[q.id]) return false;
      for (const opt of q.options) {
        if (!OPTION_COPY[q.id][opt.id]) return false;
      }
    }
    return true;
  }

  // ── painéis ──────────────────────────────────────────────────────
  function showPanel(name) {
    Object.keys(panels).forEach((key) => {
      if (panels[key]) panels[key].hidden = key !== name;
    });
  }

  function focusHeading(el) {
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    // rAF: garante que o elemento já está visível (hidden removido) antes do foco.
    requestAnimationFrame(() => el.focus());
  }

  // ── intro ────────────────────────────────────────────────────────
  function renderIntro() {
    showPanel('intro');
    focusHeading($('diagIntroTitle'));
  }

  function startDiagnostic() {
    draft.currentStep = 0;
    persistDraft();
    sendEvent('diagnostic_started');
    renderQuestion(0);
  }

  // ── perguntas ────────────────────────────────────────────────────
  function currentAnswer(qid) {
    return draft.answers[qid];
  }

  function isMultiSelect(question) {
    return question.answerType === 'multi_select';
  }

  function isAnswered(question) {
    const val = currentAnswer(question.id);
    if (isMultiSelect(question)) return Array.isArray(val) && val.length > 0;
    return typeof val === 'string' && val.length > 0;
  }

  function toggleOption(question, optionId) {
    const opt = question.options.find((o) => o.id === optionId);
    const exclusive = !!(opt && opt.exclusive);

    if (!isMultiSelect(question)) {
      draft.answers[question.id] = optionId;
      persistDraft();
      syncOptionsState(question);
      updateNextEnabled(question);
      return;
    }

    const current = Array.isArray(draft.answers[question.id]) ? draft.answers[question.id].slice() : [];
    const idx = current.indexOf(optionId);

    if (exclusive) {
      // Selecionar uma opção exclusiva desmarca todas as outras.
      draft.answers[question.id] = idx === -1 ? [optionId] : [];
    } else if (idx !== -1) {
      current.splice(idx, 1);
      draft.answers[question.id] = current;
    } else {
      // Selecionar uma opção normal sempre desmarca qualquer exclusiva
      // já marcada — regra genérica, não amarrada a nenhum id fixo.
      const withoutExclusive = current.filter((id) => {
        const o = question.options.find((qo) => qo.id === id);
        return !(o && o.exclusive);
      });
      withoutExclusive.push(optionId);
      draft.answers[question.id] = withoutExclusive;
    }

    persistDraft();
    syncOptionsState(question);
    updateNextEnabled(question);
  }

  // Constrói o DOM das opções uma vez por pergunta (chamado só por
  // renderQuestion). Alternar uma opção nunca recria esses nós — só
  // troca .checked/.is-selected — para não derrubar o foco do teclado.
  function buildOptions(question) {
    const container = $('diagOptions');
    container.innerHTML = '';
    const multi = isMultiSelect(question);

    question.options.forEach((opt) => {
      const copy = OPTION_COPY[question.id][opt.id][lang] || OPTION_COPY[question.id][opt.id].pt;
      const inputId = `diagOpt_${question.id}_${opt.id}`;
      const wrap = document.createElement('label');
      wrap.className = 'diag-option';
      wrap.setAttribute('for', inputId);

      const input = document.createElement('input');
      input.type = multi ? 'checkbox' : 'radio';
      input.id = inputId;
      input.name = `diag_${question.id}`;
      input.value = opt.id;
      input.className = 'diag-option__input';
      input.addEventListener('change', () => toggleOption(question, opt.id));

      const box = document.createElement('span');
      box.className = 'diag-option__box';
      box.setAttribute('aria-hidden', 'true');

      const text = document.createElement('span');
      text.className = 'diag-option__text';
      text.textContent = copy;

      wrap.appendChild(input);
      wrap.appendChild(box);
      wrap.appendChild(text);
      container.appendChild(wrap);
    });

    syncOptionsState(question);
  }

  // Só atualiza checked/is-selected nos nós já existentes.
  function syncOptionsState(question) {
    const multi = isMultiSelect(question);
    const answer = currentAnswer(question.id);
    const selectedSet = multi ? new Set(Array.isArray(answer) ? answer : []) : null;

    question.options.forEach((opt) => {
      const input = $(`diagOpt_${question.id}_${opt.id}`);
      if (!input) return;
      const checked = multi ? selectedSet.has(opt.id) : answer === opt.id;
      input.checked = checked;
      input.closest('.diag-option').classList.toggle('is-selected', checked);
    });
  }

  // Só atualiza o texto visível de cada opção (troca de idioma) — nunca
  // recria os nós, para não perder foco/estado.
  function updateOptionsCopy(question) {
    question.options.forEach((opt) => {
      const input = $(`diagOpt_${question.id}_${opt.id}`);
      if (!input) return;
      const textEl = input.closest('.diag-option').querySelector('.diag-option__text');
      const copy = OPTION_COPY[question.id][opt.id][lang] || OPTION_COPY[question.id][opt.id].pt;
      textEl.textContent = copy;
    });
  }

  function updateNextEnabled(question) {
    const btn = $('diagNextBtn');
    const hint = $('diagOptionsHint');
    const ok = isAnswered(question);
    btn.disabled = !ok;
    if (hint) hint.hidden = ok;
  }

  function renderQuestion(index) {
    const question = registry.questions[index];
    draft.currentStep = index;
    persistDraft();

    const copy = QUESTION_COPY[question.id][lang] || QUESTION_COPY[question.id].pt;
    $('diagQuestionTitle').textContent = copy.title;
    $('diagQuestionHelp').textContent = copy.help || '';
    $('diagQuestionHelp').hidden = !copy.help;

    const total = registry.questions.length;
    $('diagProgressLabel').textContent = t('progressLabel', { current: index + 1, total });
    $('diagProgressFill').style.width = `${((index + 1) / total) * 100}%`;
    $('diagProgressBar').setAttribute('aria-valuenow', String(index + 1));
    $('diagProgressBar').setAttribute('aria-valuemin', '1');
    $('diagProgressBar').setAttribute('aria-valuemax', String(total));

    $('diagBackBtn').hidden = index === 0;

    buildOptions(question);
    updateNextEnabled(question);

    showPanel('question');
    focusHeading($('diagQuestionTitle'));
    sendEvent('question_viewed', { questionId: question.id });
  }

  function goNext() {
    const index = draft.currentStep;
    const question = registry.questions[index];
    if (!isAnswered(question)) return;
    sendEvent('question_answered', { questionId: question.id });

    if (index + 1 < registry.questions.length) {
      renderQuestion(index + 1);
    } else {
      renderIdentity();
    }
  }

  function goBack() {
    const index = draft.currentStep;
    if (typeof index !== 'number') return;
    if (index === 0) {
      draft.currentStep = 'intro';
      persistDraft();
      renderIntro();
      return;
    }
    renderQuestion(index - 1);
  }

  // ── identity ─────────────────────────────────────────────────────
  function renderIdentity() {
    draft.currentStep = 'identity';
    persistDraft();
    hideSubmitError();
    showPanel('identity');
    focusHeading($('diagIdentityTitle'));
    sendEvent('identity_viewed');
  }

  function fieldError(inputId, errorId, message) {
    const input = $(inputId);
    const err = $(errorId);
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      err.textContent = message;
      err.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      err.textContent = '';
      err.hidden = true;
    }
  }

  function validateIdentityForm() {
    const name = $('diagName').value.trim();
    const email = $('diagEmail').value.trim();
    const whatsapp = $('diagWhatsapp').value.trim();

    let ok = true;

    if (!name) { fieldError('diagName', 'diagNameError', t('errNameRequired')); ok = false; }
    else fieldError('diagName', 'diagNameError', null);

    if (!email) { fieldError('diagEmail', 'diagEmailError', t('errEmailRequired')); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fieldError('diagEmail', 'diagEmailError', t('errEmailInvalid')); ok = false; }
    else fieldError('diagEmail', 'diagEmailError', null);

    const digits = whatsapp.replace(/\D/g, '');
    if (!whatsapp) { fieldError('diagWhatsapp', 'diagWhatsappError', t('errWhatsappRequired')); ok = false; }
    else if (digits.length < 10 || digits.length > 13) { fieldError('diagWhatsapp', 'diagWhatsappError', t('errWhatsappInvalid')); ok = false; }
    else fieldError('diagWhatsapp', 'diagWhatsappError', null);

    return ok ? { name, email, whatsapp, company: $('diagCompany').value.trim() || undefined } : null;
  }

  function showSubmitError(message, actionLabel, actionFn) {
    $('diagSubmitErrorMessage').textContent = message;
    const btn = $('diagSubmitErrorAction');
    if (actionLabel) {
      btn.textContent = actionLabel;
      btn.hidden = false;
      btn.onclick = actionFn;
    } else {
      btn.hidden = true;
      btn.onclick = null;
    }
    $('diagSubmitError').hidden = false;
  }

  function hideSubmitError() {
    $('diagSubmitError').hidden = true;
  }

  function setSubmitting(isSubmitting) {
    submitting = isSubmitting;
    const btn = $('diagSubmitBtn');
    btn.disabled = isSubmitting;
    btn.textContent = isSubmitting ? t('submittingBtn') : t('submitBtn');
  }

  async function restartWithFreshRegistry() {
    clearDraftStorage();
    showPanel(null);
    $('diagLoading').hidden = false;
    try {
      const fresh = await apiGet('/registry');
      registry = fresh;
      if (!validateRegistryCoverage(registry)) { showFatal(true); return; }
      draft = newDraft();
      persistDraft();
      sendEvent('diagnostic_viewed');
      renderIntro();
    } catch (_) {
      showFatal(false);
    }
  }

  function restartAttempt() {
    // Reinício controlado (conflito de submissão): nova tentativa, mesmo
    // Registry já carregado, sem reconsultar a rede.
    clearDraftStorage();
    draft = newDraft();
    persistDraft();
    hideSubmitError();
    renderQuestion(0);
  }

  async function handleIdentitySubmit(ev) {
    ev.preventDefault();
    if (submitting) return;
    hideSubmitError();

    const fields = validateIdentityForm();
    if (!fields) return;

    setSubmitting(true);

    // Confirma a versão do Registry antes de enviar, conforme o contrato.
    let freshRegistry;
    try {
      freshRegistry = await apiGet('/registry');
    } catch (_) {
      setSubmitting(false);
      showSubmitError(t('errNetwork'), t('errRetryBtn'), () => handleIdentitySubmit(ev));
      return;
    }

    if (freshRegistry.questionnaireVersion !== draft.questionnaireVersion) {
      setSubmitting(false);
      showSubmitError(t('errVersionMismatch'), t('errVersionMismatchBtn'), () => {
        registry = freshRegistry;
        restartWithFreshRegistry();
      });
      return;
    }

    const answers = {};
    registry.questions.forEach((q) => { answers[q.id] = draft.answers[q.id]; });

    lastSubmitPayload = {
      questionnaireVersion: draft.questionnaireVersion,
      submissionId: draft.submissionId,
      name: fields.name,
      email: fields.email,
      whatsapp: fields.whatsapp,
      company: fields.company,
      answers,
    };

    await doSubmit();
  }

  async function doSubmit() {
    setSubmitting(true);
    let result;
    try {
      result = await apiPost('/submit', lastSubmitPayload);
    } catch (_) {
      setSubmitting(false);
      showSubmitError(t('errNetwork'), t('errRetryBtn'), doSubmit);
      return;
    }

    setSubmitting(false);

    if (result.ok) {
      hideSubmitError();
      const { recommendationPath, outcomeMode } = result.json || {};
      // Limpa o draft de respostas — o submissionId segue só em memória,
      // pelo tempo necessário para os eventos da tela de resultado.
      clearDraftStorage();
      renderResult(recommendationPath, outcomeMode);
      return;
    }

    const code = result.json && result.json.error && result.json.error.code;

    if (code === 'questionnaire_version_mismatch') {
      showSubmitError(t('errVersionMismatch'), t('errVersionMismatchBtn'), restartWithFreshRegistry);
      return;
    }
    if (code === 'submission_conflict') {
      showSubmitError(t('errConflict'), t('errConflictBtn'), restartAttempt);
      return;
    }
    if (code === 'validation_error') {
      showSubmitError(t('errValidation'), null, null);
      return;
    }
    if (result.status >= 500) {
      showSubmitError(t('errServer'), t('errRetryBtn'), doSubmit);
      return;
    }
    showSubmitError(t('errServer'), t('errRetryBtn'), doSubmit);
  }

  // ── resultado ────────────────────────────────────────────────────
  let lastResult = null; // { recommendationPath, outcomeMode } — só em memória, nunca persistido

  // Renderização pura, chamada tanto no primeiro exibir quanto ao
  // reaplicar tradução (troca de idioma) — nunca dispara eventos nem
  // reatribui o listener do WhatsApp por addEventListener (evita
  // empilhar handlers a cada re-render).
  function updateResultView() {
    if (!lastResult) return;
    const { recommendationPath, outcomeMode } = lastResult;
    const entry = RESULT_COPY[recommendationPath];
    const copy = entry ? (entry[lang] || entry.pt) : null;
    const guarded = outcomeMode === 'guarded';

    $('diagResultTitle').textContent = copy ? copy.label : (lang === 'en' ? 'Your result is ready' : 'Seu resultado está pronto');
    $('diagResultBody').textContent = copy ? copy.body : (lang === 'en'
      ? 'Thanks for answering — let\'s continue this conversation directly to go over what makes sense for your operation.'
      : 'Obrigado por responder — vamos continuar essa conversa diretamente para entender o que faz mais sentido para sua operação.');
    $('diagResultNext').textContent = copy ? copy.next : '';
    $('diagResultNext').hidden = !copy;

    const waBtn = $('diagResultWaBtn');
    const waMessageStandard = lang === 'en'
      ? "Hi, I just completed L A Cabral's diagnostic and would like to talk about my results."
      : 'Olá, acabei de fazer o diagnóstico da L A Cabral e quero conversar sobre o resultado.';
    const waMessageGuarded = lang === 'en'
      ? "Hi, I completed L A Cabral's diagnostic and would like to understand my results better before deciding anything."
      : 'Olá, fiz o diagnóstico da L A Cabral e quero entender melhor o resultado antes de decidir qualquer coisa.';
    waBtn.href = `https://wa.me/5512997863832?text=${encodeURIComponent(guarded ? waMessageGuarded : waMessageStandard)}`;
    waBtn.classList.toggle('btn--primary', !guarded);
    waBtn.classList.toggle('btn--ghost', guarded);
    waBtn.onclick = () => sendEvent('whatsapp_clicked');
  }

  function renderResult(recommendationPath, outcomeMode) {
    lastResult = { recommendationPath, outcomeMode };
    draft.currentStep = 'result'; // só em memória — o draft de respostas já foi limpo do storage
    updateResultView();
    showPanel('result');
    focusHeading($('diagResultTitle'));
    sendEvent('result_viewed');
  }

  // ── erro fatal (registry indisponível / erro de configuração) ─────
  function showFatal(isConfigError) {
    fatalIsConfigError = isConfigError;
    $('diagFatalMessage').textContent = isConfigError ? t('fatalConfigMessage') : t('fatalMessage');
    showPanel('fatal');
    focusHeading($('diagFatalTitle'));
  }

  // Reaplica só a copy no idioma novo — nunca refaz navegação, nunca
  // reemite eventos (diagnostic_started/identity_viewed/question_viewed/
  // result_viewed já dispararam quando a etapa foi alcançada) e nunca
  // esconde um erro de submissão que esteja visível.
  function rerenderCurrentStep() {
    applyTranslations(); // cobre 100% do texto estático (data-i18n) em qualquer etapa
    if (!registry || !draft) return;

    const step = draft.currentStep;
    if (typeof step === 'number') {
      const question = registry.questions[step];
      const copy = QUESTION_COPY[question.id][lang] || QUESTION_COPY[question.id].pt;
      $('diagQuestionTitle').textContent = copy.title;
      $('diagQuestionHelp').textContent = copy.help || '';
      $('diagQuestionHelp').hidden = !copy.help;
      $('diagProgressLabel').textContent = t('progressLabel', { current: step + 1, total: registry.questions.length });
      updateOptionsCopy(question);
    } else if (step === 'result') {
      updateResultView();
    }
    // 'intro' e 'identity': applyTranslations() já cobre todo o texto delas.
  }

  // ── boot ─────────────────────────────────────────────────────────
  async function init() {
    panels.loading = $('diagLoading');
    panels.fatal = $('diagFatalError');
    panels.intro = $('diagIntro');
    panels.question = $('diagQuestion');
    panels.identity = $('diagIdentity');
    panels.result = $('diagResult');

    try {
      const saved = localStorage.getItem(LANG_KEY);
      lang = saved === 'en' ? 'en' : 'pt';
    } catch (_) { lang = 'pt'; }

    $('langBtnPt').addEventListener('click', () => setLang('pt'));
    $('langBtnEn').addEventListener('click', () => setLang('en'));
    applyTranslations();

    $('diagStartBtn').addEventListener('click', startDiagnostic);
    $('diagBackBtn').addEventListener('click', goBack);
    $('diagNextBtn').addEventListener('click', goNext);
    $('diagIdentityBackBtn').addEventListener('click', () => renderQuestion(registry.questions.length - 1));
    $('diagIdentityForm').addEventListener('submit', handleIdentitySubmit);
    $('diagFatalRetry').addEventListener('click', () => window.location.reload());

    try {
      registry = await apiGet('/registry');
    } catch (_) {
      showFatal(false);
      return;
    }

    if (!validateRegistryCoverage(registry)) {
      console.error('[diagnostico] Registry retornou id(s) sem copy correspondente no site.');
      showFatal(true);
      return;
    }

    // Sessão de visitante (best-effort, não bloqueia a experiência caso falhe).
    apiPost('/session', {
      contractVersion: registry.contractVersion,
      landingUrl: window.location.href,
      referrer: document.referrer || null,
    }).catch(() => {});

    const stored = loadDraftFromStorage();
    if (stored && stored.questionnaireVersion === registry.questionnaireVersion) {
      draft = stored;
    } else {
      if (stored) clearDraftStorage(); // versão incompatível — nunca migra silenciosamente
      draft = newDraft();
      persistDraft();
    }

    sendEvent('diagnostic_viewed');

    if (draft.currentStep === 'intro') renderIntro();
    else if (draft.currentStep === 'identity') renderIdentity();
    else if (typeof draft.currentStep === 'number' && registry.questions[draft.currentStep]) renderQuestion(draft.currentStep);
    else renderIntro();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
