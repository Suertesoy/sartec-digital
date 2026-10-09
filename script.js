// ── i18n ─────────────────────────────────────────────────────
const WA_NUMBER = '5512997863832';

const I18N = {
  pt: {
    docTitle: `L A Cabral — Design e tecnologia para negócios`,
    metaDescription: `A L A Cabral transforma problemas de negócio em experiências digitais, sistemas e soluções sob medida — do diagnóstico ao desenvolvimento.`,
    metaOgTitle: `L A Cabral — Design e tecnologia para negócios`,
    metaOgDescription: `Experiências digitais, sistemas e soluções sob medida para problemas de negócio.`,

    brandTagline: `Design e tecnologia para negócios`,
    navSolutions: `Soluções`,
    navCases: `Projetos`,
    navHowWeWork: `Como trabalhamos`,
    navAbout: `Sobre`,
    navContact: `Contato`,
    ariaMainNav: `Navegação principal`,
    ariaLangGroup: `Idioma do site`,
    ariaOpenMenu: `Abrir menu`,
    ariaFooterNav: `Links rápidos`,
    ariaWaFloat: `Falar pelo WhatsApp`,
    tagFaq: `Dúvidas`,
    ctaSaibaMais: `Saiba mais →`,

    waGeneral: `Olá, vim pelo site da L A Cabral e quero conversar sobre um projeto.`,
    waFloatGeneral: `Olá, vim pelo site da L A Cabral.`,
    waAutomacao: `Olá, vim pelo site da L A Cabral e quero conversar sobre um site ou uma experiência web.`,
    waConectada: `Olá, vim pelo site da L A Cabral e quero conversar sobre um produto digital ou aplicativo.`,
    waSistemas: `Olá, vim pelo site da L A Cabral e quero entender se minha operação precisa de um sistema, automação ou integração.`,
    waAquisicao: `Olá, vim pelo site da L A Cabral e quero entender como organizar a jornada entre o primeiro contato e o comercial.`,

    tagCtaFinal: `Contato direto`,
    ctaFinalHeading: `Já sabe o que sua empresa precisa?`,
    ctaFinalDesc: `Conte sobre seu projeto diretamente para quem desenvolve as soluções da L A Cabral.`,
    ctaFinalBtn: `Conversar pelo WhatsApp`,
    ctaFinalNote: `Sem compromisso · Uma conversa inicial para entender onde vale mais a pena organizar primeiro.`,

    footerTagline: `Design e tecnologia para transformar necessidades de negócio em soluções que funcionam.`,
    footerAuthorship: `Conduzida por Lucas Cabral.`,
    footerDisclaimer: `Cada projeto começa com uma análise da operação. O escopo é definido depois desse diagnóstico, não antes.`,
    footerBottom: `© 2025 L A CABRAL LTDA · CNPJ 68.528.047/0001-66 · Todos os direitos reservados`,

    // ── HOME · Hero ──────────────────────────────────────────
    heroTag: `Design e tecnologia para empresas`,
    heroTitle: `Sua empresa evoluiu. Seus processos também precisam evoluir.`,
    heroDesc: `Transformamos problemas de negócio em experiências digitais, sistemas e soluções sob medida. Entendemos como sua empresa funciona, identificamos oportunidades de melhoria e desenvolvemos a tecnologia necessária para colocá-las em prática.`,
    heroBtnPrimary: `Fazer meu diagnóstico`,
    heroBtnGhost: `Conhecer nossos projetos`,
    heroMicro: `Descubra onde sua empresa pode melhorar. Comece com um diagnóstico guiado.`,

    // ── HOME · Nossa forma de pensar ─────────────────────────
    thinkingTag: `Como pensamos`,
    thinkingHeading: `Não começamos pela ferramenta. Começamos pelo problema.`,
    thinkingDesc: `Nem todo problema pede um sistema novo. Às vezes basta reorganizar um processo, conectar ferramentas que já existem ou redesenhar uma experiência. Só depois de entender a situação decidimos o formato — e desenvolvemos software próprio quando ele é, de fato, a melhor resposta.`,

    // ── HOME · Territórios (sites / produtos / sistemas / aquisição) ─
    approachTag: `O que fazemos`,
    approachHeading: `Cada negócio tem seus desafios. A solução precisa fazer sentido para eles.`,
    approachIntro: `Quatro frentes de atuação, combinadas conforme a necessidade de cada projeto.`,
    territory1Title: `Sites e experiências web`,
    territory1Desc: `Para quem precisa que a empresa seja bem apresentada e fácil de contatar ou de comprar. Sites institucionais, landing pages, redesign, experiências de venda, UX/UI e direção visual.`,
    territory2Title: `Produtos digitais`,
    territory2Desc: `Para transformar uma ideia ou uma necessidade em um produto que as pessoas entendam e queiram usar. Pesquisa, concepção de aplicativos, protótipos navegáveis, MVPs e evolução de produtos existentes.`,
    territory3Title: `Sistemas, automação e IA`,
    territory3Desc: `Para organizar o que acontece por trás da venda: pedidos, atendimento, equipe e informação. Sistemas internos, painéis, automações, integrações e IA aplicada, quando fizerem sentido.`,
    territory4Title: `Aquisição e conversão`,
    territory4Desc: `Para que o interesse não se perca entre o primeiro contato e a venda. Páginas, qualificação, CRM, WhatsApp e automações conectadas.`,
    territoriesCta: `Ver todas as soluções →`,

    // ── SOLUÇÕES + COMO TRABALHAMOS · Os três territórios ───────
    // (Home usa as chaves territory1-3 — mais curtas, para teaser;
    // estas são a versão completa, usada nos cards de Soluções e no
    // bloco "o que muda por tipo de problema" de Como Trabalhamos.)

    approach1Num: `01`,
    approach1Title: `Sites e experiências web`,
    approach1ShortDesc: `Sites institucionais, landing pages, redesign e arquitetura da informação — a porta de entrada da empresa, desenhada para representar o porte do negócio.`,
    approach1Ideal: `<strong>Ideal para:</strong> empresas cujo site atual não representa mais o tamanho ou a qualidade do negócio, ou que precisam de uma presença digital nova.`,
    approach1List1: `Redesign e sites institucionais`,
    approach1List2: `Landing pages`,
    approach1List3: `Arquitetura da informação e UX/UI`,
    approach1List4: `Direção visual e conteúdo`,
    approach1List5: `Responsividade e performance`,
    approach1List6: `Catálogos e jornadas digitais`,
    approach1Resolve: `Um site desatualizado, difícil de navegar ou que não transmite a qualidade da empresa.`,
    approach1Fit: `Quando a primeira impressão digital não corresponde ao que a empresa realmente entrega.`,
    approach1Note: `Um bom site começa na marca e no público — não na programação.`,
    approach1ProcessNote: `Processo de marca e produto: entender público, conteúdo e referências antes de desenhar e implementar.`,

    approach2Num: `02`,
    approach2Title: `Produtos digitais`,
    approach2ShortDesc: `Aplicativos, MVPs e protótipos — do desenho da experiência à evolução de produtos que já existem.`,
    approach2Ideal: `<strong>Ideal para:</strong> empresas que precisam validar, lançar ou evoluir um produto digital com experiência mobile ou web própria.`,
    approach2List1: `Aplicativos e MVPs`,
    approach2List2: `Protótipos navegáveis`,
    approach2List3: `Identidade visual do produto`,
    approach2List4: `Experiência mobile`,
    approach2List5: `Evolução de produtos existentes`,
    approach2List6: `Testes com usuários reais`,
    approach2Resolve: `Uma ideia de produto sem forma, ou um produto existente que já não atende quem usa.`,
    approach2Fit: `Quando o problema pede uma experiência própria, não uma página ou um sistema interno.`,
    approach2Note: `Produto digital é decisão de negócio antes de ser decisão de tela.`,
    approach2ProcessNote: `Processo de produto: prototipagem, validação com uso real e evolução em ciclos.`,

    approach3Num: `03`,
    approach3Title: `Sistemas, automação e IA`,
    approach3ShortDesc: `Sistemas internos, automações, integrações e IA aplicada — quando a operação já tem o essencial, mas precisa funcionar de forma conectada.`,
    approach3Ideal: `<strong>Ideal para:</strong> operações com processos próprios, ferramentas que não conversam entre si, ou tarefas repetitivas que já custam tempo.`,
    approach3List1: `Sistemas internos e painéis`,
    approach3List2: `CRM e organização operacional`,
    approach3List3: `Automações e agentes de IA`,
    approach3List4: `Integrações entre ferramentas`,
    approach3List5: `WhatsApp e atendimento digital`,
    approach3List6: `Dashboards e relatórios`,
    approach3Resolve: `Ferramentas soltas, tarefas manuais repetitivas e falta de visibilidade sobre a operação.`,
    approach3Fit: `Quando o site e o produto já existem, mas a operação por trás ainda depende de planilhas e retrabalho.`,
    approach3Note: `Nem todo problema de operação precisa de um sistema novo — às vezes basta conectar o que já existe.`,
    approach3ProcessNote: `Processo mais investigativo: mapeamento de regras, integrações e automação testada com uso real.`,

    approach4Num: `04`,
    approach4Title: `Aquisição e conversão`,
    approach4ShortDesc: `A jornada entre o primeiro interesse e a oportunidade comercial — páginas, qualificação, CRM, WhatsApp, automações e IA conectados quando fizer sentido.`,
    approach4Ideal: `<strong>Ideal para:</strong> empresas que já geram interesse — por site, indicação ou campanhas — mas sentem que parte dele se perde antes de chegar ao comercial.`,
    approach4List1: `Landing pages e páginas de campanha`,
    approach4List2: `Formulários e diagnósticos de qualificação`,
    approach4List3: `CRM e organização do pipeline comercial`,
    approach4List4: `WhatsApp integrado ao processo comercial`,
    approach4List5: `Automações de acompanhamento e agendamento`,
    approach4List6: `IA aplicada à triagem e ao contexto de cada contato`,
    approach4Resolve: `Contato chegando sem contexto, demora no primeiro atendimento e oportunidades esquecidas depois da primeira conversa.`,
    approach4Fit: `Quando o site ou as campanhas já trazem interesse, mas o que acontece depois do primeiro contato ainda depende de memória e retrabalho manual.`,
    approach4Note: `Nem toda jornada precisa de todas essas peças — a estrutura é desenhada conforme como a empresa capta, qualifica e atende.`,
    approach4ProcessNote: `Processo de jornada: mapear como o contato chega, o que precisa ser perguntado e onde a passagem para o comercial hoje trava.`,

    ctaConversar: `Conversar sobre este caminho`,
    pkgDetailsToggle: `Ver detalhes`,
    pkgLabelResolve: `O que resolve`,
    pkgLabelFit: `Quando faz sentido`,

    // ── HOME · Não começamos pela ferramenta (citação de fecho,
    //    fundida em #como-pensamos — ver notEverythingQuote acima) ─
    notEverythingQuote: `A tecnologia é consequência do diagnóstico.`,

    // ── HOME · Quando entramos ───────────────────────────────
    fitTag: `Quando faz sentido`,
    fitHeading: `Sua empresa funciona. Mas alguns processos já não acompanham o crescimento.`,
    fit0: `WhatsApp funcionando como o principal sistema de pedidos e atendimento`,
    fit1: `Planilhas paralelas fazendo o papel de sistema`,
    fit2: `Contatos que chegam sem contexto ou ficam sem retorno`,
    fit3: `Falta de indicadores para acompanhar a operação`,
    fit4: `Processos que dependem do conhecimento de pessoas específicas`,
    fit5: `Equipe ou unidades crescendo mais rápido que os processos`,
    fit6: `Site ou produto digital que já não representa o tamanho da empresa`,
    fitNote: `Clínicas, escolas, indústrias, comércios e prestadores de serviço são alguns exemplos. O ponto em comum é uma operação ativa que já começou a exigir mais clareza, integração e controle.`,

    // ── HOME + COMO TRABALHAMOS · As 4 fases ────────────────
    tagMethod: `Método de trabalho`,
    howHeading: `Como trabalhamos.`,
    homeHowSubtitle: `Quatro etapas, do primeiro entendimento à solução em uso.`,
    howStep1: `Entendemos a operação`,
    howStep1Desc: `Pessoas, ferramentas, processos, gargalos e objetivos.`,
    howStep2: `Desenhamos o caminho`,
    howStep2Desc: `Definimos o que precisa mudar e qual é a solução mais simples para chegar lá.`,
    howStep3: `Implementamos`,
    howStep3Desc: `Configuramos ferramentas existentes, integrações e automações — ou desenvolvemos software quando necessário.`,
    howStep4: `Medimos e evoluímos`,
    howStep4Desc: `Quando o projeto pede, acompanhamos o uso, ajustamos o que for preciso e identificamos novas oportunidades.`,
    howCta: `Ver como trabalhamos →`,

    // ── HOME · Projetos (showcase assimétrico) ───────────────
    projectsShowcaseTag: `Projetos`,
    projectsShowcaseHeading: `Problemas diferentes. Soluções construídas para cada negócio.`,
    projectsShowcaseDesc: `Conheça projetos em que unimos análise, design e tecnologia para responder a necessidades específicas de empresas e usuários.`,
    proj1CtaSite: `Visitar site →`,

    // ── HOME + CASES · Projetos (tagProjects/projectsDesc também usados
    //    na página de Projetos — ver cases.html) ──────────────
    tagProjects: `Projetos`,
    projectsDesc: `Uma loja conectada à operação, um ecossistema de atendimento, uma pesquisa que virou protótipo e um site institucional para um grupo de empresas. Cada projeto tem um case completo.`,
    projStatus1: `Projeto entregue`,
    proj1Category: `Site institucional + ecossistema digital`,
    proj1Desc: `Redesenhamos o site, a jornada de listas escolares, o atendimento via WhatsApp, a triagem por IA e o painel interno — uma operação conectada, não páginas isoladas.`,
    proj1Cta: `Ver o case completo →`,
    projStatus2: `Protótipo de produto`,
    proj2Category: `Product Design · Pesquisa e protótipo mobile`,
    proj2Desc: `Da investigação com estudantes à concepção de um aplicativo educacional: pesquisa, personas, jornada, UX/UI e um protótipo navegável avaliado em testes de usabilidade.`,
    proj2Cta: `Abrir o protótipo →`,
    projStatus3: `Projeto em homologação`,
    proj3Category: `Site institucional · Grupo de empresas`,
    proj3Desc: `Um site institucional que reúne as empresas do Grupo Almeida — gestão de resíduos e operação ambiental desde 1985 — em uma só narrativa, com conteúdo organizado para cada público.`,
    proj3Cta: `Ver em homologação →`,
    projectsSeeAllCta: `Ver todos os projetos →`,
    projScrollAriaLabel: `Projetos — navegação por scroll`,

    homeFounderTag: `Quem está por trás`,
    homeFounderText: `À frente da L A Cabral está Lucas Cabral, UX Designer e Design Engineer, biólogo e ex gestor de negócio. Sua atuação combina design, tecnologia e experiência prática de operação para enxergar problemas além da interface e construir soluções conectadas à realidade da empresa.`,
    homeFounderSpecialties: `UX Design · Design Engineering · Automação e IA · Operação`,
    homeOriginProofCta: `Conhecer a história completa →`,
    lucasAvatarAlt: `Lucas Cabral, à frente da L A Cabral`,

    // ── SOLUÇÕES ─────────────────────────────────────────────
    docTitleSolucoes: `Soluções — L A Cabral`,
    metaDescSolucoes: `Sites, produtos digitais ou sistemas sob medida — a L A Cabral define o caminho depois de entender seu negócio.`,
    metaOgTitleSolucoes: `Soluções — L A Cabral`,
    metaOgDescSolucoes: `Você não precisa saber qual tecnologia precisa. A gente descobre isso com você.`,

    solPageTag: `Como decidimos o caminho`,
    solPageHeading: `Você não precisa saber qual tecnologia precisa.`,
    solPageIntro: `Começamos entendendo sua marca, seu público e sua operação. Depois definimos se o problema pede um site, um produto digital ou um sistema — e, dentro disso, se a resposta é redesign, automação, integração, IA ou desenvolvimento sob medida.`,
    ariaPricingTabs: `Territórios de atuação · L A Cabral`,
    tabAutomacao: `Sites`,
    tabConectada: `Produtos`,
    tabSistemas: `Sistemas`,
    tabAquisicao: `Aquisição`,

    solFaqHeading: `Perguntas sobre nossas soluções`,
    faqQ1: `Vocês fazem apenas sites?`,
    faqA1: `Não, mas sites e experiências web são uma frente forte — redesign, UX/UI e direção visual costumam ser o ponto de partida mais comum. Também construímos produtos digitais e, quando o diagnóstico aponta para isso, sistemas, automações e IA. O caminho depende do problema, não de um pacote fixo.`,
    faqQ2: `Vocês desenvolvem aplicativos e produtos digitais?`,
    faqA2: `Sim. Quando o diagnóstico aponta para isso, desenhamos protótipos navegáveis, produtos em fase inicial (MVPs) e aplicativos sob medida, sempre a partir de um escopo bem definido.`,
    faqQ3: `Vocês fazem projetos de e-commerce e venda digital?`,
    faqA3: `Sim, quando esse é o gargalo identificado: jornadas de pedido online, catálogos digitais e estruturas de venda avaliadas conforme a complexidade das integrações e do fluxo de pagamento.`,
    faqQ7: `Vocês trabalham com melhorias em sistemas que já existem?`,
    faqA7: `Sim. Avaliamos o que já está em uso para identificar gargalos, redesenhar interfaces, criar integrações ou construir novas rotinas sobre o que já funciona — em vez de substituir por substituir.`,
    faqQ11: `Aquisição e Conversão substitui o site ou é a mesma coisa que gestão de tráfego?`,
    faqA11: `Nenhum dos dois. O site cuida da apresentação e da experiência digital, e não cuidamos de campanhas de mídia nem da geração de tráfego. Aquisição e Conversão entra a partir do momento em que alguém demonstra interesse: a página que recebe esse contato, a qualificação, o CRM, o WhatsApp, o acompanhamento e, quando faz sentido, a IA que ajuda a organizar cada contato.`,
    faqQ12: `Como a IA entra nesse processo?`,
    faqA12: `De forma aplicada, não como promessa genérica: ajuda a interpretar respostas de um formulário ou diagnóstico, resumir o contexto de um contato antes do atendimento humano e apoiar a priorização de quem falar primeiro. A decisão final e o relacionamento continuam com a sua equipe.`,
    faqQ4: `Como sei qual é a solução ideal para o meu negócio?`,
    faqA4: `Você não precisa saber. Em uma conversa inicial sem compromisso, mapeamos como funciona sua operação, suas vendas e seu atendimento para indicar o caminho mais simples que resolve o problema.`,

    // ── PROJETOS / CASES ─────────────────────────────────────
    docTitleCases: `Projetos — L A Cabral`,
    metaDescCases: `Quatro projetos de design e tecnologia — Pesca Delivery, Sartec Papelaria, UNIEDU e Grupo Almeida — com o problema, a análise, a solução e o resultado de cada um.`,
    metaOgTitleCases: `Projetos — L A Cabral`,
    metaOgDescCases: `Problema, análise, solução e resultado de cada projeto.`,
    casesPageHeading: `Quatro projetos, quatro tipos de problema.`,

    ecosystemSectionTag: `Case · Sartec Papelaria`,
    ecosystemSectionHeading: `Como a Sartec Papelaria virou um ecossistema conectado.`,
    ecosystemSectionSubtitle: `O site apresenta, a lista escolar direciona, o WhatsApp recebe, a IA faz a triagem e o painel organiza a equipe.`,
    caseSartecShotAlt: `Página inicial do site da Sartec Papelaria, capturada em desktop.`,
    ariaSartecMediaLink: `Abrir o site da Sartec Papelaria em nova aba`,
    ariaUniEduMediaLink: `Abrir o protótipo do UniEdu em nova aba`,
    ariaAlmeidaMediaLink: `Abrir o ambiente de homologação do Grupo Almeida em nova aba`,
    caseAlmeidaShotAlt: `Página inicial do site do Grupo Almeida em homologação, capturada em desktop.`,

    caseFactTypeLabel: `Tipo`,
    caseFactTypeValue: `Site + ecossistema digital`,
    caseFactScopeLabel: `Escopo`,
    caseFactScopeValue: `Site, WhatsApp, IA e painel interno`,

    caseSolutionLabel: `Solução`,
    caseResultLabel: `Resultado`,
    caseCapabilitiesLabel: `Capacidades utilizadas`,


    caseBadgeUX: `UX/UI`,
    caseBadgeAutomacao: `Automação`,
    caseBadgeIA: `IA aplicada`,
    caseBadgeIntegracoes: `Integrações`,
    caseBadgeRedesign: `Redesign`,
    caseBadgeArquitetura: `Arquitetura da informação`,
    caseBadgeDirecao: `Direção visual`,
    caseBadgeResponsividade: `Responsividade`,
    caseBadgePrototipagem: `Prototipagem`,
    caseBadgeIdentidade: `Identidade visual`,

    ecoFlow1Title: `Site e presença visual`,
    ecoFlow1Desc: `Apresenta a papelaria, os serviços e os produtos com identidade própria.`,
    ecoFlow2Title: `Listas escolares e produtos`,
    ecoFlow2Desc: `Direciona o cliente certo para o pedido certo, sem perder tempo.`,
    ecoFlow3Title: `WhatsApp`,
    ecoFlow3Desc: `Recebe o contato e mantém a conversa em um único canal.`,
    ecoFlow4Title: `IA de triagem`,
    ecoFlow4Desc: `Identifica o tipo de demanda antes de chegar a um responsável.`,
    ecoFlow5Title: `Painel de atendimento`,
    ecoFlow5Desc: `Organiza conversas, pedidos e responsáveis em um só lugar.`,
    ecoFlow6Title: `Equipe e setores`,
    ecoFlow6Desc: `Cada demanda chega para quem realmente deve resolver.`,
    ecoFlow7Title: `Automação e relatórios`,
    ecoFlow7Desc: `Automatiza tarefas repetitivas e organiza informações para acompanhar a operação.`,

    // ── COMO TRABALHAMOS ─────────────────────────────────────
    docTitleComoTrab: `Como trabalhamos — L A Cabral`,
    metaDescComoTrab: `Quatro fases, a partir do diagnóstico da operação — não da ferramenta. Veja como a L A Cabral conduz cada projeto.`,
    metaOgTitleComoTrab: `Como trabalhamos — L A Cabral`,
    metaOgDescComoTrab: `Entendemos a operação, desenhamos o caminho, implementamos e medimos — nessa ordem.`,

    comoTrabTag: `Como trabalhamos`,
    comoTrabHeading: `Entendemos a operação antes de escolher a ferramenta.`,
    comoTrabIntro: `Não começamos pela ferramenta, começamos pelo problema da sua operação. Esta página reúne como pensamos, como conduzimos um projeto e como funciona o início de um trabalho.`,
    processHeading: `Nosso processo em quatro fases`,
    pilotDesc: `Não começamos pela ferramenta, começamos pelo problema da sua operação. Cada fase existe para garantir que a solução final seja simples, usável e do tamanho certo para o problema.`,
    midPageCtaText: `Quer conversar sobre o seu projeto?`,
    midPageCtaLink: `Falar agora pelo WhatsApp →`,

    processTypeTag: `Nem todo projeto segue o mesmo ritmo`,
    processTypeHeading: `O que muda conforme o tipo de problema`,
    processTypeIntro: `As quatro fases são as mesmas. O que muda é a profundidade de cada uma, dependendo do que a operação pede.`,

    contractingTag: `Como começamos`,
    contractingHeading: `Como funciona o início de um projeto`,
    pricingDesc: `Cada projeto começa com uma conversa sem compromisso. O escopo é definido depois de entendermos sua operação — não antes.`,

    contractingGroup1: `Antes de começar`,
    contracting1Title: `Diagnóstico inicial`,
    contracting1Desc: `Começamos com uma conversa sem compromisso para entender sua operação e indicar o melhor caminho.`,
    contracting2Title: `Escopo definido junto`,
    contracting2Desc: `O que entra no projeto é alinhado com você antes de qualquer proposta.`,
    contracting3Title: `Proposta personalizada`,
    contracting3Desc: `Cada proposta é montada conforme o escopo, a complexidade e as necessidades específicas do projeto.`,

    contractingGroup2: `Durante o projeto`,
    contracting4Title: `Implementação com escopo fechado`,
    contracting4Desc: `Cobre o desenho e a construção da solução até a primeira entrega, dentro do escopo combinado.`,
    contracting5Title: `Mensalidade quando há operação contínua`,
    contracting5Desc: `Projetos com automações, painéis ou infraestrutura ativa contam com uma mensalidade para manter a operação funcionando.`,

    contractingGroup3: `Depois da entrega`,
    contracting6Title: `Escopo fechado ou acompanhamento contínuo`,
    contracting6Desc: `Alguns projetos terminam na entrega. Outros contam com acompanhamento e evolução contratados à parte.`,
    contracting7Title: `Treinamento quando aplicável`,
    contracting7Desc: `Projetos que mudam a rotina da equipe contam com treinamento para garantir o uso no dia a dia.`,
    contracting8Title: `Suporte recorrente quando necessário`,
    contracting8Desc: `Disponível para quem depende de manutenção, ajustes ou monitoramento contínuo.`,

    comoTrabFaqHeading: `Perguntas sobre como começamos`,
    faqQ5: `Por que o investimento é definido depois de uma análise?`,
    faqA5: `Porque cada solução nasce do diagnóstico da sua operação — o investimento varia conforme o escopo: número de páginas ou telas, necessidade de banco de dados, integrações, volume de automação e suporte necessário.`,
    faqQ6: `A mensalidade de suporte é obrigatória?`,
    faqA6: `Depende do tipo de solução. Em sites e páginas simples, suporte e manutenção podem ser combinados sob demanda. Em painéis internos, automações com IA, APIs ou aplicações que dependem de servidores ativos, a manutenção é essencial para manter a operação funcionando.`,
    faqQ8: `O projeto inclui acompanhamento após a entrega?`,
    faqA8: `O escopo padrão cobre até a primeira entrega estável. Acompanhamento e evolução contínua ficam disponíveis à parte, especialmente para sistemas e automações que mudam a rotina da equipe.`,
    faqQ9: `É possível parcelar o valor do projeto?`,
    faqA9: `Sim. O parcelamento pode ser combinado conforme o escopo, o prazo e o tipo de projeto. Esses detalhes são alinhados na proposta, depois da análise inicial.`,
    faqQ10: `Vocês emitem nota fiscal?`,
    faqA10: `Sim. A contratação é feita pela L A CABRAL LTDA, com emissão de nota fiscal conforme a proposta aprovada.`,

    // ── SOBRE ─────────────────────────────────────────────────
    docTitleSobre: `Sobre — L A Cabral`,
    metaDescSobre: `Conheça o método por trás da L A Cabral, formado dentro de uma operação comercial, e quem conduz as soluções hoje: Lucas Cabral.`,
    metaOgTitleSobre: `Sobre a L A Cabral`,
    metaOgDescSobre: `Um método formado dentro de uma operação comercial de mais de 30 anos, aplicado hoje a diferentes empresas.`,

    tagOrigin: `Origem do método`,
    originHeading: `Um método formado dentro de uma operação comercial.`,
    originDesc: `Antes de fundar a L A Cabral, Lucas Cabral viveu por dentro uma operação comercial: atendimento, pedidos, organização de demandas e gestão de uma papelaria com mais de 30 anos de história. Foi nessa vivência que ficou claro que crescer sem organizar processos custa tempo, vendas e clareza — e que tecnologia bem aplicada resolve isso sem precisar reinventar a empresa. Hoje, essa forma de enxergar problemas estrutura a atuação da L A Cabral em diferentes empresas.`,
    originCard1Title: `Mais de 30 anos de operação comercial`,
    originCard1Desc: `A Sartec Papelaria opera com equipe, clientes e rotinas comerciais diárias há mais de três décadas em São José dos Campos.`,
    originCard2Title: `Processos e rotinas`,
    originCard2Desc: `O fluxo diário de atendimentos e pedidos serviu de base para desenhar soluções que realmente encaixam na rotina de quem opera.`,
    originCard3Title: `Validadas no dia a dia da equipe`,
    originCard3Desc: `Nada aqui é teórico. Entendemos a rotina de quem opera para desenhar caminhos que realmente funcionem no dia a dia.`,

    disciplinesTag: `Por que tudo isso junto`,
    disciplinesHeading: `Um problema empresarial raramente respeita a fronteira entre disciplinas.`,
    disciplinesDesc: `Às vezes o gargalo está na interface. Às vezes no processo. Às vezes na comunicação. Às vezes na integração entre ferramentas. Às vezes na ausência de um software que ainda não existe. Por isso a L A Cabral começa pelo problema — e combina as capacidades necessárias para resolvê-lo, em vez de forçar o problema a caber em uma especialidade só.`,

    tagAbout: `Quem conduz a L A Cabral`,
    aboutHeading: `Produto, operações e tecnologia trabalhando juntos.`,
    aboutP1: `Sou Lucas Cabral. Trabalho na interseção entre produto, operações, design, tecnologia, automação e IA — entendendo como uma empresa funciona por dentro antes de decidir o que construir.`,
    aboutP2: `A formação em Product Design entra aqui como abordagem, não como rótulo: ela ajuda a começar pelo problema, entender marca, público e processos, e só depois desenhar a solução — seja ela um site, um produto digital, uma automação ou um sistema novo.`,
    aboutQuote: `"Antes de escolher a ferramenta, entendemos o gargalo que está custando tempo, venda ou clareza."`,
    proofCard1Title: `Operação`,
    proofCard1Desc: `Vivência em atendimento, compras, financeiro e gestão comercial dentro da própria Sartec.`,
    proofCard2Title: `Produto e UX/UI`,
    proofCard2Desc: `Desenho de jornadas, telas e fluxos pensados para clientes, equipe e gestor.`,
    proofCard3Title: `Automação e IA aplicada`,
    proofCard3Desc: `IA, triagem, painéis e integrações para reduzir retrabalho e dar mais controle sobre a operação.`,
    lucasCardRole: `Produto, operações e soluções digitais`,
    factFormacaoLabel: `Formação`,
    factFormacaoValue: `Formado pela UFSC`,
    factEspecialidadeLabel: `Especialidade`,
    factEspecialidadeValue: `Produto, operações, automação e IA aplicada`,
    factVivenciaLabel: `Vivência prática`,
    factVivenciaValue: `Atendimento, gestão comercial e processos`,
    factEntregaLabel: `Entrega`,
    factEntregaValue: `Soluções digitais simples de operar`,
    factParaQuemLabel: `Para quem`,
    factParaQuemValue: `Empresas que já têm uma operação rodando e sentem que os processos pararam de acompanhar o crescimento.`,

    // ── Rodada editorial: Home + cases (Pesca, Sartec, UNIEDU, Almeida) ──
    ctaFinalDiagLink: `Ainda não tem clareza? Faça o diagnóstico →`,
    fitDesc: `Pedidos chegando por diferentes canais, informações espalhadas, tarefas repetitivas e ferramentas que não se conectam. São sinais de que a operação pode precisar de uma estrutura melhor.`,
    projPescaCategory: `Da loja virtual à operação integrada`,
    projPescaDesc: `Uma solução para conectar vendas online, personalização de produtos e processamento de pedidos, reunindo a experiência do cliente e a gestão operacional em uma aplicação própria.`,
    projStatusPesca: `Publicado e em operação`,
    projPescaCtaSite: `Visitar a loja →`,
    ariaPescaMediaLink: `Abrir a loja do Pesca Delivery em nova aba`,
    casePescaShotAlt: `Tela inicial da loja do Pesca Delivery em celular, com os caminhos Do mar e Poke.`,
    caseBadgeProductDesign: `Product Design`,
    caseBadgeComercio: `Comércio digital`,
    caseBadgeSistemas: `Sistemas`,
    caseBadgePesquisaUX: `Pesquisa UX`,
    caseBadgeSiteInstitucional: `Site institucional`,
    caseProblemLabel: `Problema`,
    caseAnalysisLabel: `Análise`,
    caseChaptersAria: `Capítulos do case`,
    caseFactRoleLabel: `Atuação`,
    caseFactContextLabel: `Contexto`,
    caseFactPeriodLabel: `Período`,
    caseRoleValue: `Product Design, UX/UI e desenvolvimento`,
    caseBack: `← Todos os projetos`,
    caseNextLabel: `Próximo projeto`,
    docTitlePesca: `Pesca Delivery — L A Cabral`,
    metaDescPesca: `Como a L A Cabral transformou a necessidade de vender online em uma experiência digital conectada à operação de uma peixaria: loja, painel e acompanhamento de pedidos.`,
    metaOgTitlePesca: `Pesca Delivery — case — L A Cabral`,
    metaOgDescPesca: `Da loja virtual à operação integrada.`,
    pescaTag: `Case · Pesca Delivery`,
    pescaHeading: `Muito além de uma loja virtual.`,
    pescaSubtitle: `Como transformamos a necessidade de vender online em uma experiência digital conectada à operação de uma peixaria.`,
    pescaTypeValue: `Comércio digital + operação`,
    pescaScopeValue: `Loja pública, painel operacional e acompanhamento do pedido`,
    pescaProblemLead: `Vender online era só o começo.`,
    pescaProblemText: `O Pesca é uma peixaria de Florianópolis que atendia quase tudo pelo WhatsApp. Digitalizar a venda parecia simples, mas os produtos seguem regras comerciais diferentes — preço fixo ou por peso, peixe vendido por unidade com peso final apurado na operação, opções de preparo e pokes montados pelo cliente. Além disso, o pedido precisava chegar à equipe com informação suficiente para ser interpretado e executado corretamente.`,
    pescaAnalysisLead: `A experiência precisava conectar cliente e operação.`,
    pescaAnalysisText: `A análise do domínio comercial mostrou duas jornadas inseparáveis: o cliente descobre, configura, compra e acompanha; a equipe recebe, interpreta, prepara e conclui. O WhatsApp continua sendo canal de conversa, mas o pedido precisa existir corretamente dentro do sistema. Algumas decisões orientaram o desenho:`,
    pescaAnalysisL1: `Separar a intenção de compra (unidades) da forma de precificação (peso)`,
    pescaAnalysisL2: `Preservar as condições comerciais contratadas no momento do pedido`,
    pescaAnalysisL3: `Não estimar peso: a pesagem real acontece na operação`,
    pescaAnalysisL4: `Sem login do cliente na primeira versão, para reduzir etapas`,
    pescaAnalysisL5: `MVP mínimo em escopo, não em qualidade — com Loja e Painel coerentes entre si`,
    pescaSolutionLead: `Uma experiência integrada, da descoberta à execução.`,
    pescaSolutionText: `Duas superfícies de um mesmo sistema. Na loja pública, o cliente explora o catálogo, personaliza produtos, monta o próprio poke, escolhe retirada ou entrega e acompanha o pedido por um link público. No painel operacional, a equipe recebe, organiza, prepara e conclui os pedidos, mantém catálogo, preços e disponibilidade e trata as exceções.`,
    pescaResultLead: `Uma aplicação em operação, não apenas um protótipo.`,
    pescaResultText: `O MVP foi publicado e é usado na operação, com pedidos reais sendo processados. O catálogo é administrado pela equipe e o cliente acompanha o pedido por um link público. A loja pode ser instalada como aplicativo (PWA), a equipe recebe alerta de novos pedidos e o negócio ganhou pós-venda, indicadores comerciais e analytics de produto. O projeto está na fase de operação e observação: a evolução passa a ser guiada pelo uso real, não por funcionalidades imaginadas.`,
    pescaResultNote: `Ainda não há medição comprovada de impacto em vendas, conversão ou tempo economizado — por isso não divulgamos números.`,
    pescaSurfacesTag: `As duas superfícies`,
    pescaSurfacesHeading: `Um mesmo pedido, do clique à entrega.`,
    pescaSurfacesIntro: `Nem todos os recursos têm o mesmo peso. Estes são os que melhor mostram a relação entre a compra e a operação.`,
    pescaStoreTitle: `Loja pública`,
    pescaStoreL1: `Catálogo com produtos vendidos por unidade e por peso`,
    pescaStoreL2: `Opções de preparo e personalização por produto`,
    pescaStoreL3: `Builder de Poke, com resumo sempre visível`,
    pescaStoreL4: `Carrinho persistente e checkout`,
    pescaStoreL5: `Retirada ou entrega`,
    pescaStoreL6: `Acompanhamento público do pedido`,
    pescaStoreL7: `Continuidade local do cliente, sem login`,
    pescaPanelTitle: `Painel operacional`,
    pescaPanelL1: `Recebimento e acompanhamento dos pedidos`,
    pescaPanelL2: `Preparação e conclusão, com histórico consistente`,
    pescaPanelL3: `Gestão de catálogo, preços e disponibilidade`,
    pescaPanelL4: `Tratamento de exceções`,
    pescaPanelL5: `Alerta de novos pedidos`,
    pescaPanelL6: `Pós-venda`,
    pescaPanelL7: `Visão comercial`,
    pescaPanelNote: `O painel é de acesso restrito e não é exibido aqui, para proteger dados da operação.`,
    pescaStoriesTag: `Decisões de UX`,
    pescaStoriesHeading: `Três decisões que mudaram a experiência.`,
    pescaStory1Title: `Builder de Poke: do wizard à composição contínua`,
    pescaStory1Text: `A primeira versão seguia um fluxo em etapas, e a revisão mostrou uma interação parecida demais com um formulário. O Builder evoluiu para uma composição vertical contínua, com resumo persistente, edição consistente e adicionais apresentados no contexto certo.`,
    pescaStory2Title: `Preço por peso, sem falsa precisão`,
    pescaStory2Text: `Um peixe inteiro é escolhido por unidade, mas seu valor depende do peso real. A interface mostra o preço por quilo, deixa claro que a venda é por unidade e não inventa uma estimativa: a pesagem acontece na operação, que informa o valor final.`,
    pescaStory3Title: `Operação orientada à ação`,
    pescaStory3Text: `O painel foi desenhado para a equipe executar pedidos, não apenas olhar números. Ele prioriza as ações do momento e mantém eventos e histórico consistentes, inclusive nas exceções — como a reversão controlada de um cancelamento.`,
    pescaVisualTag: `Identidade visual`,
    pescaVisualQuote: `“A interface é escura, mas a comida não.”`,
    pescaVisualText: `A direção visual amadureceu para um Dark Premium: interface em grafite e preto quente, com o dourado da marca como único acento — para que a fotografia gastronômica, clara e luminosa, seja a protagonista da compra.`,
    pescaGalleryHeading: `A loja em uso`,
    pescaShot1: `Início`,
    pescaShot1Alt: `Tela inicial da loja do Pesca Delivery, com os caminhos Do mar e Poke.`,
    pescaShot2: `Preço por quilo, venda por unidade`,
    pescaShot2Alt: `Lista de produtos com peixes inteiros, preço por quilo e a indicação de venda por unidade.`,
    pescaShot3: `Opções de preparo`,
    pescaShot3Alt: `Detalhe de um peixe com seletor de unidades e opções de preparo sem custo.`,
    pescaShot4: `Builder de Poke`,
    pescaShot4Alt: `Montagem do poke com proteínas adicionais, valor do prato e botão de adicionar ao carrinho.`,
    pescaGalleryNote: `Capturas da loja pública em produção. O aviso “fechado agora” reflete o horário de funcionamento.`,
    caseBadgeSistemasPainel: `Sistemas e painel`,
    caseBadgeAnalytics: `Analytics de produto`,
    docTitleSartec: `Sartec Papelaria — L A Cabral`,
    metaDescSartec: `Como a L A Cabral conectou site, WhatsApp, IA de triagem e painel interno em um único fluxo de atendimento para a Sartec Papelaria.`,
    metaOgTitleSartec: `Sartec Papelaria — case — L A Cabral`,
    metaOgDescSartec: `Um ecossistema conectado, não páginas isoladas.`,
    sartecProblemLead: `O desafio não era apenas melhorar a presença digital.`,
    sartecProblemText: `Com mais de 30 anos de operação e uma rotina sazonal pesada — principalmente na época de listas escolares —, a Sartec dependia de conversas manuais no balcão e no WhatsApp. Nos picos de demanda, pedidos chegavam por canais diferentes, sem organização entre quem perguntava, quem orçava e quem separava o material, e a direção não tinha visibilidade do andamento. Era preciso conectar o primeiro contato, a identificação das demandas e a organização do trabalho da equipe.`,
    sartecAnalysisLead: `O problema não era volume. Era falta de um fluxo único.`,
    sartecAnalysisText: `A análise partiu da observação do atendimento real — no balcão, no WhatsApp e na separação dos pedidos — e do mapeamento do fluxo existente. Separando sintoma de causa, o gargalo estava na passagem entre quem pergunta, quem orça e quem separa. Isso indicou que site, atendimento e gestão precisavam ser tratados como partes de um mesmo fluxo, e não como projetos independentes.`,
    sartecSolutionLead: `Um ecossistema conectado.`,
    sartecSolutionText: `Desenhamos um ecossistema conectado: um site que apresenta a operação e direciona por lista escolar, um canal único de WhatsApp, uma camada de IA para triagem inicial e um painel interno que organiza conversas, pedidos e responsáveis — as sete partes implementadas como um fluxo único, não como entregas separadas.`,
    sartecResultLead: `Um ecossistema entregue e usado no atendimento.`,
    sartecResultText: `A equipe trabalha a partir de um canal único de WhatsApp, a IA faz a triagem inicial antes do encaminhamento a um responsável e o painel dá à direção visão da fila de atendimento. Os ajustes seguem vindo do feedback de quem opera.`,
    sartecResultNote: `Ainda não há medição formal de ganho de tempo ou de vendas — por isso não divulgamos números.`,
    ecoFlowHeading: `As sete peças do ecossistema`,
    docTitleUniedu: `UNIEDU — L A Cabral`,
    metaDescUniedu: `Da pesquisa com estudantes ao protótipo navegável de um aplicativo educacional: case de Product Design e prototipação da L A Cabral.`,
    metaOgTitleUniedu: `UNIEDU — case — L A Cabral`,
    metaOgDescUniedu: `Da investigação à concepção de um aplicativo educacional.`,
    unieduTag: `Case · UNIEDU`,
    unieduHeading: `Da investigação à concepção de um aplicativo educacional.`,
    unieduSubtitle: `Como uma necessidade de estudantes de cursos online virou uma proposta de produto — pesquisa, UX/UI e protótipo navegável, sem exigir que o aplicativo estivesse em produção.`,
    unieduTypeValue: `Product Design e prototipação`,
    unieduScopeValue: `Pesquisa UX, estratégia de produto, UX/UI e protótipo navegável`,
    unieduContextValue: `Projeto de formação, desenvolvido em dupla com Najme Simon Alé`,
    unieduPeriodValue: `Cerca de 8 meses, da pesquisa à validação`,
    unieduProblemLead: `Estudar online exige constância — e a constância se perde.`,
    unieduProblemText: `Cursos a distância enfrentam quatro fricções recorrentes: perda de ritmo semanal, baixa percepção de evolução, sensação de isolamento e recompensas sem valor percebido. O UNIEDU parte delas para propor um aplicativo que ajude o estudante a manter o hábito — não um redesenho visual isolado. A pergunta de oportunidade: como recompensar o esforço real do aluno e transformar constância em hábito?`,
    unieduAnalysisLead: `Pesquisa antes de tela.`,
    unieduAnalysisText: `As decisões de produto se apoiaram em várias fontes de evidência:`,
    unieduAnalysisL1: `Pesquisa de apoio sobre evasão e permanência em cursos online`,
    unieduAnalysisL2: `Benchmark de aplicativos e plataformas como Duolingo, Kahoot e Alura`,
    unieduAnalysisL3: `Survey e entrevistas individuais com estudantes de cursos online`,
    unieduAnalysisL4: `Duas personas — Sofia e Marcos — e suas jornadas completas`,
    unieduAnalysisL5: `Wireframes, protótipo em alta fidelidade e testes de usabilidade monitorados com 5 participantes`,
    unieduSolutionLead: `Uma plataforma de aprendizagem contínua, com progresso visível.`,
    unieduSolutionText: `O aplicativo combina progresso visível desde a tela inicial, plano de estudos ajustável, recompensas com valor percebido, comunidade e suporte com IA dentro da própria aula. Decisões como ranking opcional, onboarding temporário e um modo escuro com paleta própria ligam o que a pesquisa mostrou à interface.`,
    unieduResultLead: `Um protótipo navegável, avaliado com usuários.`,
    unieduResultText: `O resultado é um protótipo mobile navegável, com tema claro e escuro. Nos testes, os fluxos de plano de estudos, aula, briefing e loja foram concluídos sem bloqueios; comunidade e resgate de pontos mostraram atritos — em parte pela formulação da tarefa — e viraram oportunidades de refinamento.`,
    unieduResultNote: `O UNIEDU é um protótipo, não um aplicativo em operação. Os indicadores de retenção e engajamento propostos ainda não foram medidos.`,
    unieduEvidenceTag: `Evidências`,
    unieduEvidenceHeading: `Do rascunho ao protótipo.`,
    unieduEvidenceIntro: `O processo deixou artefatos em cada etapa — do papel ao protótipo navegável.`,
    unieduFig1: `Rascunho em papel da trilha de aprendizagem`,
    unieduFig1Alt: `Rascunho à mão de uma trilha sinuosa em uma tela de celular, com um unicórnio no topo.`,
    unieduFig2: `Wireframe da tela inicial`,
    unieduFig2Alt: `Wireframe em tons de cinza da tela inicial, com progresso, trilha de aprendizagem, aula atual, cases e plano de estudos.`,
    unieduFig3: `Protótipo navegável — tela de entrada`,
    unieduFig3Alt: `Tela de entrada do protótipo UNIEDU em modo escuro, com um unicórnio de vidro rosa.`,
    unieduJourneyCaption: `Mapa da jornada: da descoberta à fidelização, com dores e oportunidades de produto.`,
    unieduJourneyAlt: `Quadro de post-its com o mapa da jornada: etapas na vertical e, na horizontal, contexto, ações, pensamentos, sentimentos, dores e oportunidades.`,
    unieduWhyTag: `Quando faz sentido`,
    unieduWhyHeading: `Pesquisar e prototipar antes de desenvolver.`,
    unieduWhyText: `O UNIEDU mostra que uma empresa pode contratar investigação, design e prototipação antes de decidir por um desenvolvimento completo: a ideia é estudada, testada com pessoas reais e comunicada de forma navegável, e a decisão de investir é tomada com mais informação.`,
    unieduWhyCta: `Conversar sobre um produto digital`,
    unieduOpenCase: `Ler a documentação do case →`,
    docTitleAlmeida: `Grupo Almeida — L A Cabral`,
    metaDescAlmeida: `Como a L A Cabral estruturou o site institucional do Grupo Almeida: uma só narrativa para empresas de diferentes frentes do setor ambiental.`,
    metaOgTitleAlmeida: `Grupo Almeida — case — L A Cabral`,
    metaOgDescAlmeida: `Um grupo, várias empresas, uma só narrativa.`,
    almeidaTag: `Case · Grupo Almeida`,
    almeidaHeading: `Um grupo, várias empresas, uma só narrativa.`,
    almeidaSubtitle: `Como estruturamos o site institucional do Grupo Almeida para apresentar, com clareza, empresas que atuam em frentes diferentes do setor ambiental.`,
    almeidaTypeValue: `Site institucional`,
    almeidaScopeValue: `Arquitetura de conteúdo, UX/UI e site em português e inglês`,
    almeidaProblemLead: `Várias empresas, uma presença fragmentada.`,
    almeidaProblemText: `O Grupo Almeida reúne a Almeida Ambiental, a Almeida Equipamentos e a Saturno Ambiental — frentes complementares, com uma história que começa em 1985. A presença digital anterior fragmentava essas empresas e não comunicava a solidez, a escala e a estrutura do grupo para clientes, fornecedores e parceiros.`,
    almeidaAnalysisLead: `Quem lê, e o que precisa encontrar.`,
    almeidaAnalysisText: `Mapeamos os públicos — clientes, fornecedores, parceiros e organizações nacionais e internacionais — e os conteúdos que sustentam a reputação do grupo: história, unidades, tecnologia, sustentabilidade e presença internacional. Uma regra editorial guiou o trabalho: nenhum número, data ou parceiro entra sem fonte ou validação do cliente.`,
    almeidaSolutionLead: `Um site que apresenta o grupo e preserva a identidade de cada empresa.`,
    almeidaSolutionText: `Home institucional, página de história, uma página para cada empresa e um diretório de contato por unidade. A fotografia real compõe o layout, a tipografia é editorial e a Saturno Ambiental mantém sua identidade própria dentro do grupo.`,
    almeidaResultLead: `Construído e em homologação.`,
    caseBadgePWA: `PWA`,
    almeidaSitemapTag: `Arquitetura do site`,
    almeidaSitemapHeading: `Seis áreas, organizadas por público e por empresa.`,
    almeidaSitemapIntro: `O site também existe em inglês. A estrutura mantém as empresas como partes de um mesmo grupo, sem fragmentar a navegação.`,
    almeidaPageHome: `Home do grupo`,
    almeidaPageHistory: `Nossa história`,
    almeidaPageContact: `Contato por unidade`,
    almeidaResultText: `O site foi desenvolvido, inclusive em inglês, e está publicado em ambiente de homologação para validação do cliente. A publicação definitiva — domínio e infraestrutura — ainda será decidida com o Grupo Almeida; por isso não há resultados de uso a apresentar.`,
  },

  en: {
    docTitle: `L A Cabral — Design and technology for businesses`,
    metaDescription: `L A Cabral turns business problems into digital experiences, systems and custom solutions — from diagnosis to development.`,
    metaOgTitle: `L A Cabral — Design and technology for businesses`,
    metaOgDescription: `Digital experiences, systems and custom solutions for business problems.`,

    brandTagline: `Design and technology for businesses`,
    navSolutions: `Solutions`,
    navCases: `Projects`,
    navHowWeWork: `How we work`,
    navAbout: `About`,
    navContact: `Contact`,
    ariaMainNav: `Main navigation`,
    ariaLangGroup: `Site language`,
    ariaOpenMenu: `Open menu`,
    ariaFooterNav: `Quick links`,
    ariaWaFloat: `Chat on WhatsApp`,
    tagFaq: `FAQ`,
    ctaSaibaMais: `Learn more →`,

    waGeneral: `Hi, I found you through the L A Cabral website and I'd like to talk about a project.`,
    waFloatGeneral: `Hi, I found you through the L A Cabral website.`,
    waAutomacao: `Hi, I found you through the L A Cabral website and I'd like to talk about a website or a web experience.`,
    waConectada: `Hi, I found you through the L A Cabral website and I'd like to talk about a digital product or app.`,
    waSistemas: `Hi, I found you through the L A Cabral website and I'd like to understand if my operation needs a system, automation or integration.`,
    waAquisicao: `Hi, I found you through the L A Cabral website and I'd like to understand how to organize the journey between the first contact and the sales team.`,

    tagCtaFinal: `Direct contact`,
    ctaFinalHeading: `Already know what your company needs?`,
    ctaFinalDesc: `Tell us about your project directly — you'll be talking to the person who builds L A Cabral's solutions.`,
    ctaFinalBtn: `Chat on WhatsApp`,
    ctaFinalNote: `No commitment · An initial conversation to find out what's worth organizing first.`,

    footerTagline: `Design and technology that turn business needs into solutions that work.`,
    footerAuthorship: `Led by Lucas Cabral.`,
    footerDisclaimer: `Every project starts with a review of the operation. Scope is defined after that diagnosis, not before.`,
    footerBottom: `© 2025 L A CABRAL LTDA · CNPJ 68.528.047/0001-66 · All rights reserved`,

    // ── HOME · Hero ──────────────────────────────────────────
    heroTag: `Design and technology for companies`,
    heroTitle: `Your company has grown. Your processes need to grow with it.`,
    heroDesc: `We turn business problems into digital experiences, systems and custom solutions. We learn how your company works, identify where it can improve and build the technology needed to make it happen.`,
    heroBtnPrimary: `Take my diagnostic`,
    heroBtnGhost: `See our projects`,
    heroMicro: `Find out where your company can improve. Start with a guided diagnostic.`,

    // ── HOME · Our way of thinking ────────────────────────────
    thinkingTag: `How we think`,
    thinkingHeading: `We don't start with the tool. We start with the problem.`,
    thinkingDesc: `Not every problem calls for a new system. Sometimes it's enough to reorganize a process, connect tools you already have or redesign an experience. We only choose the format once we understand the situation — and we build custom software when it really is the best answer.`,

    // ── HOME · Territories (websites / products / systems / acquisition) ─
    approachTag: `What we do`,
    approachHeading: `Every business has its own challenges. The solution has to make sense for them.`,
    approachIntro: `Four areas of work, combined according to what each project needs.`,
    territory1Title: `Websites and web experiences`,
    territory1Desc: `For companies that need to be well presented and easy to contact or buy from. Institutional sites, landing pages, redesigns, sales experiences, UX/UI and visual direction.`,
    territory2Title: `Digital products`,
    territory2Desc: `To turn an idea or a need into a product people understand and want to use. Research, app concepts, navigable prototypes, MVPs and the evolution of existing products.`,
    territory3Title: `Systems, automation and AI`,
    territory3Desc: `To organize what happens behind the sale: orders, service, team and information. Internal systems, dashboards, automation, integrations and applied AI, when they make sense.`,
    territory4Title: `Acquisition and conversion`,
    territory4Desc: `So interest isn't lost between the first contact and the sale. Pages, qualification, CRM, WhatsApp and connected automation.`,
    territoriesCta: `See all solutions →`,

    // ── SOLUTIONS + HOW WE WORK · The three territories ─────────
    approach1Num: `01`,
    approach1Title: `Websites and web experiences`,
    approach1ShortDesc: `Institutional sites, landing pages, redesigns and information architecture — the company's front door, built to represent the size of the business.`,
    approach1Ideal: `<strong>Ideal for:</strong> companies whose current site no longer represents the size or quality of the business, or that need a new digital presence.`,
    approach1List1: `Redesigns and institutional sites`,
    approach1List2: `Landing pages`,
    approach1List3: `Information architecture and UX/UI`,
    approach1List4: `Visual direction and content`,
    approach1List5: `Responsiveness and performance`,
    approach1List6: `Catalogs and digital journeys`,
    approach1Resolve: `An outdated site, one that's hard to navigate, or one that doesn't convey the company's quality.`,
    approach1Fit: `When the digital first impression doesn't match what the company actually delivers.`,
    approach1Note: `A good website starts with the brand and the audience — not the code.`,
    approach1ProcessNote: `Brand and product process: understanding audience, content and references before designing and building.`,

    approach2Num: `02`,
    approach2Title: `Digital products`,
    approach2ShortDesc: `Apps, MVPs and prototypes — from designing the experience to evolving products that already exist.`,
    approach2Ideal: `<strong>Ideal for:</strong> companies that need to validate, launch or evolve a digital product with its own mobile or web experience.`,
    approach2List1: `Apps and MVPs`,
    approach2List2: `Navigable prototypes`,
    approach2List3: `Product visual identity`,
    approach2List4: `Mobile experience`,
    approach2List5: `Evolving existing products`,
    approach2List6: `Testing with real users`,
    approach2Resolve: `A product idea with no shape yet, or an existing product that no longer serves the people using it.`,
    approach2Fit: `When the problem calls for its own experience, not a page or an internal system.`,
    approach2Note: `A digital product is a business decision before it's a screen decision.`,
    approach2ProcessNote: `Product process: prototyping, validating with real use and evolving in cycles.`,

    approach3Num: `03`,
    approach3Title: `Systems, automation and AI`,
    approach3ShortDesc: `Internal systems, automations, integrations and applied AI — when the operation already has the essentials but needs to run connected.`,
    approach3Ideal: `<strong>Ideal for:</strong> operations with their own processes, tools that don't talk to each other, or repetitive tasks that already cost time.`,
    approach3List1: `Internal systems and dashboards`,
    approach3List2: `CRM and operational organization`,
    approach3List3: `Automations and AI agents`,
    approach3List4: `Integrations between tools`,
    approach3List5: `WhatsApp and digital service`,
    approach3List6: `Dashboards and reports`,
    approach3Resolve: `Disconnected tools, repetitive manual tasks and no visibility into the operation.`,
    approach3Fit: `When the website and the product already exist, but the operation behind them still runs on spreadsheets and rework.`,
    approach3Note: `Not every operational problem needs a new system — sometimes it just needs to connect what's already there.`,
    approach3ProcessNote: `The most investigative process: mapping rules, integrations and automation tested with real use.`,

    approach4Num: `04`,
    approach4Title: `Acquisition and conversion`,
    approach4ShortDesc: `The journey between the first interest and the sales opportunity — pages, qualification, CRM, WhatsApp, automation and AI connected when it makes sense.`,
    approach4Ideal: `<strong>Ideal for:</strong> companies that already generate interest — through their website, referrals or campaigns — but feel that some of it gets lost before reaching sales.`,
    approach4List1: `Landing pages and campaign pages`,
    approach4List2: `Forms and qualification diagnostics`,
    approach4List3: `CRM and sales pipeline organization`,
    approach4List4: `WhatsApp integrated into the sales process`,
    approach4List5: `Follow-up and scheduling automation`,
    approach4List6: `AI applied to triage and context for each contact`,
    approach4Resolve: `Contacts arriving with no context, a slow first response, and opportunities forgotten after the first conversation.`,
    approach4Fit: `When the website or campaigns already bring in interest, but what happens after the first contact still depends on memory and manual rework.`,
    approach4Note: `Not every journey needs every piece — the structure is designed around how each company attracts, qualifies and serves.`,
    approach4ProcessNote: `Journey process: mapping how contacts arrive, what needs to be asked, and where the handoff to sales breaks down today.`,

    ctaConversar: `Talk about this path`,
    pkgDetailsToggle: `See details`,
    pkgLabelResolve: `What it solves`,
    pkgLabelFit: `When it makes sense`,

    // ── HOME · Not every problem needs a new system (closing quote,
    //    merged into #como-pensamos — see notEverythingQuote above) ──
    notEverythingQuote: `Technology is a consequence of the diagnosis.`,

    // ── HOME · When we step in ────────────────────────────────
    fitTag: `When it makes sense`,
    fitHeading: `Your company works. But some processes no longer keep up with its growth.`,
    fit0: `WhatsApp acting as the main ordering and customer service system`,
    fit1: `Side spreadsheets doing the job of a system`,
    fit2: `Contacts that arrive without context or never get a reply`,
    fit3: `No indicators to track the operation`,
    fit4: `Processes that depend on specific people's knowledge`,
    fit5: `A team or locations growing faster than the processes`,
    fit6: `A website or digital product that no longer reflects the size of the company`,
    fitNote: `Clinics, schools, manufacturers, retailers and service providers are a few examples. What they share is an active operation that has started to demand more clarity, integration and control.`,

    // ── HOME + HOW WE WORK · The 4 phases ─────────────────────
    tagMethod: `Our process`,
    howHeading: `How we work.`,
    homeHowSubtitle: `Four steps, from first understanding to a solution in use.`,
    howStep1: `We understand the operation`,
    howStep1Desc: `People, tools, processes, bottlenecks and goals.`,
    howStep2: `We design the path`,
    howStep2Desc: `We define what needs to change and the simplest solution to get there.`,
    howStep3: `We implement`,
    howStep3Desc: `We set up existing tools, integrations and automation — or build software when needed.`,
    howStep4: `We measure and evolve`,
    howStep4Desc: `When the project calls for it, we follow how it's used, adjust what's needed and spot new opportunities.`,
    howCta: `See how we work →`,

    // ── HOME · Projects (asymmetric showcase) ─────────────────
    projectsShowcaseTag: `Projects`,
    projectsShowcaseHeading: `Different problems. Solutions built for each business.`,
    projectsShowcaseDesc: `See projects where we combined analysis, design and technology to meet the specific needs of companies and users.`,
    proj1CtaSite: `Visit site →`,

    // ── HOME + CASES · Projects (tagProjects/projectsDesc also used
    //    on the Projects page — see cases.html) ────────────────
    tagProjects: `Projects`,
    projectsDesc: `A store connected to its operation, a customer-service ecosystem, research that became a prototype and an institutional website for a group of companies. Each project has a full case.`,
    projStatus1: `Delivered project`,
    proj1Category: `Website + digital ecosystem`,
    proj1Desc: `We redesigned the website, the school-list journey, WhatsApp service, AI triage and the internal dashboard — one connected operation, not isolated pages.`,
    proj1Cta: `See the full case →`,
    projStatus2: `Product prototype`,
    proj2Category: `Product Design · Research and mobile prototype`,
    proj2Desc: `From research with students to the concept of an educational app: research, personas, journey, UX/UI and a navigable prototype assessed in usability tests.`,
    proj2Cta: `Open the prototype →`,
    projStatus3: `Project in review`,
    proj3Category: `Institutional website · Group of companies`,
    proj3Desc: `An institutional website that brings the Grupo Almeida companies — waste management and environmental operations since 1985 — into one narrative, with content organized for each audience.`,
    proj3Cta: `View staging site →`,
    projectsSeeAllCta: `See all projects →`,
    projScrollAriaLabel: `Projects — scroll navigation`,

    homeFounderTag: `Who's behind it`,
    homeFounderText: `L A Cabral is led by Lucas Cabral — UX Designer and Design Engineer, biologist and former business manager. His work combines design, technology and hands-on operational experience to see problems beyond the interface and build solutions grounded in the reality of the business.`,
    homeFounderSpecialties: `UX Design · Design Engineering · Automation & AI · Operations`,
    homeOriginProofCta: `See the full story →`,
    lucasAvatarAlt: `Lucas Cabral, leading L A Cabral`,

    // ── SOLUTIONS ────────────────────────────────────────────
    docTitleSolucoes: `Solutions — L A Cabral`,
    metaDescSolucoes: `Websites, digital products or custom systems — L A Cabral defines the path after understanding your business.`,
    metaOgTitleSolucoes: `Solutions — L A Cabral`,
    metaOgDescSolucoes: `You don't need to know which technology you need. We figure that out with you.`,

    solPageTag: `How we decide the path`,
    solPageHeading: `You don't need to know which technology you need.`,
    solPageIntro: `We start by understanding your brand, your audience and your operation. Then we figure out whether the problem calls for a website, a digital product or a system — and, within that, whether the answer is a redesign, automation, integration, AI or custom development.`,
    ariaPricingTabs: `Territories we work in · L A Cabral`,
    tabAutomacao: `Websites`,
    tabConectada: `Products`,
    tabSistemas: `Systems`,
    tabAquisicao: `Acquisition`,

    solFaqHeading: `Questions about our solutions`,
    faqQ1: `Do you only build websites?`,
    faqA1: `No, but websites and web experiences are a strong focus — redesign, UX/UI and visual direction are often the most common starting point. We also build digital products and, when the diagnosis points there, systems, automation and AI. The path depends on the problem, not a fixed package.`,
    faqQ2: `Do you develop apps and digital products?`,
    faqA2: `Yes. When the diagnosis points that way, we design navigable prototypes, early-stage products (MVPs) and custom apps, always starting from a well-defined scope.`,
    faqQ3: `Do you build e-commerce and digital sales projects?`,
    faqA3: `Yes, when that's the bottleneck we identify: online ordering journeys, digital catalogs and sales structures, scoped according to the complexity of integrations and the payment flow.`,
    faqQ7: `Do you work on improving systems that already exist?`,
    faqA7: `Yes. We assess what's already in use to spot bottlenecks, redesign interfaces, build integrations, or create new workflows on top of what's already working — instead of replacing for the sake of replacing.`,
    faqQ11: `Does Acquisition and Conversion replace the website, or is it the same as running ad campaigns?`,
    faqA11: `Neither. The website handles presentation and the digital experience, and we don't run media campaigns or generate traffic. Acquisition and Conversion starts the moment someone shows interest: the page that receives that contact, qualification, the CRM, WhatsApp, follow-up and, when it makes sense, the AI that helps organize each contact.`,
    faqQ12: `How does AI fit into this?`,
    faqA12: `In an applied way, not as a generic promise: it helps interpret answers from a form or diagnostic, summarize a contact's context before a human takes over, and support prioritizing who to talk to first. The final decision and the relationship stay with your team.`,
    faqQ4: `How do I know which solution is right for my business?`,
    faqA4: `You don't need to know. In an initial, no-commitment conversation, we map how your operation, sales and customer service work to point you to the simplest path that solves the problem.`,

    // ── PROJECTS / CASES ─────────────────────────────────────
    docTitleCases: `Projects — L A Cabral`,
    metaDescCases: `Four design and technology projects — Pesca Delivery, Sartec Papelaria, UNIEDU and Grupo Almeida — with the problem, analysis, solution and result of each.`,
    metaOgTitleCases: `Projects — L A Cabral`,
    metaOgDescCases: `The problem, analysis, solution and result of each project.`,
    casesPageHeading: `Four projects, four kinds of problem.`,

    ecosystemSectionTag: `Case · Sartec Papelaria`,
    ecosystemSectionHeading: `How Sartec Papelaria became a connected ecosystem.`,
    ecosystemSectionSubtitle: `The site presents, the school list routes, WhatsApp receives, AI handles triage and the dashboard organizes the team.`,
    caseSartecShotAlt: `Sartec Papelaria homepage, captured on desktop.`,
    ariaSartecMediaLink: `Open the Sartec Papelaria website in a new tab`,
    ariaUniEduMediaLink: `Open the UniEdu prototype in a new tab`,
    ariaAlmeidaMediaLink: `Open the Grupo Almeida staging site in a new tab`,
    caseAlmeidaShotAlt: `Grupo Almeida staging site homepage, captured on desktop.`,

    caseFactTypeLabel: `Type`,
    caseFactTypeValue: `Website + digital ecosystem`,
    caseFactScopeLabel: `Scope`,
    caseFactScopeValue: `Website, WhatsApp, AI and internal dashboard`,

    caseSolutionLabel: `Solution`,
    caseResultLabel: `Result`,
    caseCapabilitiesLabel: `Capabilities used`,


    caseBadgeUX: `UX/UI`,
    caseBadgeAutomacao: `Automation`,
    caseBadgeIA: `Applied AI`,
    caseBadgeIntegracoes: `Integrations`,
    caseBadgeRedesign: `Redesign`,
    caseBadgeArquitetura: `Information architecture`,
    caseBadgeDirecao: `Visual direction`,
    caseBadgeResponsividade: `Responsiveness`,
    caseBadgePrototipagem: `Prototyping`,
    caseBadgeIdentidade: `Visual identity`,

    ecoFlow1Title: `Website and visual presence`,
    ecoFlow1Desc: `Presents the stationery store, its services and products with its own identity.`,
    ecoFlow2Title: `School lists and products`,
    ecoFlow2Desc: `Routes the right customer to the right order, without wasting time.`,
    ecoFlow3Title: `WhatsApp`,
    ecoFlow3Desc: `Receives contact and keeps the conversation in a single channel.`,
    ecoFlow4Title: `AI triage`,
    ecoFlow4Desc: `Identifies the type of demand before it reaches a team member.`,
    ecoFlow5Title: `Service dashboard`,
    ecoFlow5Desc: `Organizes conversations, orders and ownership in one place.`,
    ecoFlow6Title: `Team and departments`,
    ecoFlow6Desc: `Each demand reaches whoever should actually handle it.`,
    ecoFlow7Title: `Automation and reports`,
    ecoFlow7Desc: `Automates repetitive tasks and organizes information to follow the operation.`,

    // ── HOW WE WORK ───────────────────────────────────────────
    docTitleComoTrab: `How we work — L A Cabral`,
    metaDescComoTrab: `Four phases, starting from the operation's diagnosis — not the tool. See how L A Cabral runs every project.`,
    metaOgTitleComoTrab: `How we work — L A Cabral`,
    metaOgDescComoTrab: `We understand the operation, design the path, implement and measure — in that order.`,

    comoTrabTag: `How we work`,
    comoTrabHeading: `We understand the operation before choosing the tool.`,
    comoTrabIntro: `We don't start with the tool, we start with the problem in your operation. This page covers how we think, how we run a project and how we get started.`,
    processHeading: `Our four-phase process`,
    pilotDesc: `We don't start with the tool, we start with the problem in your operation. Each phase exists to make sure the final solution is simple, usable and the right size for the problem.`,
    midPageCtaText: `Want to talk about your project?`,
    midPageCtaLink: `Chat on WhatsApp now →`,

    processTypeTag: `Not every project moves at the same pace`,
    processTypeHeading: `What changes depending on the type of problem`,
    processTypeIntro: `The four phases stay the same. What changes is how deep each one goes, depending on what the operation calls for.`,

    contractingTag: `How we get started`,
    contractingHeading: `How a project gets started`,
    pricingDesc: `Every project starts with a no-commitment conversation. Scope is defined after we understand your operation — not before.`,

    contractingGroup1: `Before we start`,
    contracting1Title: `Initial diagnosis`,
    contracting1Desc: `We start with a no-commitment conversation to understand your operation and point you to the best path.`,
    contracting2Title: `Scope defined together`,
    contracting2Desc: `What's included in the project is aligned with you before any proposal.`,
    contracting3Title: `Personalized proposal`,
    contracting3Desc: `Each proposal is built according to the scope, complexity and specific needs of the project.`,

    contractingGroup2: `During the project`,
    contracting4Title: `Implementation with a closed scope`,
    contracting4Desc: `Covers the design and build work up to the first delivery, within the agreed scope.`,
    contracting5Title: `Monthly fee for ongoing operation`,
    contracting5Desc: `Projects with automation, dashboards or active infrastructure include a monthly fee to keep the operation running.`,

    contractingGroup3: `After delivery`,
    contracting6Title: `Closed scope or ongoing support`,
    contracting6Desc: `Some projects end at delivery. Others include ongoing support and evolution contracted separately.`,
    contracting7Title: `Training when applicable`,
    contracting7Desc: `Projects that change the team's routine include training to ensure day-to-day use.`,
    contracting8Title: `Recurring support when needed`,
    contracting8Desc: `Available for anyone who depends on maintenance, adjustments or ongoing monitoring.`,

    comoTrabFaqHeading: `Questions about getting started`,
    faqQ5: `Why is the investment defined after a review?`,
    faqA5: `Because every solution starts from the diagnosis of your operation — the investment varies according to scope: number of pages or screens, database needs, integrations, the volume of automation and the support required.`,
    faqQ6: `Is the monthly support fee mandatory?`,
    faqA6: `It depends on the type of solution. For simple websites and pages, support and maintenance can be arranged on demand. For internal dashboards, AI automation, APIs or applications that depend on active servers, maintenance is essential to keep the operation running.`,
    faqQ8: `Does the project include follow-up after delivery?`,
    faqA8: `The standard scope covers up to the first stable delivery. Ongoing follow-up and evolution are available separately, especially for systems and automation that change the team's routine.`,
    faqQ9: `Can the project be paid in installments?`,
    faqA9: `Yes. Installments can be arranged according to the scope, timeline and type of project. These details are aligned in the proposal, after the initial review.`,
    faqQ10: `Do you issue invoices?`,
    faqA10: `Yes. The contract is with L A CABRAL LTDA, with an invoice issued according to the approved proposal.`,

    // ── ABOUT ──────────────────────────────────────────────────
    docTitleSobre: `About — L A Cabral`,
    metaDescSobre: `Learn about the method behind L A Cabral, formed inside a commercial operation, and who leads the solutions today: Lucas Cabral.`,
    metaOgTitleSobre: `About L A Cabral`,
    metaOgDescSobre: `A method formed inside a commercial operation of more than 30 years, applied today to different companies.`,

    tagOrigin: `Origin of the method`,
    originHeading: `A method formed inside a commercial operation.`,
    originDesc: `Before founding L A Cabral, Lucas Cabral lived a commercial operation from the inside: customer service, orders, demand organization and management at a stationery store with more than 30 years of history. That experience made it clear that growing without organizing processes costs time, sales and clarity — and that well-applied technology solves that without having to reinvent the company. Today, that way of seeing problems shapes how L A Cabral operates across different companies.`,
    originCard1Title: `Over 30 years of commercial operation`,
    originCard1Desc: `Sartec Papelaria has run a team, clients and daily business routines for more than three decades in São José dos Campos.`,
    originCard2Title: `Processes and routines`,
    originCard2Desc: `The daily flow of customer service and orders served as the basis for designing solutions that actually fit the routine of the people running it.`,
    originCard3Title: `Validated in the team's daily work`,
    originCard3Desc: `Nothing here is theoretical. We understand the routine of the people who operate it to design paths that actually work day to day.`,

    disciplinesTag: `Why it's all under one roof`,
    disciplinesHeading: `A business problem rarely respects the line between disciplines.`,
    disciplinesDesc: `Sometimes the bottleneck is in the interface. Sometimes in the process. Sometimes in communication. Sometimes in the integration between tools. Sometimes in the absence of software that doesn't exist yet. That's why L A Cabral starts with the problem — and combines the capabilities needed to solve it, instead of forcing the problem to fit inside a single specialty.`,

    tagAbout: `Who leads L A Cabral`,
    aboutHeading: `Product, operations and technology working together.`,
    aboutP1: `I'm Lucas Cabral. I work at the intersection of product, operations, design, technology, automation and AI — understanding how a company actually works before deciding what to build.`,
    aboutP2: `Product Design training comes in here as an approach, not a label: it helps start from the problem, understand brand, audience and processes, and only then design the solution — whether that's a website, a digital product, an automation or a new system.`,
    aboutQuote: `"Before choosing the tool, we understand the bottleneck that's costing time, sales or clarity."`,
    proofCard1Title: `Operations`,
    proofCard1Desc: `Hands-on experience in customer service, purchasing, finance and business management inside Sartec itself.`,
    proofCard2Title: `Product and UX/UI`,
    proofCard2Desc: `Designing journeys, screens and workflows built for customers, the team and management.`,
    proofCard3Title: `Automation and applied AI`,
    proofCard3Desc: `AI, triage, dashboards and integrations to cut rework and give more control over the operation.`,
    lucasCardRole: `Product, operations and digital solutions`,
    factFormacaoLabel: `Education`,
    factFormacaoValue: `Graduated from UFSC`,
    factEspecialidadeLabel: `Specialty`,
    factEspecialidadeValue: `Product, operations, automation and applied AI`,
    factVivenciaLabel: `Hands-on experience`,
    factVivenciaValue: `Customer service, business management and processes`,
    factEntregaLabel: `What you get`,
    factEntregaValue: `Digital solutions that are simple to operate`,
    factParaQuemLabel: `Who it's for`,
    factParaQuemValue: `Companies that already have an operation running and feel their processes have stopped keeping up with growth.`,

    // ── Rodada editorial: Home + cases (Pesca, Sartec, UNIEDU, Almeida) ──
    ctaFinalDiagLink: `Not sure yet? Take the diagnostic →`,
    fitDesc: `Orders arriving through different channels, scattered information, repetitive tasks and tools that don't connect. These are signs the operation may need a better structure.`,
    projPescaCategory: `From online store to integrated operation`,
    projPescaDesc: `A solution that connects online sales, product customization and order processing, bringing the customer experience and operational management together in a single application.`,
    projStatusPesca: `Live and in operation`,
    projPescaCtaSite: `Visit the store →`,
    ariaPescaMediaLink: `Open the Pesca Delivery store in a new tab`,
    casePescaShotAlt: `Pesca Delivery store home screen on mobile, with the Seafood and Poke paths.`,
    caseBadgeProductDesign: `Product Design`,
    caseBadgeComercio: `Digital commerce`,
    caseBadgeSistemas: `Systems`,
    caseBadgePesquisaUX: `UX research`,
    caseBadgeSiteInstitucional: `Institutional website`,
    caseProblemLabel: `Problem`,
    caseAnalysisLabel: `Analysis`,
    caseChaptersAria: `Case chapters`,
    caseFactRoleLabel: `Role`,
    caseFactContextLabel: `Context`,
    caseFactPeriodLabel: `Period`,
    caseRoleValue: `Product Design, UX/UI and development`,
    caseBack: `← All projects`,
    caseNextLabel: `Next project`,
    docTitlePesca: `Pesca Delivery — L A Cabral`,
    metaDescPesca: `How L A Cabral turned the need to sell online into a digital experience connected to a fish market's operation: store, dashboard and order tracking.`,
    metaOgTitlePesca: `Pesca Delivery — case — L A Cabral`,
    metaOgDescPesca: `From online store to integrated operation.`,
    pescaTag: `Case · Pesca Delivery`,
    pescaHeading: `Far beyond an online store.`,
    pescaSubtitle: `How we turned the need to sell online into a digital experience connected to the operation of a fish market.`,
    pescaTypeValue: `Digital commerce + operations`,
    pescaScopeValue: `Public store, operations dashboard and order tracking`,
    pescaProblemLead: `Selling online was only the beginning.`,
    pescaProblemText: `Pesca is a fish market in Florianópolis, Brazil, that handled almost everything over WhatsApp. Moving sales online looked simple, but the products follow different commercial rules — fixed or per-weight pricing, whole fish sold by the unit with the final weight set during fulfilment, preparation options and pokes assembled by the customer. On top of that, each order had to reach the team with enough information to be read and fulfilled correctly.`,
    pescaAnalysisLead: `The experience had to connect customer and operation.`,
    pescaAnalysisText: `Analysing the commercial domain revealed two inseparable journeys: the customer discovers, configures, buys and tracks; the team receives, interprets, prepares and completes. WhatsApp remains a conversation channel, but the order has to exist correctly inside the system. A few decisions guided the design:`,
    pescaAnalysisL1: `Separate purchase intent (units) from how it is priced (weight)`,
    pescaAnalysisL2: `Preserve the commercial terms agreed when the order is placed`,
    pescaAnalysisL3: `Never estimate weight: real weighing happens in the operation`,
    pescaAnalysisL4: `No customer login in the first version, to cut steps`,
    pescaAnalysisL5: `An MVP that is minimal in scope, not in quality — with Store and Dashboard consistent with each other`,
    pescaSolutionLead: `An integrated experience, from discovery to fulfilment.`,
    pescaSolutionText: `Two surfaces of one system. In the public store, customers browse the catalogue, customize products, build their own poke, choose pickup or delivery and follow the order through a public link. In the operations dashboard, the team receives, organizes, prepares and completes orders, maintains the catalogue, prices and availability, and handles exceptions.`,
    pescaResultLead: `A running application, not just a prototype.`,
    pescaResultText: `The MVP is live and used in the operation, with real orders being processed. The team manages the catalogue and customers follow their order through a public link. The store can be installed as an app (PWA), the team gets an alert for new orders, and the business gained after-sales, commercial indicators and product analytics. The project is in an operate-and-observe phase: what comes next is guided by real use, not by imagined features.`,
    pescaResultNote: `There is no proven measurement yet of impact on sales, conversion or time saved — so we don't publish numbers.`,
    pescaSurfacesTag: `The two surfaces`,
    pescaSurfacesHeading: `One order, from the first tap to delivery.`,
    pescaSurfacesIntro: `Not every feature carries the same weight. These are the ones that best show how the purchase connects to the operation.`,
    pescaStoreTitle: `Public store`,
    pescaStoreL1: `Catalogue with products sold by unit and by weight`,
    pescaStoreL2: `Preparation options and customization per product`,
    pescaStoreL3: `Poke Builder with an always-visible summary`,
    pescaStoreL4: `Persistent cart and checkout`,
    pescaStoreL5: `Pickup or delivery`,
    pescaStoreL6: `Public order tracking`,
    pescaStoreL7: `Local customer continuity, no login`,
    pescaPanelTitle: `Operations dashboard`,
    pescaPanelL1: `Receiving and tracking orders`,
    pescaPanelL2: `Preparation and completion, with a consistent history`,
    pescaPanelL3: `Catalogue, price and availability management`,
    pescaPanelL4: `Exception handling`,
    pescaPanelL5: `New-order alerts`,
    pescaPanelL6: `After-sales`,
    pescaPanelL7: `Commercial overview`,
    pescaPanelNote: `The dashboard is restricted-access and isn't shown here, to protect operational data.`,
    pescaStoriesTag: `UX decisions`,
    pescaStoriesHeading: `Three decisions that changed the experience.`,
    pescaStory1Title: `Poke Builder: from wizard to continuous composition`,
    pescaStory1Text: `The first version followed a step-by-step flow, and review showed an interaction that felt too much like a form. The Builder evolved into a continuous vertical composition, with a persistent summary, consistent editing and add-ons shown in the right context.`,
    pescaStory2Title: `Weight-based pricing, without false precision`,
    pescaStory2Text: `A whole fish is chosen by the unit, but its price depends on its real weight. The interface shows the price per kilo, makes clear the sale is by the unit and doesn't invent an estimate: weighing happens in the operation, which sets the final amount.`,
    pescaStory3Title: `Operations built around action`,
    pescaStory3Text: `The dashboard was designed so the team can carry out orders, not just look at numbers. It prioritizes the actions of the moment and keeps events and history consistent, including in exceptions — such as the controlled reversal of a cancellation.`,
    pescaVisualTag: `Visual identity`,
    pescaVisualQuote: `“The interface is dark, but the food is not.”`,
    pescaVisualText: `The visual direction matured into a Dark Premium: a graphite and warm-black interface with the brand gold as its only accent — so the bright, luminous food photography leads the purchase.`,
    pescaGalleryHeading: `The store in use`,
    pescaShot1: `Home`,
    pescaShot1Alt: `Pesca Delivery store home screen, with the Seafood and Poke paths.`,
    pescaShot2: `Price per kilo, sold by the unit`,
    pescaShot2Alt: `Product list with whole fish, price per kilo and a note that they are sold by the unit.`,
    pescaShot3: `Preparation options`,
    pescaShot3Alt: `Fish detail with a unit selector and no-cost preparation options.`,
    pescaShot4: `Poke Builder`,
    pescaShot4Alt: `Poke assembly with extra proteins, the bowl price and an add-to-cart button.`,
    pescaGalleryNote: `Captures of the live public store. The “closed now” notice reflects opening hours.`,
    caseBadgeSistemasPainel: `Systems and dashboard`,
    caseBadgeAnalytics: `Product analytics`,
    docTitleSartec: `Sartec Papelaria — L A Cabral`,
    metaDescSartec: `How L A Cabral connected a website, WhatsApp, AI triage and an internal dashboard into a single service flow for Sartec Papelaria.`,
    metaOgTitleSartec: `Sartec Papelaria — case — L A Cabral`,
    metaOgDescSartec: `A connected ecosystem, not isolated pages.`,
    sartecProblemLead: `The challenge wasn't just improving the digital presence.`,
    sartecProblemText: `With more than 30 years in business and a heavy seasonal routine — especially during school-list season — Sartec relied on manual conversations at the counter and on WhatsApp. At peak demand, orders arrived through different channels with no organization between who was asking, who was quoting and who was picking the order, and management had no visibility into progress. The first contact, the identification of each request and the organization of the team's work had to be connected.`,
    sartecAnalysisLead: `The problem wasn't volume. It was the lack of a single flow.`,
    sartecAnalysisText: `The analysis started from observing real service — at the counter, on WhatsApp and while picking orders — and mapping the existing flow. Separating symptom from cause, the bottleneck was in the handoff between who asks, who quotes and who picks. That showed the website, customer service and management had to be treated as parts of one flow, not as independent projects.`,
    sartecSolutionLead: `A connected ecosystem.`,
    sartecSolutionText: `We designed a connected ecosystem: a website that presents the operation and routes by school list, a single WhatsApp channel, an AI layer for initial triage, and an internal dashboard that organizes conversations, orders and ownership — all seven parts implemented as a single flow, not as separate deliverables.`,
    sartecResultLead: `An ecosystem delivered and used in daily service.`,
    sartecResultText: `The team works from a single WhatsApp channel, AI does the initial triage before handing off to a team member, and the dashboard gives management a view of the service queue. Adjustments keep coming from the feedback of the people who use it.`,
    sartecResultNote: `There is no formal measurement yet of time saved or sales — so we don't publish numbers.`,
    ecoFlowHeading: `The seven parts of the ecosystem`,
    docTitleUniedu: `UNIEDU — L A Cabral`,
    metaDescUniedu: `From research with students to a navigable prototype of an educational app: a Product Design and prototyping case by L A Cabral.`,
    metaOgTitleUniedu: `UNIEDU — case — L A Cabral`,
    metaOgDescUniedu: `From research to the concept of an educational app.`,
    unieduTag: `Case · UNIEDU`,
    unieduHeading: `From research to the concept of an educational app.`,
    unieduSubtitle: `How the needs of online-course students became a product proposal — research, UX/UI and a navigable prototype, without requiring the app to be in production.`,
    unieduTypeValue: `Product Design and prototyping`,
    unieduScopeValue: `UX research, product strategy, UX/UI and a navigable prototype`,
    unieduContextValue: `Training project, developed as a pair with Najme Simon Alé`,
    unieduPeriodValue: `About 8 months, from research to validation`,
    unieduProblemLead: `Studying online takes consistency — and consistency fades.`,
    unieduProblemText: `Distance courses face four recurring frictions: loss of weekly rhythm, low perception of progress, a feeling of isolation and rewards with no perceived value. UNIEDU starts from them to propose an app that helps students keep the habit — not an isolated visual redesign. The opportunity question: how might we reward students' real effort and turn consistency into habit?`,
    unieduAnalysisLead: `Research before screens.`,
    unieduAnalysisText: `Product decisions rested on several sources of evidence:`,
    unieduAnalysisL1: `Supporting research on dropout and retention in online courses`,
    unieduAnalysisL2: `Benchmark of apps and platforms such as Duolingo, Kahoot and Alura`,
    unieduAnalysisL3: `A survey and one-on-one interviews with online-course students`,
    unieduAnalysisL4: `Two personas — Sofia and Marcos — and their full journeys`,
    unieduAnalysisL5: `Wireframes, a high-fidelity prototype and moderated usability tests with 5 participants`,
    unieduSolutionLead: `A continuous-learning platform with visible progress.`,
    unieduSolutionText: `The app combines progress visible from the home screen, an adjustable study plan, rewards with perceived value, community and AI support inside the lesson itself. Decisions such as optional rankings, temporary onboarding and a dark mode with its own palette connect what the research showed to the interface.`,
    unieduResultLead: `A navigable prototype, assessed with users.`,
    unieduResultText: `The result is a navigable mobile prototype with light and dark themes. In testing, the study-plan, lesson, briefing and store flows were completed without blockers; community and points redemption showed friction — partly due to how the task was worded — and became opportunities for refinement.`,
    unieduResultNote: `UNIEDU is a prototype, not an app in operation. The proposed retention and engagement indicators have not been measured yet.`,
    unieduEvidenceTag: `Evidence`,
    unieduEvidenceHeading: `From sketch to prototype.`,
    unieduEvidenceIntro: `The process left artifacts at every stage — from paper to a navigable prototype.`,
    unieduFig1: `Paper sketch of the learning path`,
    unieduFig1Alt: `Hand-drawn sketch of a winding path on a phone screen, with a unicorn at the top.`,
    unieduFig2: `Home screen wireframe`,
    unieduFig2Alt: `Grayscale wireframe of the home screen, with progress, learning path, current lesson, cases and study plan.`,
    unieduFig3: `Navigable prototype — sign-in screen`,
    unieduFig3Alt: `UNIEDU prototype sign-in screen in dark mode, with a pink glass unicorn.`,
    unieduJourneyCaption: `Journey map: from discovery to loyalty, with pain points and product opportunities.`,
    unieduJourneyAlt: `Board of sticky notes with the journey map: stages down the side and, across the top, context, actions, thoughts, feelings, pain points and opportunities.`,
    unieduWhyTag: `When it makes sense`,
    unieduWhyHeading: `Research and prototype before you build.`,
    unieduWhyText: `UNIEDU shows that a company can commission research, design and prototyping before deciding on a full development: the idea is studied, tested with real people and communicated in a navigable form, and the decision to invest is made with better information.`,
    unieduWhyCta: `Talk about a digital product`,
    unieduOpenCase: `Read the case documentation →`,
    docTitleAlmeida: `Grupo Almeida — L A Cabral`,
    metaDescAlmeida: `How L A Cabral structured the Grupo Almeida institutional website: one narrative for companies working across different fronts of the environmental sector.`,
    metaOgTitleAlmeida: `Grupo Almeida — case — L A Cabral`,
    metaOgDescAlmeida: `One group, several companies, one narrative.`,
    almeidaTag: `Case · Grupo Almeida`,
    almeidaHeading: `One group, several companies, one narrative.`,
    almeidaSubtitle: `How we structured the Grupo Almeida institutional website to present, clearly, companies that work on different fronts of the environmental sector.`,
    almeidaTypeValue: `Institutional website`,
    almeidaScopeValue: `Content architecture, UX/UI and a website in Portuguese and English`,
    almeidaProblemLead: `Several companies, one fragmented presence.`,
    almeidaProblemText: `Grupo Almeida brings together Almeida Ambiental, Almeida Equipamentos and Saturno Ambiental — complementary fronts, with a history that began in 1985. The previous digital presence fragmented these companies and didn't convey the group's solidity, scale and structure to customers, suppliers and partners.`,
    almeidaAnalysisLead: `Who reads, and what they need to find.`,
    almeidaAnalysisText: `We mapped the audiences — customers, suppliers, partners and national and international organizations — and the content that supports the group's reputation: history, units, technology, sustainability and international presence. One editorial rule guided the work: no number, date or partner goes in without a source or client validation.`,
    almeidaSolutionLead: `A website that presents the group and keeps each company's identity.`,
    almeidaSolutionText: `An institutional home page, a history page, one page for each company and a contact directory by unit. Real photography shapes the layout, the typography is editorial, and Saturno Ambiental keeps its own identity within the group.`,
    almeidaResultLead: `Built and in staging.`,
    caseBadgePWA: `PWA`,
    almeidaSitemapTag: `Site structure`,
    almeidaSitemapHeading: `Six areas, organized by audience and by company.`,
    almeidaSitemapIntro: `The site is also available in English. The structure keeps the companies as parts of one group, without fragmenting the navigation.`,
    almeidaPageHome: `Group home`,
    almeidaPageHistory: `Our history`,
    almeidaPageContact: `Contact by unit`,
    almeidaResultText: `The website has been built, including in English, and is published in a staging environment for client validation. Final publication — domain and infrastructure — is still to be decided with Grupo Almeida, so there are no usage results to show.`,
  },
};

