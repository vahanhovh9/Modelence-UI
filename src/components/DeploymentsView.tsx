import { useState } from 'react';
import { assets } from '../assets';
import { Button } from './Button';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';
import { PUBLISH_STEPS, type PublishPhase, type StepId, type StepState } from '../publish';

const META = [
  { label: 'ENVIRONMENT', value: 'Production' },
  { label: 'BRANCH', value: 'main' },
  { label: 'COMMIT', value: '9f2c81e' },
  { label: 'DEPLOYMENT', value: '#184' },
];

type LogLine = { text: string; tone?: 'command' | 'ok' | 'warn' };

const LOG_LINES: LogLine[] = [
  { text: '$ modelence deploy --env prod', tone: 'command' },
  { text: 'Resolving 214 modules…' },
  { text: 'Compiling client bundle (vite build)…' },
  { text: '✓ Client build completed in 6.4s (1.2 MB gzipped)', tone: 'ok' },
  { text: 'Compiling server bundle (esbuild)…' },
  { text: '✓ Server build completed in 3.1s', tone: 'ok' },
  { text: 'Uploading artifact (18.2 MB) to registry…' },
  { text: '✓ Artifact sha256:9f2c81 uploaded', tone: 'ok' },
  { text: 'Provisioning container (us-west-2, 512 MB)…' },
  { text: 'Validating environment configuration…' },
  { text: '⚠ Missing config values in Prod: payments.stripeKey, email.smtpUrl', tone: 'warn' },
  { text: '⚠ Deploy paused — waiting for confirmation', tone: 'warn' },
];

const DEPLOYMENTS = [
  { id: '#182', sha: '77b2f3d', when: '8 days ago', status: 'Ready' },
  { id: '#181', sha: '4c19ba7', when: '9 days ago', status: 'Ready' },
  { id: '#180', sha: 'e5d0a12', when: '12 days ago', status: 'Ready' },
];

/** Inline code chip used inside the warning copy. */
function Code({ children }: { children: string }) {
  return (
    <code className="font-mono-code rounded-[4px] bg-bg-container-secondary px-[4px] py-[1px] text-[11px] text-code-text">
      {children}
    </code>
  );
}

/** The same chip in the resolved state, where the keys are no longer a problem. */
function CodeOk({ children }: { children: string }) {
  return (
    <code className="font-mono-code rounded-[4px] bg-bg-container-secondary px-[4px] py-[1px] text-[11px] text-accent-green-text">
      {children}
    </code>
  );
}

/** Figma "Title-subtitle" (746:6713). */
function TitleSubtitle() {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
      <h1 className="text-h3 w-full text-text-selected">Deployments</h1>
      <div className="flex shrink-0 items-center gap-[5px]">
        <span className="text-small-title whitespace-nowrap text-text-main">Last deployed:</span>
        <span className="text-small-title whitespace-nowrap text-text-secondary">5 days ago</span>
      </div>
    </div>
  );
}

/** Figma "HorizontalBorder" (746:6915) — the four-up deployment summary. */
function MetaRow() {
  return (
    <div className="flex w-full shrink-0 items-start justify-center gap-[16px] border-b border-border-main pt-[12px] pb-[13px]">
      {META.map(({ label, value }) => (
        <div key={label} className="flex min-w-px flex-1 flex-col items-start gap-[2px]">
          <span className="text-xs-title w-full text-text-secondary">{label}</span>
          <span className="text-small-title w-full overflow-clip text-text-main">{value}</span>
        </div>
      ))}
    </div>
  );
}

const STAGES: { id: StepId; label: string }[] = [
  { id: 'build', label: 'Build' },
  { id: 'deploy', label: 'Deploy' },
  { id: 'start', label: 'App started' },
];

