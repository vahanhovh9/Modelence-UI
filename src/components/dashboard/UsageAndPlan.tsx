import { assets } from '../../assets';
import { Button } from '../Button';
import { Icon } from '../Icon';

const PLAN_FEATURES = [
  'Unlimited production instances',
  'On demand App Builder usage',
  'Unlimited custom domains',
  'Multi-region deployments',
  'Dedicated support channel',
  'Custom SLAs',
  'Architecture review',
];

/** Figma "Card" — the shared surface every panel on this page sits on. */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      // Figma's dashboard Card (1115:12802) outlines itself with Border
      // Secondary, a step lighter than the Border Main used elsewhere.
      className={`flex shrink-0 flex-col items-start gap-[12px] rounded-main border border-border-secondary bg-bg-primary p-[17px] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: string }) {
  return <h2 className="text-h3 w-full px-[4px] text-text-selected">{children}</h2>;
}

function UsageCards() {
  return (
    <div className="flex w-full shrink-0 items-stretch gap-[10px]">
      <Card className="min-w-px flex-1">
        <div className="flex w-full items-start justify-between">
          <div className="flex min-w-px flex-1 flex-col items-start">
            <h3 className="text-h4 text-text-primary">App builder usage</h3>
            <p className="text-small-title mt-[4px] text-text-secondary">
              Included usage resets on the 1st of each month
            </p>
          </div>
          <Button>Learn more</Button>
        </div>

        <div className="flex w-full flex-col items-start gap-[6px]">
          <span className="text-small-title text-text-secondary">Plan</span>
          <p className="flex items-baseline gap-[6px]">
            <span className="text-large-number text-text-selected">$0.00</span>
            <span className="text-body-large text-text-secondary">/ $200.00</span>
          </p>
          {/* Usage meter — 0 of $200 spent. */}
          <div
            role="progressbar"
            aria-valuenow={0}
            aria-valuemin={0}
            aria-valuemax={200}
            aria-label="App builder usage"
            className="h-[6px] w-full overflow-clip rounded-full bg-bg-element-2"
          >
            <div className="h-full w-[16%] rounded-full bg-accent-purple-highlight" />
          </div>
        </div>
      </Card>

      <Card className="w-[401px]">
        <div className="flex w-full items-start justify-between gap-[12px]">
          <div className="flex min-w-px flex-1 flex-col items-start">
            <h3 className="text-h4 text-text-primary">App Builder Credits</h3>
            <p className="text-small-title mt-[4px] leading-[15px] text-text-secondary">
              For App Builder usage only. Stays on your account until used
            </p>
          </div>
          <Button>View history</Button>
        </div>

        <div className="flex w-full items-center gap-[12px]">
          <span className="text-large-number text-text-selected">$200.00</span>
          <button
            type="button"
            className="flex h-[20px] shrink-0 items-center gap-[4px] rounded-small px-[4px] text-text-button transition-colors hover:bg-hover"
          >
            <span aria-hidden className="text-[14px] leading-none">
              +
            </span>
            <span className="text-small-title whitespace-nowrap">Add credits</span>
          </button>
        </div>
      </Card>
    </div>
  );
}

function CurrentPlan() {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[12px]">
      <SectionHeading>Current plan</SectionHeading>
      <Card className="w-full">
        <div className="flex w-full flex-col gap-[4px]">
          <h3 className="text-h4 text-text-primary">Enterprise</h3>
          <p className="text-small-title text-text-secondary">Included usage resets on the 1st of each month</p>
        </div>
        <ul className="grid w-full grid-cols-3 gap-x-[28px] gap-y-[10.5px] border-t border-border-secondary pt-[22px]">
          {PLAN_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-[7px]">
              <span className="shrink-0 text-accent-bg-success">
                <Icon src={assets.check} />
              </span>
              <span className="text-body text-text-main">{feature}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function PaymentMethod() {
  return (
    <Card className="w-full">
      <h3 className="text-h4 text-text-primary">Payment method</h3>
      <div className="flex w-full items-center justify-between pt-[16px]">
        <span className="flex shrink-0 items-center gap-[8px]">
          <span className="flex size-[32px] shrink-0 items-center justify-center overflow-clip rounded-main bg-[#1434cb]">
            <img src={assets.visa} alt="Visa" className="block w-[28px] max-w-none" />
          </span>
          <span className="flex shrink-0 items-center gap-[4px]">
            <span className="text-body text-text-main">Visa</span>
            <span aria-hidden className="flex items-center gap-[2px]">
              {[0, 1, 2, 3].map((dot) => (
                <span key={dot} className="size-[4px] rounded-full bg-text-main" />
              ))}
            </span>
            <span className="text-body text-text-main">3211</span>
          </span>
        </span>
        <Button>Update</Button>
      </div>
    </Card>
  );
}

/** Figma "Ai chat 1" (1100:11899) — the Usage and plan page body. */
export function UsageAndPlan() {
  return (
    <div className="min-w-px flex-1 overflow-y-auto rounded-block border border-border-main bg-bg-container">
      <div className="mx-auto flex w-full max-w-[1024px] flex-col items-start gap-[20px] px-[24px] py-[25px]">
        <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
          <h1 className="text-h1 text-text-selected">Usage and Plan</h1>
          <p className="text-body text-text-secondary">
            Track your App Builder credits and cloud resources for this billing period.
          </p>
        </div>

        <UsageCards />
        <CurrentPlan />
        <PaymentMethod />

        <div className="flex w-full shrink-0 flex-col items-start gap-[12px]">
          <SectionHeading>Invoices</SectionHeading>
          <Card className="h-[52px] w-full justify-center">
            <p className="text-body text-text-secondary">No invoices yet</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
