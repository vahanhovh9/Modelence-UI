import { useState } from 'react';
import { assets } from '../assets';
import { MoreDots } from './Dropdown';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';
import { HeadCell, IconCta, Scroller, TableHead, TableRow, TableSection } from './ConsoleTable';

type StoredFile = { path: string; size: string; modified: string };

const FILES: StoredFile[] = [
  { path: 'chat-attachments/1784043017757-d6e7658c-2705-4e6e-83ff-7455a1043541-download.png', size: '444 KB', modified: 'Jul 14, 2026' },
  { path: 'chat-attachments/1784055621748-ee990e60-898a-4ce3-b4c7-641df0149a63-4c6f07d06ad236f0f1a95fa94207860c.png', size: '2.1 KB', modified: 'Jul 14, 2026' },
  { path: 'chat-attachments/1784130494901-575c2c30-b399-44fc-95b2-9b13940107ee-04528551a5166aa3e56fa76edf5c6b05.png', size: '225 KB', modified: 'Jul 15, 2026' },
  { path: 'chat-attachments/1784558153611-b61bb685-c987-4063-b8cb-731b7c70aafe-download11.png', size: '724 KB', modified: 'Jul 20, 2026' },
  { path: 'chat-attachments/1784559093305-0f50b550-011e-4e71-aba2-fd5323a95a81-download11.png', size: '724 KB', modified: 'Jul 20, 2026' },
  { path: 'chat-attachments/1784559790213-34d9f128-d369-41bc-b2ac-a63b0dd033c3-download11.png', size: '724 KB', modified: 'Jul 20, 2026' },
  { path: 'chat-attachments/1784728697018-c4a347c4-0885-49fb-985e-538b0fdaaaa3-ae1dafe9ab5bd1148471042c094531ec.png', size: '118 KB', modified: 'Jul 22, 2026' },
  { path: 'chat-attachments/1784730362877-563df914-dd7e-4cd5-9474-e82b0b460ddb-11.png', size: '120 KB', modified: 'Jul 22, 2026' },
  { path: 'chat-attachments/1784730824303-b526106a-f434-4912-abfa-fca3c523c841-21.png', size: '37 KB', modified: 'Jul 22, 2026' },
  { path: 'chat-attachments/1784731204540-f3e2c02e-53b6-49d3-a5f3-11d4171e7d96-31.png', size: '167 KB', modified: 'Jul 22, 2026' },
  { path: 'chat-attachments/1784736695795-28399a7d-a11a-468e-ac17-a1ff1bfc1818-44.png', size: '23 KB', modified: 'Jul 22, 2026' },
  { path: 'chat-attachments/1785427112958-7a49fe9f-337a-48c0-b3a8-f5bf8a917fbb-6f954b2a7f7ffac7978707c30486a637.png', size: '85 KB', modified: 'Jul 30, 2026' },
  { path: 'exports/monthly-usage-2026-07.csv', size: '12 KB', modified: 'Aug 1, 2026' },
  { path: 'branding/logo-mark.svg', size: '4 KB', modified: 'Aug 3, 2026' },
];

/**
 * How much of the name survives. A row has the width for the folder plus a
 * generous name; a tile has neither, so it drops the folder and keeps less.
 */
const BUDGET = {
  row: { head: 13, tail: 15, folder: true },
  tile: { head: 8, tail: 12, folder: false },
};

/**
 * Collapses the middle of a long file name, keeping its opening characters and
 * enough of the tail to carry the extension. The end matters as much as the
 * start here — a plain trailing ellipsis would hide the file type.
 */
function shorten(name: string, head: number, tail: number) {
  if (name.length <= head + tail + 1) return name;
  return `${name.slice(0, head)}…${name.slice(-tail)}`;
}

/** Splits a stored path so the folder stays readable and only the name collapses. */
function split(path: string) {
  const cut = path.lastIndexOf('/');
  return { folder: cut < 0 ? '' : path.slice(0, cut + 1), name: path.slice(cut + 1) };
}

function FileName({ path, variant = 'row' }: { path: string; variant?: keyof typeof BUDGET }) {
  const { folder, name } = split(path);
  const { head, tail, folder: showFolder } = BUDGET[variant];
  return (
    <span
      className="font-mono-code min-w-px flex-1 truncate text-[12px] leading-[18px]"
      // The untruncated path is always one hover away.
      title={path}
    >
      {showFolder && folder && <span className="text-text-secondary">{folder}</span>}
      <span className="text-text-primary">{shorten(name, head, tail)}</span>
    </span>
  );
}

