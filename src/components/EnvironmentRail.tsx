import { useState, type ReactNode } from 'react';
import { assets } from '../assets';
import type { Version } from '../version';
import { Dropdown, MenuItem } from './Dropdown';
import { ThemeSwitcher, type Theme } from './ThemeSwitcher';
import { MaskIcon, VectorIcon, icons, maskStyle } from './VectorIcon';

type Environment = { name: string; icon: ReactNode };

/**
 * Deployment pipeline order. The rail always renders this sequence, so an
 * environment added later lands in its proper slot rather than on the end.
 */
const CATALOG: Environment[] = [
  { name: 'Sandbox', icon: <VectorIcon {...icons.box} /> },
  { name: 'Staging', icon: <MaskIcon src={assets.iconRocket} /> },
  { name: 'Prod', icon: <VectorIcon {...icons.zapRail} /> },
  // Demo sits after Prod — a showcase target, not a pipeline stage.
  { name: 'Demo', icon: <MaskIcon src={assets.iconPlay} /> },
];

const DEFAULT_ENVIRONMENTS = ['Sandbox', 'Prod'];

function Separator() {
  return (
    // #656565 in both themes — the value Figma ships for the dashed rule in the
    // dark and bright frames alike. Tying it to a border token washed it out on
    // the light background.
    <div className="relative h-[20px] w-0 shrink-0 text-text-faint">
      <div className="absolute inset-y-0 -inset-x-[0.5px]">
        <div
          aria-hidden
          className="size-full bg-current"
          style={maskStyle(assets.railSeparator, { maskSize: '100% 100%', WebkitMaskSize: '100% 100%' })}
        />
      </div>
    </div>
  );
}

function EnvButton({ env, active, onSelect }: { env: Environment; active: boolean; onSelect: () => void }) {
  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-[4px]">
      <button
        type="button"
        aria-current={active}
        onClick={onSelect}
        // Uniform 28px across states so selecting never shifts the rail.
        // Text colour drives the icon, which is drawn as a mask.
        className={`flex size-[28px] shrink-0 items-center justify-center rounded-[8px] p-[6px] transition-colors ${
          active
            ? 'bg-control text-text hover:bg-control-hover'
            : 'text-text-faint hover:bg-hover hover:text-text-secondary'
        }`}
      >
        {env.icon}
      </button>
      <span
        className={`w-full text-center text-[9px] whitespace-nowrap ${
          active ? 'text-text-secondary' : 'text-text-faint'
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
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  version: Version;
}) {
  const isV2 = version === 'v2';
  const [installed, setInstalled] = useState<string[]>(DEFAULT_ENVIRONMENTS);
  const [active, setActive] = useState('Sandbox');

  const environments = CATALOG.filter((env) => installed.includes(env.name));
  const remaining = CATALOG.filter((env) => !installed.includes(env.name));

  return (
    <nav
      aria-label="Environment"
      // The agent column stops 12px short of the bottom, so the rail adds that
      // to its own 8px inset (20px total). Both ends then sit 8px inside the
      // agent panel's edges.
      className={`flex shrink-0 flex-col items-center justify-between self-stretch ${
        isV2 ? 'w-[54px] px-[8px] pt-[13px] pb-[13px]' : 'w-[56px] px-[8px] pt-[8px] pb-[20px]'
      }`}
    >
      <div className="flex w-[36px] shrink-0 flex-col items-center gap-[4px]">
        {environments.map((env, index) => (
          <div key={env.name} className="flex w-full flex-col items-center gap-[4px]">
            {index > 0 && <Separator />}
            <EnvButton env={env} active={env.name === active} onSelect={() => setActive(env.name)} />
          </div>
        ))}

        {/* Nothing left to add — the control and its separator drop away. */}
        {remaining.length > 0 && (
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
                  className={`flex size-[28px] shrink-0 items-center justify-center rounded-[8px] p-[6px] transition-colors ${
                    open ? 'bg-control text-text' : 'text-text-faint hover:bg-hover hover:text-text-secondary'
                  }`}
                >
                  <VectorIcon {...icons.plus} />
                </button>
              )}
            >
              {({ close }) =>
                remaining.map((env) => (
                  <MenuItem
                    key={env.name}
                    label={env.name}
                    icon={
                      <span className="flex size-[16px] shrink-0 items-center justify-center text-text-secondary">
                        {env.icon}
                      </span>
                    }
                    onClick={() => {
                      setInstalled((prev) => [...prev, env.name]);
                      setActive(env.name);
                      close();
                    }}
                  />
                ))
              }
            </Dropdown>
          </>
        )}
      </div>

      <ThemeSwitcher theme={theme} onChange={onThemeChange} />
    </nav>
  );
}
