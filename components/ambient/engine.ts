// AmbientMotion — orquestra as camadas: loop único (compartilhado),
// parallax, intensidade conforme o scroll, pausa fora da viewport,
// ajustes de mobile e prefers-reduced-motion.
//
// Desempenho: nenhum filtro CSS nem animação CSS. A atmosfera
// (gradientes/halos) fica em canvases minúsculos, redesenhados ~12x por
// segundo e ampliados pela GPU; o parallax e a intensidade são só
// transform/opacity (compositor). O canvas em tamanho real desenha apenas
// as partículas e os fios de luz, a 30 fps.

import { resolveConfig, type AmbientConfig, type AmbientPreset, type DeepPartial, type ResolvedConfig } from "./config";
import { GlowLayer, GradientLayer } from "./layers/atmosphere";
import { ConnectionLayer, ParticleLayer } from "./layers/particles";
import { Pointer, Scheduler, bindPointer, clamp, rand, smooth, toRGB, type Frameable, type Palette, type Zone } from "./shared";

export class AmbientEngine implements Frameable {
  private cfg!: ResolvedConfig;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gradient: GradientLayer | null = null;
  private glow: GlowLayer | null = null;
  private particles: ParticleLayer | null = null;
  private connections: ConnectionLayer | null = null;

  private w = 0;
  private h = 0;
  private zones: Zone[] = [];
  private t = rand(0, 100);
  private px = 0;
  private py = 0;
  private k = 1;
  private kTarget = 1;
  private last = 0;
  private atmosLast = -1;
  private visible = false;
  private measureQueued = false;

  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  private onReduceChange = () => this.init();

  private opacity = "";

