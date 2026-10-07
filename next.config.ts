import type { NextConfig } from "next";

// Site 100% estático (pasta `out/`), publicado no Cloudflare Pages.
// NEXT_PUBLIC_BASE_PATH só é necessário se o site for servido num subcaminho.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
