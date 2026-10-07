export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};

export interface AmbientConfig {
  /** intensidade geral (multiplica todas as camadas) */
  intensity: number;
  /** quadros por segundo do canvas — o movimento é lento, 30 já é fluido */
  fps: number;
  /** cores: nome de variável CSS do site (ex. "--sage") ou qualquer cor CSS */
  colors: { primary: string; secondary: string; soft: string; light: string };
  base: { enabled: boolean; color: string };
  gradient: { enabled: boolean; opacity: number; speed: number; sheen: boolean };
  noise: { enabled: boolean; opacity: number };
  particles: {
    enabled: boolean;
    count: number;
    minSize: number;
    maxSize: number;
    opacity: number;
    speed: number;
    /** partículas ficam mais tênues atrás destes elementos (legibilidade) */
    avoid: string;
  };
  connections: { enabled: boolean; distance: number; opacity: number; max: number; width: number };
  /** halos de luz; `targets` = seletores dentro da seção (vazio = posições padrão) */
  glow: { enabled: boolean; intensity: number; blur: number; targets: string };
  parallax: {
    enabled: boolean;
    intensity: number;
    /** deslocamento máximo de cada camada, em px */
    depth: { gradient: number; glow: number; particles: number; lines: number };
  };
  /** intensidade acompanha quanto da seção está visível */
  scroll: { enabled: boolean; min: number };
  quality: {
    /** escala do buffer da atmosfera (gradientes/halos são suaves: baixa resolução basta) */
    resolution: number;
    /** atualizações por segundo da atmosfera */
    atmosphereFps: number;
    maxDpr: number;
  };
  mobile: {
    breakpoint: number;
    particles: number;
    connections: number;
    intensity: number;
    blur: number;
    parallax: boolean;
    sheen: boolean;
    fps: number;
    maxDpr: number;
  };
}

export const DEFAULTS: AmbientConfig = {
  intensity: 1,
  fps: 30,
  colors: { primary: "--sage", secondary: "--sage-light", soft: "--sage-mid", light: "#ffffff" },
  base: { enabled: false, color: "transparent" },
  gradient: { enabled: true, opacity: 1, speed: 1, sheen: true },
  noise: { enabled: true, opacity: 0.03 },
  particles: {
    enabled: true,
    count: 28,
    minSize: 1,
    maxSize: 3,
    opacity: 0.26,
    speed: 0.15,
    avoid: "h1, h2, h3, h4, p, a, button, input, textarea, label",
  },
  connections: { enabled: true, distance: 120, opacity: 0.09, max: 4, width: 0.6 },
  glow: { enabled: true, intensity: 0.22, blur: 48, targets: "" },
  parallax: {
    enabled: true,
    intensity: 1,
    depth: { gradient: 2, glow: 4, particles: 6, lines: 3 },
  },
  scroll: { enabled: true, min: 0.6 },
  quality: { resolution: 0.2, atmosphereFps: 12, maxDpr: 1.5 },
  mobile: {
    breakpoint: 768,
    particles: 0.5,
    connections: 0.5,
    intensity: 0.85,
    blur: 0.5,
    parallax: false,
    sheen: false,
    fps: 30,
    maxDpr: 1.25,
  },
};

export const PRESETS = {
  hero: {},
  soft: {
    intensity: 0.85,
    particles: { count: 18, opacity: 0.2 },
    connections: { max: 2, opacity: 0.07 },
    glow: { intensity: 0.16 },
    gradient: { sheen: false },
  },
  minimal: {
    intensity: 0.8,
    particles: { enabled: false },
    connections: { enabled: false },
    gradient: { sheen: false },
  },
} satisfies Record<string, DeepPartial<AmbientConfig>>;

export type AmbientPreset = keyof typeof PRESETS;

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

export function merge<T>(target: T, ...sources: unknown[]): T {
  const t = target as Record<string, unknown>;
  for (const src of sources) {
    if (!isObj(src)) continue;
    for (const k of Object.keys(src)) {
      const v = src[k];
      if (isObj(v)) t[k] = merge(isObj(t[k]) ? t[k] : {}, v);
      else if (v !== undefined) t[k] = v;
    }
  }
  return target;
}

export interface ResolvedConfig extends AmbientConfig {
  isMobile: boolean;
  reduced: boolean;
  parallaxOn: boolean;
  dpr: number;
}

/** aplica preset, configuração do usuário e ajustes de mobile / reduced-motion */
export function resolveConfig(preset: AmbientPreset | undefined, user: DeepPartial<AmbientConfig> | undefined): ResolvedConfig {
  const cfg = merge(structuredClone(DEFAULTS), preset ? PRESETS[preset] : {}, user) as ResolvedConfig;
  const m = cfg.mobile;
  cfg.isMobile = window.matchMedia(`(max-width: ${m.breakpoint}px)`).matches;
  cfg.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  cfg.dpr = Math.min(window.devicePixelRatio || 1, cfg.quality.maxDpr);

  if (cfg.isMobile) {
    cfg.particles.count = Math.round(cfg.particles.count * m.particles);
    cfg.connections.max = Math.max(1, Math.round(cfg.connections.max * m.connections));
    cfg.intensity *= m.intensity;
    cfg.glow.blur *= m.blur;
    cfg.fps = Math.min(cfg.fps, m.fps);
    cfg.dpr = Math.min(cfg.dpr, m.maxDpr);
    if (!m.parallax) cfg.parallax.enabled = false;
    if (!m.sheen) cfg.gradient.sheen = false;
  }
  if (cfg.reduced) {
    cfg.particles.count = Math.round(cfg.particles.count * 0.3);
    cfg.connections.enabled = false;
    cfg.parallax.enabled = false;
    cfg.scroll.enabled = false;
    cfg.gradient.sheen = false;
  }
  cfg.parallaxOn =
    cfg.parallax.enabled && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!cfg.parallaxOn) cfg.parallax.intensity = 0;
  return cfg;
}
