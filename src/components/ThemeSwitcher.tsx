import { assets } from '../assets';
import { Icon } from './Icon';

export type Theme = 'dark' | 'bright';

const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: 'dark', label: 'Dark', icon: assets.themeDark },
  { id: 'bright', label: 'Bright', icon: assets.themeBright },
];

/**
 * Vertical twin of the Tab component, built from the same roles: the track
 * carries Border Main, the selected chip Bg Selected + Border Highlight. Both
 * chips reserve the same box, so switching never reflows the rail.
 */
export function ThemeSwitcher({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex w-[28px] shrink-0 flex-col items-center rounded-main border border-border-main bg-bg-element-2"
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
            className={`flex size-[26px] shrink-0 items-center justify-center rounded-small transition-colors ${
              active
                ? 'border border-border-highlight bg-bg-selected text-icon-selected'
                : 'border border-transparent text-icon-default hover:text-icon-selected'
            }`}
          >
            <Icon src={icon} />
          </button>
        );
      })}
    </div>
  );
}
