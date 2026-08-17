import { useCallback, useEffect, useRef, useState } from 'react';
import { BuilderPreview } from './components/BuilderPreview';
import { ChatPanel } from './components/ChatPanel';
import { EnvironmentRail } from './components/EnvironmentRail';
import { ResizeHandle } from './components/ResizeHandle';
import type { Theme } from './components/ThemeSwitcher';
import { TopBar } from './components/TopBar';
import type { Version } from './version';

const RELOAD_MS = 1400;

/** Figma's agent panel width, and the range the handle allows around it. */
const DEFAULT_CHAT_WIDTH = 287;
const MIN_CHAT_WIDTH = 240;
const MAX_CHAT_WIDTH = 560;

export default function App() {
  const [reloading, setReloading] = useState(false);
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [theme, setTheme] = useState<Theme>('dark');
  const [version, setVersion] = useState<Version>('v1');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  // Set on <html> so the token overrides reach body's background too.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.version = version;
  }, [theme, version]);

  const reload = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setReloading(true);
    timer.current = setTimeout(() => setReloading(false), RELOAD_MS);
  }, []);

  const toggleVersion = useCallback(() => setVersion((v) => (v === 'v1' ? 'v2' : 'v1')), []);

  const bar = (
    <TopBar version={version} reloading={reloading} onReload={reload} onToggleVersion={toggleVersion} />
  );
  const rail = <EnvironmentRail theme={theme} onThemeChange={setTheme} version={version} />;
  const panel = <ChatPanel width={chatWidth} version={version} />;
  const handle = (
    <ResizeHandle
      width={chatWidth}
      min={MIN_CHAT_WIDTH}
      max={MAX_CHAT_WIDTH}
      defaultWidth={DEFAULT_CHAT_WIDTH}
      onChange={setChatWidth}
    />
  );
  const preview = <BuilderPreview reloading={reloading} version={version} />;

  // V1 — rounded cards floating on a gutter.
  if (version === 'v1') {
    return (
      <div className="flex h-full w-full flex-col gap-[8px] bg-app">
        {bar}
        <div className="flex min-h-0 w-full flex-1 items-stretch">
          {rail}
          <div className="flex min-w-0 flex-1 items-stretch px-[8px] pb-[12px]">
            {panel}
            {handle}
            {preview}
          </div>
        </div>
      </div>
    );
  }

  // V2 — full-bleed, with an L of hairline rules instead of card edges. The
  // rules are overlaid rather than being borders, because the vertical one runs
  // the whole window height (past the top bar) while the horizontal one starts
  // to its right.
  return (
    <div className="relative flex h-full w-full flex-col bg-app">
      {bar}
      <div className="flex min-h-0 w-full flex-1 items-stretch">
        {rail}
        <div className="flex min-w-0 flex-1 items-stretch">
          {panel}
          {handle}
          {preview}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[54px] z-20 w-px bg-border" />
      <div aria-hidden className="pointer-events-none absolute top-[52px] right-0 left-[55px] z-20 h-px bg-border" />
    </div>
  );
}
