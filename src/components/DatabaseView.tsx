import { assets } from '../assets';
import { Button } from './Button';
import { HeadCell, IconCta, Scroller, TableHead, TableRow, TableSection } from './ConsoleTable';
import { Icon } from './Icon';
import type { Env } from '../environment';

type Model = { name: string; size: string; records: string };

const MODELS: Model[] = [
  { name: '_modelenceCronJobs', size: '0 bytes', records: '0' },
  { name: '_modelenceDisposableEmailDomains', size: '4.7 MB', records: '74.5K' },
  { name: '_modelenceEmailVerificationTokens', size: '0 bytes', records: '0' },
  { name: '_modelenceLinkNonces', size: '0 bytes', records: '0' },
  { name: '_modelenceLocks', size: '118 bytes', records: '1' },
  { name: '_modelenceMigrations', size: '123 bytes', records: '1' },
  { name: '_modelenceRateLimits', size: '0 bytes', records: '0' },
  { name: '_modelenceResetPasswordTokens', size: '0 bytes', records: '0' },
  { name: '_modelenceSessions', size: '302 bytes', records: '2' },
  { name: '_modelenceUsers', size: '259 bytes', records: '1' },
  // Not yet created, so it reports no size or count.
  { name: 'exampleItems', size: '—', records: '—' },
];

/*
 * The same models, with the volume a live environment accumulates. Records are
 * runtime state, so a deploy changes the schema but never the contents.
 */
const PROD_MODELS: Model[] = [
  { name: '_modelenceCronJobs', size: '84 KB', records: '1,204' },
  { name: '_modelenceDisposableEmailDomains', size: '4.7 MB', records: '74.5K' },
  { name: '_modelenceEmailVerificationTokens', size: '19 KB', records: '312' },
  { name: '_modelenceLinkNonces', size: '6 KB', records: '97' },
  { name: '_modelenceLocks', size: '412 bytes', records: '3' },
  { name: '_modelenceMigrations', size: '1.1 KB', records: '9' },
  { name: '_modelenceRateLimits', size: '240 KB', records: '8,461' },
  { name: '_modelenceResetPasswordTokens', size: '3 KB', records: '41' },
  { name: '_modelenceSessions', size: '1.9 MB', records: '24,108' },
  { name: '_modelenceUsers', size: '318 KB', records: '7,940' },
  { name: 'exampleItems', size: '12.4 MB', records: '196,203' },
];

const COLS = {
  size: 'w-[120px] shrink-0',
  records: 'w-[100px] shrink-0',
  action: 'w-[108px] shrink-0',
};

export function DatabaseView({ env = 'sandbox' }: { env?: Env }) {
  const models = env === 'prod' ? PROD_MODELS : MODELS;
  const readOnly = env === 'prod';
  return (
    <TableSection
      title="Database"
      actions={
        readOnly ? undefined : (
          <>
            <IconCta icon={<Icon src={assets.history} size={14} />} label="See migrations" variant="secondary" />
            <IconCta icon={<Icon src={assets.connect} size={14} />} label="Connect external tool" />
          </>
        )
      }
    >
      <Scroller min="min-w-[600px]">
        <TableHead>
          <HeadCell className="min-w-px flex-1">Model Name</HeadCell>
          <HeadCell className={COLS.size}>Size</HeadCell>
          <HeadCell className={COLS.records}>Records</HeadCell>
          <span className={COLS.action} />
        </TableHead>

        {models.map((model) => (
          <TableRow key={model.name}>
            <span className="text-body min-w-px flex-1 truncate text-text-primary" title={model.name}>
              {model.name}
            </span>
            <span className={`text-body text-text-main ${COLS.size}`}>{model.size}</span>
            <span className={`text-body text-text-main ${COLS.records}`}>{model.records}</span>
            <span className={`flex justify-end ${COLS.action}`}>
              <Button>View Schema</Button>
            </span>
          </TableRow>
        ))}
      </Scroller>
    </TableSection>
  );
}
