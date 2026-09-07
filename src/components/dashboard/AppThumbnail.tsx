export type ThumbKind = 'journal' | 'builder' | 'timezone';

/*
 * Miniature interfaces standing in for app screenshots. They are drawn as
 * markup rather than shipped as rasters so they stay sharp at any card size,
 * and each keeps the palette of the app it depicts — a thumbnail shows the
 * built product, which has its own theme, not this console's chrome.
 *
 * Every size is in container-query units, so a mock is one drawing that scales
 * with the card instead of a layout that has to be retuned per breakpoint.
 */
/** Fills the card and establishes the container the mock's units resolve against. */
function Screen({ background, children }: { background: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        containerType: 'size',
        width: '100%',
        height: '100%',
        background,
        overflow: 'hidden',
        fontFamily: 'inherit',
        textAlign: 'left',
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------- App Builder */

const B = {
  chrome: '#ffffff',
  line: '#e8e9ee',
  bg: '#f6f7f9',
  text: '#16171a',
  muted: '#8b8f98',
  dim: '#b9bdc5',
  sel: '#eceef1',
  purple: '#7c3aed',
};

/** One sidebar row: a glyph stand-in plus its label. */
function NavRow({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1cqw',
        padding: '0.7cqw 1cqw',
        borderRadius: '0.8cqw',
        background: active ? B.sel : 'transparent',
        fontSize: '1.6cqw',
        fontWeight: active ? 600 : 400,
        color: active ? B.text : B.muted,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: '1.6cqw', height: '1.6cqw', borderRadius: '0.3cqw', border: `1px solid ${active ? B.text : B.dim}` }} />
      {label}
    </span>
  );
}

/** A recent-application tile: initials chip, name, then its environment row. */
function RecentCard({ initials, name, edited, tint }: { initials: string; name: string; edited: string; tint: string }) {
  return (
    <span
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '1cqw',
        background: B.chrome,
        border: `1px solid ${B.line}`,
        borderRadius: '1.2cqw',
        padding: '1.2cqw',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '1cqw', minWidth: 0 }}>
        <span
          style={{
            width: '3.4cqw',
            height: '3.4cqw',
            borderRadius: '0.9cqw',
            background: tint,
            color: '#ffffff',
            fontSize: '1.4cqw',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {initials}
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: '0.2cqw', minWidth: 0 }}>
          <span style={{ fontSize: '1.7cqw', fontWeight: 600, color: B.text, whiteSpace: 'nowrap' }}>{name}</span>
          <span style={{ fontSize: '1.4cqw', color: B.muted, whiteSpace: 'nowrap' }}>{edited}</span>
        </span>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.4cqw', color: B.muted }}>
        <span>sandbox</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.6cqw' }}>
          <span style={{ width: '1cqw', height: '1cqw', borderRadius: 999, background: B.dim }} />
          Paused
        </span>
      </span>
    </span>
  );
}

