import { assets } from '../assets';
import { Icon } from './Icon';

export type Theme = 'dark' | 'bright';

const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: 'dark', label: 'Dark', icon: assets.themeDark },
  { id: 'bright', label: 'Bright', icon: assets.themeBright },
];

/**
 * Twin of the Tab component, built from the same roles: the track carries
 * Border Main, the selected chip Bg Selected + Border Highlight. As there, the
 * chip is the full size of the track and is pulled out by its 1px border, so it
 * stands on the switcher rather than sitting inset within it. Both chips
 * reserve the same box, so switching never reflows the rail.
 */
export function ThemeSwitcher({
  theme,
  onChange,
  orientation = 'vertical',
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
  /** The rail stacks them; a header row lays them side by side. */
  orientation?: 'vertical' | 'horizontal';
}) {
  const vertical = orientation === 'vertical';
  return (
    <div
      role="group"
      aria-label="Theme"
      className={`flex shrink-0 items-center rounded-main border border-border-main bg-bg-element-2 ${
        vertical ? 'w-[28px] flex-col' : 'h-[28px]'
      }`}
    >
      {THEMES.map(({ id, label, icon }, index) => {
        const active = id === theme;
        const first = index === 0;
        return (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={`flex size-[28px] shrink-0 items-center justify-center rounded-main border transition-colors ${
              vertical ? `-mx-px ${first ? '-mt-px' : '-mb-px'}` : `-my-px ${first ? '-ml-px' : '-mr-px'}`
            } ${
              active
                ? 'border-border-highlight bg-bg-selected text-icon-selected'
                : 'border-transparent text-icon-default hover:text-icon-selected'
            }`}
          >
            <Icon src={icon} />
          </button>
        );
      })}
    </div>
  );
}
