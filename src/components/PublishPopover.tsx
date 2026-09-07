import { useState } from 'react';
import { assets } from '../assets';
import type { PublishPhase, StepId, StepState } from '../publish';
import { Button } from './Button';
import { Dropdown } from './Dropdown';
import { Icon } from './Icon';
import { PublishProgress } from './PublishProgress';

/**
 * The deploy flow's entry point. Idle shows the domain form; once publishing
 * starts the same popover becomes the progress view. It stays dismissable —
 * the timeline runs above this component, so closing it never stops a deploy.
 */
export function PublishPopover({
  phase,
  steps,
  onStart,
  onConfirm,
  onReview,
  onReset,
}: {
  phase: PublishPhase;
  steps: Record<StepId, StepState>;
  onStart: () => void;
  onConfirm: () => void;
  onReview: () => void;
  onReset: () => void;
}) {
  const [domain, setDomain] = useState('product-design-diary');
  const valid = domain.trim().length > 0;
  const busy = phase === 'running' || phase === 'action-needed';

  const label = phase === 'idle' ? 'Publish' : phase === 'done' ? 'Published' : 'Publishing…';

  return (
    <Dropdown
      placement="bottom-end"
      panelWidth="w-[374px]"
      panelClassName="flex flex-col gap-[12px] rounded-block border border-border-highlight bg-bg-container p-[16px]"
      trigger={({ open, toggle }) => (
        <Button
          variant="main"
          className={phase === 'idle' ? 'w-[87px]' : ''}
          aria-expanded={open}
          onClick={toggle}
          icon={
            phase === 'idle' ? undefined : (
              <Icon
                src={phase === 'done' ? assets.stepCheck : assets.refresh}
                size={14}
                className={busy ? 'animate-spin' : ''}
              />
            )
          }
        >
          {label}
        </Button>
      )}
    >
      {({ close }) =>
        phase === 'idle' ? (
          <>
            <h2 className="text-h4 text-text-selected">Publish</h2>

            <div className="flex flex-col gap-[6px]">
              <label htmlFor="publish-domain" className="text-small-title text-text-secondary">
                Domain (URL)
              </label>

              {/* Same shell as the page selector: h-28, radius main, Border Main. */}
              <div className="flex h-[28px] w-full overflow-clip rounded-main border border-border-main">
                <input
                  id="publish-domain"
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  className="text-h6 min-w-px flex-1 bg-bg-element-1 px-[10px] text-text-selected outline-none"
                />
                <span className="text-h6 flex shrink-0 items-center border-l border-border-main bg-bg-element-2 px-[10px] text-text-secondary">
                  .modelence.app
                </span>
              </div>

              <button
                type="button"
                className="-mx-[4px] flex shrink-0 items-center gap-[4px] self-start rounded-small px-[4px] py-[3px] text-text-selected transition-colors hover:bg-hover"
              >
                <Icon src={assets.plus} size={12} />
                <span className="text-h6 whitespace-nowrap">Add custom domain</span>
              </button>
            </div>

            <Button variant="main" className="w-full" disabled={!valid} onClick={onStart}>
              Publish
            </Button>
          </>
        ) : (
          <PublishProgress
            phase={phase}
            steps={steps}
            domain={domain}
            onReview={() => {
              close();
              onReview();
            }}
            onConfirm={onConfirm}
            onDone={() => {
              close();
              onReset();
            }}
          />
        )
      }
    </Dropdown>
  );
}
