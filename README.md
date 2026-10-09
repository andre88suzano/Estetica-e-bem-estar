# Penha Andreia — Estética & Bem-Estar

Site institucional em Next.js App Router, React e TypeScript, preparado para deploy na Vercel. O visual usa CSS próprio, componentes enxutos e fundos ambientais sem dependência de animação pesada.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Configuração

Copie `.env.example` para `.env.local` se quiser substituir os padrões:

- `NEXT_PUBLIC_GA_ID`: identificador GA4 `G-0SWSLV6CF6`.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: telefone em formato internacional, apenas dígitos (`5527992540574`, conforme o contato que consta no arquivo local anterior).
- `NEXT_PUBLIC_SITE_URL`: opcional; defina a URL de produção após o primeiro deploy ou quando um domínio próprio estiver definido. Sem esse valor, o build usa as URLs públicas fornecidas pela Vercel e, localmente, `http://localhost:3000`.

O GA4 é carregado com `afterInteractive`; page views são enviados pelo rastreador de rota e cliques nos CTAs de contato geram `contact_click` com o rótulo do link. A coleta real depende da publicação, da configuração de privacidade/consentimento aplicável e da validação no DebugView ou relatório em tempo real.

## Deploy na Vercel

Importe o repositório GitHub na Vercel, mantenha o preset Next.js e configure as variáveis de ambiente necessárias no projeto. Faça o deploy e valide o domínio `.vercel.app` gerado. Nenhum DNS ou domínio próprio foi alterado.

## Conteúdo ainda necessário

- Fotografia profissional real de Penha para o hero. A página pública atual exibe um retrato, mas o arquivo de imagem não está incluído neste repositório; o monograma local é apenas uma composição temporária e não representa uma fotografia.
- Fotografias reais para uma galeria. A seção vazia foi removida da página até haver imagens apropriadas.
- Os três relatos exibidos foram transcritos do conteúdo existente na Vercel. Confirmar autorização e atualidade antes de novas edições ou republicações.
- Confirmação dos horários e da lista final de recursos utilizados no pós-operatório. O site não publica horários; a seção comunica apenas o cuidado e a necessidade de seguir a equipe de saúde responsável.
- Confirmar que WhatsApp `+55 27 99254-0574` e Instagram `@andreiamsuzano` continuam ativos antes de divulgar. Ambos aparecem no HTML local legado.

Antes de divulgar, adicione as fotografias reais, confirme os canais de contato e os serviços, execute `npm run lint`, `npx tsc --noEmit` e `npm run build`, e verifique o GA4 após o deploy.