  constructor(
    private host: HTMLElement,
    private root: HTMLElement,
    private canvases: { gradient: HTMLCanvasElement; glow: HTMLCanvasElement; particles: HTMLCanvasElement },
    private noise: HTMLElement | null,
    private preset: AmbientPreset | undefined,
    private user: DeepPartial<AmbientConfig> | undefined,
  ) {
    this.canvas = canvases.particles;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.ro = new ResizeObserver(() => this.measureSoon());
    this.ro.observe(host);
    this.io = new IntersectionObserver((e) => this.onIntersect(e[e.length - 1]), {
      rootMargin: "80px 0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    });
    this.io.observe(host);
    this.reduceMQ.addEventListener("change", this.onReduceChange);
    document.fonts?.ready.then(() => this.measureSoon());
  }

  destroy() {
    Scheduler.remove(this);
    this.ro.disconnect();
    this.io.disconnect();
    this.reduceMQ.removeEventListener("change", this.onReduceChange);
  }

  /** (re)cria as camadas a partir da configuração atual */
  private init() {
    const cfg = (this.cfg = resolveConfig(this.preset, this.user));
    const host = this.host;
    const pal: Palette = {
      primary: toRGB(cfg.colors.primary, host),
      secondary: toRGB(cfg.colors.secondary, host),
      soft: toRGB(cfg.colors.soft, host),
      light: toRGB(cfg.colors.light, host),
    };
    if (cfg.base.color.startsWith("--")) {
      cfg.base.color = getComputedStyle(host).getPropertyValue(cfg.base.color).trim() || "transparent";
    }

    const { gradient, glow, particles } = this.canvases;
    this.gradient = cfg.gradient.enabled ? new GradientLayer(gradient, cfg, pal) : null;
    this.glow = cfg.glow.enabled ? new GlowLayer(glow, cfg, pal) : null;
    this.particles = cfg.particles.enabled && cfg.particles.count > 0 ? new ParticleLayer(cfg, pal) : null;
    this.connections =
      this.particles && cfg.connections.enabled && cfg.connections.max > 0 ? new ConnectionLayer(cfg, pal) : null;

    gradient.style.display = this.gradient ? "" : "none";
    glow.style.display = this.glow ? "" : "none";
    particles.style.display = this.particles ? "" : "none";
    if (this.noise) {
      this.noise.style.display = cfg.noise.enabled && cfg.noise.opacity > 0 ? "" : "none";
      this.noise.style.opacity = String(cfg.noise.opacity);
    }

    this.k = this.kTarget = cfg.intensity * (cfg.scroll.enabled ? cfg.scroll.min : 1);
    this.atmosLast = -1;
    this.w = this.h = 0;
    if (cfg.parallaxOn) bindPointer();
    this.measure();
  }

  private measureSoon() {
    if (this.measureQueued) return;
    this.measureQueued = true;
    requestAnimationFrame(() => {
      this.measureQueued = false;
      this.measure();
    });
  }

  private measure() {
    const cfg = this.cfg;
    const host = this.host;
    // cruzou o breakpoint (desktop ↔ mobile): reconstrói com a config adequada
    if (window.matchMedia(`(max-width: ${cfg.mobile.breakpoint}px)`).matches !== cfg.isMobile) {
      this.init();
      return;
    }
    const hb = host.getBoundingClientRect();
    const origin = { left: hb.left + host.clientLeft, top: hb.top + host.clientTop };
    const box = { width: host.clientWidth, height: host.clientHeight };
    const { width: w, height: h } = box;
    if (!w || !h) return;

    const d = cfg.parallax.depth;
    const pad = Math.ceil(Math.max(d.gradient, d.glow) * cfg.parallax.intensity) + 4;
    this.gradient?.resize(box, pad);
    this.glow?.layout(host, origin, box, pad);

    // zonas de legibilidade (textos, botões...)
    const zones: Zone[] = [];
    if (cfg.particles.avoid) {
      let nodes: Element[] = [];
      try {
        nodes = Array.from(host.querySelectorAll(cfg.particles.avoid));
      } catch {
        nodes = [];
      }
      for (const n of nodes) {
        if (zones.length >= 60) break;
        if (this.root.contains(n)) continue;
        const r = n.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        zones.push({ l: r.left - origin.left - 8, t: r.top - origin.top - 8, r: r.right - origin.left + 8, b: r.bottom - origin.top + 8 });
      }
    }
    this.zones = zones;

    this.canvas.width = Math.round(w * cfg.dpr);
    this.canvas.height = Math.round(h * cfg.dpr);
    this.ctx.setTransform(cfg.dpr, 0, 0, cfg.dpr, 0, 0);
    if (this.particles) {
      if (!this.particles.list.length || !this.w || !this.h) this.particles.populate(w, h);
      else this.particles.rescale(w / this.w, h / this.h);
    }
    this.w = w;
    this.h = h;
    this.atmosLast = -1;

    if (cfg.reduced) {
      // um único quadro estático, sem loop
      this.particles?.update(0, this.t, w, h, zones, true);
      this.renderAtmosphere();
      this.draw();
    } else if (this.visible) {
      this.renderAtmosphere();
      this.draw();
    }
  }

  private onIntersect(entry: IntersectionObserverEntry) {
    const cfg = this.cfg;
    this.visible = entry.isIntersecting;
    if (cfg.scroll.enabled && entry.isIntersecting) {
      // entrada/saída mais discretas; permanência na seção um pouco mais viva
      const v = entry.intersectionRect.height / Math.max(1, Math.min(entry.boundingClientRect.height, window.innerHeight));
      this.kTarget = cfg.intensity * (cfg.scroll.min + (1 - cfg.scroll.min) * smooth(v));
    } else {
      this.kTarget = cfg.intensity;
    }
    if (cfg.reduced) return;
    if (this.visible) {
      this.last = 0;
      Scheduler.add(this);
    } else {
      Scheduler.remove(this);
    }
  }

  /** chamado pelo loop rAF único compartilhado */
  frame(now: number) {
    const cfg = this.cfg;
    if (this.last && now - this.last < 1000 / cfg.fps - 2) return;
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.1) : 1 / cfg.fps;
    this.last = now;
    if (!this.w) return;

    this.k += (this.kTarget - this.k) * (1 - Math.exp(-dt * 1.2));
    if (cfg.parallaxOn) {
      const pe = 1 - Math.exp(-dt * 2.2); // inércia suave
      this.px += (Pointer.x - this.px) * pe;
      this.py += (Pointer.y - this.py) * pe;
    }

    // o movimento desacelera levemente quando a seção está saindo da tela
    const motion = cfg.scroll.enabled ? 0.55 + 0.45 * clamp(this.k / Math.max(cfg.intensity, 0.001), 0, 1) : 1;
    const mdt = dt * motion;
    this.t += mdt;

    if (this.atmosLast < 0 || this.t - this.atmosLast >= 1 / cfg.quality.atmosphereFps) this.renderAtmosphere();
    if (this.particles) {
      this.particles.update(mdt, this.t, this.w, this.h, this.zones);
      this.connections?.update(mdt, this.particles);
    }
    this.draw();
  }

  private renderAtmosphere() {
    this.atmosLast = this.t;
    this.gradient?.render(this.t);
    this.glow?.render(this.t);
  }

  private draw() {
    const { ctx, cfg } = this;
    const pi = cfg.parallax.intensity;
    const d = cfg.parallax.depth;

    // intensidade geral: opacity no container (compositor)
    const op = clamp(this.k, 0, 1).toFixed(3);
    if (op !== this.opacity) {
      this.opacity = op;
      this.root.style.opacity = op;
    }
    this.gradient?.offset(this.px * d.gradient * pi, this.py * d.gradient * pi);
    this.glow?.offset(this.px * d.glow * pi, this.py * d.glow * pi);

    if (!this.particles) return;
    ctx.clearRect(0, 0, this.w, this.h);
    this.connections?.draw(ctx, this.px, this.py, 1);
    this.particles.draw(ctx, this.t, this.px, this.py, 1);
    ctx.globalAlpha = 1;
  }

  /** para testes/inspeção */
  get stats() {
    return {
      particles: this.particles?.list.length ?? 0,
      connections: this.connections?.count ?? 0,
      maxConnections: this.connections ? this.cfg.connections.max : 0,
      fps: this.cfg.fps,
      parallax: this.cfg.parallaxOn,
      reduced: this.cfg.reduced,
      mobile: this.cfg.isMobile,
      running: this.visible && !this.cfg.reduced,
      intensity: this.k,
    };
  }
}
