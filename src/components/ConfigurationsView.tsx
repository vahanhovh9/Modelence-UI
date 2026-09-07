import { assets } from '../assets';
import { HeadCell, Scroller, TableHead, TableRow, TableSection } from './ConsoleTable';
import { Icon } from './Icon';

type Config = { key: string; value: string; kind: 'number' | 'text' };

const CONFIGS: Config[] = [
  { key: 'example.itemsPerPage', value: '5', kind: 'number' },
  { key: 'example.modelenceDemoPassword', value: '12345678', kind: 'text' },
  { key: 'example.modelenceDemoUsername', value: 'demo@modelence.dev', kind: 'text' },
];

/** The value's type, as a glyph — `#` for a number, `T` for text. */
function TypeChip({ kind }: { kind: Config['kind'] }) {
  return (
    <span
      aria-label={kind}
      className="flex size-[20px] shrink-0 items-center justify-center rounded-small bg-bg-selected-2 text-[11px] font-semibold text-text-secondary"
    >
      {kind === 'number' ? '#' : 'T'}
    </span>
  );
}

export function ConfigurationsView() {
  return (
    <TableSection title="Configurations">
      <Scroller min="min-w-[520px]">
        <TableHead>
          <HeadCell className="min-w-px flex-1">Key</HeadCell>
          <HeadCell className="min-w-px flex-1">Value</HeadCell>
          <span className="w-[24px] shrink-0" />
        </TableHead>

        {CONFIGS.map((config) => (
          <TableRow key={config.key}>
            <span className="text-body min-w-px flex-1 truncate text-text-primary" title={config.key}>
              {config.key}
            </span>
            <span className="flex min-w-px flex-1 items-center gap-[10px]">
              <TypeChip kind={config.kind} />
              <span className="text-body min-w-px truncate text-text-primary">{config.value}</span>
            </span>
            <span className="flex size-[24px] shrink-0 items-center justify-center rounded-small text-icon-default transition-colors hover:bg-hover hover:text-icon-selected">
              <Icon src={assets.copy} size={14} />
            </span>
          </TableRow>
        ))}
      </Scroller>
    </TableSection>
  );
}
