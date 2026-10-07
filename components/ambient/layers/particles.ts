// Partículas orgânicas + "fios de luz" entre algumas delas.
// Desenhadas no canvas principal (um único canvas por fundo).

import type { ResolvedConfig } from "../config";
import { rand, rgba, smooth, type Palette, type RGB, type Zone } from "../shared";

/** sprite suave (bokeh) — nunca um ponto duro de "estrela" */
function makeSprite(c: RGB) {
  const s = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const g = cv.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, rgba(c, 1));
  grad.addColorStop(0.22, rgba(c, 0.75));
  grad.addColorStop(0.55, rgba(c, 0.18));
  grad.addColorStop(1, rgba(c, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return cv;
}

export interface Particle {
  x: number;
  y: number;
  z: number; // profundidade: 0 (longe) .. 1 (perto)
  size: number;
  vx: number;
  vy: number;
  amp: number;
  wf: number;
  ph: number;
  ph2: number;
  bf: number;
  alpha: number;
  sprite: HTMLCanvasElement;
  avoid: number;
  rx: number; // posição renderizada (com ondulação)
  ry: number;
  linked: boolean;
}

export class ParticleLayer {
  list: Particle[] = [];
  private sprites: HTMLCanvasElement[];
  private weights = [0.42, 0.87, 1]; // 42% secondary, 45% primary, 13% light

  constructor(
    private cfg: ResolvedConfig,
    pal: Palette,
  ) {
    this.sprites = [makeSprite(pal.secondary), makeSprite(pal.primary), makeSprite(pal.light)];
  }

  populate(w: number, h: number) {
    const c = this.cfg.particles;
    this.list = [];
    for (let i = 0; i < c.count; i++) {
      const z = Math.pow(Math.random(), 0.8);
      const pick = Math.random();
      let si = 0;
      while (pick > this.weights[si]) si++;
      const ang = rand(0, Math.PI * 2);
      const sp = c.speed * rand(0.4, 1) * (0.45 + 0.55 * z) * 60; // px/s
      this.list.push({
        x: rand(0, w),
        y: rand(0, h),
        z,
        size: c.minSize + (c.maxSize - c.minSize) * (0.25 * Math.random() + 0.75 * z),
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - c.speed * 12 * z, // leve tendência de subir, como vapor
        amp: rand(6, 18),
        wf: rand(0.04, 0.12),
        ph: rand(0, 6.28),
        ph2: rand(0, 6.28),
        bf: rand(0.15, 0.4),
        alpha: c.opacity * rand(0.35, 1) * (0.5 + 0.5 * z),
        sprite: this.sprites[si],
        avoid: 1,
        rx: 0,
        ry: 0,
        linked: false,
      });
    }
  }

  rescale(sx: number, sy: number) {
    for (const p of this.list) {
      p.x *= sx;
      p.y *= sy;
    }
  }

  update(dt: number, t: number, w: number, h: number, zones: Zone[], instant = false) {
    const m = 24;
    for (const p of this.list) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < -m) p.x += w + 2 * m;
      else if (p.x > w + m) p.x -= w + 2 * m;
      if (p.y < -m) p.y += h + 2 * m;
      else if (p.y > h + m) p.y -= h + 2 * m;
      p.rx = p.x + Math.sin(t * p.wf + p.ph) * p.amp;
      p.ry = p.y + Math.cos(t * p.wf * 0.8 + p.ph2) * p.amp;

      // atenua suavemente atrás de textos/botões
      let target = 1;
      for (const r of zones) {
        const dx = Math.max(r.l - p.rx, 0, p.rx - r.r);
        const dy = Math.max(r.t - p.ry, 0, p.ry - r.b);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 28) {
          target = Math.min(target, 0.2 + 0.8 * (d / 28));
          if (target <= 0.2) break;
        }
      }
      p.avoid = instant ? target : p.avoid + (target - p.avoid) * Math.min(1, dt * 1.5);
    }
  }

  draw(ctx: CanvasRenderingContext2D, t: number, px: number, py: number, k: number) {
    const depth = this.cfg.parallax.depth.particles * this.cfg.parallax.intensity;
    for (const p of this.list) {
      const a = p.alpha * (0.75 + 0.25 * Math.sin(t * p.bf + p.ph)) * p.avoid * k;
      if (a < 0.004) continue;
      const s = p.size * 4;
      const pd = depth * (0.4 + 0.6 * p.z); // mais perto = mais parallax
      ctx.globalAlpha = a;
      ctx.drawImage(p.sprite, p.rx + px * pd - s / 2, p.ry + py * pd - s / 2, s, s);
    }
  }
}

