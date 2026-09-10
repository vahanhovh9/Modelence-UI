import { useLayoutEffect, useRef, useState } from 'react';
import { assets } from '../../assets';
import { Button } from '../Button';
import { Dropdown, MenuItem, MoreDots } from '../Dropdown';
import { BrandIcon, Icon } from '../Icon';
import { StatusBadge } from '../StatusBadge';
import { Tab } from '../Tab';
import { ThemeSwitcher, type Theme } from '../ThemeSwitcher';
import { HeadCell, IconCta, Scroller, TableHead, TableRow } from '../ConsoleTable';
import { COLOUR_GROUPS, RADII, TEXT_STYLES, useColours } from './tokens';

const SECTIONS = ['Colour', 'Typography', 'Styles', 'Atoms', 'Molecules', 'Blocks', 'Themes'] as const;
type Section = (typeof SECTIONS)[number];

/* ------------------------------------------------------------------ shell */

/** A titled run of the library, with the one-line rule that governs it. */
function Block({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="flex w-full flex-col gap-[14px]">
      <div className="flex flex-col gap-[4px]">
        <h3 className="text-h3 text-text-selected">{title}</h3>
        {note && <p className="text-body max-w-[62ch] text-text-secondary">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/** The frame each specimen sits in, so every example is measured the same way. */
function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-px flex-col gap-[10px] rounded-main border border-border-main bg-bg-primary p-[16px]">
      <span className="text-xs-title tracking-[0.08em] text-text-secondary uppercase">{label}</span>
      <div className="flex flex-wrap items-center gap-[10px]">{children}</div>
    </div>
  );
}

function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={`grid w-full grid-cols-1 items-start gap-[12px] ${cols === 3 ? 'xl:grid-cols-3 md:grid-cols-2' : 'lg:grid-cols-2'}`}>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- colour */

function Swatch({ token, value }: { token: string; value: string }) {
  return (
    <div className="flex min-w-px items-center gap-[10px]">
      <span
        aria-hidden
        className="size-[34px] shrink-0 rounded-small border border-border-main"
        style={{ background: `var(--color-${token})` }}
      />
      <span className="flex min-w-px flex-col">
        <span className="text-h6 truncate text-text-primary">{token}</span>
        <span className="font-mono-code truncate text-[11px] text-text-secondary">{value || '—'}</span>
      </span>
    </div>
  );
}

function Colour({ theme }: { theme: Theme }) {
  const colours = useColours(theme);
  return (
    <div className="flex w-full flex-col gap-[28px]">
      {COLOUR_GROUPS.map((group) => (
        <Block key={group.name} title={group.name} note={group.note}>
          <div className="grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2 xl:grid-cols-3">
            {group.tokens.map((token) => (
              <Swatch key={token} token={token} value={colours[token]} />
            ))}
          </div>
        </Block>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- typography */

/** Reads the specimen's own computed metrics rather than restating them. */
function Specimen({ name, sample }: { name: string; sample: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [metrics, setMetrics] = useState('');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    setMetrics(`${cs.fontSize} · ${cs.fontWeight} · ${cs.lineHeight}`);
  }, [name]);

  return (
    <div className="flex w-full flex-col gap-[6px] border-b border-border-secondary py-[14px] last:border-b-0">
      <span className="flex flex-wrap items-baseline gap-x-[10px]">
        <span className="text-h6 text-text-primary">{name}</span>
        <span className="font-mono-code text-[11px] text-text-secondary">{metrics}</span>
      </span>
      <p ref={ref} className={`${name} text-text-selected`}>
        {sample}
      </p>
    </div>
  );
}

function Typography() {
  return (
    <Block
      title="Typography"
      note="Eleven text styles, each a Tailwind utility. The metrics beside each name are read off the specimen itself."
    >
      <div className="w-full rounded-main border border-border-main bg-bg-primary px-[16px]">
        {TEXT_STYLES.map((style) => (
          <Specimen key={style.name} name={style.name} sample={style.sample} />
        ))}
      </div>
    </Block>
  );
}

/* ----------------------------------------------------------------- styles */

function Styles({ theme }: { theme: Theme }) {
  const colours = useColours(theme);
  return (
    <div className="flex w-full flex-col gap-[28px]">
      <Block title="Corner radius" note="Three steps. Anything fully round is a button or an input — never a badge.">
        <Grid cols={3}>
          {RADII.map((radius) => (
            <Frame key={radius.name} label={radius.name}>
              <span
                className="size-[56px] shrink-0 border border-border-highlight bg-bg-selected-2"
                style={{ borderRadius: `var(--${radius.name})` }}
              />
              <span className="text-body min-w-px flex-1 text-text-secondary">{radius.use}</span>
            </Frame>
          ))}
        </Grid>
      </Block>

      <Block title="Edges" note="Main separates blocks, secondary separates rows inside one, highlight marks an interactive edge.">
        <div className="flex w-full flex-col gap-[12px] rounded-main border border-border-main bg-bg-primary p-[16px]">
          {['border-main', 'border-secondary', 'border-highlight', 'border-chat'].map((token) => (
            <span key={token} className="flex items-center gap-[12px]">
              <span className="text-h6 w-[132px] shrink-0 text-text-primary">{token}</span>
              <span className="h-px min-w-px flex-1" style={{ background: `var(--color-${token})` }} />
              <span className="font-mono-code w-[80px] shrink-0 text-right text-[11px] text-text-secondary">
                {colours[token]}
              </span>
            </span>
          ))}
        </div>
      </Block>

      <Block title="Hover" note="One translucent wash over whatever is beneath it, so it works on every surface.">
        <Grid cols={3}>
          {['bg-bg-canvas', 'bg-bg-container', 'bg-bg-primary'].map((surface) => (
            <Frame key={surface} label={surface}>
              <span className={`flex h-[56px] w-full items-center justify-center rounded-main ${surface}`}>
                <span className="text-body rounded-small bg-hover px-[16px] py-[8px] text-text-primary">
                  bg-hover
                </span>
              </span>
            </Frame>
          ))}
        </Grid>
      </Block>
    </div>
  );
}

/* ------------------------------------------------------------------ atoms */

function Atoms() {
  return (
    <div className="flex w-full flex-col gap-[28px]">
      <Block title="Button" note="Five variants on one component. Fully round is the button shape; the text variant carries no fill or border at all.">
        <Grid cols={3}>
          <Frame label="main"><Button variant="main">Publish</Button></Frame>
          <Frame label="primary"><Button variant="primary">Confirm</Button></Frame>
          <Frame label="secondary"><Button>View Schema</Button></Frame>
          <Frame label="outline"><Button variant="outline" icon={<Icon src={assets.zap} />}>Upgrade</Button></Frame>
          <Frame label="text"><Button variant="text">See migrations</Button></Frame>
          <Frame label="icon + trailing">
            <Button icon={<Icon src={assets.github} size={14} />}>Connect GitHub</Button>
            <Button variant="text" trailing={<Icon src={assets.chevron12} size={12} className="-rotate-90" />}>
              Open
            </Button>
          </Frame>
        </Grid>
      </Block>

      <Block title="Icon action" note="A section's key action reduced to its glyph; the label rides underneath on hover and on focus.">
        <Grid>
          <Frame label="primary">
            <IconCta icon={<Icon src={assets.upload} size={14} />} label="Upload file" />
            <span className="text-body text-text-secondary">hover for the label</span>
          </Frame>
          <Frame label="secondary">
            <IconCta icon={<Icon src={assets.history} size={14} />} label="See migrations" variant="secondary" />
            <span className="text-body text-text-secondary">same shape, quieter fill</span>
          </Frame>
        </Grid>
      </Block>

      <Block title="Badge" note="Never fully round — that shape belongs to buttons. The dot can give way to a glyph.">
        <Frame label="StatusBadge">
          <StatusBadge label="Ready" />
          <StatusBadge label="Paused" tone="neutral" />
          <StatusBadge label="Current" shape="pill" />
          <StatusBadge
            label="Private"
            tone="neutral"
            icon={
              <span className="shrink-0 text-text-secondary">
                <Icon src={assets.lock} size={11} />
              </span>
            }
          />
        </Frame>
      </Block>

      <Block title="Switcher" note="The selected element is the full height of the track and covers its border, so it stands on the switcher rather than sitting inside it.">
        <Frame label="Tab">
          <Tab options={['Web', 'Mobile app', 'Dashboard']} value="Web" onChange={() => {}} />
        </Frame>
      </Block>

      <Block title="Icons" note="One asset per glyph, painted through a CSS mask so it follows the surrounding text colour.">
        <Frame label="mask-tinted">
          {[assets.search, assets.upload, assets.copy, assets.connect, assets.history, assets.lock, assets.close, assets.plus, assets.check, assets.refresh, assets.externalLink, assets.sparkle].map(
            (icon) => (
              <span key={icon} className="flex size-[32px] items-center justify-center rounded-small bg-bg-selected-2 text-text-primary">
                <Icon src={icon} />
              </span>
            )
          )}
          <span className="flex size-[32px] items-center justify-center rounded-small bg-bg-selected-2">
            <BrandIcon src={assets.claude} size={16} />
          </span>
        </Frame>
      </Block>
    </div>
  );
}

/* -------------------------------------------------------------- molecules */

function Molecules() {
  const [tab, setTab] = useState('List');
  return (
    <div className="flex w-full flex-col gap-[28px]">
      <Block title="Menu" note="Click to open, closes on outside pointer-down or Escape. The trigger and the panel are both render props.">
        <Frame label="Dropdown + MenuItem">
          <Dropdown
            panelWidth="w-[168px]"
            trigger={({ open, toggle }) => (
              <Button onClick={toggle} trailing={<Icon src={assets.chevronModel} size={12} className={open ? 'rotate-180' : ''} />}>
                Model
              </Button>
            )}
          >
            {({ close }) => (
              <>
                <MenuItem label="Fable" selected onClick={close} />
                <MenuItem label="Opus 5" onClick={close} />
                <MenuItem label="Sonnet 5" onClick={close} />
              </>
            )}
          </Dropdown>
          <span className="text-body text-text-secondary">open it — outside click closes</span>
        </Frame>
      </Block>

      <Block title="Table row" note="No card around it: the header rule and the row rules are the table. Columns are fixed so header and body stay on one grid.">
        <div className="w-full rounded-main border border-border-main bg-bg-primary px-[16px]">
          <Scroller min="min-w-[420px]">
            <TableHead>
              <HeadCell className="min-w-px flex-1">File</HeadCell>
              <HeadCell className="w-[88px] shrink-0">Size</HeadCell>
              <HeadCell className="flex w-[104px] shrink-0 items-center">Visibility</HeadCell>
              <span className="w-[24px] shrink-0" />
            </TableHead>
            {['logo-mark.svg', 'monthly-usage.csv'].map((file) => (
              <TableRow key={file}>
                <span className="font-mono-code min-w-px flex-1 truncate text-[12px] text-text-primary">{file}</span>
                <span className="text-body w-[88px] shrink-0 text-text-main">4 KB</span>
                <span className="flex w-[104px] shrink-0 items-center">
                  <StatusBadge label="Private" tone="neutral" />
                </span>
                <span className="flex size-[24px] shrink-0 items-center justify-center rounded-small text-icon-default">
                  <MoreDots />
                </span>
              </TableRow>
            ))}
          </Scroller>
        </div>
      </Block>

      <Block title="Segmented control" note="The same Tab track carries text options or icon-only ones.">
        <Frame label="stateful">
          <Tab options={['List', 'Grid']} value={tab} onChange={setTab} />
          <span className="text-body text-text-secondary">selected: {tab}</span>
        </Frame>
      </Block>

      <Block title="Stat" note="A value, its movement coloured by whether that direction is wanted, and the series behind it.">
        <Grid>
          <div className="flex min-w-px flex-col gap-[10px] rounded-main border border-border-main bg-bg-primary p-[16px]">
            <span className="text-h5 text-text-secondary">Requests</span>
            <span className="flex items-baseline gap-[8px]">
              <span className="text-large-number text-text-selected">1.24M</span>
              <span className="text-small-title text-accent-green-text">+8.2%</span>
            </span>
          </div>
          <div className="flex min-w-px flex-col gap-[10px] rounded-main border border-border-main bg-bg-primary p-[16px]">
            <span className="text-h5 text-text-secondary">Error rate</span>
            <span className="flex items-baseline gap-[8px]">
              <span className="text-large-number text-text-selected">0.42%</span>
              <span className="text-small-title text-danger">+0.11%</span>
            </span>
          </div>
        </Grid>
      </Block>
    </div>
  );
}

/* ----------------------------------------------------------------- blocks */

function Blocks() {
  return (
    <div className="flex w-full flex-col gap-[28px]">
      <Block title="Section header" note="Full-bleed: it carries its own padding so its rule runs the whole pane, and it sticks to the top while the body scrolls.">
        <div className="w-full overflow-hidden rounded-main border border-border-main bg-bg-container">
          <div className="flex h-[52px] items-center justify-between gap-[12px] border-b border-border-main px-[20px]">
            <h2 className="text-h1 text-text-selected">Files</h2>
            <span className="flex items-center gap-[16px]">
              <Tab options={['List', 'Grid']} value="List" onChange={() => {}} />
              <IconCta icon={<Icon src={assets.upload} size={14} />} label="Upload file" />
            </span>
          </div>
          <div className="px-[20px] py-[16px]">
            <p className="text-body text-text-secondary">The body sits inside the same 20px gutters.</p>
          </div>
        </div>
      </Block>

      <Block title="Card" note="Border, container fill, 16–20px of padding. Everything that groups content uses this one shell.">
        <Grid>
          <div className="flex flex-col gap-[12px] rounded-main border border-border-main bg-bg-primary p-[20px]">
            <span className="flex items-center justify-between">
              <h4 className="text-h3 text-text-selected">Environment</h4>
              <span className="flex size-[24px] items-center justify-center rounded-small text-icon-default">
                <MoreDots />
              </span>
            </span>
            <p className="text-body flex gap-[8px]">
              <span className="text-text-secondary">Region:</span>
              <span className="text-text-primary">US West (Oregon)</span>
            </p>
            <Button className="self-start">Add Custom Domain</Button>
          </div>
          <div className="flex flex-col gap-[12px] rounded-main border border-accent-green-border bg-bg-primary p-[20px]">
            <span className="flex items-center gap-[10px]">
              <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full border border-accent-green-border text-accent-green-text">
                <Icon src={assets.stepCheck} size={12} />
              </span>
              <h4 className="text-h3 text-text-selected">All resolved</h4>
            </span>
            <p className="text-body text-text-main">A card states its outcome in its border as well as its copy.</p>
          </div>
        </Grid>
      </Block>

      <Block title="Progress track" note="One container holds every stage; the stages reached so far sit in a nested box whose fill is the current stage's colour.">
        <div className="flex w-full items-center rounded-[90px] bg-bg-selected-2">
          <div className="flex w-2/3 shrink-0 items-center overflow-clip rounded-[30px] bg-accent-bg-alert">
            <span className="flex h-[28px] w-1/2 items-center gap-[8px] rounded-full bg-accent-bg-success pr-[8px] pl-[6px]">
              <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-green-800 text-accent-bg-success">
                <Icon src={assets.stepCheck} size={14} />
              </span>
              <span className="text-[12px] leading-[16px] font-semibold text-green-800">Build</span>
            </span>
            <span className="flex h-[28px] w-1/2 items-center gap-[8px] pr-[8px] pl-[6px]">
              <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-accent-alert-text text-accent-bg-alert">
                <Icon src={assets.stepDeploy} size={12} />
              </span>
              <span className="text-[12px] leading-[16px] font-semibold text-accent-alert-text">Deploy</span>
            </span>
          </div>
          <span className="flex h-[28px] w-1/3 items-center gap-[8px] pr-[8px] pl-[11px]">
            <span className="size-[18px] shrink-0 rounded-full border border-text-secondary" />
            <span className="text-[12px] leading-[16px] font-semibold text-text-secondary">App started</span>
          </span>
        </div>
      </Block>

      <Block title="Empty state" note="Say what is missing and offer the one action that fixes it.">
        <div className="flex w-full flex-col items-start gap-[8px] rounded-main border border-border-main bg-bg-primary p-[20px]">
          <h4 className="text-h4 text-text-selected">Custom Domains</h4>
          <p className="text-body text-text-main">No custom domains configured.</p>
          <Button className="mt-[4px]">Add Custom Domain</Button>
        </div>
      </Block>
    </div>
  );
}

/* ----------------------------------------------------------------- themes */

function Themes({ theme, onThemeChange }: { theme: Theme; onThemeChange: (theme: Theme) => void }) {
  const colours = useColours(theme);
  const roles = ['bg-canvas', 'bg-container', 'bg-primary', 'text-selected', 'text-main', 'border-main', 'button-main-bg'];

  return (
    <div className="flex w-full flex-col gap-[28px]">
      <Block
        title="Two modes, one set of roles"
        note="A theme is not a value swap: the same dark colour maps to different bright values depending on the role it plays. Only the roles below change — the primitives they point at do not."
      >
        <div className="flex items-center gap-[12px] rounded-main border border-border-main bg-bg-primary p-[16px]">
          <span className="text-body text-text-main">Currently {theme}</span>
          <span className="min-w-px flex-1" />
          <Button onClick={() => onThemeChange(theme === 'dark' ? 'bright' : 'dark')}>
            Switch to {theme === 'dark' ? 'bright' : 'dark'}
          </Button>
        </div>
      </Block>

      <Block title="Roles under this theme" note="Read live, so this table follows the switch above.">
        <div className="w-full rounded-main border border-border-main bg-bg-primary px-[16px]">
          {roles.map((token) => (
            <span
              key={token}
              className="flex items-center gap-[12px] border-b border-border-secondary py-[12px] last:border-b-0"
            >
              <span
                aria-hidden
                className="size-[24px] shrink-0 rounded-small border border-border-main"
                style={{ background: `var(--color-${token})` }}
              />
              <span className="text-h6 min-w-px flex-1 text-text-primary">{token}</span>
              <span className="font-mono-code text-[11px] text-text-secondary">{colours[token]}</span>
            </span>
          ))}
        </div>
      </Block>

      <Block title="Exceptions" note="Two surfaces deliberately ignore the switch, because they are objects rather than chrome.">
        <Grid>
          <Frame label="Build terminal — pinned">
            <span className="flex h-[64px] w-full items-center rounded-small bg-terminal px-[12px]">
              <span className="font-mono-code text-[11px] text-terminal-ok">✓ Client build completed in 6.4s</span>
            </span>
          </Frame>
          <Frame label="Code editor — its own ramp per theme">
            <span className="flex h-[64px] w-full items-center rounded-small bg-bg-canvas px-[12px]">
              <span className="font-mono-code text-[11px]">
                <span className="text-code-key">"url"</span>
                <span className="text-code-plain">: </span>
                <span className="text-code-string">"https://…"</span>
              </span>
            </span>
          </Frame>
        </Grid>
      </Block>
    </div>
  );
}

/* ------------------------------------------------------------------- page */

export function DesignSystem({
  theme,
  onThemeChange,
  onBack,
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onBack: () => void;
}) {
  const [section, setSection] = useState<Section>('Colour');

  return (
    <div className="flex h-full w-full flex-col bg-bg-canvas">
      <header className="flex w-full shrink-0 items-center justify-between gap-[16px] px-[20px] py-[10px]">
        <span className="flex items-center gap-[16px]">
          <BrandIcon src={assets.logoMark} width={19} height={23} />
          <span className="flex flex-col">
            <span className="text-h6 text-text-selected">Design system</span>
            <span className="text-small-title text-text-secondary">Modelence app builder</span>
          </span>
        </span>
        <span className="flex items-center gap-[12px]">
          <ThemeSwitcher theme={theme} onChange={onThemeChange} orientation="horizontal" />
          <Button onClick={onBack} icon={<Icon src={assets.chevron12} size={12} className="rotate-90" />}>
            Back to builder
          </Button>
        </span>
      </header>

      <div className="flex min-h-0 w-full flex-1 items-stretch gap-[8px] px-[12px] pb-[12px]">
        <nav
          aria-label="Design system"
          className="flex w-[176px] shrink-0 flex-col items-start gap-[4px] rounded-block border border-border-main bg-bg-container p-[8px]"
        >
          {SECTIONS.map((name) => (
            <button
              key={name}
              type="button"
              aria-current={name === section}
              onClick={() => setSection(name)}
              className={`text-h5 flex h-[30px] w-full shrink-0 items-center rounded-main px-[10px] text-left transition-colors ${
                name === section
                  ? 'bg-bg-selected-2 text-text-selected'
                  : 'text-text-main hover:bg-hover hover:text-text-selected'
              }`}
            >
              {name}
            </button>
          ))}
        </nav>

        <div className="min-w-px flex-1 overflow-y-auto rounded-block border border-border-main bg-bg-container">
          <div className="sticky top-0 z-30 flex h-[52px] items-center border-b border-border-main bg-bg-container px-[20px]">
            <h2 className="text-h1 text-text-selected">{section}</h2>
          </div>
          <div className="flex w-full max-w-[1040px] flex-col gap-[28px] px-[20px] pt-[16px] pb-[32px]">
            {section === 'Colour' && <Colour theme={theme} />}
            {section === 'Typography' && <Typography />}
            {section === 'Styles' && <Styles theme={theme} />}
            {section === 'Atoms' && <Atoms />}
            {section === 'Molecules' && <Molecules />}
            {section === 'Blocks' && <Blocks />}
            {section === 'Themes' && <Themes theme={theme} onThemeChange={onThemeChange} />}
          </div>
        </div>
      </div>
    </div>
  );
}
