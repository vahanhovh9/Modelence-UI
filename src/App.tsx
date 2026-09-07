import { useCallback, useEffect, useRef, useState } from 'react';
import { AgentTab } from './components/AgentTab';
import { BuilderPreview } from './components/BuilderPreview';
import { ChatPanel } from './components/ChatPanel';
import { Dashboard } from './components/dashboard/Dashboard';
import { EnvironmentRail } from './components/EnvironmentRail';
import { MobilePreview } from './components/MobilePreview';
import { ProdPanel } from './components/ProdPanel';
import { SandboxPanel } from './components/SandboxPanel';
import { ResizeHandle } from './components/ResizeHandle';
import type { Theme } from './components/ThemeSwitcher';
import { TopBar } from './components/TopBar';
import type { Version } from './version';
import { usePublish } from './publish';
import { useFakeAgent } from './agent/useFakeAgent';
import { PROD_FIX_PROMPT } from './agent/script';
import { RESIZE_HANDLES, useFloatingWindow } from './useFloatingWindow';

const RELOAD_MS = 1400;
/** How long the completed progress track stays up before the page settles. */
const SETTLE_MS = 3000;

/** Figma's agent panel width, and the range the handle allows around it. */
const DEFAULT_CHAT_WIDTH = 287;
const MIN_CHAT_WIDTH = 240;
const MAX_CHAT_WIDTH = 560;
/** The 8px gutter either side of the panel, which collapses along with it. */
const PANEL_GUTTER = 16;

