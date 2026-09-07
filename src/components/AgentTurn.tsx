import { assets } from '../assets';
import { formatDuration } from '../agent/useFakeAgent';
import type { Step, Turn } from '../agent/script';
import { Icon, maskStyle } from './Icon';

function Caret() {
  return (
    <span className="ml-[2px] inline-block h-[11px] w-[6px] translate-y-[1px] animate-pulse bg-text-main align-baseline" />
  );
}

function StepView({ step, caret }: { step: Step; caret: boolean }) {
  if (step.kind === 'text') {
    return (
      <p className="text-body whitespace-pre-wrap text-text-main">
        {step.text}
        {caret && <Caret />}
      </p>
    );
  }

  return (
    <div>
      <p className="text-body">
        <span className="font-semibold text-text-selected">{step.tool}</span>{' '}
        <span className="text-text-main">{step.label}</span>
      </p>
      {step.input && (
        <>
          <p className="text-body text-grey-400">IN</p>
          <p className="text-body whitespace-pre-wrap text-text-main">
            {step.input}
            {caret && !step.output && <Caret />}
          </p>
        </>
      )}
      {step.output && (
        <>
          <p className="text-body text-grey-400">OUT</p>
          <p className="text-body whitespace-pre-wrap text-text-main">
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
    <div className={`break-words ${className}`}>
      {steps.map((step, index) => {
        const body = <StepView step={step} caret={working && index === steps.length - 1} />;
        return (
          <div
            key={index}
            className={`${index > 0 ? 'mt-[10px]' : ''} ${bullets ? 'flex gap-[8px]' : ''}`.trim() || undefined}
          >
            {bullets && <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-grey-400" />}
            {bullets ? <div className="min-w-0 flex-1">{body}</div> : body}
          </div>
        );
      })}
    </div>
  );
}

export function TurnView({ turn, elapsed, bullets = false }: { turn: Turn; elapsed: number; bullets?: boolean }) {
  if (turn.role === 'user') {
    // Figma component "Chat Bubble" (528:3146).
    return (
      <div className="flex w-full shrink-0 items-center justify-center rounded-main border border-border-chat bg-bg-chat px-[12px] py-[8px]">
        <p className="text-body min-w-px flex-1 break-words text-text-primary">{turn.text}</p>
      </div>
    );
  }

  const footer = turn.working ? (
    <div className="flex shrink-0 items-center gap-[4px]">
      <span className="flex size-[16px] items-center justify-center">
        <span className="size-[6px] animate-pulse rounded-full bg-button-main-bg" />
      </span>
      <span className="text-body whitespace-nowrap text-text-main">working… {formatDuration(elapsed)}</span>
    </div>
  ) : turn.durationMs !== null ? (
    <div className="flex shrink-0 items-center gap-[4px]">
      <span className="text-green-300">
        <Icon src={assets.check} />
      </span>
      <span className="text-body whitespace-nowrap text-text-primary">
        worked for {formatDuration(turn.durationMs)}
      </span>
    </div>
  ) : null;

  if (bullets || !turn.rail) {
    return (
      <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
        <Steps steps={turn.steps} working={turn.working} className="w-full" bullets={bullets} />
        {footer}
      </div>
    );
  }

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
      <div className="flex w-full items-stretch gap-[8px]">
        {/* The exported rail is a fixed 5x105 tile, repeated so it spans any number of steps. */}
        <div className="flex shrink-0 py-[7px] text-grey-400">
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
