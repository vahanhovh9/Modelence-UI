import { useMemo, useState } from 'react';
import { Tab } from './Tab';
import { TableSection } from './ConsoleTable';
import type { Env } from '../environment';

/*
 * Charts are drawn by hand rather than pulled from a library: every series is a
 * handful of points, and an SVG path themed off the token layer follows the
 * dark/bright switch for free where a canvas-based library would not.
 *
 * Geometry is authored in a fixed 0..W / 0..H space and stretched to the panel
 * with preserveAspectRatio="none". Strokes carry vectorEffect="non-scaling-stroke"
 * so that stretch never thickens them unevenly, and every label lives in HTML
 * beside the chart rather than inside it, where it would skew.
 */

const RANGES = ['1h', '24h', '7d'] as const;
type Range = (typeof RANGES)[number];

/** X-axis ticks per range, oldest first. */
const TICKS: Record<Range, string[]> = {
  '1h': ['60m', '45m', '30m', '15m', 'now'],
  '24h': ['24h', '18h', '12h', '6h', 'now'],
  '7d': ['Mon', 'Wed', 'Fri', 'Sun', 'now'],
};

const POINTS: Record<Range, number> = { '1h': 36, '24h': 48, '7d': 56 };

/**
 * Deterministic pseudo-random: the page has to look organic, but a fresh
 * Math.random on every render would make the charts twitch on any state change.
 */
function noise(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };
}

function series(seed: number, count: number, base: number, spread: number, swell = 2.2) {
  const rand = noise(seed);
  return Array.from({ length: count }, (_, i) => {
    const phase = (i / count) * Math.PI * swell;
    const wave = Math.sin(phase) * 0.3 + Math.sin(i / 3.5) * 0.1;
    return Math.max(0, base + base * wave + (rand() - 0.5) * spread);
  });
}

const W = 100;
const H = 40;

