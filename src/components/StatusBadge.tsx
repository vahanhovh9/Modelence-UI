import type { ReactNode } from 'react';

/** Figma component 1007:5906 — a status pill. */
export function StatusBadge({
  label = 'Active',
  tone = 'success',
  shape = 'square',
  icon,
}: {
  label?: string;
  tone?: 'success' | 'neutral';
  /** The top bar uses the file's 4px chip; cards use a pill. */
  shape?: 'square' | 'pill';
  /** Replaces the status dot where a glyph says more — a lock, say. */
  icon?: ReactNode;
}) {
  const isSuccess = tone === 'success';
  const skin = isSuccess ? 'border-accent-green-border bg-accent-badge-success' : 'border-border-secondary bg-bg-selected-2';
  const label_ = isSuccess ? 'text-accent-green-text' : 'text-text-secondary';
  const dot = isSuccess ? 'bg-accent-green-text' : 'bg-text-secondary';

  return (
    <span
      className={`flex h-[20px] shrink-0 items-center gap-[4px] rounded-small border ${
        shape === 'pill' ? 'px-[8px]' : 'px-[4px]'
      } ${skin}`}
    >
      {icon ?? <span aria-hidden className={`size-[6px] shrink-0 rounded-full ${dot}`} />}
      <span className={`text-small-title whitespace-nowrap ${label_}`}>{label}</span>
    </span>
  );
}