/** The 18px disc at the head of a stage, one look per state. */
function StageMark({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-green-800 text-accent-bg-success">
        <Icon src={assets.stepCheck} size={14} />
      </span>
    );
  }
  if (state === 'warning') {
    return (
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-accent-alert-text text-accent-bg-alert">
        <Icon src={assets.stepDeploy} size={12} />
      </span>
    );
  }
  if (state === 'active') {
    return (
      <span className="size-[18px] shrink-0 animate-spin rounded-full border-2 border-border-chat border-t-button-main-bg motion-reduce:animate-none" />
    );
  }
  return <span className="size-[18px] shrink-0 rounded-full border border-text-secondary" />;
}

const MARK_TEXT: Record<StepState, string> = {
  done: 'text-green-800',
  warning: 'text-accent-alert-text',
  active: 'text-text-selected',
  pending: 'text-text-secondary',
};

/** Div 2's fill follows whichever stage is currently the furthest reached. */
const TRACK_FILL: Record<StepState, string> = {
  done: 'bg-accent-bg-success',
  warning: 'bg-accent-bg-alert',
  active: 'bg-bg-chat',
  pending: '',
};

const THIRDS = ['w-1/3', 'w-2/3', 'w-full'];
const SHARE = ['w-full', 'w-1/2', 'w-1/3'];

/**
 * Figma 746:6984 — the deployment progress track, driven by the live publish
 * state instead of a fixed picture.
 *
 * Two nested containers, as the file builds it:
 *   Div 1  the full track, carrying the unreached-stage colour
 *   Div 2  wraps the stages reached so far; ITS fill is the current stage's
 *          colour — amber while the deploy is blocked, green once it lands
 *
 * A finished stage sits on top of Div 2 as its own green pill, rounded only on
 * the sides where it meets an unfinished neighbour, so consecutive greens read
 * as one continuous run.
 *
 * Widths are border-box fractions so all three stages stay equal however much
 * padding each carries; the file pinned the last one to 298px, which left them
 * uneven.
 */
