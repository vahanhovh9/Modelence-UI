import { useState, type ReactNode } from 'react';
import { assets } from '../assets';
import type { Version } from '../version';
import { Dropdown, MenuItem } from './Dropdown';
import { Icon, maskStyle } from './Icon';
import { ThemeSwitcher, type Theme } from './ThemeSwitcher';

type Environment = { name: string; icon: ReactNode };

/**
 * Deployment pipeline order. The rail always renders this sequence, so an
 * environment added later lands in its proper slot rather than on the end.
 */
const CATALOG: Environment[] = [
  { name: 'Sandbox', icon: <Icon src={assets.sandbox} /> },
  { name: 'Staging', icon: <Icon src={assets.rocket} /> },
  { name: 'Prod', icon: <Icon src={assets.prod} /> },
  // Demo sits after Prod — a showcase target, not a pipeline stage.
  { name: 'Demo', icon: <Icon src={assets.play} /> },
];

const DEFAULT_ENVIRONMENTS = ['Sandbox', 'Prod'];

function Separator() {
  return (
    <div className="relative h-[16px] w-0 shrink-0 text-border-highlight">
      <div className="absolute inset-y-0 -inset-x-[0.5px]">
        <div
          aria-hidden
          className="size-full bg-current"
          style={maskStyle(assets.separator, { maskSize: '100% 100%', WebkitMaskSize: '100% 100%' })}
        />
      </div>
    </div>
  );
}

function EnvButton({ env, active, onSelect }: { env: Environment; active: boolean; onSelect: () => void }) {
  return (
    <div className="flex w-[36px] shrink-0 flex-col items-center gap-[4px]">
      <button
        type="button"
        aria-current={active}
        onClick={onSelect}
        // Uniform 28px across states so selecting never shifts the rail.
        // Text colour drives the icon, which is drawn as a mask.
        className={`flex size-[28px] shrink-0 items-center justify-center rounded-main p-[6px] transition-colors ${
          active
            ? 'border border-border-highlight bg-bg-selected text-icon-selected'
            : 'border border-transparent text-icon-default hover:bg-hover hover:text-icon-selected'
        }`}
      >
        {env.icon}
      </button>
      <span
        className={`w-full text-center text-[9px] whitespace-nowrap ${
          active ? 'text-text-selected' : 'text-text-main'
        }`}
      >
        {env.name}
      </span>
    </div>
  );
}

export function EnvironmentRail({
  theme,
  onThemeChange,
  version,
  active,
  onActiveChange,
  onToggleVersion,
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  version: Version;
  active: string;
  onActiveChange: (name: string) => void;
  onToggleVersion: () => void;
}) {
  const isV2 = version === 'v2';
  const [installed, setInstalled] = useState<string[]>(DEFAULT_ENVIRONMENTS);
  const setActive = onActiveChange;

  const environments = CATALOG.filter((env) => installed.includes(env.name));
  const remaining = CATALOG.filter((env) => !installed.includes(env.name));

  return (
    <nav
      aria-label="Environment"
      // The agent column stops short of the bottom, so the rail adds that to
      // its own inset — both ends then sit level with the panel's edges.
      className={`flex shrink-0 flex-col items-center justify-between self-stretch ${
        isV2 ? 'w-[54px] px-[8px] pt-[13px] pb-[13px]' : 'w-[56px] px-[8px] pt-[8px] pb-[16px]'
      }`}
    >
      <div className="flex w-[36px] shrink-0 flex-col items-center gap-[8px]">
        {environments.map((env, index) => (
          <div key={env.name} className="flex w-full flex-col items-center gap-[8px]">
            {index > 0 && <Separator />}
            <EnvButton env={env} active={env.name === active} onSelect={() => setActive(env.name)} />
          </div>
        ))}

        <>
          <Separator />
            <Dropdown
              panelWidth="w-[152px]"
              trigger={({ open, toggle }) => (
                <button
                  type="button"
                  aria-label="Add environment"
                  aria-expanded={open}
                  onClick={toggle}
                  className={`flex size-[32px] shrink-0 items-center justify-center rounded-main p-[6px] transition-colors ${
                    open ? 'bg-bg-selected text-icon-selected' : 'text-icon-default hover:bg-hover hover:text-icon-selected'
                  }`}
                >
                  <Icon src={assets.plus} />
                </button>
              )}
            >
              {({ close }) => (
                <>
                  {remaining.map((env) => (
                    <MenuItem
                      key={env.name}
                      label={env.name}
                      icon={
                        <span className="flex size-[16px] shrink-0 items-center justify-center text-icon-default">
                          {env.icon}
                        </span>
                      }
                      onClick={() => {
                        setInstalled((prev) => [...prev, env.name]);
                        setActive(env.name);
                        close();
                      }}
                    />
                  ))}
                  {remaining.length > 0 && <span className="my-[2px] h-px w-full bg-border-main" />}
                  <MenuItem
                    label={version === 'v1' ? 'Switch to layout 2' : 'Switch to layout 1'}
                    icon={
                      <span className="flex size-[16px] shrink-0 items-center justify-center text-icon-default">
                        <Icon src={assets.expand} size={12} />
                      </span>
                    }
                    onClick={() => {
                      onToggleVersion();
                      close();
                    }}
                  />
                </>
              )}
            </Dropdown>
        </>
      </div>

      <ThemeSwitcher theme={theme} onChange={onThemeChange} />
    </nav>
  );
}
