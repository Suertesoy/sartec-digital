# Sartec Digital

Página comercial da **Sartec Digital** — soluções digitais sob medida para pequenos e médios negócios, com foco em presença digital, sistemas internos, automações, aplicativos, fluxos de atendimento, venda digital e gestão.

## Objetivo

Apresentar a Sartec Digital como parceira de desenvolvimento sob medida, capaz de entender problemas reais de operação, atendimento, venda e experiência do cliente, e transformá-los em soluções digitais simples, usáveis e bem implementadas.

## Seções da página

| # | Seção | Descrição |
|---|---|---|
| 1 | Hero | Título, subtítulo, CTAs e selos de área de atuação |
| 2 | Antes vs Depois | Mapeamento de dores operacionais clássicas versus fluxos organizados |
| 3 | Nossa Origem | A história real nascida na operação comercial da Sartec Papelaria |
| 4 | O que entregamos | 6 verticais de serviço (Landing pages, Sistemas internos, Automações, Apps/MVPs, Agendamento, Venda digital) |
| 5 | Aplicação Real | Case prático e link de produção da Sartec Papelaria |
| 6 | Sobre Lucas | Bio do Product Designer focado em UX/UI, automações e IA aplicada à rotina real |
| 7 | Pacotes | 4 caminhos de entrada com escopo flexível (sem preços pré-definidos) |
| 8 | Comparativo | Tabela detalhada de recursos, opcionais e escopos de cada pacote |
| 9 | Como começamos | 4 etapas do método (Entendimento → Desenho → Implementação → Ajuste) |
| 10 | FAQ | 8 perguntas frequentes com respostas honestas sobre escopo, e-commerce, apps e suporte |
| 11 | CTA final | Chamada para análise inicial gratuita e conversa sem compromisso |

## Stack

- HTML5 semântico
- CSS3 com custom properties, grid e flexbox
- JavaScript vanilla — sem dependências, sem build
- Fonte: Inter via Google Fonts
- Botão flutuante de WhatsApp

**Sem framework. Sem npm. Sem build command.**

## Como rodar localmente

Abra `index.html` diretamente no navegador. Se precisar evitar problemas de CORS:

```bash
python -m http.server 8080
# Acesse: http://localhost:8080
```

## Deploy — Vercel

Deploy automático a cada push para `main`.

Repositório: `https://github.com/Suertesoy/sartec-digital.git`

| Parâmetro | Valor |
|---|---|
| Application Preset | Other |
| Root Directory | `./` |
| Build Command | *(vazio)* |
| Output Directory | `.` |

## Estrutura de arquivos

```
sartec-digital/
├── index.html    ← página principal (11 seções)
├── styles.css    ← design system + todos os estilos
├── script.js     ← header scroll, menu mobile, FAQ accordion, fade-in
└── README.md
```

## Personalização rápida

- **Número do WhatsApp**: substituir `5512997863832` no `index.html` pelo número real
- **Cores primárias**: variável `--blue` em `:root` no `styles.css`

---

© 2025 Sartec Digital · Soluções digitais sob medida