function applyTranslations(lang) {
  const dict = I18N[lang] || I18N.pt;
  document.documentElement.setAttribute('lang', lang === 'en' ? 'en-US' : 'pt-BR');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (attr && key && dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });
  });

  document.querySelectorAll('[data-wa-key]').forEach(el => {
    const key = el.getAttribute('data-wa-key');
    if (dict[key] !== undefined) {
      el.setAttribute('href', `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(dict[key])}`);
    }
  });

  const btnPt = document.getElementById('langBtnPt');
  const btnEn = document.getElementById('langBtnEn');
  if (btnPt && btnEn) {
    const isEn = lang === 'en';
    btnPt.classList.toggle('is-active', !isEn);
    btnEn.classList.toggle('is-active', isEn);
    btnPt.setAttribute('aria-pressed', String(!isEn));
    btnEn.setAttribute('aria-pressed', String(isEn));
  }

  // Re-measure any open FAQ panel so its height isn't left clipped to the old text.
  document.querySelectorAll('.faq-item.is-open').forEach(item => {
    const panel = item.querySelector('.faq-a');
    const inner = item.querySelector('.faq-a__inner');
    if (panel && inner) panel.style.height = inner.offsetHeight + 'px';
  });

  // PT/EN pode quebrar linha diferente — avisa quem precisa remedir
  // geometria de texto (Grid Light Occlusion) sem acoplar os dois módulos.
  window.dispatchEvent(new Event('la:languagechange'));
}

