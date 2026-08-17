import { assets } from '../assets';
import { formatDuration } from '../agent/useFakeAgent';
import type { Step, Turn } from '../agent/script';
import { VectorIcon, icons, maskStyle } from './VectorIcon';

function Caret() {
  return (
    <span className="ml-[2px] inline-block h-[11px] w-[6px] translate-y-[1px] animate-pulse bg-text-body align-baseline" />
  );
}

function StepView({ step, caret }: { step: Step; caret: boolean }) {
  if (step.kind === 'text') {
    return (
      <p className="leading-[20px] whitespace-pre-wrap text-text-body">
        {step.text}
        {caret && <Caret />}
      </p>
    );
  }

  return (
    <div>
      <p className="leading-[20px]">
        <span className="font-medium text-text">{step.tool}</span>{' '}
        <span className="text-text-body">{step.label}</span>
      </p>
      {step.input && (
        <>
          <p className="leading-[20px] text-text-muted">IN</p>
          <p className="leading-[20px] whitespace-pre-wrap text-text-body">
            {step.input}
            {caret && !step.output && <Caret />}
          </p>
        </>
      )}
      {step.output && (
        <>
          <p className="leading-[20px] text-text-muted">OUT</p>
          <p className="leading-[20px] whitespace-pre-wrap text-text-body">
            {step.output}
            {caret && <Caret />}
          </p>
        </>
      )}
    </div>
  );
}

function Steps({
  steps,
  working,
  className,
  bullets = false,
}: {
  steps: Step[];
  working: boolean;
  className: string;
  /** V2 marks each step with a 5px dot instead of a continuous gutter rail. */
  bullets?: boolean;
}) {
  return (
    <div className={`text-[13px] break-words ${className}`}>
      {steps.map((step, index) => {
        const body = <StepView step={step} caret={working && index === steps.length - 1} />;
        return (
          <div
            key={index}
            className={`${index > 0 ? 'mt-[10px]' : ''} ${bullets ? 'flex gap-[8px]' : ''}`.trim() || undefined}
          >
            {bullets && <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-text-muted" />}
            {bullets ? <div className="min-w-0 flex-1">{body}</div> : body}
          </div>
        );
      })}
    </div>
  );
}

export function TurnView({ turn, elapsed, bullets = false }: { turn: Turn; elapsed: number; bullets?: boolean }) {
  if (turn.role === 'user') {
    return (
      <div className="flex w-full shrink-0 items-center justify-center rounded-[8px] border border-bubble-border bg-bubble px-[12px] py-[8px]">
        <p className="min-w-px flex-1 text-[13px] leading-[20px] break-words text-bubble-text">{turn.text}</p>
      </div>
    );
  }

  const footer = turn.working ? (
    <div className="flex shrink-0 items-center gap-[4px]">
      <span className="flex size-[16px] items-center justify-center">
        <span className="size-[6px] animate-pulse rounded-full bg-publish" />
      </span>
      <span className="text-[13px] leading-[20px] whitespace-nowrap text-text-body">
        working… {formatDuration(elapsed)}
      </span>
    </div>
  ) : turn.durationMs !== null ? (
    <div className="flex shrink-0 items-center gap-[4px]">
      <span className="text-accent-green">
        <VectorIcon {...icons.check} />
      </span>
      <span className="text-[13px] leading-[20px] whitespace-nowrap text-text">
        worked for {formatDuration(turn.durationMs)}
      </span>
    </div>
  ) : null;

  if (!turn.rail) {
    return (
      <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
        <Steps steps={turn.steps} working={turn.working} className="w-full" />
        {footer}
      </div>
    );
  }

  // V2 renders the same grouped steps with per-step dots, no gutter rail.
  if (bullets) {
    return (
      <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
        <Steps steps={turn.steps} working={turn.working} className="w-full" bullets />
        {footer}
      </div>
    );
  }

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
      <div className="flex w-full items-stretch gap-[8px]">
        {/* The exported rail is a fixed 5×105 tile, repeated so it spans any number of steps. */}
        <div className="flex shrink-0 py-[7px] text-text-muted">
          <div
            aria-hidden
            className="w-[5px] shrink-0 bg-current"
            style={maskStyle(assets.thinkingRail, {
              maskRepeat: 'repeat-y',
              WebkitMaskRepeat: 'repeat-y',
              maskSize: '5px 105px',
              WebkitMaskSize: '5px 105px',
              maskPosition: 'top',
              WebkitMaskPosition: 'top',
            })}
          />
        </div>
        <Steps steps={turn.steps} working={turn.working} className="min-w-0 flex-1" />
      </div>
      {footer}
    </div>
  );
}
