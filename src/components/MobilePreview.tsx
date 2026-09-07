import { assets } from '../assets';
import { Button } from './Button';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';
import type { Version } from '../version';

const URL = 'https://mobile-tenant-sandbox-vzbms.sandbox.modelence.app';

/* ------------------------------------------------------------------- phone */

/*
 * The device is a physical object rather than a themed surface, so its bezel
 * keeps one near-black finish in both themes — the same reasoning that keeps
 * the build terminal dark on a bright page.
 */
const BEZEL = '#0e0e0e';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
/** July 2026 starts on a Wednesday, so the first row carries three blanks. */
const LEAD = 3;
const EVENTS: Record<number, string> = { 8: 'Design review', 14: 'Sprint planning', 20: 'Product demo' };

/** The generated app as it renders on a handset — drawn, not screenshotted. */
function PhoneScreen() {
  return (
    <div
      style={{ containerType: 'size' }}
      className="flex size-full flex-col bg-grey-0 text-left text-grey-900"
    >
      {/* Status bar. */}
      <div className="flex shrink-0 items-center justify-between px-[7cqw] pt-[3cqw]">
        <span style={{ fontSize: '3.6cqw', fontWeight: 600 }}>9:41</span>
        <span className="flex items-center gap-[1.2cqw]">
          {[0, 1, 2].map((bar) => (
            <span
              key={bar}
              style={{ width: '1.4cqw', height: `${2 + bar}cqw`, background: BEZEL, borderRadius: '0.4cqw' }}
            />
          ))}
        </span>
      </div>

      <div className="flex shrink-0 flex-col gap-[1cqw] px-[7cqw] pt-[5cqw]">
        <span style={{ fontSize: '7cqw', fontWeight: 700, letterSpacing: '-0.02em' }}>July 2026</span>
        <span style={{ fontSize: '3.4cqw', color: '#8b8f98' }}>8 events this month</span>
      </div>

      <div className="mt-[5cqw] grid shrink-0 grid-cols-7 px-[5cqw]">
        {WEEKDAYS.map((day, index) => (
          <span
            key={index}
            className="text-center"
            style={{ fontSize: '2.8cqw', fontWeight: 600, color: '#b9bdc5' }}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="mt-[2cqw] grid grid-cols-7 gap-y-[1cqw] px-[5cqw]">
        {Array.from({ length: 35 }, (_, cell) => {
          const day = cell - LEAD + 1;
          if (day < 1 || day > 31) return <span key={cell} />;
          const today = day === 20;
          return (
            <span key={cell} className="flex flex-col items-center gap-[0.6cqw]">
              <span
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '7cqw',
                  height: '7cqw',
                  fontSize: '3.2cqw',
                  fontWeight: today ? 700 : 500,
                  background: today ? BEZEL : 'transparent',
                  color: today ? '#ffffff' : BEZEL,
                }}
              >
                {day}
              </span>
              <span
                style={{
                  width: '1.4cqw',
                  height: '1.4cqw',
                  borderRadius: 999,
                  background: EVENTS[day] ? '#7151f5' : 'transparent',
                }}
              />
            </span>
          );
        })}
      </div>

      <div className="mt-[5cqw] flex min-h-0 flex-1 flex-col gap-[2cqw] px-[5cqw]">
        {Object.entries(EVENTS).map(([day, title]) => (
          <span
            key={day}
            className="flex shrink-0 items-center gap-[3cqw] rounded-[2.4cqw]"
            style={{ background: '#f3f3f5', padding: '2.6cqw 3cqw' }}
          >
            <span style={{ width: '1cqw', alignSelf: 'stretch', borderRadius: 999, background: '#7151f5' }} />
            <span className="flex min-w-px flex-1 flex-col">
              <span style={{ fontSize: '3.4cqw', fontWeight: 600 }}>{title}</span>
              <span style={{ fontSize: '2.8cqw', color: '#8b8f98' }}>Jul {day} · 10:00</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Phone() {
  return (
    <div
      className="shrink-0 rounded-[42px] p-[10px]"
      style={{ background: BEZEL, width: 272, boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}
    >
      <div className="aspect-[9/19] w-full overflow-clip rounded-[32px]">
        <PhoneScreen />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- QR */

const QR = 29;

/** Deterministic, so the code does not reshuffle on every render. */
function noise(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };
}

/**
 * A QR-shaped matrix: real finder, timing and alignment patterns around a
 * seeded data field. It is a picture of a code, not an encoding of the URL —
 * the URL beneath it is the thing to copy.
 */
function qrMatrix() {
  const rand = noise(20260907);
  const m: boolean[][] = Array.from({ length: QR }, () => Array.from({ length: QR }, () => rand() > 0.52));

  const finder = (ox: number, oy: number) => {
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        const px = ox + x;
        const py = oy + y;
        if (px < 0 || py < 0 || px >= QR || py >= QR) continue;
        const inside = x >= 0 && x <= 6 && y >= 0 && y <= 6;
        const ring = x === 0 || x === 6 || y === 0 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        m[py][px] = inside ? ring || core : false;
      }
    }
  };
  finder(0, 0);
  finder(QR - 7, 0);
  finder(0, QR - 7);

  for (let i = 8; i < QR - 8; i++) {
    m[6][i] = i % 2 === 0;
    m[i][6] = i % 2 === 0;
  }

  const a = QR - 7;
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      m[a + y][a + x] = Math.abs(x) === 2 || Math.abs(y) === 2 || (x === 0 && y === 0);
    }
  }
  return m;
}

const MATRIX = qrMatrix();

function QrCode() {
  return (
    // A scannable stays light-on-dark in every theme, so this box does not follow the tokens.
    <div className="flex w-full items-center justify-center rounded-main bg-grey-0 p-[16px]">
      <svg viewBox={`0 0 ${QR} ${QR}`} shapeRendering="crispEdges" role="img" aria-label="QR code to open the app in Expo Go" className="h-auto w-full max-w-[200px]">
        <rect width={QR} height={QR} fill="#ffffff" />
        {MATRIX.map((row, y) =>
          row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={BEZEL} /> : null))
        )}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------- card */

function PreviewCard() {
  return (
    <div className="flex w-full max-w-[320px] min-w-[264px] shrink-0 flex-col gap-[14px] rounded-main border border-border-main bg-bg-primary p-[20px]">
      <div className="flex items-center justify-between gap-[12px]">
        <h3 className="text-h3 text-text-selected">Preview on your phone</h3>
        <StatusBadge label="Running" />
      </div>

      <p className="text-body text-text-main">
        Install <span className="font-semibold text-text-primary">Expo Go</span> on your phone, then scan the
        QR code below to launch your mobile app.
      </p>

      <QrCode />

      <div className="flex items-center gap-[8px] rounded-main border border-border-main bg-bg-element-1 py-[7px] pr-[6px] pl-[10px]">
        <span className="font-mono-code min-w-px flex-1 truncate text-[11px] text-text-main" title={URL}>
          {URL}
        </span>
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-small text-icon-default transition-colors hover:bg-hover hover:text-icon-selected">
          <Icon src={assets.copy} size={13} />
        </span>
      </div>

      <div className="-mx-[4px] flex flex-col items-start">
        <Button variant="text" trailing={<Icon src={assets.externalLink} size={12} />}>
          Get Expo Go for iOS
        </Button>
        <Button variant="text" trailing={<Icon src={assets.externalLink} size={12} />}>
          Get Expo Go for Android
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- pane */

/** What the Mobile app tab shows: the handset, and how to open it on a real one. */
export function MobilePreview({ version }: { version: Version }) {
  const isV2 = version === 'v2';
  return (
    <div
      className={`h-full min-w-0 flex-1 overflow-y-auto bg-bg-container ${
        isV2 ? '' : 'rounded-block border border-border-main'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[720px] flex-wrap items-start justify-center gap-[28px] px-[24px] py-[32px]">
        <Phone />
        <PreviewCard />
      </div>
    </div>
  );
}
