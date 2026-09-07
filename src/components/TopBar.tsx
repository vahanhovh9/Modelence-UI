import { useState } from 'react';
import { assets } from '../assets';
import type { Version } from '../version';
import { Button } from './Button';
import { Dropdown, MenuItem, ProjectBadge } from './Dropdown';
import { PublishPopover } from './PublishPopover';
import { StatusBadge } from './StatusBadge';
import { BrandIcon, Icon } from './Icon';
import { Tab } from './Tab';

const TARGETS = ['Web', 'Mobile app', 'Dashboard'] as const;
type Target = (typeof TARGETS)[number];

const PROJECTS = [
  { name: 'Product design diary', initials: 'PD', tone: 'bg-green-300' },
  { name: 'Marketing site', initials: 'MS', tone: 'bg-[#0a84ff]' },
  { name: 'Internal tools', initials: 'IT', tone: 'bg-[#ff9f0a]' },
];

const PAGES = ['Homepage', 'Pricing', 'Changelog', 'Blog', 'Settings'];

function LogoTile({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpenDashboard}
      title="Account dashboard"
      aria-label="Open account dashboard"
      className="relative size-[28px] shrink-0 overflow-clip rounded-small bg-brand transition-[filter] hover:brightness-125 active:brightness-90"
    >
      <BrandIcon
        src={assets.logoMark}
        width={19}
        height={23}
        className="absolute top-[3px] left-[calc(50%+0.5px)] -translate-x-1/2"
      />
    </button>
  );
}

function ProjectSwitcher() {
  const [current, setCurrent] = useState(PROJECTS[0]);

  return (
    <Dropdown
      panelWidth="w-[214px]"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="-mx-[4px] flex h-[20px] shrink-0 items-center gap-[6px] rounded-small px-[4px] text-text-selected transition-colors hover:bg-hover"
        >
          <ProjectBadge initials={current.initials} tone={current.tone} />
          <span className="flex shrink-0 items-end gap-[2px]">
            <span className="text-[13px] font-medium whitespace-nowrap">{current.name}</span>
            <Icon
              src={assets.chevron12}
              size={12}
              className={`relative -top-[2px] transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
      )}
    >
      {({ close }) =>
        PROJECTS.map((project) => (
          <MenuItem
            key={project.name}
            label={project.name}
            selected={project.name === current.name}
            icon={<ProjectBadge initials={project.initials} tone={project.tone} />}
            onClick={() => {
              setCurrent(project);
              close();
            }}
          />
        ))
      }
    </Dropdown>
  );
}

/** Figma component "Dropdown" (886:5280) — w-164, radius main, padding 12. */
function PageSelector({ reloading, onReload }: { reloading: boolean; onReload: () => void }) {
  const [page, setPage] = useState(PAGES[0]);

  return (
    <Dropdown
      panelWidth="w-[164px]"
      trigger={({ open, toggle }) => (
        // A div, not a button — the reload control nests inside it.
        <div
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={toggle}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              toggle();
            }
          }}
          className="flex h-[28px] w-[164px] shrink-0 cursor-pointer items-center justify-between rounded-main border border-border-main bg-bg-element-2 px-[12px] text-text-main transition-colors hover:border-border-highlight"
        >
          <button
            type="button"
            aria-label="Reload preview"
            onClick={(event) => {
              event.stopPropagation();
              onReload();
            }}
            // Negative margin cancels the padding, so the hover target grows
            // without moving the icon.
            className="-m-[6px] shrink-0 rounded-small p-[6px] transition-colors hover:bg-hover"
          >
            <Icon src={assets.refresh} size={12} className={reloading ? 'animate-spin' : ''} />
          </button>
          <span className="text-h6 whitespace-nowrap">{page}</span>
          <Icon
            src={assets.chevron16}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      )}
    >
      {({ close }) =>
        PAGES.map((name) => (
          <MenuItem
            key={name}
            label={name}
            selected={name === page}
            onClick={() => {
              setPage(name);
              close();
              // Switching pages re-renders the preview, same as hitting reload.
              if (name !== page) onReload();
            }}
          />
        ))
      }
    </Dropdown>
  );
}

export function TopBar({
  version,
  reloading,
  onReload,
  onOpenDashboard,
  publish,
  mode = 'builder',
  target,
  onTargetChange,
}: {
  version: Version;
  reloading: boolean;
  onReload: () => void;
  onOpenDashboard: () => void;
  publish: React.ComponentProps<typeof PublishPopover>;
  /** Prod swaps the build controls for a status badge and a single action. */
  mode?: 'builder' | 'prod';
  /** Which surface the pane shows — the shell owns it, so Dashboard can swap the pane. */
  target: Target;
  onTargetChange: (target: Target) => void;
}) {
  const isV2 = version === 'v2';

  if (mode === 'prod') {
    return (
      <header className="flex w-full shrink-0 flex-col items-start px-[12px] py-[10px]">
        <div className="flex w-full items-center justify-between px-[3px]">
          <div className="flex w-[729px] shrink-0 items-center gap-[16px]">
            <div className="flex shrink-0 items-center gap-[22px]">
              <LogoTile onOpenDashboard={onOpenDashboard} />
              <ProjectSwitcher />
            </div>
            <StatusBadge />
          </div>
          <div className="flex shrink-0 items-center gap-[8px]">
            <Button icon={<Icon src={assets.viewOnWeb} />}>View on web</Button>
            {/*
              Prod has no Publish button of its own — but a publish started from
              the builder keeps running here, so the control appears while it is
              in flight and disappears once the deploy finishes.
            */}
            {(publish.phase === 'running' || publish.phase === 'action-needed') && <PublishPopover {...publish} />}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`flex w-full shrink-0 flex-col items-start px-[12px] ${isV2 ? 'py-[12px]' : 'py-[10px]'}`}>
      <div className="flex w-full items-center justify-between px-[3px]">
        {/*
          The 729px is Figma's measure for where the switcher sits; it is a
          minimum now, so adding a control beside the switcher pushes the row
          along rather than overflowing the box.
        */}
        <div className={`flex min-w-[729px] shrink-0 items-center ${isV2 ? 'gap-[114px]' : 'gap-[129px]'}`}>
          <div className={`flex shrink-0 items-center ${isV2 ? 'gap-[32px]' : 'gap-[22px]'}`}>
            <LogoTile onOpenDashboard={onOpenDashboard} />
            <ProjectSwitcher />
          </div>
          <div className="flex shrink-0 items-center gap-[24px]">
            <Tab options={TARGETS} value={target} onChange={onTargetChange} />
            <Button icon={<Icon src={assets.github} size={14} />}>Connect GitHub</Button>
          </div>
        </div>

        <div className="flex w-[304px] shrink-0 items-center gap-[12px]">
          {/*
            Both controls drive the web preview — which page to show and where
            to open it. The console has neither, so the slot empties out.
          */}
          {target !== 'Dashboard' && (
            <>
              <PageSelector reloading={reloading} onReload={onReload} />
              <button
                type="button"
                aria-label="Open preview in a new tab"
                className="-m-[6px] shrink-0 rounded-small p-[6px] text-icon transition-colors hover:bg-hover"
              >
                <Icon src={assets.externalLink} />
              </button>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-[8px]">
          {/* V2 adds a run control ahead of Upgrade. */}
          {isV2 && (
            <Button aria-label="Run preview" className="!w-[26px] !px-0" icon={<Icon src={assets.play} />} />
          )}
          <Button variant="outline" icon={<Icon src={assets.zap} />}>
            Upgrade
          </Button>
          <PublishPopover {...publish} />
        </div>
      </div>
    </header>
  );
}
