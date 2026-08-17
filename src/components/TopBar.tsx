import { useState } from 'react';
import { assets } from '../assets';
import type { Version } from '../version';
import { Dropdown, MenuItem, ProjectBadge } from './Dropdown';
import { MaskIcon, VectorIcon, icons } from './VectorIcon';

const TARGETS = ['Web', 'Mobile app', 'Dashboard'] as const;

const PROJECTS = [
  { name: 'Product design diary', initials: 'PD', tone: 'bg-accent-green' },
  { name: 'Marketing site', initials: 'MS', tone: 'bg-[#0a84ff]' },
  { name: 'Internal tools', initials: 'IT', tone: 'bg-[#ff9f0a]' },
];

const PAGES = ['Homepage', 'Pricing', 'Changelog', 'Blog', 'Settings'];

function LogoTile({ version, onToggleVersion }: { version: Version; onToggleVersion: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggleVersion}
      title={`Layout ${version === 'v1' ? '1' : '2'} — click to switch`}
      aria-label={`Switch layout (currently version ${version === 'v1' ? '1' : '2'})`}
      className="relative size-[28px] shrink-0 overflow-clip rounded-(--radius-small) bg-brand transition-[filter] hover:brightness-125 active:brightness-90"
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
  const [current, setCurrent] = useState(PROJECTS[0]);

  return (
    <Dropdown
      panelWidth="w-[214px]"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="-mx-[4px] flex h-[20px] shrink-0 items-center gap-[6px] rounded-(--radius-small) px-[4px] text-text transition-colors hover:bg-hover"
        >
          <ProjectBadge initials={current.initials} tone={current.tone} />
          <span className="flex shrink-0 items-end gap-[2px]">
            <span className="text-[13px] font-medium whitespace-nowrap">{current.name}</span>
            <VectorIcon
              {...icons.chevronDown12}
              className={`-top-[2px] transition-transform ${open ? 'rotate-180' : ''}`}
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

/**
 * Every tab reserves the same box regardless of state, so selecting one never
 * reflows the track. Only fill and ring change.
 *
 * The track's border is drawn inside its box (inset ring) while the selected
 * chip's is drawn outside its box (outset ring), so the chip's outline lands
 * exactly on the track edge rather than nesting one pixel inside it.
 */
function TargetTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-[28px] shrink-0 items-center gap-[4px] rounded-[8px] bg-track px-px inset-ring-1 inset-ring-track-border">
      {TARGETS.map((target, index) => {
        const isActive = index === active;
        return (
          <button
            key={target}
            type="button"
            aria-pressed={isActive}
            onClick={() => setActive(index)}
            className={`flex h-[26px] shrink-0 items-center justify-center rounded-[7px] px-[14px] text-[12px] font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-chip text-text ring-1 ring-border-chip'
                : 'text-text-secondary hover:bg-hover hover:text-text'
            }`}
          >
            {target}
          </button>
        );
      })}
    </div>
  );
}

function PageSelector({ reloading, onReload }: { reloading: boolean; onReload: () => void }) {
  const [page, setPage] = useState(PAGES[0]);

  return (
    <Dropdown
      panelWidth="w-[193px]"
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
          className="flex h-[28px] w-[193px] shrink-0 cursor-pointer items-center justify-between rounded-[8px] border border-track-border bg-track px-[12px] text-text-secondary transition-colors hover:border-border-chip"
        >
          <button
            type="button"
            aria-label="Reload preview"
            onClick={(event) => {
              event.stopPropagation();
              onReload();
            }}
            className="-m-[6px] shrink-0 rounded-(--radius-small) p-[6px] transition-colors hover:bg-hover"
          >
            <VectorIcon {...icons.refresh} className={reloading ? 'animate-spin' : ''} />
          </button>
          <span className="flex h-[20px] items-center justify-center rounded-[8px] px-[8px] text-[12px] font-medium whitespace-nowrap">
            {page}
          </span>
          <VectorIcon {...icons.chevronDown16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
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
  onToggleVersion,
}: {
  version: Version;
  reloading: boolean;
  onReload: () => void;
  onToggleVersion: () => void;
}) {
  const isV2 = version === 'v2';

  return (
    <header className={`flex w-full shrink-0 flex-col items-start px-[12px] ${isV2 ? 'py-[12px]' : 'py-[10px]'}`}>
      <div className="flex w-full items-center justify-between px-[3px]">
        <div className={`flex w-[729px] shrink-0 items-center ${isV2 ? 'gap-[114px]' : 'gap-[123px]'}`}>
          <div className={`flex shrink-0 items-center ${isV2 ? 'gap-[32px]' : 'gap-[22px]'}`}>
            <LogoTile version={version} onToggleVersion={onToggleVersion} />
            <ProjectSwitcher />
          </div>
          <TargetTabs />
        </div>

        <div className="flex w-[304px] shrink-0 items-center gap-[12px]">
          <PageSelector reloading={reloading} onReload={onReload} />
          {/* Negative margin cancels the padding, so the hover target grows without moving the icon. */}
          <button
            type="button"
            aria-label="Open preview in a new tab"
            className="-m-[6px] shrink-0 rounded-(--radius-small) p-[6px] text-text-secondary transition-colors hover:bg-hover"
          >
            <VectorIcon {...icons.externalLink} />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-[8px]">
          {/* V2 adds a run control ahead of Upgrade. */}
          {isV2 && (
            <button
              type="button"
              aria-label="Run preview"
              className="flex size-[26px] shrink-0 items-center justify-center rounded-[48px] bg-pill text-text-secondary transition-colors hover:bg-control-hover"
            >
              <MaskIcon src={assets.iconPlay} />
            </button>
          )}
          <button
            type="button"
            className="flex h-[26px] shrink-0 items-center justify-center gap-[4px] rounded-[48px] bg-pill px-[12px] text-text-secondary transition-colors hover:bg-control-hover"
          >
            <VectorIcon {...icons.zapUpgrade} />
            <span className={`whitespace-nowrap ${isV2 ? 'text-[13px] font-medium' : 'text-[12px] font-semibold'}`}>
              Upgrade
            </span>
          </button>
          <button
            type="button"
            className={`flex h-[26px] w-[84px] shrink-0 items-center justify-center rounded-[48px] border border-publish-border bg-publish whitespace-nowrap text-publish-text transition-colors hover:bg-publish-hover ${
              isV2 ? 'text-[13px] font-medium' : 'text-[12px] font-semibold'
            }`}
          >
            Publish
          </button>
        </div>
      </div>
    </header>
  );
}