interface Link {
  a: Particle;
  b: Particle;
  life: number;
  dur: number;
  bend: number;
}

export class ConnectionLayer {
  private links: Link[] = [];
  private timer = rand(0.5, 1.5);
  private color: RGB;

  constructor(
    private cfg: ResolvedConfig,
    pal: Palette,
  ) {
    this.color = pal.primary;
  }

  get count() {
    return this.links.length;
  }

  update(dt: number, particles: ParticleLayer) {
    const c = this.cfg.connections;
    const list = particles.list;
    for (let i = this.links.length - 1; i >= 0; i--) {
      const l = this.links[i];
      l.life += dt;
      if (l.life >= l.dur) {
        l.a.linked = l.b.linked = false;
        this.links.splice(i, 1);
      }
    }
    this.timer -= dt;
    if (this.timer > 0 || this.links.length >= c.max || list.length < 2) return;
    this.timer = rand(1.4, 3.2);
    // poucas conexões; cada partícula participa de no máximo um fio
    for (let tries = 0; tries < 6; tries++) {
      const a = list[(Math.random() * list.length) | 0];
      if (a.linked || a.avoid < 0.7) continue;
      let best: Particle | null = null;
      let bd = c.distance;
      for (const b of list) {
        if (b === a || b.linked || b.avoid < 0.7) continue;
        const d = Math.hypot(a.rx - b.rx, a.ry - b.ry);
        if (d < bd && d > 18) {
          bd = d;
          best = b;
        }
      }
      if (best) {
        a.linked = best.linked = true;
        this.links.push({ a, b: best, life: 0, dur: rand(7, 12), bend: rand(0.06, 0.16) * (Math.random() < 0.5 ? -1 : 1) });
        return;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, px: number, py: number, k: number) {
    const c = this.cfg.connections;
    const depth = this.cfg.parallax.depth.lines * this.cfg.parallax.intensity;
    const ox = px * depth;
    const oy = py * depth;
    for (const l of this.links) {
      const ax = l.a.rx + ox, ay = l.a.ry + oy, bx = l.b.rx + ox, by = l.b.ry + oy;
      const dx = bx - ax, dy = by - ay;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1) continue;
      const env = 0.5 - 0.5 * Math.cos((l.life / l.dur) * Math.PI * 2); // entra e sai suave
      const distF = 1 - smooth((len - c.distance) / (c.distance * 0.5));
      const a = c.opacity * env * distF * Math.min(l.a.avoid, l.b.avoid) * k;
      if (a < 0.003) continue;
      const cx = (ax + bx) / 2 - dy * l.bend;
      const cy = (ay + by) / 2 + dx * l.bend;
      const g = ctx.createLinearGradient(ax, ay, bx, by);
      g.addColorStop(0, rgba(this.color, 0));
      g.addColorStop(0.5, rgba(this.color, 1));
      g.addColorStop(1, rgba(this.color, 0));
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(cx, cy, bx, by);
      // passada larga e fraca (difusão) + passada fina
      ctx.globalAlpha = a * 0.3;
      ctx.lineWidth = c.width * 3.5;
      ctx.stroke();
      ctx.globalAlpha = a;
      ctx.lineWidth = c.width;
      ctx.stroke();
    }
  }
}
