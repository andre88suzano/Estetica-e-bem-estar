// Camadas "atmosféricas" (base, gradientes, onda de luz e halos).
// São formas muito suaves, então cada uma é desenhada num canvas pequeno
// (baixa resolução) que o navegador amplia na GPU: a própria ampliação faz
// o papel do blur, sem `filter: blur()` nem animações CSS (que eram o
// gargalo de desempenho). O parallax é só um `transform` nesse canvas.

import type { ResolvedConfig } from "../config";
import { clamp, rgba, type Box, type Palette, type RGB } from "../shared";

const TAU = Math.PI * 2;

/** canvas reduzido com margem extra para o parallax não revelar bordas */
class Buffer {
  ctx: CanvasRenderingContext2D;
  pad = 0;
  scale = 1;
  w = 0;
  h = 0;
  private tx = "";

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
  }

  resize(box: Box, pad: number, scale: number) {
    this.pad = pad;
    this.scale = scale;
    this.w = box.width;
    this.h = box.height;
    this.canvas.width = Math.max(1, Math.ceil((box.width + pad * 2) * scale));
    this.canvas.height = Math.max(1, Math.ceil((box.height + pad * 2) * scale));
    const st = this.canvas.style;
    st.inset = `${-pad}px`;
    st.width = `${box.width + pad * 2}px`;
    st.height = `${box.height + pad * 2}px`;
  }

  /** prepara o contexto para desenhar em coordenadas da seção (px) */
  begin() {
    const { ctx, scale, pad } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(scale, 0, 0, scale, pad * scale, pad * scale);
    return ctx;
  }

  /** parallax: só um transform (composição na GPU) */
  offset(ox: number, oy: number) {
    const tx = `translate3d(${ox.toFixed(2)}px,${oy.toFixed(2)}px,0)`;
    if (tx !== this.tx) {
      this.tx = tx;
      this.canvas.style.transform = tx;
    }
  }
}

/** elipse com gradiente radial (centro → borda transparente) */
function ellipse(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  stops: [number, RGB, number][],
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(rx, ry);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  for (const [at, c, a] of stops) g.addColorStop(at, rgba(c, a));
  ctx.fillStyle = g;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

interface Blob {
  cx: number; // posição relativa à seção (0..1)
  cy: number;
  rx: number;
  ry: number;
  color: keyof Palette;
  alpha: number;
  edge: number; // fração do raio onde ainda resta um pouco de cor
  edgeAlpha: number;
  period: number; // s
  drift: [number, number]; // amplitude relativa ao raio
  fade: [number, number]; // opacidade mín/máx (aparece/desaparece)
  phase: number;
}

const BLOBS: Blob[] = [
  { cx: 0.79, cy: 0.22, rx: 0.39, ry: 0.44, color: "secondary", alpha: 0.16, edge: 0.6, edgeAlpha: 0.05, period: 56, drift: [0.12, 0.1], fade: [1, 1], phase: 0 },
  { cx: 0.11, cy: 0.57, rx: 0.33, ry: 0.39, color: "light", alpha: 0.6, edge: 0.55, edgeAlpha: 0.18, period: 72, drift: [0.14, 0.1], fade: [0.5, 1], phase: 2.1 },
  { cx: 0.58, cy: 0.98, rx: 0.36, ry: 0.36, color: "soft", alpha: 0.26, edge: 0.6, edgeAlpha: 0.08, period: 88, drift: [0.16, 0.12], fade: [0.55, 0.9], phase: 4.2 },
];

export class GradientLayer {
  private buf: Buffer;

  constructor(
    canvas: HTMLCanvasElement,
    private cfg: ResolvedConfig,
    private pal: Palette,
    private seed = Math.random() * 1000,
  ) {
    this.buf = new Buffer(canvas);
  }

  resize(box: Box, pad: number) {
    this.buf.resize(box, pad, this.cfg.quality.resolution);
  }

  render(time: number) {
    const ctx = this.buf.begin();
    const { w, h } = this.buf;
    const { gradient, base } = this.cfg;
    const o = gradient.opacity;
    const t = (time + this.seed) * gradient.speed;

    if (base.enabled && base.color !== "transparent") {
      ctx.fillStyle = base.color; // variáveis CSS já resolvidas pelo engine
      ctx.fillRect(-this.buf.pad, -this.buf.pad, w + this.buf.pad * 2, h + this.buf.pad * 2);
    }

    for (const b of BLOBS) {
      const p = (TAU * t) / b.period + b.phase;
      const rx = b.rx * w;
      const ry = b.ry * h;
      const s = 1 + 0.045 * Math.sin(p * 0.8 + 1.3);
      const cx = b.cx * w + Math.sin(p) * b.drift[0] * rx;
      const cy = b.cy * h + Math.sin(p * 0.77 + 0.6) * b.drift[1] * ry;
      const fade = b.fade[0] + (b.fade[1] - b.fade[0]) * (0.5 + 0.5 * Math.sin(p * 1.1 + 2));
      const c = this.pal[b.color];
      ellipse(ctx, cx, cy, rx * s, ry * s, [
        [0, c, b.alpha * o * fade],
        [b.edge, c, b.edgeAlpha * o * fade],
        [1, c, 0],
      ]);
    }

    if (gradient.sheen) this.sheen(ctx, t, w, h, o);
  }

  /** onda de luz: atravessa a seção muito devagar e some por um tempo */
  private sheen(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, o: number) {
    const period = 52;
    const u = (((t + 17) % period) + period) % period / period;
    if (u > 0.62) return;
    const k = u / 0.62;
    const env = u < 0.2 ? u / 0.2 : u < 0.5 ? 1 - ((u - 0.2) / 0.3) * 0.4 : 0.6 * (1 - (u - 0.5) / 0.12);
    const bw = w * 0.4;
    const x = -0.55 * w + bw / 2 + k * bw * 4.2;
    ctx.save();
    ctx.translate(x, h / 2);
    ctx.rotate((16 * Math.PI) / 180);
    const g = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0);
    g.addColorStop(0, rgba(this.pal.light, 0));
    g.addColorStop(0.5, rgba(this.pal.light, 0.2 * o * clamp(env, 0, 1)));
    g.addColorStop(1, rgba(this.pal.light, 0));
    ctx.fillStyle = g;
    ctx.fillRect(-bw / 2, -h * 1.1, bw, h * 2.2);
    ctx.restore();
  }

  offset(ox: number, oy: number) {
    this.buf.offset(ox, oy);
  }
}

