# Penha Andreia — Estética & Bem-Estar

Site institucional em Next.js App Router, React e TypeScript, hospedado na Vercel. A página usa composição editorial, CSS próprio e movimento ambiental leve.

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

O GA4 registra visualizações de página e cliques nos links de contato. Após o deploy, valide os eventos no DebugView ou no relatório em tempo real.

## Deploy

O projeto está vinculado à Vercel. A branch `main` publica em produção conforme a configuração do projeto. O `next.config.ts` mantém exportação estática para a configuração atual.

## Conteúdo

- O retrato real de Penha está em `assets/penha-andreia.webp`.
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