function getCurrentLang() {
  return document.documentElement.getAttribute('lang') === 'en-US' ? 'en' : 'pt';
}

function setLanguage(lang) {
  applyTranslations(lang);
  localStorage.setItem('sartec_lang', lang);
}

(() => {
  const saved = localStorage.getItem('sartec_lang');
  applyTranslations(saved === 'en' ? 'en' : 'pt');

  const btnPt = document.getElementById('langBtnPt');
  const btnEn = document.getElementById('langBtnEn');
  if (btnPt) btnPt.addEventListener('click', () => setLanguage('pt'));
  if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
})();

// ── Header scroll ─────────────────────────────────────────────
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile burger menu ────────────────────────────────────────
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('click', e => {
  if (nav.classList.contains('is-open') && !nav.contains(e.target) && !burger.contains(e.target)) {
    closeMenu();
  }
});

function closeMenu() {
  nav.classList.remove('is-open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ── Smooth scroll ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
  });
});

// ── FAQ accordion ─────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const btn   = item.querySelector('.faq-q');
  const panel = item.querySelector('.faq-a');
  const inner = item.querySelector('.faq-a__inner');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.faq-item.is-open').forEach(other => {
      if (other !== item) {
        other.classList.remove('is-open');
        other.querySelector('.faq-a').style.height = '0';
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      }
    });

    if (isOpen) {
      item.classList.remove('is-open');
      panel.style.height = '0';
      btn.setAttribute('aria-expanded', 'false');
    } else {
      item.classList.add('is-open');
      panel.style.height = inner.offsetHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Fade-in on scroll ─────────────────────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
);

