import type { ReactNode } from 'react';

/**
 * Figma component 1007:5906 — a status pill.
 *
 * The chip is reserved for the Prod header, where it has to hold its own
 * against the top bar's chrome. Everywhere else a status is a dot and a label
 * on Text main — see StatusDot below.
 */
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

type Tone = 'success' | 'neutral' | 'accent' | 'pending';

/*
 * Pending is the one that is drawn rather than filled: a ring reads as
 * something not yet done, where a solid dot reads as a state it has reached.
 */
const DOT: Record<Tone, string> = {
  success: 'bg-accent-green-text',
  neutral: 'bg-text-secondary',
  accent: 'bg-button-main-bg',
  pending: 'border border-text-secondary',
};

/**
 * A status as a dot and a label, with no chip around it.
 *
 * This is the default: inside a table or a card a status is a fact about the
 * row, and a fill around it only adds weight. The dot carries the meaning and
 * the label stays on Text main like the rest of the row.
 */
export function StatusDot({
  label,
  tone = 'success',
  icon,
}: {
  label: string;
  tone?: Tone;
  /** Replaces the dot where a glyph says more — a lock, say. */
  icon?: ReactNode;
}) {
  return (
    <span className="flex shrink-0 items-center gap-[6px]">
      {icon ?? <span aria-hidden className={`size-[6px] shrink-0 rounded-full ${DOT[tone]}`} />}
      <span className="text-body whitespace-nowrap text-text-main">{label}</span>
    </span>
  );
}
