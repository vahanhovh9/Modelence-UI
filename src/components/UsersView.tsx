import { useEffect, useRef, useState } from 'react';
import { assets } from '../assets';
import { HeadCell, IconCta, Scroller, TableHead, TableRow, TableSection } from './ConsoleTable';
import { MoreDots } from './Dropdown';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';

type User = {
  id: string;
  handle: string;
  email: string;
  verified: boolean;
  methods: string[];
  roles: string[];
  created: string;
};

const USERS: User[] = [
  {
    id: '13fef3',
    handle: 'demo@modelence.dev',
    email: 'demo@modelence.dev',
    verified: true,
    methods: ['Password'],
    roles: [],
    created: 'Jul 14, 2026',
  },
  {
    id: '8a21c0',
    handle: 'alex',
    email: 'alex@modelence.dev',
    verified: true,
    methods: ['Google'],
    roles: ['Admin'],
    created: 'Jul 18, 2026',
  },
  {
    id: 'c47b19',
    handle: 'priya',
    email: 'priya@northwind.io',
    verified: true,
    methods: ['Password', 'Google'],
    roles: ['Editor'],
    created: 'Jul 22, 2026',
  },
  {
    id: '2ee905',
    handle: 'sam',
    email: 'sam@northwind.io',
    verified: false,
    methods: ['Password'],
    roles: [],
    created: 'Aug 2, 2026',
  },
  {
    id: 'f01d7a',
    handle: 'jordan',
    email: 'jordan@acme.co',
    verified: true,
    methods: ['GitHub'],
    roles: ['Viewer'],
    created: 'Aug 9, 2026',
  },
];

/**
 * An auth method, stripped to a dot and its name. A method is a fact about the
 * account rather than a status, so it does not need a chip around it — the dot
 * is enough to separate two of them.
 */
function Method({ name }: { name: string }) {
  return (
    <span className="flex shrink-0 items-center gap-[5px]">
      <span aria-hidden className="size-[6px] shrink-0 rounded-full bg-button-main-bg" />
      <span className="text-body whitespace-nowrap text-text-main">{name}</span>
    </span>
  );
}

const COLS = {
  id: 'w-[128px] shrink-0',
  methods: 'w-[168px] shrink-0',
  roles: 'w-[104px] shrink-0',
  created: 'w-[112px] shrink-0',
};

/**
 * Search, as one control in two states. Closed it is the same 26px circle as
 * the action beside it; open, it grows leftward into a field and the input
 * fades in behind it. It is a single element throughout — the circle becomes
 * the bar rather than handing off to one — so the glyph never jumps.
 *
 * Growing leftward is what keeps the rest of the bar still: the actions are
 * right-anchored, so the extra width is taken from the empty space on the left.
 */
