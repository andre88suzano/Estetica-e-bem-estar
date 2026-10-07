/*!
 * AmbientBackground — fundo ambiental animado, discreto e reutilizável.
 *
 * Web Component sem dependências. Fica ATRÁS do conteúdo da seção que o
 * contém; não altera nada dentro dela.
 *
 * USO BÁSICO (primeiro filho da seção):
 *
 *   <section class="services">
 *     <ambient-background></ambient-background>
 *     ...conteúdo existente, intocado...
 *   </section>
 *
 * CONFIGURAÇÃO POR ATRIBUTOS:
 *
 *   <ambient-background
 *     preset="soft"                    hero | soft | minimal
 *     intensity="1"                    intensidade geral (0–1+)
 *     particle-count="30"
 *     particle-opacity="0.25"
 *     particle-speed="0.15"
 *     particle-min-size="1"
 *     particle-max-size="3"
 *     connection-distance="120"
 *     connection-opacity="0.09"
 *     max-connections="4"
 *     glow-intensity="0.22"
 *     glow-blur="48"
 *     glow-targets=".hero-title, .hero-visual"
 *     noise-opacity="0.03"
 *     parallax="1"                     multiplicador; "false" desliga
 *     scroll="true"
 *     color-primary="--sage"           variável CSS do site ou cor
 *     color-secondary="--sage-light"
 *     color-soft="--sage-mid"
 *     color-light="#ffffff"
 *     config='{"particles":{"count":20}}'
 *   ></ambient-background>
 *
 * CONFIGURAÇÃO POR OBJETO (JS):
 *
 *   AmbientBackground.mount(document.querySelector('#sobre'), {
 *     particles:   { count: 20, speed: 0.12, opacity: 0.2 },
 *     connections: { enabled: true, distance: 100, opacity: 0.07 },
 *     glow:        { intensity: 0.18, blur: 60 },
 *     parallax:    { enabled: true, intensity: 0.8 }
 *   });
 *
 *   // ou, num elemento já existente:
 *   document.querySelector('ambient-background').configure({ intensity: 0.8 });
 *
 * PRECEDÊNCIA: padrões < preset < atributo config < atributos individuais
 *             < configure()/mount() (JS sempre vence).
 *
 * CAMADAS (independentes, de trás para frente):
 *   BaseLayer → GradientLayer → GlowLayer → ParticleLayer + ConnectionLayer
 *   (um único canvas) → NoiseLayer.  AmbientMotion orquestra o movimento,
 *   parallax, scroll, pausa fora da viewport, mobile e reduced-motion.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined' || !window.customElements) return;
  if (customElements.get('ambient-background')) return;

  /* ------------------------------------------------------------------ */
  /* Configuração                                                        */
  /* ------------------------------------------------------------------ */

  var DEFAULTS = {
    intensity: 1,
    colors: {
      primary: '--sage',
      secondary: '--sage-light',
      soft: '--sage-mid',
      light: '#ffffff'
    },
    base: { enabled: false, color: 'transparent' },
    gradient: { enabled: true, opacity: 1, speed: 1, sheen: true },
    noise: { enabled: true, opacity: 0.03 },
    particles: {
      enabled: true,
      count: 28,
      minSize: 1,
      maxSize: 3,
      opacity: 0.26,
      speed: 0.15,
      // partículas ficam mais tênues atrás destes elementos (legibilidade)
      avoid: 'h1, h2, h3, h4, p, a, button, input, textarea, label'
    },
    connections: { enabled: true, distance: 120, opacity: 0.09, max: 4, width: 0.6 },
    glow: { enabled: true, intensity: 0.22, blur: 48, targets: '' },
    parallax: {
      enabled: true,
      intensity: 1,
      depth: { gradient: 2, glow: 4, particles: 6, lines: 3 } // px
    },
    scroll: { enabled: true, min: 0.6 },
    fps: 60,
    mobile: {
      breakpoint: 768,
      particles: 0.5, // multiplicadores
      connections: 0.5,
      intensity: 0.85,
      blur: 0.5,
      parallax: false,
      sheen: false,
      fps: 30
    }
  };

  var PRESETS = {
    hero: {},
    soft: {
      intensity: 0.85,
      particles: { count: 18, opacity: 0.2 },
      connections: { max: 2, opacity: 0.07 },
      glow: { intensity: 0.16 },
      gradient: { sheen: false }
    },
    minimal: {
      intensity: 0.8,
      particles: { enabled: false },
      connections: { enabled: false },
      gradient: { sheen: false }
    }
  };

  var ATTRS = {
    'intensity': ['intensity', 'num'],
    'particles': ['particles.enabled', 'bool'],
    'particle-count': ['particles.count', 'num'],
    'particle-opacity': ['particles.opacity', 'num'],
    'particle-speed': ['particles.speed', 'num'],
    'particle-min-size': ['particles.minSize', 'num'],
    'particle-max-size': ['particles.maxSize', 'num'],
    'connections': ['connections.enabled', 'bool'],
    'connection-distance': ['connections.distance', 'num'],
    'connection-opacity': ['connections.opacity', 'num'],
    'max-connections': ['connections.max', 'num'],
    'glow': ['glow.enabled', 'bool'],
    'glow-intensity': ['glow.intensity', 'num'],
    'glow-blur': ['glow.blur', 'num'],
    'glow-targets': ['glow.targets', 'str'],
    'noise': ['noise.enabled', 'bool'],
    'noise-opacity': ['noise.opacity', 'num'],
    'scroll': ['scroll.enabled', 'bool'],
    'sheen': ['gradient.sheen', 'bool'],
    'color-primary': ['colors.primary', 'str'],
    'color-secondary': ['colors.secondary', 'str'],
    'color-soft': ['colors.soft', 'str'],
    'color-light': ['colors.light', 'str']
  };

  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }

  function merge(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (!isObj(src)) continue;
      for (var k in src) {
        if (isObj(src[k])) target[k] = merge(isObj(target[k]) ? target[k] : {}, src[k]);
        else if (src[k] !== undefined) target[k] = src[k];
      }
    }
    return target;
  }

  function setPath(obj, path, value) {
    var keys = path.split('.');
    var o = obj;
    for (var i = 0; i < keys.length - 1; i++) o = o[keys[i]] = o[keys[i]] || {};
    o[keys[keys.length - 1]] = value;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }

  /* ------------------------------------------------------------------ */
  /* Cores — reaproveita a paleta do site (variáveis CSS)                */
  /* ------------------------------------------------------------------ */

  var colorCtx = null;
  function toRGB(value, scope) {
    var v = String(value || '').trim();
    if (v.indexOf('--') === 0) v = getComputedStyle(scope).getPropertyValue(v).trim();
    if (!colorCtx) colorCtx = document.createElement('canvas').getContext('2d');
    colorCtx.fillStyle = '#000';
    colorCtx.fillStyle = v || '#000';
    var s = colorCtx.fillStyle; // normalizado: #rrggbb ou rgba(...)
    if (s.charAt(0) === '#') {
      return [parseInt(s.substr(1, 2), 16), parseInt(s.substr(3, 2), 16), parseInt(s.substr(5, 2), 16)];
    }
    var m = s.match(/[\d.]+/g) || [0, 0, 0];
    return [+m[0], +m[1], +m[2]];
  }
  function rgba(c, a) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + clamp(a, 0, 1).toFixed(3) + ')';
  }

  /* ------------------------------------------------------------------ */
  /* Estilos (injetados uma única vez)                                   */
  /* ------------------------------------------------------------------ */

  var NOISE_SVG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

  var CSS = [
    'ambient-background{position:absolute;inset:0;z-index:-1;display:block;overflow:hidden;pointer-events:none;contain:strict;opacity:var(--ab-intensity,1)}',
    '.ambient-host{isolation:isolate}',
    '.ambient-host--positioned{position:relative}',
    'ambient-background>.ab-layer,ambient-background>.ab-canvas{position:absolute;inset:0}',
    // parallax por camada: --ab-px/--ab-py (−1..1) × profundidade (px)
    'ambient-background>.ab-parallax{inset:-10px;will-change:transform;transform:translate3d(calc(var(--ab-px,0)*var(--ab-depth,0)*1px),calc(var(--ab-py,0)*var(--ab-depth,0)*1px),0)}',
    'ambient-background .ab-canvas{width:100%;height:100%;display:block}',
    // GradientLayer
    'ambient-background .ab-blob{position:absolute;border-radius:50%;will-change:transform,opacity;animation:ab-drift-1 var(--ab-dur,60s) ease-in-out infinite alternate}',
    'ambient-background .ab-blob--1{top:-22%;right:-18%;width:78%;height:88%}',
    'ambient-background .ab-blob--2{top:18%;left:-22%;width:66%;height:78%;animation-name:ab-drift-2}',
    'ambient-background .ab-blob--3{bottom:-34%;left:22%;width:72%;height:72%;animation-name:ab-drift-3}',
    '@keyframes ab-drift-1{0%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-6%,4%,0) scale(1.06)}100%{transform:translate3d(-2%,9%,0) scale(.97)}}',
    '@keyframes ab-drift-2{0%{transform:translate3d(0,0,0) scale(1);opacity:.5}50%{transform:translate3d(7%,-5%,0) scale(1.08);opacity:1}100%{transform:translate3d(3%,4%,0) scale(.95);opacity:.7}}',
    '@keyframes ab-drift-3{0%{transform:translate3d(0,0,0) scale(1.04);opacity:.9}100%{transform:translate3d(-8%,-6%,0) scale(.96);opacity:.55}}',
    // onda de luz muito lenta e tênue
    'ambient-background .ab-sheen{position:absolute;top:-60%;left:-55%;width:40%;height:220%;opacity:0;will-change:transform,opacity;animation:ab-sheen var(--ab-dur,52s) ease-in-out infinite}',
    '@keyframes ab-sheen{0%{transform:rotate(16deg) translate3d(0,0,0);opacity:0}20%{opacity:1}50%{opacity:.6}62%{transform:rotate(16deg) translate3d(420%,0,0);opacity:0}100%{transform:rotate(16deg) translate3d(420%,0,0);opacity:0}}',
    // GlowLayer
    'ambient-background .ab-halo{position:absolute;border-radius:50%;filter:blur(var(--ab-blur,48px));transform:translate3d(-50%,-50%,0);will-change:transform,opacity;animation:ab-breathe var(--ab-dur,16s) ease-in-out infinite alternate}',
    '@keyframes ab-breathe{0%{opacity:.62;transform:translate3d(-50%,-50%,0) scale(.94)}100%{opacity:1;transform:translate3d(-50%,-50%,0) scale(1.05)}}',
    // NoiseLayer
    'ambient-background .ab-noise{background-image:' + NOISE_SVG + ';background-size:180px 180px}',
    // pausa quando fora da viewport
    'ambient-background[data-paused] *{animation-play-state:paused!important}',
    '@media (prefers-reduced-motion:reduce){ambient-background *{animation:none!important}ambient-background .ab-sheen{display:none}ambient-background>.ab-parallax{transform:none}}'
  ].join('\n');

  function injectStyles() {
    if (document.getElementById('ambient-background-styles')) return;
    var style = document.createElement('style');
    style.id = 'ambient-background-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------ */
  /* Infra compartilhada: um único loop rAF e um único listener de mouse */
  /* ------------------------------------------------------------------ */

  var Scheduler = {
    items: new Set(),
    raf: 0,
    add: function (item) {
      this.items.add(item);
      if (!this.raf) this.raf = requestAnimationFrame(this.tick);
    },
    remove: function (item) {
      this.items.delete(item);
      if (!this.items.size && this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
    },
    tick: function (now) {
      Scheduler.raf = 0;
      Scheduler.items.forEach(function (item) { item.frame(now); });
      if (Scheduler.items.size) Scheduler.raf = requestAnimationFrame(Scheduler.tick);
    }
  };

  var Pointer = {
    x: 0, y: 0, bound: false,
    bind: function () {
      if (this.bound) return;
      this.bound = true;
      window.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        Pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        Pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }
  };

  var MQ = {
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)'),
    finePointer: window.matchMedia('(hover: hover) and (pointer: fine)')
  };

  /* ------------------------------------------------------------------ */
  /* Camadas DOM                                                          */
  /* ------------------------------------------------------------------ */

  function layer(root, className, depth) {
    var el = document.createElement('div');
    el.className = 'ab-layer ' + className + (depth != null ? ' ab-parallax' : '');
    el.setAttribute('aria-hidden', 'true');
    if (depth != null) el.style.setProperty('--ab-depth', depth);
    root.appendChild(el);
    return el;
  }

  var BaseLayer = {
    build: function (root, cfg, pal) {
      if (!cfg.base.enabled) return null;
      var el = layer(root, 'ab-base');
      var c = cfg.base.color;
      el.style.background = c.indexOf('--') === 0 ? 'var(' + c + ')' : c;
      return el;
    }
  };

  var GradientLayer = {
    build: function (root, cfg, pal) {
      if (!cfg.gradient.enabled) return null;
      var el = layer(root, 'ab-gradient', cfg.parallaxDepth.gradient);
      var o = cfg.gradient.opacity;
      var sp = Math.max(0.1, cfg.gradient.speed);
      var blobs = [
        { cls: 'ab-blob--1', dur: 56, bg: 'radial-gradient(closest-side,' + rgba(pal.secondary, 0.16 * o) + ',' + rgba(pal.secondary, 0.05 * o) + ' 60%,transparent)' },
        { cls: 'ab-blob--2', dur: 72, bg: 'radial-gradient(closest-side,' + rgba(pal.light, 0.6 * o) + ',' + rgba(pal.light, 0.18 * o) + ' 55%,transparent)' },
        { cls: 'ab-blob--3', dur: 88, bg: 'radial-gradient(closest-side,' + rgba(pal.soft, 0.26 * o) + ',' + rgba(pal.soft, 0.08 * o) + ' 60%,transparent)' }
      ];
      blobs.forEach(function (b) {
        var d = document.createElement('div');
        d.className = 'ab-blob ' + b.cls;
        d.style.background = b.bg;
        d.style.setProperty('--ab-dur', (b.dur / sp) + 's');
        d.style.animationDelay = -rand(0, b.dur / sp) + 's';
        el.appendChild(d);
      });
      if (cfg.gradient.sheen) {
        var s = document.createElement('div');
        s.className = 'ab-sheen';
        s.style.background = 'linear-gradient(90deg,transparent,' + rgba(pal.light, 0.16 * o) + ' 50%,transparent)';
        s.style.setProperty('--ab-dur', (52 / sp) + 's');
        s.style.animationDelay = -rand(8, 30) + 's';
        el.appendChild(s);
      }
      return el;
    }
  };

  var GlowLayer = {
    build: function (root, cfg, pal) {
      if (!cfg.glow.enabled) return null;
      var el = layer(root, 'ab-glow', cfg.parallaxDepth.glow);
      el.style.setProperty('--ab-blur', cfg.glow.blur + 'px');
      return el;
    },
    // posiciona halos atrás dos alvos (ou em pontos padrão)
    layout: function (el, host, box, cfg, pal) {
      if (!el) return;
      var spots = [];
      var sel = cfg.glow.targets;
      if (sel) {
        var nodes;
        try { nodes = host.querySelectorAll(sel); } catch (e) { nodes = []; }
        for (var i = 0; i < nodes.length && spots.length < 4; i++) {
          var r = nodes[i].getBoundingClientRect();
          if (!r.width || !r.height) continue;
          spots.push({
            x: r.left - box.left + r.width / 2,
            y: r.top - box.top + r.height / 2,
            size: clamp(Math.max(r.width, r.height) * 1.3, 220, 720)
          });
        }
      }
      if (!spots.length) {
        var base = clamp(Math.max(box.width, box.height) * 0.45, 240, 640);
        spots.push({ x: box.width * 0.28, y: box.height * 0.42, size: base });
        spots.push({ x: box.width * 0.74, y: box.height * 0.6, size: base * 0.85 });
      }
      if (cfg.isMobile) spots.forEach(function (s) { s.size *= 0.8; });

      var I = cfg.glow.intensity;
      var bg = 'radial-gradient(closest-side,' + rgba(pal.light, I * 2.6) + ',' +
        rgba(pal.secondary, I * 0.5) + ' 55%,transparent)';
      el.textContent = '';
      spots.forEach(function (s, i) {
        var h = document.createElement('div');
        h.className = 'ab-halo';
        h.style.cssText = 'left:' + s.x.toFixed(1) + 'px;top:' + s.y.toFixed(1) + 'px;width:' +
          s.size.toFixed(0) + 'px;height:' + s.size.toFixed(0) + 'px;background:' + bg;
        h.style.setProperty('--ab-dur', (14 + i * 3.5) + 's');
        h.style.animationDelay = -rand(0, 12) + 's';
        el.appendChild(h);
      });
    }
  };

  var NoiseLayer = {
    build: function (root, cfg) {
      if (!cfg.noise.enabled || cfg.noise.opacity <= 0) return null;
      var el = layer(root, 'ab-noise');
      el.style.opacity = cfg.noise.opacity;
      return el;
    }
  };

  /* ------------------------------------------------------------------ */
  /* Camadas canvas: partículas + fios de luz                             */
  /* ------------------------------------------------------------------ */

  // sprite suave (bokeh), nunca um ponto duro de "estrela"
  function makeSprite(c) {
    var s = 64, cv = document.createElement('canvas');
    cv.width = cv.height = s;
    var g = cv.getContext('2d');
    var grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, rgba(c, 1));
    grad.addColorStop(0.22, rgba(c, 0.75));
    grad.addColorStop(0.55, rgba(c, 0.18));
    grad.addColorStop(1, rgba(c, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    return cv;
  }

  function ParticleLayer(cfg, pal) {
    this.cfg = cfg.particles;
    this.depth = cfg.parallaxDepth.particles;
    this.list = [];
    this.sprites = [makeSprite(pal.secondary), makeSprite(pal.primary), makeSprite(pal.light)];
    this.weights = [0.45, 0.75, 1]; // cumulativo: 45% secondary, 30% primary, 25% light
  }
  ParticleLayer.prototype.populate = function (w, h, count) {
    var c = this.cfg;
    this.list = [];
    for (var i = 0; i < count; i++) {
      var z = Math.pow(Math.random(), 0.8); // profundidade 0 (longe) .. 1 (perto)
      var pick = Math.random(), si = 0;
      while (pick > this.weights[si]) si++;
      var ang = rand(0, Math.PI * 2);
      var sp = c.speed * rand(0.4, 1) * (0.45 + 0.55 * z) * 60; // px/s
      this.list.push({
        x: rand(0, w), y: rand(0, h), z: z,
        size: c.minSize + (c.maxSize - c.minSize) * (0.25 * Math.random() + 0.75 * z),
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - c.speed * 12 * z, // leve tendência de subir, como vapor
        amp: rand(6, 18), wf: rand(0.04, 0.12), ph: rand(0, 6.28), ph2: rand(0, 6.28),
        bf: rand(0.15, 0.4), alpha: c.opacity * rand(0.35, 1) * (0.5 + 0.5 * z),
        sprite: this.sprites[si], avoid: 1, rx: 0, ry: 0, linked: false
      });
    }
  };
  ParticleLayer.prototype.rescale = function (sx, sy) {
    this.list.forEach(function (p) { p.x *= sx; p.y *= sy; });
  };
  ParticleLayer.prototype.update = function (dt, t, w, h, zones, instant) {
    var m = 24;
    for (var i = 0; i < this.list.length; i++) {
      var p = this.list[i];
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < -m) p.x += w + 2 * m; else if (p.x > w + m) p.x -= w + 2 * m;
      if (p.y < -m) p.y += h + 2 * m; else if (p.y > h + m) p.y -= h + 2 * m;
      p.rx = p.x + Math.sin(t * p.wf + p.ph) * p.amp;
      p.ry = p.y + Math.cos(t * p.wf * 0.8 + p.ph2) * p.amp;
      // atenua suavemente atrás de textos/botões
      var target = 1;
      for (var j = 0; j < zones.length; j++) {
        var r = zones[j];
        var dx = Math.max(r.l - p.rx, 0, p.rx - r.r);
        var dy = Math.max(r.t - p.ry, 0, p.ry - r.b);
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 28) { target = Math.min(target, 0.2 + 0.8 * (d / 28)); if (target <= 0.2) break; }
      }
      p.avoid = instant ? target : p.avoid + (target - p.avoid) * Math.min(1, dt * 1.5);
    }
  };
  ParticleLayer.prototype.draw = function (ctx, t, px, py, k) {
    for (var i = 0; i < this.list.length; i++) {
      var p = this.list[i];
      var a = p.alpha * (0.75 + 0.25 * Math.sin(t * p.bf + p.ph)) * p.avoid * k;
      if (a < 0.004) continue;
      var s = p.size * 4;
      var ox = px * this.depth * (0.4 + 0.6 * p.z), oy = py * this.depth * (0.4 + 0.6 * p.z);
      ctx.globalAlpha = a;
      ctx.drawImage(p.sprite, p.rx + ox - s / 2, p.ry + oy - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  };

  function ConnectionLayer(cfg, pal) {
    this.cfg = cfg.connections;
    this.depth = cfg.parallaxDepth.lines;
    this.color = pal.primary;
    this.links = [];
    this.timer = rand(0.5, 1.5);
  }
  ConnectionLayer.prototype.update = function (dt, particles) {
    var c = this.cfg, list = particles.list, maxD = c.distance;
    for (var i = this.links.length - 1; i >= 0; i--) {
      var l = this.links[i];
      l.life += dt;
      if (l.life >= l.dur) { l.a.linked = l.b.linked = false; this.links.splice(i, 1); }
    }
    this.timer -= dt;
    if (this.timer > 0 || this.links.length >= c.max || list.length < 2) return;
    this.timer = rand(1.4, 3.2);
    // poucas conexões, cada partícula no máximo em um fio
    for (var tries = 0; tries < 6; tries++) {
      var a = list[(Math.random() * list.length) | 0];
      if (a.linked || a.avoid < 0.7) continue;
      var best = null, bd = maxD;
      for (var j = 0; j < list.length; j++) {
        var b = list[j];
        if (b === a || b.linked || b.avoid < 0.7) continue;
        var d = Math.hypot(a.rx - b.rx, a.ry - b.ry);
        if (d < bd && d > 18) { bd = d; best = b; }
      }
      if (best) {
        a.linked = best.linked = true;
        this.links.push({ a: a, b: best, life: 0, dur: rand(7, 12), bend: rand(0.06, 0.16) * (Math.random() < 0.5 ? -1 : 1) });
        return;
      }
    }
  };
  ConnectionLayer.prototype.draw = function (ctx, px, py, k) {
    var c = this.cfg, ox = px * this.depth, oy = py * this.depth;
    for (var i = 0; i < this.links.length; i++) {
      var l = this.links[i];
      var ax = l.a.rx + ox, ay = l.a.ry + oy, bx = l.b.rx + ox, by = l.b.ry + oy;
      var dx = bx - ax, dy = by - ay, len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1) continue;
      var env = 0.5 - 0.5 * Math.cos((l.life / l.dur) * Math.PI * 2); // entra e sai suave
      var distF = 1 - smooth((len - c.distance) / (c.distance * 0.5));
      var a = c.opacity * env * distF * Math.min(l.a.avoid, l.b.avoid) * k;
      if (a < 0.003) continue;
      var cx = (ax + bx) / 2 - dy * l.bend, cy = (ay + by) / 2 + dx * l.bend;
      var g = ctx.createLinearGradient(ax, ay, bx, by);
      g.addColorStop(0, rgba(this.color, 0));
      g.addColorStop(0.5, rgba(this.color, 1));
      g.addColorStop(1, rgba(this.color, 0));
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(cx, cy, bx, by);
      // passada larga e fraca (difusão) + passada fina
      ctx.globalAlpha = a * 0.3; ctx.lineWidth = c.width * 3.5; ctx.stroke();
      ctx.globalAlpha = a; ctx.lineWidth = c.width; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  /* ------------------------------------------------------------------ */
  /* AmbientMotion — o elemento <ambient-background>                     */
  /* ------------------------------------------------------------------ */

  class AmbientBackgroundElement extends HTMLElement {
    static get observedAttributes() { return Object.keys(ATTRS).concat(['preset', 'parallax', 'config']); }
  }

  var P = AmbientBackgroundElement.prototype;

  P.connectedCallback = function () {
    injectStyles();
    this.setAttribute('aria-hidden', 'true');
    this._host = this.parentElement;
    if (!this._host) return;
    this._host.classList.add('ambient-host');
    if (getComputedStyle(this._host).position === 'static') this._host.classList.add('ambient-host--positioned');
    this._onMQ = this._rebuild.bind(this);
    MQ.reduce.addEventListener && MQ.reduce.addEventListener('change', this._onMQ);
    this._build();
  };

  P.disconnectedCallback = function () {
    this._teardown();
    MQ.reduce.removeEventListener && MQ.reduce.removeEventListener('change', this._onMQ);
  };

  P.attributeChangedCallback = function () {
    if (this._built) this._rebuildSoon();
  };

  // API JS: el.configure({...}) / el.config = {...}
  P.configure = function (obj) { this._userConfig = merge(this._userConfig || {}, obj); this._rebuildSoon(); return this; };
  Object.defineProperty(P, 'config', {
    get: function () { return this._cfg; },
    set: function (obj) { this._userConfig = obj; this._rebuildSoon(); }
  });

  P._resolveConfig = function () {
    var cfg = merge({}, DEFAULTS, PRESETS[this.getAttribute('preset')] || {});
    var json = this.getAttribute('config');
    if (json) { try { merge(cfg, JSON.parse(json)); } catch (e) { console.warn('[ambient-background] config inválida', e); } }
    for (var name in ATTRS) {
      if (!this.hasAttribute(name)) continue;
      var raw = this.getAttribute(name), spec = ATTRS[name];
      var v = spec[1] === 'num' ? parseFloat(raw) : spec[1] === 'bool' ? raw !== 'false' : raw;
      if (spec[1] === 'num' && isNaN(v)) continue;
      setPath(cfg, spec[0], v);
    }
    if (this.hasAttribute('parallax')) {
      var pv = this.getAttribute('parallax');
      if (pv === 'false') cfg.parallax.enabled = false;
      else if (!isNaN(parseFloat(pv))) cfg.parallax.intensity = parseFloat(pv);
    }
    merge(cfg, this._userConfig);

    var m = cfg.mobile;
    cfg.isMobile = window.matchMedia('(max-width: ' + m.breakpoint + 'px)').matches;
    cfg.reduced = MQ.reduce.matches;
    if (cfg.isMobile) {
      cfg.particles.count = Math.round(cfg.particles.count * m.particles);
      cfg.connections.max = Math.max(1, Math.round(cfg.connections.max * m.connections));
      cfg.intensity *= m.intensity;
      cfg.glow.blur *= m.blur;
      cfg.fps = Math.min(cfg.fps, m.fps);
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
    cfg.parallaxOn = cfg.parallax.enabled && MQ.finePointer.matches;
    var d = cfg.parallax.depth, pi = cfg.parallaxOn ? cfg.parallax.intensity : 0;
    cfg.parallaxDepth = { gradient: d.gradient * pi, glow: d.glow * pi, particles: d.particles * pi, lines: d.lines * pi };
    return cfg;
  };

  P._build = function () {
    var self = this, host = this._host;
    var cfg = this._cfg = this._resolveConfig();
    var pal = this._pal = {
      primary: toRGB(cfg.colors.primary, host),
      secondary: toRGB(cfg.colors.secondary, host),
      soft: toRGB(cfg.colors.soft, host),
      light: toRGB(cfg.colors.light, host)
    };

    this.textContent = '';
    BaseLayer.build(this, cfg, pal);
    GradientLayer.build(this, cfg, pal);
    this._glowEl = GlowLayer.build(this, cfg, pal);

    var useCanvas = (cfg.particles.enabled && cfg.particles.count > 0);
    if (useCanvas) {
      this._canvas = document.createElement('canvas');
      this._canvas.className = 'ab-canvas';
      this._canvas.setAttribute('aria-hidden', 'true');
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext('2d');
      this._particles = new ParticleLayer(cfg, pal);
      this._connections = cfg.connections.enabled && cfg.connections.max > 0 ? new ConnectionLayer(cfg, pal) : null;
    } else {
      this._canvas = this._ctx = this._particles = this._connections = null;
    }
    NoiseLayer.build(this, cfg);

    this._w = this._h = 0;
    this._zones = [];
    this._t = rand(0, 100);
    this._px = this._py = 0;
    this._k = cfg.intensity * (cfg.scroll.enabled ? cfg.scroll.min : 1);
    this._kTarget = this._k;
    this._last = 0;
    this._visible = false;
    this.style.setProperty('--ab-intensity', clamp(this._k, 0, 1).toFixed(3));
    if (cfg.parallaxOn) Pointer.bind();

    this._ro = new ResizeObserver(function () { self._measureSoon(); });
    this._ro.observe(host);
    this._io = new IntersectionObserver(function (entries) { self._onIntersect(entries[entries.length - 1]); }, {
      rootMargin: '80px 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    });
    this._io.observe(host);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { self._measureSoon(); });

    this._built = true;
    this._measure();
  };

  P._teardown = function () {
    Scheduler.remove(this);
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    this._ro = this._io = null;
    this._built = false;
  };

  P._rebuild = function () {
    if (!this._host) return;
    this._teardown();
    this._build();
  };

  P._rebuildSoon = function () {
    var self = this;
    if (!this._built || this._rebuildQueued) return;
    this._rebuildQueued = true;
    requestAnimationFrame(function () { self._rebuildQueued = false; self._rebuild(); });
  };

  P._measureSoon = function () {
    var self = this;
    if (this._measureQueued) return;
    this._measureQueued = true;
    requestAnimationFrame(function () { self._measureQueued = false; if (self._built) self._measure(); });
  };

  P._measure = function () {
    var cfg = this._cfg, host = this._host;
    // mudou de desktop ↔ mobile: reconstrói com a configuração adequada
    var mobileNow = window.matchMedia('(max-width: ' + cfg.mobile.breakpoint + 'px)').matches;
    if (mobileNow !== cfg.isMobile) { this._rebuild(); return; }

    var hb = host.getBoundingClientRect();
    var box = { left: hb.left + host.clientLeft, top: hb.top + host.clientTop, width: host.clientWidth, height: host.clientHeight };
    var w = box.width, h = box.height;
    if (!w || !h) return;

    GlowLayer.layout(this._glowEl, host, box, cfg, this._pal);

    // zonas de legibilidade (textos, botões...)
    var zones = [];
    if (cfg.particles.avoid) {
      var nodes;
      try { nodes = host.querySelectorAll(cfg.particles.avoid); } catch (e) { nodes = []; }
      for (var i = 0; i < nodes.length && zones.length < 60; i++) {
        if (this.contains(nodes[i])) continue;
        var r = nodes[i].getBoundingClientRect();
        if (!r.width || !r.height) continue;
        zones.push({ l: r.left - box.left - 8, t: r.top - box.top - 8, r: r.right - box.left + 8, b: r.bottom - box.top + 8 });
      }
    }
    this._zones = zones;

    if (this._canvas) {
      var dpr = Math.min(window.devicePixelRatio || 1, cfg.isMobile ? 1.5 : 2);
      this._canvas.width = Math.round(w * dpr);
      this._canvas.height = Math.round(h * dpr);
      this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!this._particles.list.length) this._particles.populate(w, h, this._cfg.particles.count);
      else if (this._w && this._h) this._particles.rescale(w / this._w, h / this._h);
    }
    this._w = w; this._h = h;

    if (cfg.reduced) this._renderStatic();
    else if (this._visible) this._draw();
  };

  P._onIntersect = function (entry) {
    var cfg = this._cfg;
    this._visible = entry.isIntersecting;
    if (cfg.scroll.enabled && entry.isIntersecting) {
      // quanto da seção ocupa a tela: entrada/saída discretas, permanência um pouco mais viva
      var v = entry.intersectionRect.height / Math.max(1, Math.min(entry.boundingClientRect.height, window.innerHeight));
      this._kTarget = cfg.intensity * (cfg.scroll.min + (1 - cfg.scroll.min) * smooth(v));
    } else {
      this._kTarget = cfg.intensity;
    }
    if (cfg.reduced) { this.setAttribute('data-paused', ''); return; }
    if (this._visible) {
      this.removeAttribute('data-paused');
      this._last = 0;
      Scheduler.add(this);
    } else {
      this.setAttribute('data-paused', '');
      Scheduler.remove(this);
    }
  };

  // chamado pelo Scheduler (loop rAF único compartilhado)
  P.frame = function (now) {
    var cfg = this._cfg;
    if (this._last && now - this._last < 1000 / cfg.fps - 2) return;
    var dt = this._last ? Math.min((now - this._last) / 1000, 0.1) : 1 / 60;
    this._last = now;

    // intensidade (scroll) com transição lenta
    var ease = 1 - Math.exp(-dt * 1.2);
    this._k += (this._kTarget - this._k) * ease;

    // parallax com inércia suave
    var tx = 0, ty = 0;
    if (cfg.parallaxOn) { tx = Pointer.x; ty = Pointer.y; }
    var pe = 1 - Math.exp(-dt * 2.2);
    this._px += (tx - this._px) * pe;
    this._py += (ty - this._py) * pe;

    var kStr = clamp(this._k, 0, 1).toFixed(3);
    if (kStr !== this._kStr) { this._kStr = kStr; this.style.setProperty('--ab-intensity', kStr); }
    if (cfg.parallaxOn) {
      var pxs = this._px.toFixed(3), pys = this._py.toFixed(3);
      if (pxs !== this._pxs || pys !== this._pys) {
        this._pxs = pxs; this._pys = pys;
        this.style.setProperty('--ab-px', pxs);
        this.style.setProperty('--ab-py', pys);
      }
    }

    if (!this._particles || !this._w) return;
    // movimento desacelera levemente quando a seção está saindo da tela
    var motion = cfg.scroll.enabled ? 0.55 + 0.45 * clamp(this._k / Math.max(cfg.intensity, 0.001), 0, 1) : 1;
    var mdt = dt * motion;
    this._t += mdt;
    this._particles.update(mdt, this._t, this._w, this._h, this._zones);
    if (this._connections) this._connections.update(mdt, this._particles);
    this._draw();
  };

  P._draw = function () {
    if (!this._ctx) return;
    var ctx = this._ctx;
    ctx.clearRect(0, 0, this._w, this._h);
    if (this._connections) this._connections.draw(ctx, this._px, this._py, 1);
    this._particles.draw(ctx, this._t, this._px, this._py, 1);
  };

  // reduced-motion: um único quadro estático, sem loop
  P._renderStatic = function () {
    if (!this._particles || !this._w) return;
    this._particles.update(0, this._t, this._w, this._h, this._zones, true);
    this._draw();
  };

  customElements.define('ambient-background', AmbientBackgroundElement);

  /* ------------------------------------------------------------------ */
  /* API pública                                                         */
  /* ------------------------------------------------------------------ */

  window.AmbientBackground = {
    defaults: DEFAULTS,
    presets: PRESETS,
    // insere o fundo como primeiro filho de uma seção existente, sem tocar no conteúdo
    mount: function (section, config) {
      if (!section) return null;
      var el = section.querySelector(':scope > ambient-background');
      if (!el) {
        el = document.createElement('ambient-background');
        if (config && config.preset) el.setAttribute('preset', config.preset);
        el._userConfig = config || {};
        section.insertBefore(el, section.firstChild);
      } else if (config) {
        el.configure(config);
      }
      return el;
    }
  };
})();