// .territory saiu desta lista: agora tem seu próprio motor de entrada no
// mobile (scrollytelling, ver mais abaixo) — a classe .fade-up genérica
// competiria com ele (os dois mexeriam na mesma opacidade/transform).
// .case-story__chapter entrou: no mobile ele nunca é tocado por JS
// (o Case Story Rail só liga no desktop, ≥1025px), então o reveal
// genérico é seguro ali e evita um motor novo só para isso.
['.ba-row', '.eco-card', '.origin-card', '.pricing-card', '.pilot-step', '.showcase-primary', '.showcase-secondary', '.commitment-item', '.case-story__chapter', '.eco-flow__node'].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });
});

// ── Pricing card selection ────────────────────────────────────
const planCards = document.querySelectorAll('[data-plan-card]');
planCards.forEach(card => {
  const selectCard = () => {
    planCards.forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
  };

  card.addEventListener('click', () => {
    selectCard();
  });

  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
      }
      selectCard();
    }
  });
});

// ── Package details — global sync toggle ────────────────
const pricingGrid = document.querySelector('.pricing__grid');
if (pricingGrid) {
  const pkgToggles = document.querySelectorAll('.pkg-details__toggle');
  const pkgBodies  = document.querySelectorAll('.pkg-details__body');
  const pkgIcons   = document.querySelectorAll('.pkg-details__icon');

  pkgToggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      const open = pricingGrid.classList.toggle('is-details-open');
      pkgToggles.forEach(t => t.setAttribute('aria-expanded', String(open)));
      pkgIcons.forEach(icon => { icon.textContent = open ? '×' : '+'; });
      pkgBodies.forEach(b => {
        if (open) b.removeAttribute('hidden');
        else b.setAttribute('hidden', '');
      });
    });
  });
}