function SearchControl({
  open,
  onToggle,
  onClose,
  value,
  onChange,
  boxRef,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  boxRef: React.RefObject<HTMLDivElement | null>;
}) {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  return (
    <div
      ref={boxRef}
      className={`group/search relative flex h-[26px] shrink-0 items-center overflow-hidden bg-button-secondary-bg transition-all duration-300 ease-out motion-reduce:transition-none ${
        open ? 'w-[280px] gap-[6px] rounded-main pr-[4px] pl-[6px]' : 'w-[26px] rounded-full'
      }`}
    >
      <button
        type="button"
        aria-label="Search users"
        aria-expanded={open}
        onClick={onToggle}
        className="flex size-[24px] shrink-0 items-center justify-center rounded-full text-button-secondary-text transition-colors hover:text-text-selected"
      >
        <Icon src={assets.search} size={14} />
      </button>

      <input
        ref={input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by handle or email..."
        tabIndex={open ? 0 : -1}
        className={`text-body min-w-px flex-1 bg-transparent text-text-primary outline-none transition-opacity duration-200 placeholder:text-text-secondary motion-reduce:transition-none ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-small text-icon-default transition-opacity hover:bg-hover hover:text-icon-selected motion-reduce:transition-none ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <Icon src={assets.close} size={11} />
      </button>

      {/* The label only makes sense while the glyph stands alone. */}
      <span
        aria-hidden
        className={`text-small-title pointer-events-none absolute top-full right-0 z-20 mt-[6px] rounded-small border border-border-main bg-bg-primary px-[8px] py-[4px] whitespace-nowrap text-text-primary opacity-0 transition-opacity duration-150 motion-reduce:transition-none ${
          open ? '' : 'group-hover/search:opacity-100'
        }`}
      >
        Search users
      </span>
    </div>
  );
}

export function UsersView() {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searching) return;

    const close = () => {
      setSearching(false);
      setQuery('');
    };
    const onPointerDown = (event: PointerEvent) => {
      if (field.current?.contains(event.target as Node)) return;
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [searching]);

  const needle = query.trim().toLowerCase();
  const shown = needle
    ? USERS.filter((user) => `${user.handle} ${user.email}`.toLowerCase().includes(needle))
    : USERS;

  return (
    <TableSection
      title="Users"
      actions={
        <>
          <SearchControl
            open={searching}
            onToggle={() => setSearching((value) => !value)}
            onClose={() => {
              setSearching(false);
              setQuery('');
            }}
            value={query}
            onChange={setQuery}
            boxRef={field}
          />
          <IconCta
            icon={<Icon src={assets.dashSettings} size={14} />}
            label="Auth providers"
            variant="secondary"
          />
        </>
      }
    >
      <Scroller min="min-w-[880px]">
        <TableHead>
          <HeadCell className={COLS.id}>ID</HeadCell>
          <HeadCell className="min-w-px flex-1">Handle</HeadCell>
          <HeadCell className="min-w-px flex-1">Email</HeadCell>
          <HeadCell className={COLS.methods}>Auth Methods</HeadCell>
          <HeadCell className={COLS.roles}>Roles</HeadCell>
          <HeadCell className={COLS.created}>Created</HeadCell>
          <span className="w-[24px] shrink-0" />
        </TableHead>

        {shown.map((user) => (
          <TableRow key={user.id}>
            <span className={`flex items-center gap-[6px] ${COLS.id}`}>
              <span
                aria-hidden
                className="flex size-[20px] shrink-0 items-center justify-center rounded-small text-icon-default"
              >
                <Icon src={assets.copy} size={13} />
              </span>
              <span className="font-mono-code text-[12px] text-text-primary" title={user.id}>
                …{user.id}
              </span>
            </span>

            <span className="text-body min-w-px flex-1 truncate font-semibold text-text-primary">{user.handle}</span>

            <span className="flex min-w-px flex-1 items-center gap-[8px]">
              <span className="text-body min-w-px truncate text-text-main">{user.email}</span>
              {user.verified ? (
                <StatusBadge label="Verified" />
              ) : (
                <StatusBadge label="Unverified" tone="neutral" />
              )}
            </span>

            <span className={`flex flex-wrap items-center gap-[12px] ${COLS.methods}`}>
              {user.methods.map((method) => (
                <Method key={method} name={method} />
              ))}
            </span>

            <span className={COLS.roles}>
              {user.roles.length > 0 ? (
                <span className="text-body truncate text-text-main">{user.roles.join(', ')}</span>
              ) : (
                <span className="text-body text-text-secondary italic">No roles</span>
              )}
            </span>

            <span className={`text-body text-text-main ${COLS.created}`}>{user.created}</span>

            <span className="flex size-[24px] shrink-0 items-center justify-center rounded-small text-icon-default transition-colors hover:bg-hover hover:text-icon-selected">
              <MoreDots />
            </span>
          </TableRow>
        ))}

        {shown.length === 0 && (
          <div className="flex w-full items-center justify-center py-[28px]">
            <p className="text-body text-text-secondary">No users match “{query.trim()}”</p>
          </div>
        )}
      </Scroller>
    </TableSection>
  );
}