function Stepper({ steps }: { steps: Record<StepId, StepState> }) {
  const reached = STAGES.filter(({ id }) => steps[id] !== 'pending').length;
  const lead = reached > 0 ? steps[STAGES[reached - 1].id] : 'pending';

  const stage = (index: number, inTrack: boolean) => {
    const { id, label } = STAGES[index];
    const state = steps[id];
    const done = state === 'done';
    return (
      <div
        key={id}
        className={`flex h-[28px] min-w-px items-center gap-[8px] pr-[8px] ${
          inTrack ? `${SHARE[reached - 1]} pl-[6px]` : 'w-1/3 pl-[11px]'
        } ${done ? 'bg-accent-bg-success' : ''} ${
          done && steps[STAGES[index - 1]?.id] !== 'done' ? 'rounded-l-full' : ''
        } ${done && steps[STAGES[index + 1]?.id] !== 'done' ? 'rounded-r-full' : ''}`}
      >
        <StageMark state={state} />
        <span className={`text-[12px] leading-[16px] font-semibold whitespace-nowrap ${MARK_TEXT[state]}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="flex w-full shrink-0 items-center rounded-[90px] bg-bg-selected-2">
      {reached > 0 && (
        <div
          className={`flex shrink-0 items-center overflow-clip rounded-[30px] transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none ${
            THIRDS[reached - 1]
          } ${TRACK_FILL[lead]}`}
        >
          {STAGES.slice(0, reached).map((_, index) => stage(index, true))}
        </div>
      )}
      {STAGES.slice(reached).map((_, index) => stage(reached + index, false))}
    </div>
  );
}

/**
 * Shown while the deploy is actually moving — after Confirm & continue, and
 * through the moment all three stages land. It is the same card shell as the
 * warning and resolved states, so the region does not change shape underneath
 * the user as the deploy progresses.
 */
function DeployingCard({ steps }: { steps: Record<StepId, StepState> }) {
  const done = STAGES.every(({ id }) => steps[id] === 'done');
  const current = PUBLISH_STEPS.find(({ id }) => steps[id] === 'active');

  return (
    <div
      className={`flex w-full shrink-0 flex-col items-start gap-[12px] rounded-main border bg-bg-primary p-[17px] transition-colors duration-500 ${
        done ? 'border-accent-green-border' : 'border-border-main'
      }`}
    >
      <div className="flex w-full items-center gap-[10px]">
        {done ? (
          <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full border border-accent-green-border text-accent-green-text">
            <Icon src={assets.stepCheck} size={12} />
          </span>
        ) : (
          <span className="size-[20px] shrink-0 animate-spin rounded-full border-2 border-border-chat border-t-button-main-bg motion-reduce:animate-none" />
        )}
        <h3 className="text-h3 text-text-selected">
          {done ? 'Deployed to Production' : 'Deploying to Production'}
        </h3>
      </div>

      <p className="text-body w-full text-text-main">
        {done
          ? 'Build, deploy and app start all completed — #184 is live. Settling to the deployment record…'
          : `${current?.subtitle ?? 'Working'} — you can leave this page, the deploy keeps running.`}
      </p>
    </div>
  );
}

/** Figma "Card" (749:7706) — the blocking config warning. */
function WarningCard({ onAskAgent, agentBusy }: { onAskAgent: () => void; agentBusy: boolean }) {
  return (
    <div className="flex w-full shrink-0 flex-col items-start rounded-main border border-border-main bg-bg-primary p-[17px]">
      <div className="flex w-full items-start gap-[11px]">
        <span className="flex h-[17px] w-[16px] shrink-0 items-start pt-px text-accent-bg-alert">
          <Icon src={assets.warning} />
        </span>
        <div className="flex min-w-px flex-1 flex-col items-start gap-[12px]">
          <p className="text-h5 w-full text-text-primary">2 config values are missing in Prod</p>

          <p className="text-body w-full text-text-main">
            <Code>payments.stripeKey</Code> and <Code>email.smtpUrl</Code> are set in Sandbox but not in Prod.
            Publishing now may break payments and outgoing email on the live app.
          </p>

          <div className="flex w-full shrink-0 flex-col items-start gap-[4px] rounded-small bg-bg-container-secondary px-[12px] pt-[12px] pb-[10px]">
            <p className="text-h6 w-full text-text-primary">How to fix</p>
            <ol className="text-body w-full list-decimal ps-[18px] text-text-secondary">
              <li>
                Open <span className="text-text-primary">Configuration → Prod</span> in your dashboard
              </li>
              <li>Add values for the two keys above (copy them from Sandbox if identical)</li>
              <li>
                Come back and press <span className="text-text-primary">Confirm &amp; continue</span> — the
                deployment will resume
              </li>
            </ol>
          </div>

          <div className="flex w-full shrink-0 items-center gap-[8px] pt-[6px]">
            {agentBusy && (
              <p className="text-small-title min-w-px flex-1 truncate text-text-secondary">
                Agent is adding the missing config values…
              </p>
            )}
            <span className={agentBusy ? '' : 'min-w-px flex-1'} />
            <button
              type="button"
              onClick={onAskAgent}
              disabled={agentBusy}
              className={`flex h-[26px] shrink-0 items-center justify-center gap-[6px] rounded-[48px] px-[12px] transition-colors ${
                agentBusy
                  ? 'border border-border-chat bg-bg-chat text-text-selected'
                  : 'text-text-button hover:bg-hover'
              }`}
            >
              <Icon src={assets.sparkle} size={14} className={agentBusy ? 'animate-pulse' : ''} />
              <span className="text-small-title whitespace-nowrap">
                {agentBusy ? 'Agent is solving…' : 'Ask agent to solve'}
              </span>
            </button>
            <Button>Cancel deploy</Button>
            <Button variant="primary">Confirm &amp; continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Shown once the agent has repaired the configuration. It deliberately stops
 * short of deploying: the agent fixed the blocker, but shipping to production
 * stays a human decision.
 */
function ResolvedCard({ onDeploy, onCancel }: { onDeploy: () => void; onCancel: () => void }) {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[12px] rounded-main border border-accent-green-border bg-bg-primary p-[17px]">
      <div className="flex w-full items-center gap-[10px]">
        <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full border border-accent-green-border text-accent-green-text">
          <Icon src={assets.stepCheck} size={12} />
        </span>
        <h3 className="text-h3 text-text-selected">All resolved — now you can deploy</h3>
      </div>

      <p className="text-body w-full text-text-main">
        The agent added <CodeOk>payments.stripeKey</CodeOk> and <CodeOk>email.smtpUrl</CodeOk> to the Prod
        configuration. Nothing was deployed yet — review and continue whenever you're ready.
      </p>

      <div className="flex w-full items-center gap-[8px] pt-[6px]">
        <p className="text-small-title min-w-px flex-1 text-text-secondary">
          Paused — the deployment decision is yours
        </p>
        <Button onClick={onCancel}>Cancel deploy</Button>
        <Button variant="primary" onClick={onDeploy}>
          Deploy
        </Button>
      </div>
    </div>
  );
}

/** Figma "Logs-opened" (1069:7366). The terminal keeps its dark ground in both themes. */
function BuildLogs() {
  return (
    <div className="flex w-full shrink-0 flex-col items-start overflow-clip rounded-main border border-border-main bg-bg-primary p-px">
      <div className="flex w-full items-center justify-between border-b border-border-main px-[16px] pt-[10px] pb-[11px]">
        <span className="text-h5 whitespace-nowrap text-text-primary">Build Logs</span>
        <span className="font-mono-code text-[10px] leading-[15px] whitespace-nowrap text-[#9aa1b1]">
          us-west-2 · node 22.x
        </span>
      </div>
      <div className="h-[256px] w-full overflow-auto bg-terminal py-[7.5px]">
        {LOG_LINES.map((line, index) => (
          <div key={index} className="flex items-start gap-[12px] px-[16px]">
            <span className="font-mono-code shrink-0 text-[11px] leading-[17.88px] text-terminal-line">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              className={`font-mono-code text-[11px] leading-[17.88px] whitespace-pre ${
                line.tone === 'command'
                  ? 'text-white'
                  : line.tone === 'ok'
                    ? 'text-terminal-ok'
                    : line.tone === 'warn'
                      ? 'font-bold text-terminal-warn'
                      : 'text-terminal-text'
              }`}
            >
              {line.text}
            </span>
          </div>
        ))}
        {/* Blinking cursor at the tail of the stream. */}
        <div className="px-[16px] pl-[48px]">
          <span aria-hidden className="mt-[2px] inline-block h-[12px] w-[6px] animate-pulse bg-terminal-text" />
        </div>
      </div>
    </div>
  );
}

/** One label/value line inside the settled deployment card. */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-[16px] border-b border-border-secondary py-[10px]">
      <span className="text-body shrink-0 text-text-secondary">{label}</span>
      <span className="text-body truncate text-text-primary">{value}</span>
    </div>
  );
}

const FACTS: [string, string][][] = [
  [
    ['Commit', 'c41d09a'],
    ['Deployed', '5 days ago'],
    ['Deployed by', 'alex@modelence.dev'],
  ],
  [
    ['Branch', 'main'],
    ['Duration', '1m 36s'],
    ['Runtime', 'Node 22.x'],
  ],
];

/**
 * The settled deployment: what the page shows when nothing is in flight —
 * either no publish has been started, or one has finished. Where the in-flight
 * view is about what still needs doing, this is a record of what shipped, so
 * the logs collapse behind a disclosure instead of sitting open.
 */
function SettledDeployment() {
  const [logsOpen, setLogsOpen] = useState(false);

  return (
    <div className="flex w-full shrink-0 flex-col items-start rounded-main border border-border-main bg-bg-primary p-[24px]">
      <div className="flex w-full items-center gap-[10px]">
        <h3 className="text-h1 text-text-selected">#183</h3>
        <span className="text-small-title flex h-[22px] shrink-0 items-center rounded-small border border-border-chat bg-bg-chat px-[8px] text-text-selected">
          Current
        </span>
        <span className="min-w-px flex-1" />
        <StatusBadge label="Ready" shape="pill" />
      </div>

      <p className="text-body mt-[8px] w-full text-text-primary">Improve onboarding empty states</p>

      <div className="mt-[10px] grid w-full grid-cols-1 gap-x-[48px] md:grid-cols-2">
        {FACTS.map((column, index) => (
          <div key={index} className="flex flex-col">
            {column.map(([label, value]) => (
              <Fact key={label} label={label} value={value} />
            ))}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-expanded={logsOpen}
        onClick={() => setLogsOpen((open) => !open)}
        className="-mx-[6px] mt-[12px] flex shrink-0 items-center gap-[6px] rounded-small px-[6px] py-[4px] text-text-primary transition-colors hover:bg-hover"
      >
        <Icon
          src={assets.chevron16}
          className={`transition-transform ${logsOpen ? 'rotate-0' : '-rotate-90'}`}
        />
        <span className="text-body whitespace-nowrap">Build logs</span>
      </button>

      {logsOpen && (
        <div className="mt-[12px] w-full">
          <BuildLogs />
        </div>
      )}
    </div>
  );
}

/** Figma "Log section" (1069:7662) — one past deployment per row. */
function DeploymentRows() {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
      {DEPLOYMENTS.map((deployment) => (
        <div
          key={deployment.id}
          className="flex h-[32px] w-full shrink-0 items-center gap-[12px] rounded-main border border-border-main bg-bg-primary px-[17px] py-px"
        >
          <span className="shrink-0 text-text-secondary">
            <Icon src={assets.logBranch} size={14} />
          </span>
          <span aria-hidden className="size-[6px] shrink-0 rounded-full bg-accent-green-text" />
          <span className="text-h6 whitespace-nowrap text-text-primary">{deployment.id}</span>
          <span className="text-small-title whitespace-nowrap text-text-secondary">{deployment.sha}</span>
          <span className="min-w-px flex-1" />
          <span className="text-small-title whitespace-nowrap text-text-secondary">{deployment.when}</span>
          <span className="text-small-title w-[52px] text-right whitespace-nowrap text-accent-green-text">
            {deployment.status}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Figma "Ai chat 1" (746:6791) — the Deployments detail pane. */
export function DeploymentsView({
  onAskAgent,
  agentBusy,
  resolved,
  onDeploy,
  onCancelDeploy,
  active,
  phase,
  steps,
}: {
  onAskAgent: () => void;
  agentBusy: boolean;
  /** True once the agent has finished repairing the configuration. */
  resolved: boolean;
  onDeploy: () => void;
  onCancelDeploy: () => void;
  /** True only while a deploy is actually running or waiting on the user. */
  active: boolean;
  phase: PublishPhase;
  steps: Record<StepId, StepState>;
}) {
  return (
    <div className="min-w-px flex-1 overflow-y-auto rounded-r-block border-y border-r border-border-main bg-bg-container">
      <div className="flex flex-col items-center gap-[20px] px-[20px] py-[12px]">
        <TitleSubtitle />
        {active ? (
          <>
            <MetaRow />
            <Stepper steps={steps} />
            {/*
              Only a deploy that has stopped for the user gets an action card;
              while it is moving, the progress card takes that slot.
            */}
            {phase === 'action-needed' ? (
              resolved ? (
                <ResolvedCard onDeploy={onDeploy} onCancel={onCancelDeploy} />
              ) : (
                <WarningCard onAskAgent={onAskAgent} agentBusy={agentBusy} />
              )
            ) : (
              <DeployingCard steps={steps} />
            )}
            <BuildLogs />
          </>
        ) : (
          <SettledDeployment />
        )}
        <DeploymentRows />
      </div>
    </div>
  );
}
