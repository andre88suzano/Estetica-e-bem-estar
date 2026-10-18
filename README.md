# Andreia Suzano — Estética & Bem-Estar

Site institucional em Next.js App Router, React e TypeScript, hospedado na Vercel. Página única com direção visual "cuidado clínico e acolhedor": verde e champanhe, Playfair Display e Manrope (carregadas via `next/font`), CSS próprio e sem animações decorativas.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Configuração

Copie `.env.example` para `.env.local` para sobrescrever os valores padrão:

- `NEXT_PUBLIC_GA_ID`: identificador GA4.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: telefone internacional apenas com dígitos.
- `NEXT_PUBLIC_SITE_URL`: URL de produção opcional. Na Vercel, a URL do projeto é detectada automaticamente.
- `NEXT_PUBLIC_SHOW_PENDING`: `1` mostra e `0` esconde as notas de conteúdo pendente. Sem a variável, elas aparecem em `npm run dev` e nas prévias da Vercel, e nunca em produção.

O GA4 registra visualizações de página e cliques nos links de contato. Após o deploy, valide os eventos no DebugView ou no relatório em tempo real.

## Deploy

O projeto está vinculado à Vercel. A branch `main` publica em produção conforme a configuração do projeto. O `next.config.ts` mantém exportação estática para a configuração atual.

## Conteúdo

Os textos ficam em `lib/content.ts`. Seções que dependem de material real ficam ocultas enquanto as listas estiverem vazias:

- `testimonials`: depoimentos reais, com autorização por escrito. A seção "Depoimentos" aparece quando houver ao menos um.
- `serviceAreas`: cidades ou bairros atendidos, confirmados por Andreia.

Imagens de compartilhamento e ícones: `app/opengraph-image.jpg` (1200×630), `app/icon.svg` e `app/apple-icon.png`. Ao trocar o retrato, gere a imagem de compartilhamento de novo.


- O retrato real de Andreia está em `assets/andreia-suzano.webp`.
- O retrato atual é provisório; o ideal é uma foto profissional vertical, com boa luz e fundo neutro.
- A galeria foi removida até que existam fotografias reais e autorizadas dos atendimentos.
- Os relatos vêm do conteúdo público existente; confirme autorização e atualidade antes de republicá-los.
- Confirme que WhatsApp `+55 27 99254-0574` e Instagram `@andreiamsuzano` continuam ativos antes de divulgar.
- O conteúdo sobre pós-operatório orienta que a indicação e o momento de cada cuidado sejam avaliados com a equipe de saúde responsável.

## Verificações

```bash
npm run lint
npx tsc --noEmit
npm run build
```
