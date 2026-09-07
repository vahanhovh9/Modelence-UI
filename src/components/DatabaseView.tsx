import { assets } from '../assets';
import { Button } from './Button';
import { HeadCell, IconCta, Scroller, TableHead, TableRow, TableSection } from './ConsoleTable';
import { Icon } from './Icon';

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

const COLS = {
  size: 'w-[120px] shrink-0',
  records: 'w-[100px] shrink-0',
  action: 'w-[108px] shrink-0',
};

export function DatabaseView() {
  return (
    <TableSection
      title="Database"
      actions={
        <>
          <IconCta icon={<Icon src={assets.history} size={14} />} label="See migrations" variant="secondary" />
          <IconCta icon={<Icon src={assets.connect} size={14} />} label="Connect external tool" />
        </>
      }
    >
      <Scroller min="min-w-[600px]">
        <TableHead>
          <HeadCell className="min-w-px flex-1">Model Name</HeadCell>
          <HeadCell className={COLS.size}>Size</HeadCell>
          <HeadCell className={COLS.records}>Records</HeadCell>
          <span className={COLS.action} />
        </TableHead>

        {MODELS.map((model) => (
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