interface Halo {
  x: number;
  y: number;
  size: number;
  period: number;
  phase: number;
}

export class GlowLayer {
  private buf: Buffer;
  private halos: Halo[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    private cfg: ResolvedConfig,
    private pal: Palette,
  ) {
    this.buf = new Buffer(canvas);
  }

  /** posiciona halos atrás dos alvos (títulos, cards...) ou em pontos padrão */
  layout(host: Element, origin: { left: number; top: number }, box: Box, pad: number) {
    this.buf.resize(box, pad + this.cfg.glow.blur, this.cfg.quality.resolution);
    const halos: Halo[] = [];
    const sel = this.cfg.glow.targets;
    if (sel) {
      let nodes: NodeListOf<Element> | Element[] = [];
      try {
        nodes = host.querySelectorAll(sel);
      } catch {
        nodes = [];
      }
      for (const n of Array.from(nodes)) {
        if (halos.length >= 4) break;
        const r = n.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        halos.push({
          x: r.left - origin.left + r.width / 2,
          y: r.top - origin.top + r.height / 2,
          size: clamp(Math.max(r.width, r.height) * 1.3, 220, 720),
          period: 0,
          phase: 0,
        });
      }
    }
    if (!halos.length) {
      const base = clamp(Math.max(box.width, box.height) * 0.45, 240, 640);
      halos.push({ x: box.width * 0.28, y: box.height * 0.42, size: base, period: 0, phase: 0 });
      halos.push({ x: box.width * 0.74, y: box.height * 0.6, size: base * 0.85, period: 0, phase: 0 });
    }
    halos.forEach((hl, i) => {
      if (this.cfg.isMobile) hl.size *= 0.8;
      hl.period = 28 + i * 7; // respiração lenta (ida e volta)
      hl.phase = Math.random() * TAU;
    });
    this.halos = halos;
  }

  render(time: number) {
    const ctx = this.buf.begin();
    const I = this.cfg.glow.intensity;
    const blur = this.cfg.glow.blur;
    for (const hl of this.halos) {
      const b = 0.5 - 0.5 * Math.cos((TAU * time) / hl.period + hl.phase); // 0..1
      const s = 0.94 + 0.11 * b;
      const a = 0.62 + 0.38 * b;
      const R = (hl.size / 2) * s + blur;
      // queda longa e gradual = luz ambiente, sem borda perceptível
      ellipse(ctx, hl.x, hl.y, R, R, [
        [0, this.pal.light, I * 1.6 * a],
        [0.3, this.pal.light, I * 1.15 * a],
        [0.55, this.pal.light, I * 0.5 * a],
        [0.78, this.pal.secondary, I * 0.18 * a],
        [1, this.pal.secondary, 0],
      ]);
    }
  }

  offset(ox: number, oy: number) {
    this.buf.offset(ox, oy);
  }
}
