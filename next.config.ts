import type { NextConfig } from "next";

// Site 100% estático (pasta `out/`): funciona no GitHub Pages, Vercel, Netlify...
// No GitHub Pages o site fica em /<repo>, então o workflow define NEXT_PUBLIC_BASE_PATH.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