function Private() {
  return (
    <StatusBadge
      label="Private"
      tone="neutral"
      icon={
        <span className="shrink-0 text-text-secondary">
          <Icon src={assets.lock} size={11} />
        </span>
      }
    />
  );
}

/** A file's own glyph, on the muted ground the grid tiles use for previews. */
function FileGlyph({ size = 16 }: { size?: number }) {
  return (
    <span className="shrink-0 text-text-secondary">
      <Icon src={assets.fileImage} size={size} />
    </span>
  );
}

function RowMenu() {
  return (
    <span className="flex size-[24px] shrink-0 items-center justify-center rounded-small text-icon-default transition-colors hover:bg-hover hover:text-icon-selected">
      <MoreDots />
    </span>
  );
}

/** Columns are fixed so the header and every row line up under a scroll. */
const COLS = {
  size: 'w-[88px] shrink-0',
  visibility: 'w-[104px] shrink-0',
  modified: 'w-[112px] shrink-0',
};

function ListView() {
  return (
    <Scroller min="min-w-[620px]">
      <TableHead>
        <HeadCell className="min-w-px flex-1">File</HeadCell>
        <HeadCell className={COLS.size}>Size</HeadCell>
        <HeadCell className={COLS.visibility}>Visibility</HeadCell>
        <HeadCell className={COLS.modified}>Modified</HeadCell>
        <span className="w-[24px] shrink-0" />
      </TableHead>

      {FILES.map((file) => (
        <TableRow key={file.path}>
          <span className="flex min-w-px flex-1 items-center gap-[10px]">
            <FileGlyph />
            <FileName path={file.path} />
          </span>
          <span className={`text-body text-text-main ${COLS.size}`}>{file.size}</span>
          <span className={COLS.visibility}>
            <Private />
          </span>
          <span className={`text-body text-text-main ${COLS.modified}`}>{file.modified}</span>
          <RowMenu />
        </TableRow>
      ))}
    </Scroller>
  );
}

function GridView() {
  return (
    <div className="grid w-full grid-cols-2 gap-[12px] pb-[16px] md:grid-cols-3 xl:grid-cols-4">
      {FILES.map((file) => (
        <div
          key={file.path}
          className="flex flex-col gap-[8px] rounded-main border border-border-main bg-bg-primary p-[10px] transition-colors hover:border-border-highlight"
        >
          <span className="flex aspect-[4/3] items-center justify-center rounded-small bg-bg-element-2">
            <FileGlyph size={24} />
          </span>
          <span className="flex items-center gap-[6px]">
            <FileName path={file.path} variant="tile" />
            <RowMenu />
          </span>
          <span className="flex items-center justify-between gap-[8px]">
            <span className="text-small-title text-text-secondary">{file.size}</span>
            <Private />
          </span>
        </div>
      ))}
    </div>
  );
}

const VIEWS = [
  { id: 'list' as const, icon: assets.viewList, label: 'List view' },
  { id: 'grid' as const, icon: assets.viewGrid, label: 'Grid view' },
];

/** The list/grid toggle, built on the Tab track so it matches the other switchers. */
function ViewSwitcher({ value, onChange }: { value: 'list' | 'grid'; onChange: (view: 'list' | 'grid') => void }) {
  return (
    <div className="flex h-[28px] shrink-0 items-center rounded-main border border-border-main bg-bg-element-2">
      {VIEWS.map((view) => {
        const selected = view.id === value;
        return (
          <button
            key={view.id}
            type="button"
            aria-pressed={selected}
            aria-label={view.label}
            onClick={() => onChange(view.id)}
            className={`flex h-[26px] w-[32px] shrink-0 items-center justify-center rounded-small transition-colors ${
              selected
                ? 'border border-border-highlight bg-bg-selected text-text-selected'
                : 'border border-transparent text-text-main hover:text-text-selected'
            }`}
          >
            <Icon src={view.icon} size={14} />
          </button>
        );
      })}
    </div>
  );
}

/** The Files section of the environment console — one card, header and all. */
export function FilesView() {
  const [view, setView] = useState<'list' | 'grid'>('list');

  return (
    <TableSection
      title="Files"
      actions={
        // Twice the section's usual action gap, so the switcher reads as a
        // control and the CTA as the action.
        <span className="flex items-center gap-[16px]">
          <ViewSwitcher value={view} onChange={setView} />
          <IconCta icon={<Icon src={assets.upload} size={14} />} label="Upload file" />
        </span>
      }
    >
      {view === 'list' ? <ListView /> : <GridView />}
    </TableSection>
  );
}
