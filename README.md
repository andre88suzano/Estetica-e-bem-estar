# Penha Andreia — Estética & Bem-Estar

Site em **Next.js** (App Router), exportado como site 100% estático.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera a pasta out/ (site estático)
```

## Publicação

O workflow `.github/workflows/deploy.yml` faz o build e publica no **GitHub Pages**
a cada push na `main`. Em *Settings → Pages*, a origem (*Source*) precisa estar em
**GitHub Actions**. A pasta `out/` também pode ser publicada na Vercel/Netlify.

## Estrutura

- `app/page.tsx` — conteúdo da página
- `app/globals.css` — estilos e cores do site (`--sage`, `--cream`, ...)
- `components/ambient/` — fundo animado `<AmbientBackground />`

## Fundo animado

Coloque como primeiro filho de qualquer seção; o conteúdo não muda:

```tsx
<section className="services" id="servicos">
  <AmbientBackground preset="soft" />
  ...
</section>
```

Presets: `hero`, `soft`, `minimal`. Ajustes por props (`particleCount`,
`glowIntensity`, `glowTargets`, `connectionDistance`, `parallax`, `noiseOpacity`...)
ou por objeto `config`. Todos os valores padrão estão em `components/ambient/config.ts`.