/** The Modelence App Builder console: preview chrome, nav rail, and the prompt. */
function BuilderMock() {
  return (
    <Screen background={B.bg}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2cqw',
            padding: '1.2cqw 1.6cqw',
            background: B.chrome,
            borderBottom: `1px solid ${B.line}`,
            flexShrink: 0,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4cqw', fontSize: '1.5cqw', fontWeight: 600, flexShrink: 0 }}>
            <span style={{ background: B.text, color: '#ffffff', borderRadius: '0.6cqw', padding: '0.5cqw 1cqw' }}>Web</span>
            <span style={{ color: B.muted, padding: '0.5cqw 0.8cqw' }}>Mobile</span>
            <span style={{ color: B.muted, padding: '0.5cqw 0.8cqw' }}>Code</span>
          </span>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              border: `1px solid ${B.line}`,
              borderRadius: '0.7cqw',
              padding: '0.5cqw 1cqw',
              fontSize: '1.4cqw',
              color: B.muted,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            tenant-sandbox.modelence.app
          </span>
          <span
            style={{
              fontSize: '1.4cqw',
              fontWeight: 600,
              color: B.text,
              border: `1px solid ${B.line}`,
              borderRadius: '0.7cqw',
              padding: '0.5cqw 1cqw',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Connect GitHub
          </span>
          <span
            style={{
              fontSize: '1.4cqw',
              fontWeight: 600,
              color: '#ffffff',
              background: B.purple,
              borderRadius: '0.7cqw',
              padding: '0.5cqw 1.2cqw',
              flexShrink: 0,
            }}
          >
            Publish
          </span>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div
            style={{
              width: '21%',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9cqw',
              background: B.chrome,
              borderRight: `1px solid ${B.line}`,
              padding: '1.4cqw 1.2cqw',
            }}
          >
            <span style={{ width: '2.8cqw', height: '2.8cqw', borderRadius: '0.8cqw', background: B.purple }} />
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8cqw',
                border: `1px solid ${B.line}`,
                borderRadius: '0.8cqw',
                padding: '0.7cqw',
                fontSize: '1.6cqw',
                fontWeight: 600,
                color: B.text,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ width: '2cqw', height: '2cqw', borderRadius: 999, background: '#a7f3d0' }} />
              Vahan Co
            </span>
            <NavRow label="Dashboard" active />
            <NavRow label="Applications" />
            <NavRow label="Team members" />
            <NavRow label="Usage and Plan" />
            <NavRow label="Settings" />
            <span style={{ flex: 1 }} />
            <span
              style={{
                background: '#f4f2ff',
                borderRadius: '0.8cqw',
                padding: '0.9cqw',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5cqw',
                fontSize: '1.3cqw',
                color: B.muted,
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>App builder</span>
                <span style={{ color: B.text }}>$2 / $20</span>
              </span>
              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Cloud usage</span>
                <span style={{ color: B.text }}>1 / 10</span>
              </span>
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '1.6cqw 2.4cqw' }}>
            <span
              style={{
                alignSelf: 'center',
                border: `1px solid ${B.line}`,
                background: B.chrome,
                borderRadius: 999,
                padding: '0.6cqw 1.4cqw',
                fontSize: '1.4cqw',
                color: B.muted,
                whiteSpace: 'nowrap',
              }}
            >
              Ask the App Builder chat questions about your data.
            </span>

            <span
              style={{
                alignSelf: 'center',
                marginTop: '1.6cqw',
                fontSize: '4.4cqw',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: B.text,
                whiteSpace: 'nowrap',
              }}
            >
              What are we building today?
            </span>

            <span
              style={{
                marginTop: '1.6cqw',
                background: B.chrome,
                border: `1px solid ${B.line}`,
                borderRadius: '1.4cqw',
                padding: '1.2cqw',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.4cqw',
              }}
            >
              <span style={{ fontSize: '1.7cqw', color: B.dim }}>Describe an app you want to build…</span>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ width: '1.8cqw', height: '1.8cqw', borderRadius: '0.4cqw', border: `1px solid ${B.dim}` }} />
                <span style={{ width: '3cqw', height: '3cqw', borderRadius: '0.7cqw', background: B.sel }} />
              </span>
            </span>

            <span style={{ marginTop: '1.4cqw', display: 'flex', gap: '0.8cqw', overflow: 'hidden' }}>
              {['Online booking system', 'Staff availability calendar', 'Timesheet tracker'].map((chip) => (
                <span
                  key={chip}
                  style={{
                    border: `1px solid ${B.line}`,
                    background: B.chrome,
                    borderRadius: 999,
                    padding: '0.6cqw 1.2cqw',
                    fontSize: '1.4cqw',
                    color: B.text,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip}
                </span>
              ))}
            </span>

            <span style={{ marginTop: '2cqw', display: 'flex', alignItems: 'center', gap: '1cqw' }}>
              <span style={{ fontSize: '2.4cqw', fontWeight: 700, color: B.text }}>Recent Applications</span>
              <span
                style={{
                  fontSize: '1.3cqw',
                  color: B.muted,
                  background: B.sel,
                  borderRadius: '0.5cqw',
                  padding: '0.1cqw 0.7cqw',
                }}
              >
                3
              </span>
            </span>

            <span style={{ marginTop: '1.2cqw', display: 'flex', gap: '1.2cqw' }}>
              <RecentCard initials="PD" name="Product Design Diary" edited="18 hours ago" tint="#10b981" />
              <RecentCard initials="CA" name="Calendar App" edited="24 days ago" tint="#2563eb" />
              <RecentCard initials="DP" name="Daily Planner" edited="25 days ago" tint="#14b8a6" />
            </span>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ---------------------------------------------------------------- Meridian */

const M = {
  bg: '#08090b',
  line: '#191b20',
  card: '#12141a',
  amber: '#e9a94b',
  teal: '#3fd0ae',
  tealBg: '#0d2b28',
  tealLine: '#1e4b45',
  text: '#f4f5f7',
  muted: '#787c88',
  dim: '#4a4e58',
};

/** One city clock. The first is the edited card, so it carries the amber focus ring. */
function MeridianCard({ city, country, time, zone, active }: {
  city: string; country: string; time: string; zone: string; active?: boolean;
}) {
  return (
    <span
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.1cqw',
        padding: '1.6cqw',
        borderRadius: '1.6cqw',
        background: M.card,
        border: `1px solid ${active ? M.amber : M.line}`,
        boxShadow: active ? `0 0 3cqw color-mix(in srgb, ${M.amber} 22%, transparent)` : 'none',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '1.2cqw',
          border: `1px solid ${M.line}`,
          padding: '0.9cqw 1.2cqw',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: '0.4cqw', minWidth: 0 }}>
          <span style={{ fontSize: '2.6cqw', fontWeight: 700, color: M.text, whiteSpace: 'nowrap' }}>{city}</span>
          <span style={{ fontSize: '1.9cqw', color: M.muted, whiteSpace: 'nowrap' }}>{country}</span>
        </span>
        <span style={{ fontSize: '2cqw', color: M.muted }}>⌄</span>
      </span>

      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '5.2cqw', fontWeight: 300, letterSpacing: '0.02em', color: M.text }}>{time}</span>
        <span
          style={{
            width: '3.6cqw',
            height: '3.6cqw',
            borderRadius: 999,
            border: `0.5cqw solid ${M.text}`,
            flexShrink: 0,
          }}
        />
      </span>

      <span style={{ borderTop: `1px solid ${M.line}`, paddingTop: '0.9cqw', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '1.9cqw', color: M.muted }}>06/09/2026</span>
        <span style={{ fontSize: '1.9cqw', color: M.dim, whiteSpace: 'nowrap' }}>{zone}</span>
      </span>
    </span>
  );
}

