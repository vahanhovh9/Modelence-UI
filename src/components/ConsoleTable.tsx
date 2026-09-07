import type { ReactNode } from 'react';

/*
 * The shell every console table shares: a header strip carrying the section
 * name and its actions, then rules-only rows. There is no card fill or border
 * — the table sits directly on the pane — so these pieces exist to keep the
 * header, the column row and the data rows on one grid.
 */

export function TableSection({
  title,
  actions,
  children,
}: {
  title: string;
  /** Buttons and switchers, right-aligned against the title. */
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="w-full">
      {/*
        The bar is full-bleed: it carries its own horizontal padding so its rule
        can run the whole width of the pane. A header inset to the content
        column reads as the first row of the table; this reads as chrome.
        It sticks to the top of the scrolling pane, so the section you are in
        stays named however far down the table you are — which means it needs a
        fill of its own, or rows would show through it.
      */}
      <div className="sticky top-0 z-30 flex h-[52px] shrink-0 items-center justify-between gap-[12px] border-b border-border-main bg-bg-container px-[20px]">
        <h2 className="text-h1 text-text-selected">{title}</h2>
        {actions && <div className="flex shrink-0 items-center gap-[8px]">{actions}</div>}
      </div>
      <div className="flex flex-col items-start px-[20px] pt-[12px] pb-[16px]">{children}</div>
    </div>
  );
}

/**
 * A section's key action, reduced to its glyph. The label rides underneath on
 * hover and on keyboard focus rather than inside the button, so the bar stays
 * quiet — and because it is positioned out of flow, revealing it never nudges
 * the controls beside it.
 */
export function IconCta({
  icon,
  label,
  variant = 'primary',
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  /**
   * Primary for the section's key action, secondary for the ones beside it.
   * Both are solid fills — the weight of the fill is what separates them.
   */
  variant?: 'primary' | 'secondary';
}) {
  return (
    <span className="group/cta relative flex shrink-0">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={`flex size-[26px] shrink-0 items-center justify-center rounded-full transition-colors ${
          variant === 'primary'
            ? 'bg-button-primary-bg text-button-primary-text hover:opacity-90'
            : 'bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover'
        }`}
      >
        {icon}
      </button>
      <span
        aria-hidden
        className="text-small-title pointer-events-none absolute top-full right-0 z-20 mt-[6px] rounded-small border border-border-main bg-bg-primary px-[8px] py-[4px] whitespace-nowrap text-text-primary opacity-0 transition-opacity duration-150 group-hover/cta:opacity-100 group-focus-within/cta:opacity-100 motion-reduce:transition-none"
      >
        {label}
      </span>
    </span>
  );
}

/** Keeps columns aligned on a narrow pane by scrolling rather than collapsing. */
export function Scroller({ min, children }: { min: string; children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className={min}>{children}</div>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-[16px] border-b border-border-main py-[10px]">{children}</div>;
}

export function HeadCell({ className = '', children }: { className?: string; children: ReactNode }) {
  return <span className={`text-h6 text-text-selected ${className}`}>{children}</span>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-[16px] border-b border-border-secondary py-[11px] transition-colors last:border-b-0 hover:text-text-selected">
      {children}
    </div>
  );
}