// ── Pricing tabs (mobile) ─────────────────────────────────────
(() => {
  const tabs = document.querySelectorAll('.pricing-tab');
  const cards = document.querySelectorAll('.pricing-card');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1. Update tabs active state
      tabs.forEach(t => {
        t.classList.remove('pricing-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('pricing-tab--active');
      tab.setAttribute('aria-selected', 'true');

      // 2. Update cards active state
      const targetId = tab.getAttribute('aria-controls');
      cards.forEach(card => {
        if (card.id === targetId) {
          card.classList.add('is-active-tab');
          card.classList.add('is-selected');
        } else {
          card.classList.remove('is-active-tab');
          card.classList.remove('is-selected');
        }
      });
    });
  });
})();

// ── Global grid energy trail effect ─────────────────────────────
// Dois canvases globais (não um por seção/card): .grid-trails (DARK,
// mix-blend-mode:screen, inalterado) e .grid-trails-light (LIGHT,
// mix-blend-mode:multiply — ver comentário em styles.css sobre por que
// um único blend mode não serve os dois fundos). Mesmo path/branches,
// mesmos listeners, mesmo loop de rAF — só o passe final de desenho
// escreve no contexto certo por retângulo.
(() => {
  const canvas = document.querySelector('.grid-trails');
  const canvasLight = document.querySelector('.grid-trails-light');
  if (!canvas || !canvasLight) return;

  const canUsePointerEffect = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canUsePointerEffect || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  const ctxLight = canvasLight.getContext('2d');
  const GRID = 72;
  const PRIMARY_LIFE_MIN = 950;
  const PRIMARY_LIFE_MAX = 1400;
  const SECONDARY_LIFE_MIN = 550;
  const SECONDARY_LIFE_MAX = 950;
  const SAMPLE_THROTTLE = 40; // ms
  const MAX_NODES = 80;
  const BRANCH_THROTTLE = 70; // ms
  const MAX_BRANCHES = 60;
  const SCROLL_THROTTLE = 70; // ms
  const MAX_SCROLL_STEPS = 6;

  // Chain of recent grid intersections the cursor (or a scroll sweep) has
  // passed through, newest last — segments are drawn connecting consecutive
  // nodes, brighter toward the newest (cursor-ward) end. This is the
  // brighter "spine" of the trail.
  let path = [];
  // Short-lived secondary glows on grid lines 1-2 cells away from the
  // spine, giving the trail a circuit/mesh feel instead of a single line.
  let branches = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let lastSampleTime = 0;
  let lastBranchTime = 0;
  let lastScrollTime = 0;
  let lastCellX = null;
  let lastCellY = null;
  let lastMouseX = null;
  let lastMouseY = null;
  let lastScrollY = window.scrollY;
  let rafId = null;

  // ── Grid Light Occlusion ────────────────────────────────────────
  // Elementos marcados com data-grid-occlude (explícito, nunca h1/p
  // genérico) definem zonas onde o RASTRO interativo precisa parar de
  // aparecer — o grid estático de fundo continua. A leitura de
  // getBoundingClientRect() só acontece aqui (load/resize/i18n change/
  // fonte carregada), nunca dentro do loop de desenho: guardamos a
  // posição relativa ao documento (docTop) e cada frame só faz
  // aritmética (docTop - scrollY) para achar a posição atual na
  // viewport — sem medir DOM a cada frame.
  // Declarado antes de resize()/sizeCanvas() porque resize() roda de
  // forma síncrona logo abaixo e já chama measureOcclusionZones().
  //
  // QA de estabilização (profiling real): ctx.filter = blur() aplicado
  // a cada frame era o custo dominante das páginas com mais zonas
  // (Cases/Soluções) — isolar essa única linha via A/B eliminou 100%
  // dos long tasks medidos. A borda suave agora é pré-renderizada UMA
  // vez por zona (aqui, junto da medição) num canvas offscreen — "carimbo"
  // já com o blur aplicado — e cada frame só faz um drawImage() barato
  // (composição de bitmap, sem recalcular convolução nenhuma).
  const OCCLUDE_MARGIN = 32; // "margem de segurança" ao redor do texto (24-40px pedido)
  const OCCLUDE_FEATHER = 22; // raio do blur do carimbo — borda suave, não corte reto
  const STAMP_PAD = OCCLUDE_FEATHER * 2; // espaço extra no carimbo para o blur não cortar na borda
  let occlusionZones = []; // { docTop, left, width, height, stamp, stampW, stampH }

  function buildOcclusionStamp(coreW, coreH) {
    const stampW = coreW + STAMP_PAD * 2;
    const stampH = coreH + STAMP_PAD * 2;
    const stamp = document.createElement('canvas');
    stamp.width = Math.max(1, Math.round(stampW * dpr));
    stamp.height = Math.max(1, Math.round(stampH * dpr));
    const sctx = stamp.getContext('2d');
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.filter = `blur(${OCCLUDE_FEATHER}px)`;
    sctx.fillStyle = '#000';
    sctx.fillRect(STAMP_PAD, STAMP_PAD, coreW, coreH);
    return { stamp, stampW, stampH };
  }

  function measureOcclusionZones() {
    const scrollY = window.scrollY;
    occlusionZones = Array.from(document.querySelectorAll('[data-grid-occlude]')).map(el => {
      const r = el.getBoundingClientRect();
      const coreW = r.width + OCCLUDE_MARGIN * 2;
      const coreH = r.height + OCCLUDE_MARGIN * 2;
      const { stamp, stampW, stampH } = buildOcclusionStamp(coreW, coreH);
      return {
        docTop: r.top + scrollY, left: r.left, width: r.width, height: r.height,
        stamp, stampW, stampH,
      };
    });
  }
  measureOcclusionZones();
  // Texto pode mudar de altura ao trocar PT/EN (quebra de linha diferente)
  // — a própria troca de idioma já dispara um 'resize' lógico aqui.
  window.addEventListener('la:languagechange', measureOcclusionZones);
  window.addEventListener('load', measureOcclusionZones);
  // Fonte web pode terminar de carregar (e trocar largura/quebra de
  // linha do texto) depois do 'load' — sem isso a zona ficava com o
  // tamanho da fonte de fallback, pequena/deslocada demais.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measureOcclusionZones);
  }

  // Aplicado depois do path/branches, ainda dentro do clip da seção
  // (ver paintSurface): "apaga" o rastro já desenhado onde ele cruza uma
  // zona de leitura, compondo o carimbo pré-borrado com destination-out —
  // a mesma técnica em ambos os canvases (DARK e LIGHT), sem duplicar
  // lógica. Zonas fora da viewport atual são puladas (barato: é só uma
  // comparação numérica, não uma medição).
  function occludeReadingZones(targetCtx) {
    if (!occlusionZones.length) return;
    const scrollY = window.scrollY;
    targetCtx.save();
    targetCtx.globalCompositeOperation = 'destination-out';
    for (const z of occlusionZones) {
      const coreTop = z.docTop - scrollY - OCCLUDE_MARGIN;
      const coreLeft = z.left - OCCLUDE_MARGIN;
      const destLeft = coreLeft - STAMP_PAD;
      const destTop = coreTop - STAMP_PAD;
      if (destLeft > width || destLeft + z.stampW < 0 || destTop > height || destTop + z.stampH < 0) continue;
      targetCtx.drawImage(z.stamp, destLeft, destTop, z.stampW, z.stampH);
    }
    targetCtx.restore();
  }

  // Posição de cada section.chapter-grid, medida uma vez (load/resize/
  // troca de idioma) e guardada relativa ao documento — ver comentário
  // completo em getInteractiveRects(), que consome este cache fazendo só
  // aritmética por frame. Declarado antes de resize() pelo mesmo motivo
  // do bloco de oclusão acima: resize() chama measureChapterGridZones()
  // de forma síncrona logo abaixo.
  let chapterGridZones = []; // { docTop, left, width, height, surface }

  function measureChapterGridZones() {
    const scrollY = window.scrollY;
    chapterGridZones = Array.from(document.querySelectorAll('section.chapter-grid')).map(section => {
      const r = section.getBoundingClientRect();
      return { docTop: r.top + scrollY, left: r.left, width: r.width, height: r.height, surface: section.dataset.surface };
    });
  }

  function sizeCanvas(el, elCtx) {
    el.width = Math.round(width * dpr);
    el.height = Math.round(height * dpr);
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    elCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    sizeCanvas(canvas, ctx);
    sizeCanvas(canvasLight, ctxLight);
    measureOcclusionZones();
    measureChapterGridZones();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('la:languagechange', measureChapterGridZones);
  window.addEventListener('load', measureChapterGridZones);

  function pushNode(x, y, boost, bornOverride) {
    const born = bornOverride !== undefined ? bornOverride : performance.now();
    path.push({
      x, y, t: born, boost: boost === undefined ? 1 : boost,
      life: PRIMARY_LIFE_MIN + Math.random() * (PRIMARY_LIFE_MAX - PRIMARY_LIFE_MIN),
    });
    if (path.length > MAX_NODES) path.shift();
  }

  function pushBranch(axis, fixed, p1, p2, now, peak) {
    branches.push({
      axis, fixed, p1, p2, born: now, peak,
      life: SECONDARY_LIFE_MIN + Math.random() * (SECONDARY_LIFE_MAX - SECONDARY_LIFE_MIN),
    });
    if (branches.length > MAX_BRANCHES) branches.shift();
  }

  // Lights up grid lines 1-2 cells away from (nodeX, nodeY): short parallel
  // "lane" segments, occasionally tapped to the spine with a perpendicular
  // "rung" — together they read as a small circuit branching off the path
  // rather than a single lit line.
  function spawnNetwork(nodeX, nodeY, now, boost, bypassThrottle) {
    if (!bypassThrottle) {
      if (now - lastBranchTime < BRANCH_THROTTLE) return;
      lastBranchTime = now;
    }

    [1, 2].forEach(rank => {
      const chance = rank === 1 ? 0.55 : 0.3;
      const peak = (rank === 1 ? 0.18 : 0.1) * boost;

      [-1, 1].forEach(side => {
        // Neighbor horizontal line (offset in Y) — lane runs along X.
        if (Math.random() < chance) {
          const fixedY = nodeY + side * rank * GRID;
          if (Math.random() < 0.4) {
            pushBranch('v', nodeX, nodeY, fixedY, now, peak * 0.8);
          } else {
            const len = 22 + Math.random() * 26;
            const center = nodeX + (Math.random() - 0.5) * 18;
            pushBranch('h', fixedY, center - len / 2, center + len / 2, now, peak);
          }
        }
        // Neighbor vertical line (offset in X) — lane runs along Y.
        if (Math.random() < chance) {
          const fixedX = nodeX + side * rank * GRID;
          if (Math.random() < 0.4) {
            pushBranch('h', nodeY, nodeX, fixedX, now, peak * 0.8);
          } else {
            const len = 22 + Math.random() * 26;
            const center = nodeY + (Math.random() - 0.5) * 18;
            pushBranch('v', fixedX, center - len / 2, center + len / 2, now, peak);
          }
        }
      });
    });
  }

  function advanceChain(fromX, fromY, toX, toY, now) {
    // Fill in intermediate grid steps so jumps still read as a continuous
    // chain rather than disconnected pieces.
    let stepX = fromX;
    let stepY = fromY;
    const dirX = Math.sign(toX - fromX);
    const dirY = Math.sign(toY - fromY);
    let guard = 0;
    while ((stepX !== toX || stepY !== toY) && guard < MAX_NODES) {
      if (stepX !== toX) stepX += dirX * GRID;
      else if (stepY !== toY) stepY += dirY * GRID;
      pushNode(stepX, stepY, 1);
      guard++;
    }
    spawnNetwork(toX, toY, now, 1, false);
  }

  function handlePointerMove(event) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    const now = performance.now();
    if (now - lastSampleTime < SAMPLE_THROTTLE) return;

    const cellX = Math.round(event.clientX / GRID) * GRID;
    const cellY = Math.round(event.clientY / GRID) * GRID;
    if (cellX === lastCellX && cellY === lastCellY) return;

    lastSampleTime = now;

    if (lastCellX !== null) {
      advanceChain(lastCellX, lastCellY, cellX, cellY, now);
    } else {
      pushNode(cellX, cellY, 1);
    }

    lastCellX = cellX;
    lastCellY = cellY;
    startLoop();
  }

  function handleScroll() {
    const now = performance.now();
    const currentScrollY = window.scrollY;

    if (now - lastScrollTime < SCROLL_THROTTLE) return;
    if (lastMouseX === null) {
      lastScrollY = currentScrollY;
      return;
    }

    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    if (Math.abs(deltaY) < 2) return;

    lastScrollTime = now;

    // Scrolling down moves page content up under the cursor, so the trail
    // should read as energy arriving from below (and vice versa).
    const dirSign = Math.sign(deltaY);
    const trailDir = -dirSign;
    const cellX = Math.round(lastMouseX / GRID) * GRID;
    const cellY = Math.round(lastMouseY / GRID) * GRID;
    const boost = 0.82;

    // Faster scroll covers more grid cells per processed tick, so the
    // trail naturally reads longer for a faster sweep.
    const steps = Math.min(MAX_SCROLL_STEPS, Math.max(1, Math.round(Math.abs(deltaY) / GRID)));

    // Build the chain from the far end down to the cursor cell (which is
    // pushed last/freshest) so it fades in brighter toward the cursor,
    // same as the mouse-driven trail. A slight stagger on the older end
    // makes the sweep read as energy already in motion, not a flicker.
    for (let i = steps; i >= 0; i--) {
      const y = cellY + trailDir * i * GRID;
      pushNode(cellX, y, boost, now - i * 14);
      if (i % 2 === 0) spawnNetwork(cellX, y, now, boost * 0.85, true);
    }

    lastCellX = cellX;
    lastCellY = cellY;
    startLoop();
  }

  // DARK: fundo absorve luz, o cursor revela branco/luz suave (fade-out
  // pálido perto do ponteiro), pintado em .grid-trails (mix-blend-mode:
  // screen). LIGHT: fundo reflete luz, o cursor revela o verde da marca,
  // pintado em .grid-trails-light (mix-blend-mode:multiply) — inversão
  // semântica, não matemática (ver nota em "Material B" no CSS). Mesma
  // geometria/física de path e branches para os dois; paleta + canvas de
  // destino mudam por retângulo (ver paintSurface abaixo). Alphas do
  // LIGHT recalibrados para o novo blend: "multiply" precisa de mais
  // alpha que "screen" para o mesmo grau de presença perceptível, porque
  // ele mistura com a cor de fundo em vez de somar luz.
  const PALETTE_DARK = { from: '74,222,128', to: '190,242,210', shadow: 'rgba(34,197,94,0.4)', blur: 3, scale: 1 };
  const PALETTE_LIGHT = { from: '13,110,60', to: '22,163,74', shadow: 'rgba(13,110,60,0.3)', blur: 1, scale: 1.5 };

  function drawSegment(targetCtx, x1, y1, x2, y2, alphaFrom, alphaTo, palette) {
    if (x1 === x2 && y1 === y2) return;
    const gradient = targetCtx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, `rgba(${palette.from},${alphaFrom})`);
    gradient.addColorStop(1, `rgba(${palette.to},${alphaTo})`);
    targetCtx.strokeStyle = gradient;
    targetCtx.beginPath();
    targetCtx.moveTo(x1, y1);
    targetCtx.lineTo(x2, y2);
    targetCtx.stroke();
  }

  // Os canvases são globais (position:fixed, cobrem a viewport inteira) e
  // pintam com z-index:1 — acima do fundo+grid estático de qualquer
  // section.chapter-grid, mas o mesmo elemento não pode saber, só por
  // CSS, onde é "grid verde/dark" e onde é "grid claro/light" ou
  // capítulo sólido. Por isso cada frame recorta o desenho aos
  // retângulos das .chapter-grid atualmente visíveis, separados por
  // data-surface: nada é desenhado fora deles, então o trail nunca vaza
  // para superfícies sólidas/paper sem grid nem sobre o conteúdo (que já
  // vence o canvas via z-index/ordem do DOM). Sem isso, um canvas com
  // z-index positivo apareceria por cima de todo o resto.
  //
  // QA de estabilização (profiling real): esta função fazia
  // querySelectorAll + getBoundingClientRect em toda section.chapter-grid
  // da página A CADA FRAME (~250+ leituras de layout por segundo medidas
  // na Home) — mesmo padrão de custo já resolvido no Grid Light
  // Occlusion. Mesma solução: a posição de cada section é medida uma vez
  // (load/resize/troca de idioma, ver measureChapterGridZones, declarada
  // acima junto do resto do estado medido só em load/resize) e guardada
  // relativa ao documento; cada frame só faz aritmética (docTop -
  // scrollY), igual à oclusão.
  function getInteractiveRects() {
    const scrollY = window.scrollY;
    const darkRects = [];
    const lightRects = [];
    for (const z of chapterGridZones) {
      const top = z.docTop - scrollY;
      if (top + z.height > 0 && top < height && z.left + z.width > 0 && z.left < width) {
        (z.surface === 'light' ? lightRects : darkRects).push({ top, left: z.left, width: z.width, height: z.height });
      }
    }
    return { darkRects, lightRects };
  }

  function paintSurface(targetCtx, rects, palette) {
    const now = performance.now();

    targetCtx.save();
    targetCtx.beginPath();
    rects.forEach(r => targetCtx.rect(r.left, r.top, r.width, r.height));
    targetCtx.clip();

    targetCtx.lineWidth = 1.3;
    targetCtx.shadowColor = palette.shadow;
    targetCtx.shadowBlur = palette.blur;

    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];

      // Only connect nodes that are genuinely adjacent on the grid (one
      // step apart on a single axis) — anything else is a seam between
      // unrelated chain segments (e.g. mouse path vs. a scroll-injected
      // sweep) and must stay disconnected.
      const sameAxis = a.x === b.x || a.y === b.y;
      const stepDist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
      if (!sameAxis || stepDist !== GRID) continue;

      const ageA = now - a.t;
      const ageB = now - b.t;
      if (ageA > a.life && ageB > b.life) continue;

      const boost = (a.boost + b.boost) / 2;
      const fadeA = Math.min(1, Math.max(0, 1 - ageA / a.life) * 0.16 * boost * palette.scale);
      const fadeB = Math.min(1, Math.max(0, 1 - ageB / b.life) * 0.4 * boost * palette.scale);
      if (fadeA <= 0.01 && fadeB <= 0.01) continue;

      drawSegment(targetCtx, a.x, a.y, b.x, b.y, fadeA, fadeB, palette);
    }

    for (const br of branches) {
      const age = now - br.born;
      const t = age / br.life;
      const alpha = Math.min(1, Math.sin(Math.PI * t) * br.peak * palette.scale);
      if (alpha <= 0.01) continue;

      if (br.axis === 'h') {
        drawSegment(targetCtx, br.p1, br.fixed, br.p2, br.fixed, alpha * 0.7, alpha, palette);
      } else {
        drawSegment(targetCtx, br.fixed, br.p1, br.fixed, br.p2, alpha * 0.7, alpha, palette);
      }
    }

    occludeReadingZones(targetCtx);

    targetCtx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctxLight.clearRect(0, 0, width, height);
    const now = performance.now();

    path = path.filter(node => now - node.t < node.life);
    branches = branches.filter(b => now - b.born < b.life);

    const { darkRects, lightRects } = getInteractiveRects();
    if (darkRects.length === 0 && lightRects.length === 0) {
      if (path.length > 1 || branches.length > 0) {
        rafId = requestAnimationFrame(draw);
      } else {
        rafId = null;
      }
      return;
    }

    if (darkRects.length) paintSurface(ctx, darkRects, PALETTE_DARK);
    if (lightRects.length) paintSurface(ctxLight, lightRects, PALETTE_LIGHT);

    if (path.length > 1 || branches.length > 0) {
      rafId = requestAnimationFrame(draw);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(draw);
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', () => {
    lastCellX = null;
    lastCellY = null;
    lastMouseX = null;
    lastMouseY = null;
  });
  window.addEventListener('scroll', handleScroll, { passive: true });
})();

