import { useMemo, useState } from 'react';
import { Tab } from './Tab';
import { HeadCell, Scroller, TableHead, TableRow, TableSection } from './ConsoleTable';
import type { Env } from '../environment';

/*
 * Monitoring shows what the platform actually measures: the container's CPU and
 * memory over the window, then the three things it counts — server methods,
 * cron jobs and HTTP routes.
 *
 * Charts are drawn by hand rather than pulled from a library: every series is a
 * handful of points, and SVG themed off the token layer follows the dark/bright
 * switch for free where a canvas-based library would not. A sampled series is
 * drawn angular with a dot on each reading, so the chart says what the data
 * says rather than smoothing a curve through it.
 *
 * Geometry: paths live in a fixed 0..W / 0..H SVG stretched with
 * preserveAspectRatio="none" and non-scaling strokes. Everything a stretch
 * would ruin is HTML over the top instead — dashed rules (a stretched dash
 * pattern smears), dots (an SVG circle would come out an ellipse), meters
 * (their rounded caps would go oval) and every label.
 */

const RANGES = ['1h', '24h', '7d'] as const;
type Range = (typeof RANGES)[number];

/** X-axis ticks per range, oldest first — the window ends at 19:00. */
const TICKS: Record<Range, string[]> = {
  '1h': ['18:00', '18:15', '18:30', '18:45', '19:00'],
  '24h': ['19:00', '22:00', '01:00', '04:00', '07:00', '10:00', '13:00', '16:00', '19:00'],
  '7d': ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
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

/** A utilisation series as a percentage, kept inside 0..100. */
function usage(seed: number, count: number, base: number, spread: number, swell = 2.2) {
  const rand = noise(seed);
  return Array.from({ length: count }, (_, i) => {
    const phase = (i / count) * Math.PI * swell;
    const wave = Math.sin(phase) * 0.18 + Math.sin(i / 3.5) * 0.06;
    return Math.min(97, Math.max(1, base + base * wave + (rand() - 0.5) * spread));
  });
}

const W = 100;
const H = 40;

/**
 * Axis ticks top-down, so they can be laid out against the gridlines.
 *
 * The scale is picked once from the maximum and every tick expressed in it,
 * because an axis reading 2.1k / 1.6k / 1.0k / 518 makes the reader convert
 * units mid-column. Zero is always bare.
 */
function ticks(max: number, rows: number, unit = '') {
  const div = max >= 1_000_000 ? 1_000_000 : max >= 1_000 ? 1_000 : 1;
  const suffix = div === 1_000_000 ? 'M' : div === 1_000 ? 'k' : '';
  const places = div === 1 ? 0 : max / div >= 10 ? 0 : 1;

  return Array.from({ length: rows + 1 }, (_, i) => {
    const value = ((max / rows) * (rows - i)) / div;
    return value === 0 ? `0${unit}` : `${value.toFixed(places)}${suffix}${unit}`;
  });
}

/* ------------------------------------------------------------ chart chrome */

const LABEL = 'text-xs-title text-text-secondary';

/**
 * The frame every chart sits in: a gutter of y labels, dashed rules behind the
 * plot, and x labels under it. The baseline rule is solid and stronger than the
 * rest, so the plot has a floor to sit on.
 */
function Chart({
  height,
  yLabels,
  xLabels,
  children,
}: {
  height: number;
  yLabels: string[];
  xLabels: string[];
  children: React.ReactNode;
}) {
  const rows = yLabels.length - 1;

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-stretch gap-[10px]">
        <div className="flex w-[36px] shrink-0 flex-col justify-between" style={{ height }}>
          {yLabels.map((label, index) => (
            <span key={index} className={`${LABEL} -mt-[4px] text-right whitespace-nowrap`}>
              {label}
            </span>
          ))}
        </div>

        <div className="relative min-w-px flex-1" style={{ height }}>
          <div aria-hidden className="absolute inset-0">
            {Array.from({ length: rows + 1 }, (_, i) => (
              <span
                key={i}
                className={`absolute inset-x-0 border-t ${
                  i === rows ? 'border-border-highlight' : 'border-dashed border-border-main'
                }`}
                style={{ top: `${(i / rows) * 100}%` }}
              />
            ))}
          </div>
          {children}
        </div>
      </div>

      <div className="mt-[10px] flex w-full justify-between pl-[46px]">
        {xLabels.map((label) => (
          <span key={label} className={LABEL}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- the plot */

/** Straight between samples — the reading, not a curve through it. */
function angular(values: number[], max: number, h = H) {
  return values.map((value, i) => `${(i / (values.length - 1)) * W},${h - (value / max) * h}`).join(' L');
}

function Line({ values, max }: { values: number[]; max: number }) {
  const id = useMemo(() => `wash-${Math.random().toString(36).slice(2, 9)}`, []);
  const path = `M${angular(values, max)}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden
      className="absolute inset-0 size-full"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.26" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${W} ${H} L0 ${H} Z`} fill={`url(#${id})`} stroke="none" />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * A dot on each reading, in HTML rather than SVG: a circle under
 * preserveAspectRatio="none" would come out an ellipse. Thinned to about two
 * dozen so a 56-point week does not turn into a bead curtain.
 */
function Dots({ values, max }: { values: number[]; max: number }) {
  const every = Math.ceil(values.length / 24);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {values.map((value, i) =>
        i % every === 0 || i === values.length - 1 ? (
          <span
            key={i}
            className="absolute size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
            style={{ left: `${(i / (values.length - 1)) * 100}%`, top: `${100 - (value / max) * 100}%` }}
          />
        ) : null,
      )}
    </div>
  );
}

/** The reference's centred key, under the plot rather than beside it. */
function SeriesKey({ label }: { label: string }) {
  return (
    <div className="mt-[14px] flex w-full items-center justify-center gap-[7px]">
      <span aria-hidden className="flex items-center text-button-main-bg">
        <span className="h-px w-[9px] bg-current" />
        <span className="size-[6px] rounded-full border border-current" />
        <span className="h-px w-[9px] bg-current" />
      </span>
      <span className="text-small-title text-text-secondary">{label}</span>
    </div>
  );
}

/** One system metric: a percentage over the window, 0–100 fixed. */
function MetricCard({
  title,
  label,
  values,
  xLabels,
}: {
  title: string;
  label: string;
  values: number[];
  xLabels: string[];
}) {
  return (
    <div className="flex min-w-px flex-col gap-[16px] rounded-main border border-border-main bg-bg-primary p-[16px]">
      <h3 className="text-h3 text-text-selected">{title}</h3>
      <div className="w-full text-button-main-bg">
        <Chart height={200} yLabels={ticks(100, 4, '%')} xLabels={xLabels}>
          <Line values={values} max={100} />
          <Dots values={values} max={100} />
        </Chart>
      </div>
      <SeriesKey label={label} />
    </div>
  );
}

/* ------------------------------------------------------------------ tables */

/** The card the three counted tables sit in — the column header names it. */
function TableCard({ min, children }: { min: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full min-w-px flex-col rounded-main border border-border-main bg-bg-primary px-[20px] pt-[2px] pb-[6px]">
      <Scroller min={min}>{children}</Scroller>
    </div>
  );
}

/** What the platform shows before a window has anything in it. */
function Empty() {
  return (
    <div className="flex w-full items-center justify-center py-[30px]">
      <span className="text-body text-text-secondary">No data available</span>
    </div>
  );
}

/** Sub-millisecond work reads in ms; anything over a second reads in s. */
function ms(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}s`;
  if (value < 1) return `${value.toFixed(1)}ms`;
  return `${Math.round(value)}ms`;
}

/**
 * Latency as a bar plus its numbers. The bar is relative to the slowest row in
 * the same table, so the column is readable at a glance without an axis.
 */
function Performance({ avg, p99, of }: { avg: number; p99: number; of: number }) {
  return (
    <span className="flex items-center gap-[10px]">
      <span
        aria-hidden
        className="hidden h-[6px] w-[108px] shrink-0 overflow-clip rounded-full bg-bg-element-2 sm:block"
      >
        <span className="block h-full rounded-full bg-text-main" style={{ width: `${(avg / of) * 100}%` }} />
      </span>
      <span className="text-body whitespace-nowrap text-text-main">
        {ms(avg)} <span className="text-text-secondary">avg</span>
      </span>
      <span className="text-body hidden whitespace-nowrap text-text-secondary lg:inline">{ms(p99)} p99</span>
    </span>
  );
}

const COUNT = 'text-body tabular-nums text-text-main';

/* -------------------------------------------------------------------- data */

type Method = { name: string; avg: number; p99: number; calls: number };
type Route = { path: string; avg: number; p99: number; requests: number };

/*
 * Cron is the platform's own, so both environments run the same two jobs — the
 * disposable-email refresh Modelence ships, and the example job a new project
 * starts with. Methods and routes are the app's, and belong to the environment
 * that served them.
 */
const CRON = [
  {
    name: '_system.user.updateDisposableEmailList',
    about: '',
    schedule: 'Every 24h',
    timeout: '24h',
    avg: 2400,
    p99: 2400,
  },
  {
    name: 'example.dailyTest',
    about: 'Daily cron job example',
    schedule: 'Every 24h',
    timeout: '24h',
    avg: 0.9,
    p99: 0.9,
  },
];

const TRAFFIC: Record<Env, { cpu: number; memory: number; methods: Method[]; routes: Route[] }> = {
  sandbox: {
    cpu: 14,
    memory: 57,
    methods: [
      { name: 'events.list', avg: 24, p99: 82, calls: 12480 },
      { name: 'events.create', avg: 41, p99: 138, calls: 1204 },
      { name: 'auth.session', avg: 18, p99: 61, calls: 8932 },
      { name: 'users.me', avg: 9, p99: 27, calls: 6410 },
    ],
    routes: [
      { path: '/', avg: 62, p99: 184, requests: 9840 },
      { path: '/api/events', avg: 38, p99: 121, requests: 14220 },
      { path: '/api/auth/callback', avg: 96, p99: 240, requests: 812 },
    ],
  },
  prod: {
    cpu: 38,
    memory: 68,
    methods: [
      { name: 'events.list', avg: 17, p99: 54, calls: 2840000 },
      { name: 'events.create', avg: 29, p99: 96, calls: 184300 },
      { name: 'auth.session', avg: 12, p99: 41, calls: 1920000 },
      { name: 'users.me', avg: 7, p99: 19, calls: 1410000 },
    ],
    routes: [
      { path: '/', avg: 44, p99: 128, requests: 2140000 },
      { path: '/api/events', avg: 26, p99: 84, requests: 3860000 },
      { path: '/api/auth/callback', avg: 71, p99: 168, requests: 96400 },
    ],
  },
};

const COLS = {
  perf: 'w-[300px] shrink-0',
  count: 'w-[120px] shrink-0 text-right',
  about: 'w-[190px] shrink-0',
  schedule: 'w-[96px] shrink-0',
  timeout: 'w-[76px] shrink-0',
  duration: 'w-[104px] shrink-0',
  runs: 'w-[130px] shrink-0',
};

/* ----------------------------------------------------------------- the page */

export function MonitoringView({ env = 'sandbox' }: { env?: Env }) {
  const [range, setRange] = useState<Range>('24h');
  const traffic = TRAFFIC[env];

  // Reseeded per range, so switching ranges genuinely redraws rather than
  // rescaling the same curve.
  const data = useMemo(() => {
    const n = POINTS[range];
    const seed = (range === '1h' ? 7 : range === '24h' ? 41 : 93) + (env === 'prod' ? 500 : 0);
    return {
      cpu: usage(seed, n, traffic.cpu, traffic.cpu * 0.7),
      // Memory is a resident working set, not a rate: it drifts rather than spikes.
      memory: usage(seed + 1, n, traffic.memory, traffic.memory * 0.12, 1.3),
    };
  }, [range, env, traffic.cpu, traffic.memory]);

  const slowestMethod = Math.max(...traffic.methods.map((method) => method.avg));
  const slowestRoute = Math.max(...traffic.routes.map((route) => route.avg));

  return (
    <TableSection title="Monitoring" actions={<Tab options={RANGES} value={range} onChange={setRange} />}>
      <div className="flex w-full flex-col gap-[20px]">
        <section className="flex w-full flex-col gap-[12px]">
          <h2 className="text-h3 text-text-selected">System Metrics</h2>
          <div className="grid w-full grid-cols-1 gap-[12px] lg:grid-cols-2">
            <MetricCard title="CPU Usage" label="System CPU" values={data.cpu} xLabels={TICKS[range]} />
            <MetricCard
              title="Memory Usage"
              label="System Memory"
              values={data.memory}
              xLabels={TICKS[range]}
            />
          </div>
        </section>

        <TableCard min="min-w-[700px]">
          <TableHead>
            <HeadCell className="min-w-px flex-1">Method</HeadCell>
            <HeadCell className={COLS.perf}>Performance</HeadCell>
            <HeadCell className={COLS.count}>Invocations</HeadCell>
          </TableHead>
          {traffic.methods.length === 0 ? (
            <Empty />
          ) : (
            traffic.methods.map((method) => (
              <TableRow key={method.name}>
                <span className="font-mono-code min-w-px flex-1 truncate text-[12px] text-text-primary">
                  {method.name}
                </span>
                <span className={COLS.perf}>
                  <Performance avg={method.avg} p99={method.p99} of={slowestMethod} />
                </span>
                <span className={`${COUNT} ${COLS.count}`}>{method.calls.toLocaleString()}</span>
              </TableRow>
            ))
          )}
        </TableCard>

        <TableCard min="min-w-[1000px]">
          <TableHead>
            <HeadCell className="min-w-px flex-1">Cron Job</HeadCell>
            <HeadCell className={COLS.about}>Description</HeadCell>
            <HeadCell className={COLS.schedule}>Schedule</HeadCell>
            <HeadCell className={COLS.timeout}>Timeout</HeadCell>
            <HeadCell className={COLS.duration}>Avg Duration</HeadCell>
            <HeadCell className={COLS.duration}>TP99 Duration</HeadCell>
            <HeadCell className={COLS.runs}>Runs</HeadCell>
          </TableHead>
          {CRON.map((job) => (
            <TableRow key={job.name}>
              <span className="font-mono-code min-w-px flex-1 truncate text-[12px] text-text-primary">
                {job.name}
              </span>
              <span className={`text-body truncate text-text-secondary ${COLS.about}`}>
                {job.about || '—'}
              </span>
              <span className={`text-body text-text-main ${COLS.schedule}`}>{job.schedule}</span>
              <span className={`text-body text-text-main ${COLS.timeout}`}>{job.timeout}</span>
              <span className={`${COUNT} ${COLS.duration}`}>{ms(job.avg)}</span>
              <span className={`${COUNT} ${COLS.duration}`}>{ms(job.p99)}</span>
              <span className={COLS.runs}>
                <span className={COUNT}>1</span>{' '}
                <span className="text-body text-text-secondary">(no errors)</span>
              </span>
            </TableRow>
          ))}
        </TableCard>

        <TableCard min="min-w-[700px]">
          <TableHead>
            <HeadCell className="min-w-px flex-1">Route</HeadCell>
            <HeadCell className={COLS.perf}>Performance</HeadCell>
            <HeadCell className={COLS.count}>Requests</HeadCell>
          </TableHead>
          {traffic.routes.length === 0 ? (
            <Empty />
          ) : (
            traffic.routes.map((route) => (
              <TableRow key={route.path}>
                <span className="font-mono-code min-w-px flex-1 truncate text-[12px] text-text-primary">
                  {route.path}
                </span>
                <span className={COLS.perf}>
                  <Performance avg={route.avg} p99={route.p99} of={slowestRoute} />
                </span>
                <span className={`${COUNT} ${COLS.count}`}>{route.requests.toLocaleString()}</span>
              </TableRow>
            ))
          )}
        </TableCard>
      </div>
    </TableSection>
  );
}
