import type { PublishPhase } from '../publish';

/*
 * Publish illustration in 1-bit-era pixel art: a low-resolution grid of large
 * cells, with shading done by DITHER — alternating cells between two tones —
 * rather than by a smooth gradient, the way classic bitmap icons did it.
 *
 * Cells are generated from silhouette functions and painted by zone, so the
 * shapes stay crisp at any grid size and re-tint through --art-* per theme.
 */
const CELL = 3;

/** Returns a fill for a solid cell, or null for empty space. */
type Paint = (x: number, y: number) => string | null;

const dist = (x: number, y: number, cx: number, cy: number) => Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
/** Checkerboard: the pixel-art way to blend two tones. */
const dither = (x: number, y: number) => (x + y) % 2 === 0;

function Bitmap({ w, h, paint, className = '' }: { w: number; h: number; paint: Paint; className?: string }) {
  const cells: { x: number; y: number; fill: string }[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const fill = paint(x, y);
      if (fill) cells.push({ x, y, fill });
    }
  }
  return (
    <svg
      width={w * CELL}
      height={h * CELL}
      viewBox={`0 0 ${w * CELL} ${h * CELL}`}
      aria-hidden
      className={`shrink-0 ${className}`}
      shapeRendering="crispEdges"
    >
      {cells.map(({ x, y, fill }) => (
        <rect key={`${x}-${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} style={{ fill }} />
      ))}
    </svg>
  );
}

/* ---- Cloud: three lobes on a flat base; the underside dithers into shadow ---- */
const CLOUD_W = 17;
const CLOUD_H = 9;
const cloudSolid = (x: number, y: number) =>
  (y >= 5 && y <= 7 && x >= 2 && x <= 14) ||
  dist(x, y, 5.3, 4.9) <= 3.5 ||
  dist(x, y, 9.3, 3.7) <= 4.1 ||
  dist(x, y, 13.4, 5.2) <= 3.0;

const paintCloud: Paint = (x, y) => {
  if (!cloudSolid(x, y)) return null;
  if (y >= 7) return 'var(--art-cloud-shade)';
  if (y === 6) return dither(x, y) ? 'var(--art-cloud-shade)' : 'var(--art-cloud)';
  return 'var(--art-cloud)';
};

/* ---- Globe: sphere lit from the upper left, continents on top ---- */
const GLOBE = 13;
const GLOBE_R = GLOBE / 2 - 0.4;

const LAND_SPANS: [number, number, number][] = [
  [2, 5, 6],
  [3, 4, 7],
  [4, 3, 6],
  [5, 4, 5],
  [5, 8, 9],
  [6, 7, 9],
  [7, 3, 4],
  [7, 7, 9],
  [8, 3, 5],
  [9, 5, 7],
];
const LAND = new Set(
  LAND_SPANS.flatMap(([y, from, to]) => Array.from({ length: to - from + 1 }, (_, i) => `${from + i},${y}`)),
);

const paintGlobe: Paint = (x, y) => {
  const c = GLOBE / 2;
  const d = dist(x, y, c, c);
  if (d > GLOBE_R) return null;
  if (LAND.has(`${x},${y}`)) return 'var(--art-land)';
  const dx = x + 0.5 - c;
  const dy = y + 0.5 - c;
  const toward = dx + dy * 0.6; // positive = away from the light
  // Terminator: a solid dark rim, dithering back into the lit sea.
  if (d > GLOBE_R - 1.1 && toward > 0.8) return 'var(--art-sea-shade)';
  if (d > GLOBE_R - 2.4 && toward > 1.6) return dither(x, y) ? 'var(--art-sea-shade)' : 'var(--art-sea)';
  // Specular: a dithered lift on the side facing the light.
  if (d > GLOBE_R - 2.6 && toward < -3.2) return dither(x, y) ? 'var(--art-cloud)' : 'var(--art-sea)';
  return 'var(--art-sea)';
};

/* ---- Trail: dotted route with packets marching along it ---- */
function Trail({ moving }: { moving: boolean }) {
  return (
    <span
      aria-hidden
      className="relative mx-[10px] min-w-px flex-1"
      style={{
        height: CELL,
        backgroundImage: `repeating-linear-gradient(to right, var(--art-trail) 0 ${CELL}px, transparent ${CELL}px ${CELL * 2}px)`,
      }}
    >
      {[0, 1, 2].map((packet) => (
        <span
          key={packet}
          className="animate-packet absolute top-0 motion-reduce:animate-none"
          style={{
            width: CELL,
            height: CELL,
            background: 'var(--art-packet)',
            animationDelay: `${packet * -0.87}s`,
            animationPlayState: moving ? 'running' : 'paused',
          }}
        />
      ))}
    </span>
  );
}

/* ---- Sparkles: single cells scattered around the scene, twinkling out of phase ---- */
const SPARKLES: { left: string; top: string; color: string; delay: string }[] = [
  { left: '36%', top: '4%', color: 'var(--art-cloud)', delay: '0s' },
  { left: '88%', top: '0%', color: 'var(--color-accent-bg-alert)', delay: '0.7s' },
  { left: '94%', top: '44%', color: 'var(--art-cloud)', delay: '1.3s' },
  { left: '82%', top: '86%', color: 'var(--art-land)', delay: '0.4s' },
  { left: '4%', top: '80%', color: 'var(--art-cloud-shade)', delay: '1.0s' },
];

const CAPTION: Record<PublishPhase, string> = {
  idle: 'Ready to publish',
  running: 'Shipping your app to production',
  'action-needed': 'Paused — waiting for your confirmation',
  done: 'Your app is live',
};

export function PublishArt({ phase }: { phase: PublishPhase }) {
  const moving = phase === 'running';
  return (
    <div
      className="flex w-full shrink-0 flex-col items-center gap-[14px] overflow-clip rounded-main border border-border-chat px-[18px] pt-[22px] pb-[16px]"
      style={{
        // A faint pixel grid under the scene, then the lavender gradient.
        backgroundImage: [
          `repeating-linear-gradient(to right, color-mix(in srgb, var(--color-border-chat) 26%, transparent) 0 1px, transparent 1px ${CELL}px)`,
          `repeating-linear-gradient(to bottom, color-mix(in srgb, var(--color-border-chat) 26%, transparent) 0 1px, transparent 1px ${CELL}px)`,
          'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-chat) 55%, var(--color-bg-primary)) 0%, var(--color-bg-chat) 100%)',
        ].join(', '),
      }}
    >
      <div className="relative flex w-full items-center">
        {SPARKLES.map((sparkle, index) => (
          <span
            key={index}
            aria-hidden
            className="animate-twinkle absolute motion-reduce:animate-none"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              width: CELL,
              height: CELL,
              background: sparkle.color,
              animationDelay: sparkle.delay,
            }}
          />
        ))}
        <Bitmap w={CLOUD_W} h={CLOUD_H} paint={paintCloud} className="animate-bob motion-reduce:animate-none" />
        <Trail moving={moving} />
        <Bitmap
          w={GLOBE}
          h={GLOBE}
          paint={paintGlobe}
          className={`animate-bob [animation-delay:-1.6s] motion-reduce:animate-none ${
            phase === 'done' ? 'drop-shadow-[0_0_10px_var(--art-land)]' : ''
          }`}
        />
      </div>
      <p className="text-small-title text-center text-text-main">{CAPTION[phase]}</p>
    </div>
  );
}
