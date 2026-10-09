// Infra compartilhada entre todas as instâncias: um único loop rAF,
// um único listener de mouse e utilitários de cor/matemática.

export interface Frameable {
  frame(now: number): void;
}

const items = new Set<Frameable>();
let raf = 0;

function tick(now: number) {
  raf = 0;
  items.forEach((item) => item.frame(now));
  if (items.size) raf = requestAnimationFrame(tick);
}

export const Scheduler = {
  add(item: Frameable) {
    items.add(item);
    if (!raf) raf = requestAnimationFrame(tick);
  },
  remove(item: Frameable) {
    items.delete(item);
    if (!items.size && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  },
};

/** posição do mouse normalizada (−1..1) */
export const Pointer = { x: 0, y: 0 };
let pointerBound = false;
export function bindPointer() {
  if (pointerBound) return;
  pointerBound = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      Pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      Pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true },
  );
}

export type RGB = [number, number, number];

let colorCtx: CanvasRenderingContext2D | null = null;
/** resolve "--sage" (variável CSS do site) ou qualquer cor CSS para RGB */
export function toRGB(value: string, scope: Element): RGB {
  let v = (value || "").trim();
  if (v.startsWith("--")) v = getComputedStyle(scope).getPropertyValue(v).trim();
  colorCtx ??= document.createElement("canvas").getContext("2d");
  if (!colorCtx) return [0, 0, 0];
  colorCtx.fillStyle = "#000";
  colorCtx.fillStyle = v || "#000";
  const s = String(colorCtx.fillStyle);
  if (s.startsWith("#")) {
    return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
  }
  const m = s.match(/[\d.]+/g) ?? ["0", "0", "0"];
  return [+m[0], +m[1], +m[2]];
}

export function rgba(c: RGB, a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${clamp(a, 0, 1).toFixed(3)})`;
}

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export function smooth(t: number) {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}

export interface Palette {
  primary: RGB;
  secondary: RGB;
  soft: RGB;
  light: RGB;
}

export interface Box {
  width: number;
  height: number;
}

/** retângulo (em coordenadas da seção) usado para preservar a legibilidade */
export interface Zone {
  l: number;
  t: number;
  r: number;
  b: number;
}