/** Meridian — convert a time across a row of city clocks. */
function MeridianMock() {
  return (
    <Screen background={M.bg}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '11%',
          padding: '0 3cqw',
          borderBottom: `1px solid ${M.line}`,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '1.4cqw' }}>
          <span style={{ width: '3cqw', height: '3cqw', borderRadius: 999, border: `1px solid ${M.amber}` }} />
          <span style={{ fontSize: '2.3cqw', fontWeight: 700, letterSpacing: '0.24em', color: M.text }}>MERIDIAN</span>
        </span>
        <span
          style={{
            fontSize: '2cqw',
            color: M.muted,
            border: `1px solid ${M.line}`,
            borderRadius: 999,
            padding: '0.7cqw 2cqw',
          }}
        >
          Sign in
        </span>
      </div>

      <div style={{ padding: '2.6cqw 3cqw 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2cqw' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: '1cqw', minWidth: 0 }}>
            <span style={{ fontSize: '1.9cqw', fontWeight: 600, letterSpacing: '0.24em', color: M.amber }}>MERIDIAN</span>
            <span style={{ fontSize: '4.3cqw', fontWeight: 700, letterSpacing: '-0.02em', color: M.text, whiteSpace: 'nowrap' }}>
              Convert time between cities
            </span>
            <span style={{ fontSize: '1.9cqw', color: M.muted }}>Pick a city, type a time — every clock follows.</span>
          </span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '1.2cqw', flexShrink: 0, paddingTop: '3.2cqw' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1cqw',
                fontSize: '2.1cqw',
                color: M.teal,
                background: M.tealBg,
                border: `1px solid ${M.tealLine}`,
                borderRadius: 999,
                padding: '1cqw 2cqw',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ width: '1.4cqw', height: '1.4cqw', borderRadius: 999, background: M.teal }} />
              Live now
            </span>
            <span
              style={{
                fontSize: '2.1cqw',
                fontWeight: 700,
                color: '#1a1206',
                background: M.amber,
                borderRadius: 999,
                padding: '1cqw 2.2cqw',
                whiteSpace: 'nowrap',
              }}
            >
              + Add city
            </span>
          </span>
        </div>

        <div
          style={{
            marginTop: '2cqw',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2cqw',
            background: '#0e1015',
            border: `1px solid ${M.line}`,
            borderRadius: '1.4cqw',
            padding: '1.1cqw 1.6cqw',
          }}
        >
          <span style={{ width: '2.2cqw', height: '2.2cqw', borderRadius: 999, border: `0.35cqw solid ${M.amber}` }} />
          <span style={{ fontSize: '2.2cqw', color: M.text }}>15:21</span>
          <span style={{ fontSize: '2.2cqw', color: M.muted }}>in London</span>
          <span style={{ fontSize: '2.2cqw', color: M.dim }}>· Sun, Sep 6</span>
        </div>

        <div style={{ marginTop: '2cqw', display: 'flex', gap: '1.6cqw', alignItems: 'stretch' }}>
          <MeridianCard city="London" country="United Kingdom" time="15:21" zone="UTC+1" active />
          <MeridianCard city="New York" country="United States" time="10:21" zone="UTC-4" />
          <span
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1cqw',
              borderRadius: '1.6cqw',
              border: `1px dashed ${M.line}`,
            }}
          >
            <span style={{ fontSize: '3.4cqw', color: M.dim, lineHeight: 1 }}>+</span>
            <span style={{ fontSize: '2cqw', color: M.dim }}>Add another city</span>
          </span>
        </div>
      </div>
    </Screen>
  );
}