/** Catmull-Rom through the points, as cubic beziers — a curve, not a zig-zag. */
function smooth(values: number[], max: number, h = H) {
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, h - (v / max) * h] as const);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** Four horizontal rules behind a chart, so a value can be read off it. */
function Grid({ rows = 4, h = H }: { rows?: number; h?: number }) {
  return (
    <g className="text-border-main">
      {Array.from({ length: rows + 1 }, (_, i) => (
        <line
          key={i}
          x1={0}
          x2={W}
          y1={(i / rows) * h}
          y2={(i / rows) * h}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}

function Axis({ range }: { range: Range }) {
  return (
    <div className="mt-[8px] flex w-full justify-between">
      {TICKS[range].map((tick) => (
        <span key={tick} className="text-xs-title text-text-secondary">
          {tick}
        </span>
      ))}
    </div>
  );
}

/** A titled chart container — the card every panel on this page sits in. */
function Panel({
  title,
  value,
  legend,
  children,
  className = '',
}: {
  title: string;
  value?: string;
  legend?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-w-px flex-col gap-[12px] rounded-main border border-border-main bg-bg-primary p-[16px] ${className}`}
    >
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[2px]">
          <span className="text-h5 text-text-secondary">{title}</span>
          {value && <span className="text-h1 text-text-selected">{value}</span>}
        </div>
        {legend}
      </div>
      {children}
    </div>
  );
}

function LegendKey({ label, tone }: { label: string; tone: string }) {
  return (
    <span className="flex shrink-0 items-center gap-[5px]">
      <span aria-hidden className={`size-[6px] shrink-0 rounded-full ${tone}`} />
      <span className="text-small-title whitespace-nowrap text-text-secondary">{label}</span>
    </span>
  );
}

/* ------------------------------------------------------------- stat cards */

function Sparkline({ values, tone }: { values: number[]; tone: string }) {
  const max = Math.max(...values) * 1.15;
  return (
    <svg
      viewBox={`0 0 ${W} 20`}
      preserveAspectRatio="none"
      aria-hidden
      className={`h-[24px] w-full ${tone}`}
    >
      <path
        d={smooth(values, max, 20)}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function StatCard({
  label,
  value,
  delta,
  good,
  spark,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  /** Whether the movement is the direction you want — colours the delta. */
  good: boolean;
  spark: number[];
  tone: string;
}) {
  return (
    <div className="flex min-w-px flex-col gap-[10px] rounded-main border border-border-main bg-bg-primary p-[16px]">
      <span className="text-h5 whitespace-nowrap text-text-secondary">{label}</span>
      <div className="flex items-baseline gap-[8px]">
        <span className="text-large-number text-text-selected">{value}</span>
        <span
          className={`text-small-title whitespace-nowrap ${good ? 'text-accent-green-text' : 'text-danger'}`}
        >
          {delta}
        </span>
      </div>
      <Sparkline values={spark} tone={tone} />
    </div>
  );
}

/* ------------------------------------------------------------ status codes */

const CODES = [
  { label: '2xx', tone: 'text-accent-green-text', dot: 'bg-accent-green-text', share: 0.86 },
  { label: '3xx', tone: 'text-text-secondary', dot: 'bg-text-secondary', share: 0.07 },
  { label: '4xx', tone: 'text-alert-strong', dot: 'bg-alert-strong', share: 0.05 },
  { label: '5xx', tone: 'text-danger', dot: 'bg-danger', share: 0.02 },
];

/** Stacked bars: one column per bucket, split by status class. */
function StatusBars({ buckets }: { buckets: number[] }) {
  const max = Math.max(...buckets) * 1.1;
  const width = (W / buckets.length) * 0.62;
  const gap = (W / buckets.length - width) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden className="h-[120px] w-full">
      <Grid />
      {buckets.map((total, index) => {
        const x = (index / buckets.length) * W + gap;
        const full = (total / max) * H;
        let y = H;
        return (
          <g key={index}>
            {CODES.map((code) => {
              const height = full * code.share;
              y -= height;
              return (
                <rect
                  key={code.label}
                  x={x}
                  y={y}
                  width={width}
                  height={Math.max(height, 0.4)}
                  className={code.tone}
                  fill="currentColor"
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------- slowest endpoints */

const ENDPOINTS = [
  { method: 'POST', path: '/api/events/import', ms: 842 },
  { method: 'GET', path: '/api/calendar/month', ms: 517 },
  { method: 'POST', path: '/api/auth/session', ms: 306 },
  { method: 'GET', path: '/api/users/me', ms: 184 },
  { method: 'GET', path: '/api/health', ms: 41 },
];

const METHOD_TONE: Record<string, string> = {
  GET: 'text-accent-green-text',
  POST: 'text-text-selected',
};

function Endpoints() {
  const slowest = ENDPOINTS[0].ms;
  return (
    <div className="flex w-full flex-col">
      {ENDPOINTS.map((endpoint) => (
        <div
          key={endpoint.path}
          className="flex items-center gap-[12px] border-b border-border-secondary py-[10px] last:border-b-0"
        >
          <span className={`text-xs-title w-[34px] shrink-0 font-semibold ${METHOD_TONE[endpoint.method]}`}>
            {endpoint.method}
          </span>
          <span className="font-mono-code min-w-px flex-1 truncate text-[12px] text-text-primary">
            {endpoint.path}
          </span>
          <span className="hidden h-[6px] w-[120px] shrink-0 overflow-clip rounded-full bg-bg-element-2 sm:block">
            <span
              className="block h-full rounded-full bg-button-main-bg"
              style={{ width: `${(endpoint.ms / slowest) * 100}%` }}
            />
          </span>
          <span className="text-body w-[64px] shrink-0 text-right text-text-main">{endpoint.ms} ms</span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- the page */

/*
 * Traffic belongs to the environment that served it. Sandbox sees a developer
 * poking at it; Prod sees the real load — so the two never share a series, and
 * a deploy does not carry one across.
 */
const HEADLINE = {
  sandbox: { requests: '1.24M', errors: '0.42%', p95: '214 ms', uptime: '99.98%', rpm: '1,842 avg', times: '48 / 214 ms', ok: '99.6% ok', base: 1200 },
  prod: { requests: '38.6M', errors: '0.08%', p95: '141 ms', uptime: '99.99%', rpm: '26,400 avg', times: '31 / 141 ms', ok: '99.9% ok', base: 26400 },
};

export function MonitoringView({ env = 'sandbox' }: { env?: Env }) {
  const [range, setRange] = useState<Range>('24h');
  const copy = HEADLINE[env];

  // Reseeded per range, so switching ranges genuinely redraws rather than
  // rescaling the same curve.
  const data = useMemo(() => {
    const n = POINTS[range];
    const seed = (range === '1h' ? 7 : range === '24h' ? 41 : 93) + (env === 'prod' ? 500 : 0);
    const scale = copy.base / 1200;
    return {
      requests: series(seed, n, copy.base, 520 * scale),
      p50: series(seed + 1, n, env === 'prod' ? 31 : 48, 16, 1.6),
      p95: series(seed + 2, n, env === 'prod' ? 128 : 190, 70, 1.9),
      errors: series(seed + 3, 14, 900 * scale, 300 * scale, 1.4),
    };
  }, [range, env, copy.base]);

  const requestMax = Math.max(...data.requests) * 1.15;
  const latencyMax = Math.max(...data.p95) * 1.2;

  return (
    <TableSection
      title="Monitoring"
      actions={<Tab options={RANGES} value={range} onChange={setRange} />}
    >
      <div className="flex w-full flex-col gap-[12px]">
        <div className="grid w-full grid-cols-2 gap-[12px] xl:grid-cols-4">
          <StatCard
            label="Requests"
            value={copy.requests}
            delta="+8.2%"
            good
            spark={data.requests}
            tone="text-button-main-bg"
          />
          <StatCard
            label="Error rate"
            value={copy.errors}
            delta="+0.11%"
            good={false}
            spark={data.p95}
            tone="text-danger"
          />
          <StatCard
            label="p95 latency"
            value={copy.p95}
            delta="−18 ms"
            good
            spark={data.p50}
            tone="text-accent-green-text"
          />
          <StatCard
            label="Uptime"
            value={copy.uptime}
            delta="30 days"
            good
            spark={data.requests.map((v) => v * 0.2 + 900)}
            tone="text-accent-green-text"
          />
        </div>

        <Panel title="Requests per minute" value={copy.rpm}>
          <div className="w-full">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              aria-hidden
              className="h-[170px] w-full text-button-main-bg"
            >
              <Grid />
              <defs>
                <linearGradient id="requestsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`${smooth(data.requests, requestMax)} L${W} ${H} L0 ${H} Z`}
                fill="url(#requestsFill)"
                stroke="none"
              />
              <path
                d={smooth(data.requests, requestMax)}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <Axis range={range} />
          </div>
        </Panel>

        <div className="grid w-full grid-cols-1 gap-[12px] lg:grid-cols-2">
          <Panel
            title="Response time"
            value={copy.times}
            legend={
              <div className="flex shrink-0 items-center gap-[10px]">
                <LegendKey label="p50" tone="bg-accent-green-text" />
                <LegendKey label="p95" tone="bg-button-main-bg" />
              </div>
            }
          >
            <div className="w-full">
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden className="h-[120px] w-full">
                <Grid />
                <path
                  d={smooth(data.p95, latencyMax)}
                  fill="none"
                  className="text-button-main-bg"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={smooth(data.p50, latencyMax)}
                  fill="none"
                  className="text-accent-green-text"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <Axis range={range} />
            </div>
          </Panel>

          <Panel
            title="Status codes"
            value={copy.ok}
            legend={
              <div className="flex shrink-0 flex-wrap items-center gap-[10px]">
                {CODES.map((code) => (
                  <LegendKey key={code.label} label={code.label} tone={code.dot} />
                ))}
              </div>
            }
          >
            <div className="w-full">
              <StatusBars buckets={data.errors} />
              <Axis range={range} />
            </div>
          </Panel>
        </div>

        <Panel title="Slowest endpoints" value="p95 over the window">
          <Endpoints />
        </Panel>
      </div>
    </TableSection>
  );
}
