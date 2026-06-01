# Sartec Digital

Landing page institucional da **Sartec Digital** — frente de soluções digitais da Sartec.

## Objetivo da página

Apresentar a Sartec Digital como uma frente de produtos e serviços digitais da Sartec, posicionando Lucas Alves Cabral como Product Designer focado em experiência do usuário, automação e construção de soluções digitais para pequenos e médios negócios.

## Seções

| Seção | Descrição |
|---|---|
| Hero | Proposta de valor principal com CTAs |
| Problema | Dores comuns de PMEs com atendimento digital |
| Soluções | 6 serviços com descrição orientada a benefícios |
| Processo | Método de trabalho em 6 etapas |
| Sobre | Apresentação de Lucas Alves Cabral |
| Projetos | Projeto referência: CRM e Agente de Atendimento Sartec |
| Para quem é | Perfis de negócio atendidos |
| Contato | CTA final com link para WhatsApp |

## Stack

- HTML5 semântico
- CSS3 (custom properties, grid, flexbox)
- JavaScript vanilla (sem dependências)
- Fonte: Inter via Google Fonts

**Sem frameworks. Sem build. Sem npm.**

## Como rodar localmente

Abra `index.html` diretamente no navegador:

```bash
# Com Python (opcional — só para evitar CORS em recursos locais)
python -m http.server 8080
# Acesse: http://localhost:8080
```

Ou simplesmente abra o arquivo `index.html` no browser.

## Deploy — Vercel

O deploy é **automático** a cada push para a branch `main`.

Repositório conectado: `https://github.com/Suertesoy/sartec-digital.git`

Configuração da Vercel:

| Parâmetro | Valor |
|---|---|
| Application Preset | Other |
| Root Directory | `./` |
| Build Command | *(vazio)* |
| Output Directory | `.` |

## Estrutura de arquivos

```
sartec-digital/
├── index.html   ← página principal
├── styles.css   ← todos os estilos
├── script.js    ← interações (header scroll, menu mobile, fade-in, smooth scroll)
└── README.md
```

## Personalização rápida

- **Número do WhatsApp**: buscar `wa.me/5512999999999` no `index.html` e substituir pelo número real
- **Textos**: editar diretamente no `index.html`
- **Cores**: variáveis CSS em `:root` no início do `styles.css`

---

© 2025 Sartec Digital · Uma frente de soluções da Sartec