export default function App() {
  const [reloading, setReloading] = useState(false);
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [agentMode, setAgentMode] = useState<'docked' | 'floating' | 'collapsed'>('docked');
  const [resizing, setResizing] = useState(false);
  const { phase: publishPhase, steps: publishSteps, start, confirm, reset } = usePublish();
  /*
   * Two separate agents. Prod diagnoses the running environment and keeps its
   * own transcript, so switching environments never mixes a build session with
   * an incident session.
   */
  const buildAgent = useFakeAgent('build');
  const prodAgent = useFakeAgent('prod');
  const [configResolved, setConfigResolved] = useState(false);
  // Set only for a run the Deployments page started, so a hand-typed prod
  // question does not mark the deploy as fixed.
  const askedAgent = useRef(false);

  /*
   * A finished deploy holds the all-green track on screen for a moment before
   * the page settles to the deployment record — otherwise the last two stages
   * turn green and vanish in the same frame.
   */
  const [settling, setSettling] = useState(false);
  useEffect(() => {
    if (publishPhase !== 'done') return;
    setSettling(true);
    const timer = setTimeout(() => setSettling(false), SETTLE_MS);
    return () => clearTimeout(timer);
  }, [publishPhase]);

  useEffect(() => {
    if (askedAgent.current && !prodAgent.busy) {
      askedAgent.current = false;
      setConfigResolved(true);
    }
  }, [prodAgent.busy]);
  const [theme, setTheme] = useState<Theme>('dark');
  const [version, setVersion] = useState<Version>('v1');
  const [environment, setEnvironment] = useState('Sandbox');
  const [target, setTarget] = useState<'Web' | 'Mobile app' | 'Dashboard'>('Web');
  const [view, setView] = useState<'builder' | 'dashboard'>('builder');
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

  const floating = agentMode === 'floating';
  // Both floating and collapsed give the vacated column back to the preview.
  const slotCollapsed = agentMode !== 'docked';
  const { rect, reset: resetRect, startDrag, startResize } = useFloatingWindow(floating);

  const toggleFloat = useCallback(() => {
    setAgentMode((mode) => {
      if (mode === 'floating') return 'docked';
      resetRect();
      return 'floating';
    });
  }, [resetRect]);
  const isV2 = version === 'v2';
  const gutter = isV2 ? 0 : PANEL_GUTTER;

  // Prod swaps the app preview for the environment console.
  const isProd = environment === 'Prod';
  const agent = isProd ? prodAgent : buildAgent;

  const bar = (
    <TopBar
      version={version}
      reloading={reloading}
      onReload={reload}
      onOpenDashboard={() => setView('dashboard')}
      target={target}
      onTargetChange={setTarget}
      publish={{
        phase: publishPhase,
        steps: publishSteps,
        onStart: () => {
          setConfigResolved(false);
          start();
        },
        onConfirm: confirm,
        // Review opens the Prod console, which carries the full config detail.
        onReview: () => setEnvironment('Prod'),
        onReset: reset,
      }}
      mode={isProd ? 'prod' : 'builder'}
    />
  );
  const rail = (
    <EnvironmentRail
      theme={theme}
      onThemeChange={setTheme}
      version={version}
      active={environment}
      onActiveChange={setEnvironment}
      onToggleVersion={toggleVersion}
    />
  );

  /*
   * One wrapper, three modes. The panel keeps its own instance across all of
   * them — switching between docked and floating only changes this wrapper's
   * positioning, so the conversation in progress is never torn down.
   *
   * Docked: in flow, animating its width to zero when it leaves. Floating:
   * taken out of flow entirely, which is what hands the column to the preview.
   */
  const panel = (
    <div
      onPointerDown={(event) => {
        if (!floating) return;
        const target = event.target as HTMLElement;
        // Drag only by the header, and never from a control inside it.
        if (!target.closest('[data-drag-handle]')) return;
        if (target.closest('button, input, textarea, [role="menu"]')) return;
        startDrag(event);
      }}
      className={
        floating
          ? 'animate-pop-in fixed z-[60] motion-reduce:animate-none'
          : // The collapse slide must not run on every resize tick, or the frame
            // lags the content and clips it mid-drag.
            `h-full shrink-0 overflow-hidden ${
              resizing ? '' : 'transition-[width,opacity] duration-300 ease-out motion-reduce:transition-none'
            }`
      }
      style={
        floating
          ? { left: rect.x, top: rect.y, width: rect.w, height: rect.h }
          : { width: slotCollapsed ? 0 : chatWidth + gutter, opacity: slotCollapsed ? 0 : 1 }
      }
      aria-hidden={agentMode === 'collapsed'}
    >
      <div className={floating ? 'h-full' : `flex h-full items-stretch ${isV2 ? '' : 'px-[8px] pb-[8px]'}`}>
        <ChatPanel
          width={chatWidth}
          version={version}
          agent={agent}
          mode={isProd ? 'prod' : 'build'}
          floating={floating}
          onCollapse={() => setAgentMode('collapsed')}
          onToggleFloat={toggleFloat}
        />
      </div>

      {floating &&
        RESIZE_HANDLES.map((handle) => (
          <span
            key={handle.dir}
            role="separator"
            aria-label={`Resize agent window (${handle.dir})`}
            onPointerDown={(event) => startResize(event, handle.dir)}
            className={`absolute z-10 ${handle.className}`}
          />
        ))}
    </div>
  );

  const handle = agentMode === 'docked' && (
    <ResizeHandle
      width={chatWidth}
      min={MIN_CHAT_WIDTH}
      max={MAX_CHAT_WIDTH}
      defaultWidth={DEFAULT_CHAT_WIDTH}
      onChange={setChatWidth}
      onResizingChange={setResizing}
    />
  );
  const preview = isProd ? (
    <ProdPanel
      onAskAgent={() => {
        askedAgent.current = true;
        prodAgent.send(PROD_FIX_PROMPT);
      }}
      agentBusy={prodAgent.busy}
      resolved={configResolved}
      // Deploying resumes the paused publish; the button finishes and clears.
      onDeploy={confirm}
      onCancelDeploy={() => {
        reset();
        setConfigResolved(false);
      }}
      // Settled view whenever nothing is in flight: before a publish, and once
      // one has finished.
      active={publishPhase === 'running' || publishPhase === 'action-needed' || settling}
      phase={publishPhase}
      steps={publishSteps}
      // A finished deploy is what brings Prod's code, files and config up to
      // Sandbox; it stays synced until the next publish starts.
      deployed={publishPhase === 'done'}
    />
  ) : target === 'Dashboard' ? (
    // Sandbox's own console, reached from the Dashboard tab.
    <SandboxPanel />
  ) : target === 'Mobile app' ? (
    <MobilePreview version={version} />
  ) : (
    <BuilderPreview reloading={reloading} version={version} />
  );
  const tab = <AgentTab collapsed={agentMode === 'collapsed'} onExpand={() => setAgentMode('docked')} />;

  // The account dashboard replaces the whole shell; the sidebar's "Dashboard"
  // item is the way back.
  if (view === 'dashboard') {
    return (
      <Dashboard
        onOpenApp={(target) => {
          setEnvironment(target);
          setView('builder');
        }}
      />
    );
  }

  // V1 — two rounded cards side by side on the canvas, 8px apart.
  if (!isV2) {
    return (
      <div className="flex h-full w-full flex-col gap-[8px] bg-bg-canvas">
        {bar}
        <div className="relative flex min-h-0 w-full flex-1 items-stretch pr-[12px]">
          {rail}
          {panel}
          {handle}
          <div className="flex min-w-0 flex-1 items-stretch pb-[8px]">{preview}</div>
          {tab}
        </div>
      </div>
    );
  }

  // V2 — full-bleed, with an L of hairline rules instead of card edges. The
  // rules are overlaid rather than being borders, because the vertical one runs
  // the whole window height (past the top bar) while the horizontal one starts
  // to its right.
  return (
    <div className="relative flex h-full w-full flex-col bg-bg-canvas">
      {bar}
      <div className="flex min-h-0 w-full flex-1 items-stretch">
        {rail}
        <div className="relative flex min-w-0 flex-1 items-stretch">
          {panel}
          {handle}
          {preview}
          {tab}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[54px] z-20 w-px bg-border-main" />
      <div aria-hidden className="pointer-events-none absolute top-[52px] right-0 left-[55px] z-20 h-px bg-border-main" />
    </div>
  );
}