/* ---------------------------------------------------------- Studio Journal */

const J = {
  bg: '#0d0d0d',
  line: '#1e1e1e',
  field: '#131313',
  fieldLine: '#272727',
  text: '#f2f2f2',
  muted: '#8b8b8b',
  dim: '#5c5c5c',
  button: '#ececec',
};

/** Studio Journal — a project page with its running log of notes. */
function JournalMock() {
  return (
    <Screen background={J.bg}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '11%',
          padding: '0 3cqw',
          borderBottom: `1px solid ${J.line}`,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '1.4cqw' }}>
          <span style={{ width: '2.8cqw', height: '2.8cqw', borderRadius: '0.6cqw', border: `1px solid ${J.muted}` }} />
          <span style={{ fontSize: '2.7cqw', fontWeight: 700, color: J.text }}>Studio Journal</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2cqw', fontSize: '2.1cqw', color: J.dim }}>
          <span>demo@modelence.dev</span>
          <span style={{ color: J.muted }}>Logout</span>
        </span>
      </div>

      <div style={{ padding: '2.6cqw 11%' }}>
        <span style={{ fontSize: '2.1cqw', color: J.muted }}>← Projects</span>

        <div
          style={{
            marginTop: '1.8cqw',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '2cqw',
          }}
        >
          <span style={{ fontSize: '3.6cqw', fontWeight: 700, letterSpacing: '-0.02em', color: J.text, whiteSpace: 'nowrap' }}>
            Modelence Financial pages
          </span>
          <span
            style={{
              flexShrink: 0,
              fontSize: '1.8cqw',
              color: J.text,
              border: `1px solid ${J.fieldLine}`,
              borderRadius: '1cqw',
              padding: '0.8cqw 1.4cqw',
              whiteSpace: 'nowrap',
            }}
          >
            ✓ Finish project
          </span>
        </div>

        <div style={{ marginTop: '1.1cqw', fontSize: '2cqw', color: J.muted }}>
          Improve the clarity for users of Billing and Usage
        </div>
        <div style={{ marginTop: '0.8cqw', fontSize: '1.8cqw', color: J.dim }}>Started 13 July 2026</div>

        <div
          style={{
            marginTop: '2.2cqw',
            height: '9cqw',
            background: J.field,
            border: `1px solid ${J.fieldLine}`,
            borderRadius: '1.4cqw',
            padding: '1.3cqw',
            fontSize: '1.9cqw',
            color: J.dim,
          }}
        >
          What did you work on, learn, or decide today?
        </div>

        <div style={{ marginTop: '1.2cqw', display: 'flex', justifyContent: 'flex-end' }}>
          <span
            style={{
              fontSize: '1.9cqw',
              fontWeight: 500,
              color: '#111111',
              background: J.button,
              borderRadius: '1cqw',
              padding: '0.8cqw 1.6cqw',
            }}
          >
            Add note
          </span>
        </div>

        <div style={{ marginTop: '2cqw', borderTop: `1px solid ${J.line}`, paddingTop: '1.8cqw' }}>
          <div style={{ fontSize: '1.8cqw', color: J.dim }}>Mon, 13 Jul 2026 · 19:55</div>
          <div style={{ marginTop: '1cqw', fontSize: '2.2cqw', color: J.text }}>Today I had a call with Ed and Hayk</div>
        </div>
      </div>
    </Screen>
  );
}

export function AppThumbnail({ kind }: { kind: ThumbKind }) {
  return (
    <div className="absolute inset-0">
      {kind === 'timezone' ? <MeridianMock /> : kind === 'journal' ? <JournalMock /> : <BuilderMock />}
    </div>
  );
}
