import { assets } from '../../assets';
import { Button } from '../Button';
import { BrandIcon, Icon } from '../Icon';
import { Dropdown } from '../Dropdown';
import { ThemeSwitcher, type Theme } from '../ThemeSwitcher';

export const DASH_SECTIONS = [
  { name: 'Dashboard', icon: assets.dashDashboard },
  { name: 'Team members', icon: assets.dashTeam },
  { name: 'Usage and plan', icon: assets.dashUsage },
  { name: 'Settings', icon: assets.dashSettings },
] as const;

export type DashSection = (typeof DASH_SECTIONS)[number]['name'];

function NavItem({
  label,
  icon,
  selected = false,
  onClick,
  width = 'w-full',
}: {
  label: string;
  icon: string;
  selected?: boolean;
  onClick?: () => void;
  width?: string;
}) {
  return (
    <button
      type="button"
      aria-current={selected}
      onClick={onClick}
      className={`flex h-[28px] ${width} shrink-0 items-center justify-between rounded-main px-[8px] transition-colors ${
        selected ? 'bg-bg-selected-2 text-text-selected' : 'text-text-main hover:bg-hover hover:text-text-selected'
      }`}
    >
      <span className="flex shrink-0 items-center gap-[6px]">
        <Icon src={icon} />
        <span className="text-h5 whitespace-nowrap">{label}</span>
      </span>
    </button>
  );
}

/** Figma "Frame 6" (1115:12866) — the account sidebar. */
export function DashboardSidebar({
  section,
  onSelect,
  theme,
  onThemeChange,
}: {
  section: DashSection;
  onSelect: (section: DashSection) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  return (
    <div className="flex h-full w-[201px] shrink-0 items-center px-[16px] pt-[12px] pb-[16px]">
      <div className="flex h-full w-[169px] shrink-0 flex-col items-start justify-between">
        <div className="flex shrink-0 flex-col items-start gap-[20px]">
          <div className="relative size-[28px] shrink-0 overflow-clip rounded-small bg-brand">
            <BrandIcon
              src={assets.logoMark}
              width={19}
              height={23}
              className="absolute top-[3px] left-[calc(50%+0.5px)] -translate-x-1/2"
            />
          </div>

          <div className="flex shrink-0 flex-col items-start gap-[24px]">
            <Dropdown
              panelWidth="w-[196px]"
              trigger={({ open, toggle }) => (
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={toggle}
                  className={`flex h-[32px] w-[164px] shrink-0 items-center justify-between rounded-main pr-[12px] pl-[4px] transition-colors ${
                    open ? 'bg-hover' : 'hover:bg-hover'
                  }`}
                >
                  <span className="flex shrink-0 items-center gap-[8px]">
                    <span className="flex size-[24.5px] shrink-0 items-center justify-center rounded-[7px] border border-[#a3dbaf] bg-[#ccffd7] text-[10.5px] leading-[14px] font-semibold text-[#20562c]">
                      VC
                    </span>
                    <span className="text-small-title whitespace-nowrap text-text-main">Vahan Co</span>
                  </span>
                  <Icon
                    src={assets.chevron16}
                    className={`text-icon transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            >
              {() => (
                // The switcher itself, not a pair of menu items — it is the same
                // control the builder rail carries, laid out for a menu row.
                <span className="flex items-center justify-between gap-[12px] px-[8px] py-[4px]">
                  <span className="text-h6 whitespace-nowrap text-text-main">Appearance</span>
                  <ThemeSwitcher theme={theme} onChange={onThemeChange} orientation="horizontal" />
                </span>
              )}
            </Dropdown>

            <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
              {DASH_SECTIONS.map((item) => (
                <NavItem
                  key={item.name}
                  label={item.name}
                  icon={item.icon}
                  selected={item.name === section}
                  onClick={() => onSelect(item.name)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start gap-[20px]">
          <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
            <NavItem label="Docs" icon={assets.dashDocs} width="w-[144px]" />
            <NavItem label="Discord" icon={assets.dashTeam} width="w-[144px]" />

            {/* Figma "Overlay" (1115:12889) — the usage / upgrade promo. */}
            <div className="flex w-full shrink-0 flex-col items-start rounded-[10.5px] border border-border-chat bg-bg-chat px-[12px] pt-[4px] pb-[12px]">
              <div className="flex w-full shrink-0 flex-col items-start gap-[7px]">
                <div className="flex w-full items-center justify-between">
                  <span className="text-[10px] leading-[15px] tracking-[0.25px] text-text-secondary uppercase">
                    Your usage
                  </span>
                  <span aria-hidden className="text-[14px] leading-[21px] text-text-main">
                    ›
                  </span>
                </div>
                <div className="flex w-full flex-col items-start gap-[4px]">
                  <span className="text-xs-title text-text-secondary">App builder</span>
                  <span className="text-h6 text-text-main">$0.00 / $200.00</span>
                </div>
                <Button variant="main" className="mt-[7px] w-full" icon={<Icon src={assets.zap} />}>
                  Upgrade
                </Button>
              </div>
            </div>
          </div>

          {/* Figma "Frame 79" (1115:12904) — the signed-in user row. */}
          <div className="flex h-[24px] w-full shrink-0 items-center justify-between rounded-main px-[4px]">
            <span className="flex shrink-0 items-center gap-[8px]">
              <span className="relative shrink-0">
                <img
                  src={assets.avatar}
                  alt=""
                  className="block size-[20px] rounded-full bg-[#303032] object-cover"
                />
                <span className="absolute -top-[8px] -right-[8px] flex size-[16px] items-center justify-center rounded-small bg-accent-bg-success text-small-title text-accent-success-text">
                  3
                </span>
              </span>
              <span className="text-body text-text-secondary">Vahan</span>
            </span>
            <button
              type="button"
              aria-label="Account settings"
              className="shrink-0 text-icon transition-colors hover:text-text-selected"
            >
              <Icon src={assets.dashGear} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
