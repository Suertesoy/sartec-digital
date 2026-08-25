# L A Cabral

Site institucional da **L A Cabral** — a empresa entra na operação de empresas em crescimento e organiza atendimento, vendas e processos internos com software, automação e IA.

## Posicionamento

Não começamos pela ferramenta, começamos pelo problema. A L A Cabral entende onde uma operação está perdendo tempo, vendas ou clareza e só depois define se a resposta é automação, integração de ferramentas existentes ou um sistema sob medida.

## Páginas

| Página | Arquivo | Conteúdo |
|---|---|---|
| Home | `index.html` | Hero, reconhecimento do problema, forma de pensar, três formas de atuação, case principal, para quem fazemos sentido, capacidades, método (4 fases), projetos, CTA final |
| Soluções | `solucoes.html` | As três formas de atuação (automação de atendimento e rotinas · operação conectada · sistemas operacionais sob medida), com FAQ |
| Projetos | `cases.html` | Case completo da Sartec Papelaria — case de cliente, contexto → resultado — e demais projetos |
| Como trabalhamos | `como-trabalhamos.html` | Processo em 4 fases, como o processo muda por tipo de problema, formas de contratação |
| Sobre | `sobre.html` | Origem do método (formado na vivência de Lucas Cabral dentro da Sartec), por que produto/design/software/automação/IA convivem na mesma empresa, e quem conduz (Lucas Cabral) |

## Assets de marca

A marca tem três níveis de uso — não são intercambiáveis:

| Uso | Arquivo | Quando usar |
|---|---|---|
| Símbolo isolado | `assets/la-cabral-symbol-white.png` | Header, favicon-scale, qualquer contexto pequeno onde só o símbolo LA cabe |
| Símbolo (verde) | `assets/la-cabral-symbol-green.png` | Variante verde do símbolo, para fundos claros ou aplicações que pedem a cor de marca em vez de branco |
| Assinatura (símbolo + "L A CABRAL") | `assets/la-cabral-signature-white.png` | Footer e qualquer aplicação institucional maior — símbolo + wordmark juntos, **sem** o descritor "Soluções Digitais" |
| Texto "L A Cabral" corrido | HTML/CSS normal (`.brand__label`, `<strong>`) | Sempre que o nome aparecer como texto comum na interface — não é logo, é tipografia |

Os três PNGs acima têm fundo real transparente (extraídos por chroma-key dos masters abaixo — nunca redesenhados). `SOLUÇÕES DIGITAIS` é um descritor, não parte inseparável da marca: a marca precisa funcionar sem ele, por isso a assinatura de uso corrente não o inclui.

Masters originais (não usar direto na interface — têm fundo sólido, servem só de fonte para gerar novos recortes):
- `assets/LOGO L A CABRAL ICONE - BASE.png` — símbolo em alta resolução
- `assets/LOGO L A CABRAL - BASE.png` — composição completa (símbolo + wordmark + "Soluções Digitais")

`assets/favicon-32.png`, `assets/apple-touch-icon.png` já são recortes quadrados com fundo sólido (correto para favicon/ícone de app — não precisam de transparência).

`LOGO_SO_SARTEC_CONTORNO_BRANCO_OFICIAL.png` (raiz do projeto) é a marca real da **Sartec Papelaria** (cliente/case), não da antiga Sartec Digital — preservado como material do case, hoje sem uso na interface.

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

© 2025 L A CABRAL LTDA
