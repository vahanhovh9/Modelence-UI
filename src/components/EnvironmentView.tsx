import { Button } from './Button';
import { TableSection } from './ConsoleTable';
import { MoreDots } from './Dropdown';
import { StatusBadge } from './StatusBadge';

const FACTS: [string, string][] = [
  ['Application', 'product-design-diary'],
  ['Environment Type', 'cloud'],
  ['Region', 'US West (Oregon)'],
];

const CONTAINERS = [
  { id: '49f9b6a4d84746a1c0b7e2f5', status: 'Running', started: '5 days ago' },
];

/** The card every panel on this page sits in. */
function Card({
  title,
  aside,
  children,
}: {
  title: string;
  /** Sits opposite the title — a count, or the card's own menu. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-px flex-col gap-[14px] rounded-main border border-border-main bg-bg-primary p-[20px]">
      <div className="flex items-center justify-between gap-[12px]">
        <h3 className="text-h3 text-text-selected">{title}</h3>
        {aside}
      </div>
      {children}
    </div>
  );
}

/** One `Label: value` line — the label sets the value up rather than columning it. */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-body flex flex-wrap items-baseline gap-x-[8px]">
      <span className="text-text-secondary">{label}:</span>
      <span className="text-text-primary">{value}</span>
    </p>
  );
}

function EnvironmentCard() {
  return (
    <Card
      title="Environment"
      aside={
        <button
          type="button"
          aria-label="Environment options"
          className="flex size-[24px] shrink-0 items-center justify-center rounded-small text-icon-default transition-colors hover:bg-hover hover:text-icon-selected"
        >
          <MoreDots />
        </button>
      }
    >
      <div className="flex flex-col gap-[6px]">
        {FACTS.map(([label, value]) => (
          <Fact key={label} label={label} value={value} />
        ))}
      </div>

      <div className="flex flex-col items-start gap-[8px] border-t border-border-secondary pt-[16px]">
        <h4 className="text-h4 text-text-selected">Custom Domains</h4>
        <p className="text-body text-text-main">
          No custom domains configured. Add one to use your own domain with this environment.
        </p>
        <Button className="mt-[4px]">Add Custom Domain</Button>
      </div>
    </Card>
  );
}

/** A setting whose value sits to the right, with its own way in. */
function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-[12px] border-b border-border-secondary py-[12px] last:border-b-0">
      <span className="text-body text-text-main">{label}</span>
      <span className="flex shrink-0 items-center gap-[10px]">
        <span className="text-body text-text-primary">{value}</span>
        <Button>Edit</Button>
      </span>
    </div>
  );
}

function ContainerConfiguration() {
  return (
    <Card title="Container Configuration">
      <div className="-mt-[8px] flex flex-col">
        <Setting label="Container Count" value="1" />
        <Setting label="Container Type" value="Micro (Included)" />
      </div>
    </Card>
  );
}

const COLS = {
  status: 'flex w-[104px] shrink-0 items-center',
  started: 'w-[104px] shrink-0',
  logs: 'w-[84px] shrink-0',
};

function CloudContainers() {
  const running = CONTAINERS.filter((container) => container.status === 'Running').length;

  return (
    <Card
      title="Cloud Containers"
      aside={<span className="text-small-title shrink-0 text-text-secondary">{running} running</span>}
    >
      <div className="w-full overflow-x-auto">
        <div className="min-w-[420px]">
          <div className="flex items-center gap-[16px] border-b border-border-main pb-[10px]">
            <span className="text-h6 min-w-px flex-1 text-text-selected">Container ID</span>
            <span className={`text-h6 text-text-selected ${COLS.status}`}>Status</span>
            <span className={`text-h6 text-text-selected ${COLS.started}`}>Started</span>
            <span className={`text-h6 text-text-selected ${COLS.logs}`}>Logs</span>
          </div>

          {CONTAINERS.map((container) => (
            <div
              key={container.id}
              className="flex items-center gap-[16px] border-b border-border-secondary py-[11px] last:border-b-0"
            >
              <span
                className="font-mono-code min-w-px flex-1 truncate text-[12px] text-text-primary"
                title={container.id}
              >
                {container.id.slice(0, 16)}…
              </span>
              <span className={COLS.status}>
                <StatusBadge label={container.status} />
              </span>
              <span className={`text-body text-text-main ${COLS.started}`}>{container.started}</span>
              <span className={`-ml-[4px] ${COLS.logs}`}>
                <Button variant="text">View Logs</Button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * The Environment section — where the environment itself is described and
 * sized. Unlike the sections that mirror Sandbox, this is Prod's own
 * configuration rather than something a deploy ships, so it keeps its actions.
 */
export function EnvironmentView() {
  return (
    <TableSection title="Environment">
      <div className="grid w-full grid-cols-1 items-start gap-[16px] lg:grid-cols-2">
        <div className="flex min-w-px flex-col gap-[16px]">
          <EnvironmentCard />
          <ContainerConfiguration />
        </div>
        <CloudContainers />
      </div>
    </TableSection>
  );
}