// ── Projetos (Home) — scrollytelling com scrub contínuo ─────────
// Progresso real do scroll dentro de .proj-scroll__track → um único
// número contínuo (posição do projeto, 0..N-1) → transform/opacity
// escritos direto via style a cada frame. Nenhuma transition CSS
// controla essas propriedades: a posição do scroll É a timeline (se o
// usuário parar em 42% de uma transição, os elementos ficam exatamente
// em 42%; rolar de volta reverte na mesma proporção).
// Ativa (.is-enhanced) em qualquer largura, sem prefers-reduced-motion —
// só sem JS (ou com reduced-motion) o HTML base (empilhado) é o
// resultado final. QA visual: deixou de ser exclusivo de desktop — o
// mobile ganha a mesma física de scrub, só com layout de card empilhado
// (ver CSS, bloco "Mobile/tablet") em vez do grid lado a lado.
//
// Física compartilhada com o scrollytelling mobile de "O que fazemos"
// (ver mais abaixo) — mesmas fórmulas, sem duplicar: uma trilha
// repouso/transição vira uma posição contínua (0..N-1), que vira
// enter/recede por item. Generalizada para N arbitrário (o código
// original tinha B1..B4 fixos, corretos só para N=3 — item 4 nunca
// seria alcançado); para N=3 com HOLD=0.24/TRANS=0.14 o resultado é
// idêntico ao original (a soma 3·HOLD+2·TRANS já fechava em 1.0).
function stScrollPosition(p, N, HOLD, TRANS) {
  if (N < 2) return 0;
  const total = N * HOLD + (N - 1) * TRANS;
  const t = Math.max(0, Math.min(1, p)) * total;
  for (let i = 0; i < N - 1; i++) {
    const holdEnd = i * (HOLD + TRANS) + HOLD;
    const transEnd = holdEnd + TRANS;
    if (t <= holdEnd) return i;
    if (t <= transEnd) return i + (t - holdEnd) / TRANS;
  }
  return N - 1;
}
function stEnterRecede(pos, i) {
  const delta = pos - i;
  return {
    enter: Math.min(1, Math.max(0, delta + 1)),
    recede: Math.min(1, Math.max(0, delta)),
    isCurrent: Math.abs(delta) < 0.5,
  };
}
//
// Cada .proj-scroll__item é uma ficha completa (número, texto, tags,
// CTA e mockup juntos) que se move como UMA unidade — não texto e
// mockup em camadas separadas. A ficha que entra sobe de
// translateY(100%) até 0% por cima da anterior (z-index estático
// crescente por índice: quem vem depois sempre cobre quem veio antes,
// nos dois sentidos do scroll); a ficha que está sendo coberta recebe
// só uma reação secundária discreta (leve translateY negativo + scale
// levemente para baixo) — ela nunca desaparece antes de ser coberta.
// Fade na entrada existe só no desktop (0.92→1), como acabamento — no
// mobile a ficha entra 100% opaca desde o início do slide (ver
// ENTER_OPACITY_FROM_MOBILE): translúcida por cima da ficha anterior
// (ainda visível, parada, por baixo) dava a sensação de "nascer de
// dentro" dela, que a rodada pediu para eliminar especificamente no
// mobile — o desktop preserva a física original, intocada.
(() => {
  const track = document.getElementById('projScrollTrack');
  if (!track) return;

  const stage = track.querySelector('.proj-scroll__stage');
  const stageInner = track.querySelector('.proj-scroll__stage-inner');
  const items = Array.from(track.querySelectorAll('.proj-scroll__item'));
  if (!stage || !stageInner || items.length === 0) return;

  // Opacity vai no CONTEÚDO (painel + coluna do visual), nunca no item
  // inteiro: o item carrega o fundo opaco da ficha (a "capa" que cobre
  // fisicamente a anterior), e opacity<1 nele deixaria esse fundo
  // parcialmente transparente — a ficha de baixo vazaria por trás como
  // um fantasma bem no momento em que ela devia estar coberta. Só
  // transform (translateY/scale) vai no item, pra fundo e conteúdo se
  // moverem juntos como uma unidade só.
  const contentEls = items.map(it => [
    it.querySelector('.proj-scroll__panel'),
    it.querySelector('.proj-scroll__visual-wrap'),
  ].filter(Boolean));
  const rulerFills = Array.from(track.querySelectorAll('.proj-scroll__ruler-fill'));
  const N = items.length;

  // Trilha dividida em repouso/transição/repouso/transição/repouso —
  // os repousos ocupam a maior parte, as transições são curtas.
  // Com 3 fichas: valores originais (N=3 idêntico ao que sempre foi). Com
  // 4+, repouso/transição ficam um pouco mais curtos e a trilha cresce de
  // 300vh para 340vh (ver #projScrollTrack em styles.css) — o repouso por
  // projeto continua em ~45vh de rolagem em vez de comprimir cada ficha.
  const HOLD = N > 3 ? 0.21 : 0.24;
  const TRANS = N > 3 ? 0.12 : 0.14;

  // QA visual (correção pontual) — a distância de entrada NÃO pode ser
  // "100% da altura do próprio card": quando o card tem altura diferente
  // da janela real (stage-inner, ver containerHeight), ele não anda o
  // suficiente para sair completamente da área visível antes de "iniciar"
  // a entrada — ficava parcialmente visível esperando a vez. A distância
  // agora é em PIXELS, baseada na altura real do palco (containerHeight)
  // + uma margem de segurança, então o topo do card sempre para, no
  // repouso "abaixo", pelo menos SAFETY_GAP px depois da borda inferior
  // real da janela — nunca dentro dela, não importa a altura do card.
  const SAFETY_GAP = 32;
  const RECEDE_SHIFT_PX = 22;
  const RECEDE_SCALE = 0.985;
  const ENTER_OPACITY_FROM_DESKTOP = 0.92;
  const ENTER_OPACITY_FROM_MOBILE = 1;
  const RECEDE_OPACITY_TO = 0.88;

  const desktopQuery = window.matchMedia('(min-width: 1025px)');
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let enhanced = false;
  let observing = false;
  let rafId = null;
  let resizeRafId = null;
  let stageHeight = 0;
  let containerHeight = 0;
  let currentFlags = items.map(() => null);

  function eligible() {
    return !reduceQuery.matches;
  }

  function setInteractive(item, isCurrent) {
    item.setAttribute('aria-hidden', String(!isCurrent));
    item.querySelectorAll('a').forEach(a => {
      if (isCurrent) a.removeAttribute('tabindex');
      else a.setAttribute('tabindex', '-1');
    });
  }

  // Mobile: a altura do card não é um valor arbitrário — é o maior
  // conteúdo natural entre os três projetos, medido de verdade (cada
  // .proj-scroll__item é position:absolute mas sem "bottom"/height
  // definidos, então a altura renderizada já é a altura de conteúdo,
  // mesmo posicionado). Escrita em --proj-mobile-card-h (CSS lê com
  // fallback) e limitada à altura do palco, para nunca pedir mais
  // espaço do que a viewport tem disponível. Desktop não precisa disso:
  // a moldura já é dimensionada em vh/px fixos (ver CSS).
  function measureMobileCardHeight() {
    let maxH = 0;
    items.forEach(it => {
      // offsetHeight (altura de layout) em vez de getBoundingClientRect(): este
      // ignora o transform scale() aplicado às fichas em transição e subestimava
      // a ficha mais alta em ~1,5%, cortando o último botão no mobile.
      const h = it.offsetHeight;
      if (h > maxH) maxH = h;
    });
    const cap = stageHeight || maxH;
    stageInner.style.setProperty('--proj-mobile-card-h', `${Math.round(Math.min(maxH, cap))}px`);
  }

  function measure() {
    stageHeight = stage.getBoundingClientRect().height;
    if (!desktopQuery.matches) measureMobileCardHeight();
    // Depois de measureMobileCardHeight() (que já pode ter escrito uma
    // nova altura no mobile) para refletir o valor atual em qualquer
    // largura — no desktop já é o min(72vh,600px) fixo do CSS.
    containerHeight = stageInner.getBoundingClientRect().height;
  }

  function frame() {
    rafId = null;

    // Uma única leitura de layout por frame.
    const rect = track.getBoundingClientRect();
    const scrollable = rect.height - stageHeight;
    const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    const pos = stScrollPosition(p, N, HOLD, TRANS);
    const enterOpacityFrom = desktopQuery.matches ? ENTER_OPACITY_FROM_DESKTOP : ENTER_OPACITY_FROM_MOBILE;
    const offstage = containerHeight + SAFETY_GAP;

    for (let i = 0; i < N; i++) {
      const { enter, recede, isCurrent } = stEnterRecede(pos, i);

      const translateY = (1 - enter) * offstage - recede * RECEDE_SHIFT_PX;
      const scale = 1 - recede * (1 - RECEDE_SCALE);
      const enterOpacity = enterOpacityFrom + enter * (1 - enterOpacityFrom);
      const opacity = enterOpacity * (1 - recede * (1 - RECEDE_OPACITY_TO));

      const item = items[i];
      item.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      const opacityStr = opacity.toFixed(3);
      contentEls[i].forEach(el => { el.style.opacity = opacityStr; });

      if (currentFlags[i] !== isCurrent) {
        currentFlags[i] = isCurrent;
        setInteractive(items[i], isCurrent);
      }
    }

    const globalProgress = N > 1 ? pos / (N - 1) : 1;
    rulerFills.forEach(f => { f.style.transform = `scaleX(${globalProgress.toFixed(3)})`; });

    if (enhanced && observing) rafId = requestAnimationFrame(frame);
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      observing = entry.isIntersecting;
      if (observing && enhanced) startLoop();
    });
  }, { rootMargin: '200px 0px 200px 0px' });

  function resetInline() {
    items.forEach((it, i) => {
      it.style.transform = '';
      it.style.zIndex = '';
      it.removeAttribute('aria-hidden');
      it.querySelectorAll('a').forEach(a => a.removeAttribute('tabindex'));
      contentEls[i].forEach(el => { el.style.opacity = ''; });
    });
    rulerFills.forEach(f => { f.style.transform = ''; });
    currentFlags = items.map(() => null);
  }

  function enable() {
    if (enhanced) return;
    enhanced = true;
    track.classList.add('is-enhanced');
    // Quem vem depois sempre cobre quem veio antes, nos dois sentidos
    // do scroll — ordem fixa, não recalculada a cada frame.
    items.forEach((it, i) => { it.style.zIndex = String(i); });
    measure();
    startLoop();
  }

  function disable() {
    if (!enhanced) return;
    enhanced = false;
    track.classList.remove('is-enhanced');
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    resetInline();
  }

  function sync() {
    if (eligible()) enable(); else disable();
    if (enhanced) measure();
  }

  window.addEventListener('resize', () => {
    if (resizeRafId) return;
    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = null;
      sync();
      if (enhanced) startLoop();
    });
  }, { passive: true });

  desktopQuery.addEventListener('change', sync);
  reduceQuery.addEventListener('change', sync);

  // Fonte web e imagens podem mudar a altura do conteúdo depois do primeiro
  // cálculo — remede quando terminarem de carregar.
  const remeasure = () => { sync(); if (enhanced) startLoop(); };
  window.addEventListener('load', remeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);

  io.observe(track);
  sync();
})();

