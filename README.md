# Sartec Digital

Página comercial da **Sartec Digital** — frente de soluções digitais da Sartec.

## Objetivo

Apresentar a Sartec Digital como uma frente de produtos e serviços digitais para pequenos e médios negócios, com foco em ecossistemas de atendimento via WhatsApp, automações, landing pages e sistemas simples de gestão.

## Seções da página

| # | Seção | Descrição |
|---|---|---|
| 1 | Hero | Título, subtítulo, CTAs e selos de área de atuação |
| 2 | Problema | 7 dores comuns de empresas que dependem do WhatsApp sem estrutura |
| 3 | Apresentação SD | Quem é a Sartec Digital e de onde surgiu |
| 4 | O que fazemos | 6 serviços com linguagem orientada a benefícios |
| 5 | Ecossistema | Solução principal em 6 módulos |
| 6 | Método | 4 etapas de trabalho (operação → fluxo → implementação → ajuste) |
| 7 | Para quem é | 10 segmentos de negócio atendidos |
| 8 | Pacotes | 4 opções de preço com valores "a partir de" |
| 9 | Sobre Lucas | Bio do Product Designer responsável pela frente |
| 10 | Piloto | Explicação do ciclo inicial de 3 meses |
| 11 | FAQ | 8 perguntas frequentes em accordion |
| 12 | CTA final | Diagnóstico gratuito via WhatsApp |

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
├── index.html    ← página principal (12 seções)
├── styles.css    ← design system + todos os estilos
├── script.js     ← header scroll, menu mobile, FAQ accordion, fade-in
└── README.md
```

## Personalização rápida

- **Número do WhatsApp**: substituir `5512999999999` no `index.html` pelo número real
- **Preços**: editar diretamente nos blocos de pricing no `index.html`
- **Cores primárias**: variável `--blue` em `:root` no `styles.css`

---

© 2025 Sartec Digital · Uma frente de soluções da Sartec
