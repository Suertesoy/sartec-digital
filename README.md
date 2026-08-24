# Sartec Digital

Site institucional da **Sartec Digital** — a empresa entra na operação de empresas em crescimento e organiza atendimento, vendas e processos internos com software, automação e IA.

## Posicionamento

Não começamos pela ferramenta, começamos pelo problema. A Sartec entende onde uma operação está perdendo tempo, vendas ou clareza e só depois define se a resposta é automação, integração de ferramentas existentes ou um sistema sob medida.

## Páginas

| Página | Arquivo | Conteúdo |
|---|---|---|
| Home | `index.html` | Hero, reconhecimento do problema, forma de pensar, três formas de atuação, case principal, para quem fazemos sentido, capacidades, método (4 fases), projetos, CTA final |
| Soluções | `solucoes.html` | As três formas de atuação (automação de atendimento e rotinas · operação conectada · sistemas operacionais sob medida), com FAQ |
| Projetos | `cases.html` | Case completo da Sartec Papelaria (contexto → resultado) e demais projetos |
| Como trabalhamos | `como-trabalhamos.html` | Processo em 4 fases, como o processo muda por tipo de problema, formas de contratação |
| Sobre | `sobre.html` | Origem da Sartec, por que produto/design/software/automação/IA convivem na mesma empresa, e quem conduz (Lucas Cabral) |

## Stack

- HTML5 semântico, uma página por rota (sem framework de front-end)
- CSS3 com custom properties, grid e flexbox (`styles.css`) + Tailwind apenas como pipeline de build (`src/tailwind-input.css` → `assets/css/tailwind.css`)
- JavaScript vanilla (`script.js`) — i18n PT/EN, menu, FAQ, seleção de cards, efeito de grid no fundo
- Fonte: Outfit via Google Fonts

## Como rodar localmente

```bash
python -m http.server 8080
# Acesse: http://localhost:8080
```

## Build

```bash
npm install
npm run build   # compila assets/css/tailwind.css
```

## Deploy — Vercel

Deploy automático a cada push para `main`. Build command: `npm run build:css` (ver `vercel.json`).

## Personalização rápida

- **Número do WhatsApp**: `WA_NUMBER` em `script.js`, usado para montar todos os links `wa.me`
- **Textos PT/EN**: objeto `I18N` em `script.js` (chaves espelhadas em `data-i18n` no HTML)
- **Cores e tokens**: `:root` em `styles.css`

---

© 2025 Sartec Digital
