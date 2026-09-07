import { assets } from '../assets';
import { Icon } from './Icon';

/** Figma "menu" (728:3802) — the 162px console nav beside the detail pane. */
export const PROD_SECTIONS = [
  { name: 'Environment', icon: assets.navEnvironment },
  { name: 'Deployments', icon: assets.navDeployments, dot: true },
  { name: 'Code', icon: assets.navCode },
  { name: 'Files', icon: assets.navFiles },
  { name: 'Configurations', icon: assets.navConfig },
  { name: 'Users', icon: assets.navUsers },
  { name: 'Database', icon: assets.navDatabase },
  { name: 'Monitoring', icon: assets.navMonitoring },
  { name: 'Alerts', icon: assets.navAlerts },
  { name: 'Logs', icon: assets.navLogs },
  { name: 'AI', icon: assets.navAi },
] as const;

export type ProdSection = (typeof PROD_SECTIONS)[number]['name'];
export type ConsoleItem = { name: ProdSection; icon: string; dot?: boolean };

/**
 * Sandbox runs the same console, minus the two sections that only mean
 * something once an environment is deployed.
 */
export const SANDBOX_SECTIONS: readonly ConsoleItem[] = PROD_SECTIONS.filter(
  (section) => section.name !== 'Environment' && section.name !== 'Deployments'
);

export function ProdMenu({
  sections = PROD_SECTIONS,
  label = 'Environment sections',
  active,
  onSelect,
}: {
  sections?: readonly ConsoleItem[];
  label?: string;
  active: ProdSection;
  onSelect: (section: ProdSection) => void;
}) {
  return (
    <nav
      aria-label={label}
      className="flex h-full w-[162px] shrink-0 flex-col items-start gap-[8px] rounded-l-block border border-border-main bg-bg-container p-[8px]"
    >
      {sections.map((section) => {
        const selected = section.name === active;
        return (
          <button
            key={section.name}
            type="button"
            aria-current={selected}
            onClick={() => onSelect(section.name)}
            className={`flex h-[28px] w-full shrink-0 items-center justify-between rounded-main px-[8px] transition-colors ${
              selected
                ? 'bg-bg-selected-2 text-text-selected'
                : 'text-text-main hover:bg-hover hover:text-text-selected'
            }`}
          >
            <span className="flex shrink-0 items-center gap-[6px]">
              <Icon src={section.icon} />
              <span className="text-h5 whitespace-nowrap">{section.name}</span>
            </span>
            {section.dot && (
              <span aria-hidden className="size-[6px] shrink-0 rounded-full bg-accent-bg-success" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
