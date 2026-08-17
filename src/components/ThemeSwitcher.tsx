import { assets } from '../assets';
import { MaskIcon } from './VectorIcon';

export type Theme = 'dark' | 'bright';

const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: 'dark', label: 'Dark', icon: assets.iconThemeDark },
  { id: 'bright', label: 'Bright', icon: assets.iconThemeBright },
];

/**
 * Vertical twin of the Web/Mobile/Dashboard switcher: the track's border is
 * drawn inside its box and the selected chip's outside, so the chip's outline
 * lands on the track edge. Both chips reserve the same box, so switching never
 * reflows the rail.
 */
export function ThemeSwitcher({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex w-[28px] shrink-0 flex-col items-center gap-[4px] rounded-[8px] bg-track py-px inset-ring-1 inset-ring-border"
    >
      {THEMES.map(({ id, label, icon }) => {
        const active = id === theme;
        return (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={`flex size-[26px] shrink-0 items-center justify-center rounded-[7px] transition-colors ${
              active
                ? 'bg-chip text-text ring-1 ring-border-chip'
                : 'text-text-faint hover:bg-hover hover:text-text-secondary'
            }`}
          >
            <MaskIcon src={icon} />
          </button>
        );
      })}
    </div>
  );
}
