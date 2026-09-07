import { assets } from '../assets';
import { PUBLISH_STEPS, type PublishPhase, type StepId, type StepState } from '../publish';
import { Button } from './Button';
import { Icon } from './Icon';
import { PublishArt } from './PublishArt';

function StepMark({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-accent-bg-success text-green-800">
        <Icon src={assets.stepCheck} size={14} />
      </span>
    );
  }
  if (state === 'warning') {
    return (
      <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-accent-bg-alert text-accent-alert-text">
        <Icon src={assets.warning} size={14} />
      </span>
    );
  }
  if (state === 'active') {
    return (
      <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-button-main-bg">
        <span className="size-[12px] animate-spin rounded-full border-2 border-white/35 border-t-white" />
      </span>
    );
  }
  return <span className="size-[24px] shrink-0 rounded-full border-2 border-border-highlight" />;
}

/** The blocking config warning, shown inline under the Deploy step. */
function ActionCard({ onReview, onConfirm }: { onReview: () => void; onConfirm: () => void }) {
  return (
    <div className="mt-[10px] flex flex-col gap-[10px] rounded-main border border-border-main bg-bg-primary p-[12px]">
      <div className="flex items-start gap-[8px]">
        <span className="shrink-0 pt-[2px] text-alert-strong">
          <Icon src={assets.warning} size={14} />
        </span>
        <p className="text-body min-w-px flex-1 text-text-main">
          2 config values are missing in Prod. Publishing now may break the live app.
        </p>
      </div>
      <div className="flex items-center gap-[8px]">
        <Button className="flex-1" onClick={onReview}>
          Review
        </Button>
        <Button variant="primary" className="flex-1" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

export function PublishProgress({
  phase,
  steps,
  domain,
  onReview,
  onConfirm,
  onDone,
}: {
  phase: PublishPhase;
  steps: Record<StepId, StepState>;
  domain: string;
  onReview: () => void;
  onConfirm: () => void;
  onDone: () => void;
}) {
  const title = phase === 'action-needed' ? 'Action needed' : phase === 'done' ? 'Published' : 'Publishing';

  return (
    <>
      <h2 className="text-h4 text-text-selected">{title}</h2>
      <PublishArt phase={phase} />

      <ol className="flex w-full flex-col">
        {PUBLISH_STEPS.map((step, index) => {
          const state = steps[step.id];
          const last = index === PUBLISH_STEPS.length - 1;
          return (
            <li key={step.id} className="flex w-full gap-[12px]">
              <div className="flex shrink-0 flex-col items-center">
                <StepMark state={state} />
                {!last && (
                  <span
                    className={`min-h-[20px] w-px flex-1 ${state === 'done' ? 'bg-accent-green-border' : 'bg-border-main'}`}
                  />
                )}
              </div>
              <div className={`min-w-px flex-1 ${last ? '' : 'pb-[14px]'}`}>
                <p
                  className={`text-h5 ${state === 'warning' ? 'text-alert-strong' : state === 'pending' ? 'text-text-secondary' : 'text-text-selected'}`}
                >
                  {step.title}
                </p>
                <p className="text-small-title mt-[5px] text-text-secondary">{step.subtitle}</p>
                {step.id === 'deploy' && phase === 'action-needed' && (
                  <ActionCard onReview={onReview} onConfirm={onConfirm} />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {phase === 'done' && (
        <>
          <a
            href={`https://${domain}.modelence.app`}
            target="_blank"
            rel="noreferrer"
            className="flex h-[28px] w-full items-center justify-between rounded-main border border-border-main bg-bg-element-2 px-[10px] text-text-selected transition-colors hover:border-border-highlight"
          >
            <span className="text-h6 truncate">{domain}.modelence.app</span>
            <Icon src={assets.externalLink} size={14} />
          </a>
          <Button variant="main" className="w-full" onClick={onDone}>
            Done
          </Button>
        </>
      )}
    </>
  );
}
