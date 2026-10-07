"use client";

/**
 * <AmbientBackground /> — fundo ambiental animado, discreto e reutilizável.
 *
 * Coloque como PRIMEIRO filho de qualquer seção existente; o conteúdo da
 * seção não precisa de nenhuma alteração:
 *
 *   <section className="services">
 *     <AmbientBackground preset="soft" />
 *     ...conteúdo existente...
 *   </section>
 *
 * Ajuste fino por props rápidas ou por objeto `config` (as props vencem):
 *
 *   <AmbientBackground
 *     particleCount={30}
 *     particleOpacity={0.15}
 *     connectionDistance={100}
 *     glowIntensity={0.2}
 *     glowTargets=".hero-title, .hero-visual"
 *     parallax={0.8}
 *     config={{ noise: { opacity: 0.025 }, colors: { primary: "--sage" } }}
 *   />
 *
 * Presets: "hero" (padrão), "soft" (seções com mais texto), "minimal"
 * (só gradientes + textura). Todos os valores em ./config.ts.
 */

import { useEffect, useMemo, useRef } from "react";
import { merge, type AmbientConfig, type AmbientPreset, type DeepPartial } from "./config";
import { AmbientEngine } from "./engine";
import "./ambient.css";

export interface AmbientBackgroundProps {
  preset?: AmbientPreset;
  config?: DeepPartial<AmbientConfig>;
  intensity?: number;
  particleCount?: number;
  particleOpacity?: number;
  particleSpeed?: number;
  particleMinSize?: number;
  particleMaxSize?: number;
  connections?: boolean;
  connectionDistance?: number;
  connectionOpacity?: number;
  maxConnections?: number;
  glowIntensity?: number;
  glowBlur?: number;
  /** seletores (dentro da seção) que recebem um halo de luz atrás */
  glowTargets?: string;
  noiseOpacity?: number;
  /** multiplicador do parallax; `false` desliga */
  parallax?: number | boolean;
  scroll?: boolean;
  fps?: number;
  className?: string;
}

function toConfig(p: AmbientBackgroundProps): DeepPartial<AmbientConfig> {
  const shorthand: DeepPartial<AmbientConfig> = {
    intensity: p.intensity,
    fps: p.fps,
    particles: {
      count: p.particleCount,
      opacity: p.particleOpacity,
      speed: p.particleSpeed,
      minSize: p.particleMinSize,
      maxSize: p.particleMaxSize,
    },
    connections: {
      enabled: p.connections,
      distance: p.connectionDistance,
      opacity: p.connectionOpacity,
      max: p.maxConnections,
    },
    glow: { intensity: p.glowIntensity, blur: p.glowBlur, targets: p.glowTargets },
    noise: { opacity: p.noiseOpacity },
    parallax: p.parallax === false ? { enabled: false } : typeof p.parallax === "number" ? { intensity: p.parallax } : {},
    scroll: { enabled: p.scroll },
  };
  return merge({}, p.config, shorthand);
}

export default function AmbientBackground(props: AmbientBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const { preset, className } = props;

  // a configuração só é recriada quando o conteúdo das props muda
  const propsKey = JSON.stringify(props);
  const user = useMemo(() => toConfig(JSON.parse(propsKey) as AmbientBackgroundProps), [propsKey]);

  useEffect(() => {
    const root = rootRef.current;
    const gradient = gradientRef.current;
    const glow = glowRef.current;
    const particles = canvasRef.current;
    const host = root?.parentElement;
    if (!root || !gradient || !glow || !particles || !host) return;
    const engine = new AmbientEngine(host, root, { gradient, glow, particles }, noiseRef.current, preset, user);
    if (process.env.NODE_ENV !== "production" || "__ambientDebug" in window) {
      (root as HTMLDivElement & { ambient?: AmbientEngine }).ambient = engine;
    }
    return () => engine.destroy();
  }, [preset, user]);

  return (
    <div ref={rootRef} className={className ? `ab-root ${className}` : "ab-root"} aria-hidden="true">
      <canvas ref={gradientRef} className="ab-atmos" />
      <canvas ref={glowRef} className="ab-atmos" />
      <canvas ref={canvasRef} className="ab-canvas" />
      <div ref={noiseRef} className="ab-noise" />
    </div>
  );
}