// ── "O que fazemos" (Home) — scrollytelling mobile só ─────────────
// Mesma física dos Projetos acima (stScrollPosition/stEnterRecede
// compartilhadas, sem duplicar a matemática), mas só liga abaixo de
// 1025px: no desktop os quatro territórios continuam lado a lado, e os
// wrappers .territories-scroll__track/__stage nem existem para o layout
// (display:contents, ver CSS) até esta classe ligar. Item = .territory
// (fundo opaco fica nele, ver CSS is-enhanced); conteúdo que recebe
// fade no recede = .territory__card (a casca interna, transparente
// neste modo — só o item por trás tem cor, então opacity<1 no card
// nunca "vaza" nada por trás dele).
(() => {
  const track = document.getElementById('territoriesScrollTrack');
  if (!track) return;

  const stage = track.querySelector('.territories-scroll__stage');
  const stageInner = track.querySelector('.territories-grid');
  const items = Array.from(track.querySelectorAll('.territory'));
  if (!stage || !stageInner || items.length === 0) return;

  const cards = items.map(it => it.querySelector('.territory__card'));
  const N = items.length;

  const HOLD = 0.26;
  const TRANS = 0.16;
  const SAFETY_GAP = 32;
  const RECEDE_SHIFT_PX = 18;
  const RECEDE_SCALE = 0.985;
  // Entra 100% opaco desde o início do slide (mesmo motivo do mobile dos
  // Projetos): translúcido por cima do território anterior, ainda
  // parado por baixo, lia como "nascer de dentro" dele.
  const ENTER_OPACITY_FROM = 1;
  const RECEDE_OPACITY_TO = 0.88;

  const mobileQuery = window.matchMedia('(max-width: 1024px)');
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let enhanced = false;
  let observing = false;
  let rafId = null;
  let resizeRafId = null;
  let stageHeight = 0;
  let containerHeight = 0;
  let currentFlags = items.map(() => null);

  function eligible() {
    return mobileQuery.matches && !reduceQuery.matches;
  }

  function setInteractive(item, isCurrent) {
    item.setAttribute('aria-hidden', String(!isCurrent));
    item.querySelectorAll('a').forEach(a => {
      if (isCurrent) a.removeAttribute('tabindex');
      else a.setAttribute('tabindex', '-1');
    });
  }

  // Altura real do maior território (não um valor arbitrário) — mesmo
  // método de measureMobileCardHeight() acima: cada .territory é
  // position:absolute sem "bottom"/height definidos, então a altura
  // renderizada já é a de conteúdo.
  function measureCardHeight() {
    let maxH = 0;
    items.forEach(it => {
      const h = it.getBoundingClientRect().height;
      if (h > maxH) maxH = h;
    });
    const cap = stageHeight || maxH;
    stageInner.style.setProperty('--terr-mobile-card-h', `${Math.round(Math.min(maxH, cap))}px`);
  }

  function measure() {
    stageHeight = stage.getBoundingClientRect().height;
    measureCardHeight();
    containerHeight = stageInner.getBoundingClientRect().height;
  }

  function frame() {
    rafId = null;
    const rect = track.getBoundingClientRect();
    const scrollable = rect.height - stageHeight;
    const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    const pos = stScrollPosition(p, N, HOLD, TRANS);
    const offstage = containerHeight + SAFETY_GAP;

    for (let i = 0; i < N; i++) {
      const { enter, recede, isCurrent } = stEnterRecede(pos, i);

      const translateY = (1 - enter) * offstage - recede * RECEDE_SHIFT_PX;
      const scale = 1 - recede * (1 - RECEDE_SCALE);
      const enterOpacity = ENTER_OPACITY_FROM + enter * (1 - ENTER_OPACITY_FROM);
      const opacity = enterOpacity * (1 - recede * (1 - RECEDE_OPACITY_TO));

      const item = items[i];
      item.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      if (cards[i]) cards[i].style.opacity = opacity.toFixed(3);

      if (currentFlags[i] !== isCurrent) {
        currentFlags[i] = isCurrent;
        setInteractive(item, isCurrent);
      }
    }

    if (enhanced && observing) rafId = requestAnimationFrame(frame);
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      observing = entry.isIntersecting;
      if (observing && enhanced) startLoop();
    });
  }, { rootMargin: '200px 0px 200px 0px' });

  function resetInline() {
    items.forEach((it, i) => {
      it.style.transform = '';
      it.style.zIndex = '';
      it.removeAttribute('aria-hidden');
      it.querySelectorAll('a').forEach(a => a.removeAttribute('tabindex'));
      if (cards[i]) cards[i].style.opacity = '';
    });
    currentFlags = items.map(() => null);
  }

  function enable() {
    if (enhanced) return;
    enhanced = true;
    track.classList.add('is-enhanced');
    items.forEach((it, i) => { it.style.zIndex = String(i); });
    measure();
    startLoop();
  }

  function disable() {
    if (!enhanced) return;
    enhanced = false;
    track.classList.remove('is-enhanced');
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    resetInline();
  }

  function sync() {
    if (eligible()) enable(); else disable();
    if (enhanced) measure();
  }

  window.addEventListener('resize', () => {
    if (resizeRafId) return;
    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = null;
      sync();
      if (enhanced) startLoop();
    });
  }, { passive: true });

  mobileQuery.addEventListener('change', sync);
  reduceQuery.addEventListener('change', sync);

  io.observe(track);
  sync();
})();

