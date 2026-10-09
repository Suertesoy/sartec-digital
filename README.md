# L A Cabral

Site institucional da **L A Cabral** — empresa brasileira de design e tecnologia que desenvolve soluções digitais (sites, produtos, sistemas, automação e IA aplicada) a partir de necessidades específicas de negócio.

## Posicionamento

O site comunica quais problemas de negócio a L A Cabral resolve, como investiga cada situação, como decide qual solução faz sentido e o que efetivamente desenvolve — com projetos como evidência (Pesca Delivery, Sartec Papelaria, UNIEDU, Grupo Almeida). A porta de entrada é o diagnóstico guiado (`/diagnostico`); o WhatsApp é o contato direto. Não se promete que todo projeto precisa de software próprio, nem se afirmam resultados sem evidência.

## Páginas

| Página | Arquivo | Conteúdo |
|---|---|---|
| Home | `index.html` | Hero (CTA principal: diagnóstico guiado em `/diagnostico`), reconhecimento do problema, quatro frentes de atuação, projetos (scrollytelling com 4 fichas), como pensamos, como trabalhamos, WhatsApp |
| Soluções | `solucoes.html` | As frentes de atuação, com FAQ |
| Projetos | `cases.html` | Índice dos quatro projetos; cada ficha leva ao case completo. `cases.html#ecossistema-papelaria` redireciona para `case-sartec.html` |
| Cases | `case-pesca.html`, `case-sartec.html`, `case-uniedu.html`, `case-almeida.html` | Mesma estrutura narrativa — Problema → Análise → Solução → Resultado (Case Story Rail, 4 capítulos) — com blocos de evidência próprios de cada projeto |
| Como trabalhamos | `como-trabalhamos.html` | Processo em 4 etapas, como o processo muda por tipo de problema, formas de contratação |
| Sobre | `sobre.html` | Origem do método e quem conduz (Lucas Cabral) |
| Diagnóstico | `diagnostico.html` (rota `/diagnostico`) | Funnel Core (repositório próprio). Não editar aqui: contratos de API, scoring e persistência vivem no Funnel Core |

### Fonte da copy e do i18n

Todo texto visível é definido em **dois lugares**: o HTML (texto PT de fallback, visível sem JavaScript) e o objeto `I18N` em `script.js` (PT/EN, aplicado em runtime por `applyTranslations`). O `I18N.pt` é a fonte da verdade — ao mudar uma copy, altere o dicionário e mantenha o fallback do HTML idêntico. Um case novo segue o padrão de `case-pesca.html`.

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
