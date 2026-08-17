import { useState } from 'react';
import { assets } from '../assets';
import { VectorIcon, icons } from './VectorIcon';

const TARGETS = ['Web', 'Mobile app', 'Dashboard'] as const;

function LogoTile() {
  return (
    <button
      type="button"
      aria-label="Home"
      className="relative size-[28px] shrink-0 overflow-clip rounded-(--radius-small) bg-purple-brand transition-[filter] hover:brightness-125"
    >
      <img
        src={assets.logoMark}
        alt=""
        className="absolute top-[3px] left-[calc(50%+0.5px)] block h-[23px] w-[19px] max-w-none -translate-x-1/2"
      />
    </button>
  );
}

function ProjectSwitcher() {
  return (
    <button
      type="button"
      className="-mx-[4px] flex h-[20px] shrink-0 items-center gap-[6px] rounded-(--radius-small) px-[4px] transition-colors hover:bg-white/10"
    >
      <span className="flex size-[20px] shrink-0 items-center justify-center rounded-[8px] bg-accent-green text-[9px] font-semibold text-white">
        PD
      </span>
      <span className="flex shrink-0 items-end gap-[2px]">
        <span className="text-[13px] font-medium whitespace-nowrap text-white">Product design diary</span>
        <VectorIcon {...icons.chevronDown12} className="-top-[4px]" />
      </span>
    </button>
  );
}

/**
 * The track's border is drawn inside its box (inset ring) while the selected
 * chip's is drawn outside its box (outset ring), so the chip's outline lands
 * exactly on the track edge rather than nesting one pixel inside it.
 */
function TargetTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-[28px] shrink-0 items-center gap-[4px] rounded-[8px] bg-black pr-[6px] pl-px inset-ring-1 inset-ring-grey-700">
      {TARGETS.map((target, index) => {
        const isActive = index === active;
        return (
          <button
            key={target}
            type="button"
            onClick={() => setActive(index)}
            className={
              isActive
                ? 'flex h-[26px] shrink-0 items-center justify-center rounded-[7px] bg-grey-750 px-[14px] text-[12px] font-medium whitespace-nowrap text-white ring-1 ring-grey-500 transition-colors hover:bg-grey-700'
                : `flex h-[20px] shrink-0 items-center justify-center rounded-[8px] px-[8px] text-[12px] font-medium whitespace-nowrap text-grey-200 transition-colors hover:bg-white/10 hover:text-white ${
                    index === active + 1 ? 'pl-[14px]' : ''
                  }`
            }
          >
            {target}
          </button>
        );
      })}
    </div>
  );
}

function PageSelector() {
  return (
    <button
      type="button"
      className="flex h-[28px] w-[193px] shrink-0 items-center justify-between rounded-[8px] border border-grey-700 bg-black px-[12px] transition-colors hover:border-grey-500 hover:bg-grey-900"
    >
      <VectorIcon {...icons.refresh} />
      <span className="flex h-[20px] items-center justify-center rounded-[8px] px-[8px] text-[12px] font-medium whitespace-nowrap text-grey-200">
        Homepage
      </span>
      <VectorIcon {...icons.chevronDown16} />
    </button>
  );
}

export function TopBar() {
  return (
    <header className="flex w-full shrink-0 flex-col items-start overflow-clip px-[12px] py-[10px]">
      <div className="flex w-full items-center justify-between px-[3px]">
        <div className="flex w-[729px] shrink-0 items-center gap-[123px]">
          <div className="flex shrink-0 items-center gap-[22px]">
            <LogoTile />
            <ProjectSwitcher />
          </div>
          <TargetTabs />
        </div>

        <div className="flex w-[304px] shrink-0 items-center gap-[12px]">
          <PageSelector />
          {/* Negative margin cancels the padding, so the hover target grows without moving the icon. */}
          <button
            type="button"
            aria-label="Open preview in a new tab"
            className="-m-[6px] shrink-0 rounded-(--radius-small) p-[6px] transition-colors hover:bg-white/10"
          >
            <VectorIcon {...icons.externalLink} />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-[8px]">
          <button
            type="button"
            className="flex h-[26px] shrink-0 items-center justify-center gap-[4px] rounded-[48px] bg-grey-780 px-[12px] transition-colors hover:bg-grey-500"
          >
            <VectorIcon {...icons.zapUpgrade} />
            <span className="text-[12px] font-semibold whitespace-nowrap text-grey-200">Upgrade</span>
          </button>
          <button
            type="button"
            className="flex h-[26px] w-[84px] shrink-0 items-center justify-center rounded-[48px] border border-white/40 bg-lavender-300 text-[12px] font-semibold whitespace-nowrap text-black transition-colors hover:border-white/60 hover:bg-[#e1cfff]"
          >
            Publish
          </button>
        </div>
      </div>
    </header>
  );
}
