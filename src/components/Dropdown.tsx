import { useEffect, useRef, useState, type ReactNode } from 'react';
import { assets } from '../assets';
import { Icon } from './Icon';

type Placement = 'bottom-start' | 'bottom-end' | 'top-start';

const PLACEMENT: Record<Placement, string> = {
  'bottom-start': 'top-full left-0 mt-[6px]',
  'bottom-end': 'top-full right-0 mt-[6px]',
  'top-start': 'bottom-full left-0 mb-[6px]',
};

/**
 * Click-to-open menu that closes on outside pointer-down or Escape. Trigger and
 * contents are render props so each site keeps its own markup from the design.
 */
export function Dropdown({
  placement = 'bottom-start',
  panelWidth = 'min-w-[168px]',
  panelClassName,
  trigger,
  children,
}: {
  placement?: Placement;
  panelWidth?: string;
  /** Replaces the default menu skin, for popovers that are not lists. */
  panelClassName?: string;
  trigger: (state: { open: boolean; toggle: () => void }) => ReactNode;
  children: (state: { close: () => void }) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={root} className="relative shrink-0">
      {trigger({ open, toggle: () => setOpen((value) => !value) })}
      {open && (
        <div
          role="menu"
          className={`absolute z-50 ${PLACEMENT[placement]} ${panelWidth} ${
            panelClassName ??
            'flex flex-col gap-[2px] rounded-block border border-border-highlight bg-bg-container p-[4px]'
          }`}
          // Shadow tracks the theme rather than always being black-on-black.
          style={{ boxShadow: '0 16px 40px color-mix(in srgb, var(--color-bg-canvas) 65%, transparent)' }}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  label,
  icon,
  selected = false,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex h-[28px] w-full shrink-0 items-center gap-[8px] rounded-small px-[8px] transition-colors hover:bg-hover"
    >
      {icon}
      <span
        className={`flex-1 text-left text-h6 whitespace-nowrap ${
          selected ? 'text-text-selected' : 'text-text-main'
        }`}
      >
        {label}
      </span>
      {selected && (
        <span className="text-green-300">
          <Icon src={assets.check} />
        </span>
      )}
    </button>
  );
}

/** Three dots — a shape, not an icon glyph, so it is drawn rather than exported. */
export function MoreDots() {
  return (
    <span aria-hidden className="flex items-center gap-[2px]">
      {[0, 1, 2].map((dot) => (
        <span key={dot} className="size-[3px] rounded-full bg-current" />
      ))}
    </span>
  );
}

/** Small initials badge used by the project menu. */
export function ProjectBadge({ initials, tone }: { initials: string; tone: string }) {
  return (
    <span
      className={`flex size-[20px] shrink-0 items-center justify-center rounded-main text-[9px] font-semibold text-grey-0 ${tone}`}
    >
      {initials}
    </span>
  );
}
