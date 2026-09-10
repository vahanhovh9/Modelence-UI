import { useEffect, useRef } from 'react';

/*
 * The iridescent glow under the prompt.
 *
 * It is drawn into a 44x26 buffer and scaled up with image-rendering: pixelated,
 * so the softness comes from the mosaic itself rather than from a blur or a
 * grain texture — chunky pixels, not noise.
 *
 * Four coloured lights drift on their own slow orbits and are summed per cell.
 * Two things keep it from ever competing with the copy above it: a hard alpha
 * ceiling, and a mask that is zero along the top edge so the glow cannot reach
 * the heading even if the layer is nudged upward.
 */

const W = 44;
const H = 26;

/**
 * Peak alpha before the mask.
 *
 * Bright layers a translucent wash over white. Dark goes the other way and is
 * nearly opaque, because on dark the field is meant to sit *below* the surface
 * rather than lighten it — a translucent bright colour over near-black is what
 * was reading as grey.
 */
const CEILING = { dark: 0.92, bright: 0.48 };

/**
 * How far the lights travel and how fast, per theme.
 *
 * Bright needs both turned up. Its colours are laid over white at a low alpha,
 * so swapping which light dominates a cell moves that cell's colour much less
 * than it does on dark — the same orbit reads as standing still. A wider, quicker
 * sweep restores the amount of visible change without making the field louder.
 */
const MOTION = {
  dark: { sweep: 1, speed: 1 },
  bright: { sweep: 1.55, speed: 1.4 },
};

/**
 * The lights, one orbit each and a colour per theme.
 *
 * Bright takes the iridescent pinks and blues straight. Dark takes deep,
 * near-black versions of the same hues — darker than Bg container — with a
 * single saturated violet as the highlight, so the field reads as a bloom
 * against a darkened ground instead of a wash across it.
 */
type Light = {
  dark: [number, number, number];
  bright: [number, number, number];
  rx: number;
  ry: number;
  sx: number;
  sy: number;
  phase: number;
};

const LIGHTS: Light[] = [
  { dark: [46, 10, 36], bright: [255, 110, 199], rx: 0.34, ry: 0.26, sx: 0.00055, sy: 0.00037, phase: 0 },
  { dark: [96, 60, 220], bright: [113, 81, 245], rx: 0.4, ry: 0.22, sx: -0.00042, sy: 0.00052, phase: 1.7 },
  { dark: [10, 18, 48], bright: [79, 157, 255], rx: 0.3, ry: 0.3, sx: 0.00032, sy: -0.00047, phase: 3.1 },
  { dark: [26, 8, 40], bright: [255, 171, 118], rx: 0.26, ry: 0.2, sx: -0.0006, sy: -0.00029, phase: 4.6 },
];

const clamp = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/** Smooth 0→1 ramp, used for the mask so the fade has no visible seam. */
function ramp(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function PromptGlow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const image = ctx.createImageData(W, H);
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const draw = (time: number) => {
      const theme = document.documentElement.dataset.theme === 'bright' ? 'bright' : 'dark';
      const ceiling = CEILING[theme];
      const { sweep, speed } = MOTION[theme];

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const u = x / (W - 1);
          const v = y / (H - 1);

          let r = 0;
          let g = 0;
          let b = 0;
          let weight = 0;

          for (const light of LIGHTS) {
            const cx = 0.5 + light.rx * sweep * Math.sin(light.sx * speed * time + light.phase);
            const cy = 0.56 + light.ry * sweep * Math.cos(light.sy * speed * time + light.phase);
            const dx = (u - cx) / 0.44;
            const dy = (v - cy) / 0.52;
            const w = Math.exp(-(dx * dx + dy * dy) * 2.1);
            const rgb = light[theme];
            r += rgb[0] * w;
            g += rgb[1] * w;
            b += rgb[2] * w;
            weight += w;
          }

          // Zero along the top edge, so the heading above is never touched;
          // rounded off at the sides and bottom so the field has no hard edge.
          /*
           * Zero along the top edge so the heading above is never touched, and
           * decaying from the middle down so the field stays concentrated around
           * the input instead of reaching the copy below it.
           */
          const mask =
            ramp(0, 0.44, v) * (1 - Math.pow(Math.abs(u - 0.5) * 2, 2.4)) * (1 - ramp(0.4, 0.86, v) * 0.94);

          const alpha = clamp(weight * 0.78) * mask * ceiling;
          const at = (y * W + x) * 4;
          image.data[at] = weight > 0 ? r / weight : 0;
          image.data[at + 1] = weight > 0 ? g / weight : 0;
          image.data[at + 2] = weight > 0 ? b / weight : 0;
          image.data[at + 3] = alpha * 255;
        }
      }

      ctx.putImageData(image, 0, 0);
    };

    if (still) {
      draw(0);
      return;
    }

    let frame = 0;
    let last = 0;
    const loop = (now: number) => {
      // 30fps: the field moves quickly enough now to want the extra frames.
      if (now - last > 33) {
        draw(now);
        last = now;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      aria-hidden
      data-prompt-glow
      className="pointer-events-none absolute -inset-x-[18%] top-0 -bottom-[130%] -z-10 size-auto h-[230%] w-[136%]"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