// ── Case Story Rail (case-*.html: Pesca, Sartec, UNIEDU, Almeida) — desktop só ──
// (nasceu em cases.html para o case Sartec; agora cada case tem página
// própria, com quatro capítulos — o motor lê N do DOM, nada é fixo em 3.)
// QA de estabilização: a versão anterior calculava um progresso de
// scroll contínuo por rAF (getBoundingClientRect a cada frame, mesmo
// parada) para decidir o capítulo ativo — profiling real mostrou que
// o custo dominante desta página nunca foi esse rAF, e sim o blur do
// Grid Light Occlusion (ver occludeReadingZones em script.js), mas a
// arquitetura em si também não permitia tabs clicáveis nem controle
// direto do usuário. Substituída por: sticky (CSS) + 3 sensores de
// 1px observados por um único IntersectionObserver — troca de
// capítulo é um evento discreto (nenhum cálculo por frame), e as
// abas 01/02/03 agora são <button role="tab"> reais, clicáveis e
// navegáveis por teclado. Só liga no desktop (≥1025px): no mobile os
// três capítulos já são painéis sólidos em fluxo normal com reveal
// via .fade-up (ver lista mais acima) — nenhum JS extra precisa
// tocar neles.
(() => {
  const track = document.getElementById('caseStoryTrack');
  if (!track) return;

  const chapters = Array.from(track.querySelectorAll('.case-story__chapter'));
  const railItems = Array.from(track.querySelectorAll('.case-story__rail-item'));
  const railFill = track.querySelector('.case-story__rail-fill');
  const sensors = Array.from(track.querySelectorAll('.case-story__sensor'));
  if (chapters.length === 0) return;

  const N = chapters.length;
  const desktopQuery = window.matchMedia('(min-width: 1025px)');
  // Mesmo critério dos outros dois motores (Projetos/Territórios): sticky
  // (o palco fica fixo enquanto o resto da página rola por baixo dele) é
  // o tipo de movimento que prefers-reduced-motion pede para desligar —
  // sob reduced-motion cai no mesmo fallback do mobile (3 painéis sólidos
  // em fluxo normal, sem JS tocando neles).
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let enhanced = false;
  let io = null;
  let activeIndex = 0;

  function setActive(i) {
    activeIndex = i;
    chapters.forEach((ch, idx) => {
      ch.classList.toggle('is-active', idx === i);
    });
    railItems.forEach((btn, idx) => {
      const isActive = idx === i;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });
    if (railFill) {
      const progress = N > 1 ? i / (N - 1) : 1;
      railFill.style.transform = `scaleX(${progress})`;
    }
  }

  function onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(Number(entry.target.dataset.chapter));
      }
    });
  }

  function enable() {
    if (enhanced) return;
    enhanced = true;
    track.classList.add('is-enhanced');
    setActive(activeIndex);
    if (sensors.length && !io) {
      io = new IntersectionObserver(onIntersect, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      sensors.forEach(s => io.observe(s));
    }
  }

  function disable() {
    if (!enhanced) return;
    enhanced = false;
    track.classList.remove('is-enhanced');
    if (io) { io.disconnect(); io = null; }
    // Fora do modo enhanced, .is-active não tem efeito visual (o CSS que
    // esconde capítulos só existe dentro de .is-enhanced), mas limpamos
    // os atributos ARIA para não descrever um estado de abas inexistente.
    railItems.forEach(btn => { btn.removeAttribute('aria-selected'); btn.removeAttribute('tabindex'); });
  }

  function eligible() {
    return desktopQuery.matches && !reduceQuery.matches;
  }

  function sync() {
    if (eligible()) enable(); else disable();
  }

  railItems.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      setActive(i);
      const sensor = sensors[i];
      if (sensor && eligible()) {
        sensor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  desktopQuery.addEventListener('change', sync);
  reduceQuery.addEventListener('change', sync);
  sync();
})();
