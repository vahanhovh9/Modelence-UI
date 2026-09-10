import { useEffect, useRef, useState } from 'react';
import { assets } from '../../assets';
import { Button } from '../Button';
import { Dropdown, MenuItem, MoreDots } from '../Dropdown';
import { Icon } from '../Icon';
import { AgentMark } from '../AgentHeader';
import { AGENTS } from '../../agent/models';
import { Modal } from '../Modal';
import { AppThumbnail, type ThumbKind } from './AppThumbnail';
import { PromptGlow } from './PromptGlow';

type EnvStatus = 'Running' | 'Paused';
type AppEnv = { name: 'Sandbox' | 'Prod'; status: EnvStatus };
type App = { id: string; name: string; edited: string; thumb: ThumbKind; envs: AppEnv[] };

/** Environments are listed in the rail's pipeline order: Sandbox before Prod. */
const INITIAL_APPS: App[] = [
  {
    id: 'user-profile-page',
    name: 'User Profile Page',
    edited: '13 days ago',
    thumb: 'builder',
    envs: [
      { name: 'Sandbox', status: 'Running' },
      { name: 'Prod', status: 'Running' },
    ],
  },
  {
    id: 'time-zone-converter',
    name: 'Time Zone Converter',
    edited: '15 days ago',
    thumb: 'timezone',
    envs: [
      { name: 'Sandbox', status: 'Paused' },
      { name: 'Prod', status: 'Running' },
    ],
  },
  {
    id: 'product-design-diary',
    name: 'Product Design Diary',
    edited: '52 days ago',
    thumb: 'journal',
    envs: [{ name: 'Sandbox', status: 'Paused' }],
  },
];

const ENV_ICON = { Sandbox: assets.sandbox, Prod: assets.prod } as const;

/**
 * Application card, following the thumbnail-first pattern: a large preview with
 * a Published badge, then an identity row. Where that pattern puts an author
 * avatar, this puts the environment the card opens into — Prod when the app is
 * live, otherwise Sandbox — so the row answers "where does this app run?".
 */
function AppCard({
  app,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: {
  app: App;
  onOpen: (env: AppEnv['name']) => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const prod = app.envs.find((env) => env.name === 'Prod');
  const published = prod?.status === 'Running';
  // Opening the card goes to the environment that matters most: live if it is.
  const primary = prod ?? app.envs[0];

  return (
    <article className="group flex flex-col gap-[12px]">
      <button
        type="button"
        onClick={() => onOpen(primary.name)}
        aria-label={`Open ${app.name} in ${primary.name}`}
        className="relative block aspect-[16/10] w-full overflow-clip rounded-block border border-border-main bg-bg-element-2 transition-colors hover:border-border-highlight"
      >
        <AppThumbnail kind={app.thumb} />
        {published && (
          <span className="text-h6 absolute bottom-[12px] left-[12px] flex h-[26px] items-center rounded-small border border-border-main bg-bg-primary px-[10px] text-text-primary">
            Published
          </span>
        )}
      </button>

      <div className="flex items-start gap-[10px]">
        <span
          title={`Runs in ${primary.name}`}
          className={`flex size-[28px] shrink-0 items-center justify-center rounded-full border ${
            published
              ? 'border-accent-green-border bg-accent-badge-success text-accent-green-text'
              : 'border-border-main bg-bg-selected-2 text-icon-default'
          }`}
        >
          <Icon src={ENV_ICON[primary.name]} />
        </span>

        <div className="flex min-w-px flex-1 flex-col items-start gap-[4px]">
          <button
            type="button"
            onClick={() => onOpen(primary.name)}
            className="text-h4 w-full truncate text-left text-text-selected transition-colors hover:text-text-main"
          >
            {app.name}
          </button>
          <span className="text-small-title text-text-secondary">Edited {app.edited}</span>
        </div>

        <div className="flex shrink-0 items-center gap-[2px] opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            aria-label={`Open ${app.name} in a new tab`}
            className="flex size-[24px] items-center justify-center rounded-small text-icon-default transition-colors hover:bg-hover hover:text-icon-selected"
          >
            <Icon src={assets.externalLink} />
          </button>
          <Dropdown
            placement="bottom-end"
            panelWidth="w-[184px]"
            trigger={({ open, toggle }) => (
              <button
                type="button"
                aria-label={`${app.name} options`}
                aria-expanded={open}
                onClick={toggle}
                className={`flex size-[24px] items-center justify-center rounded-small transition-colors hover:bg-hover hover:text-icon-selected ${
                  open ? 'bg-hover text-icon-selected' : 'text-icon-default'
                }`}
              >
                <MoreDots />
              </button>
            )}
          >
            {({ close }) => (
              <>
                {app.envs.map((env) => (
                  <MenuItem
                    key={env.name}
                    label={`Open in ${env.name}`}
                    icon={
                      <span className="flex size-[16px] shrink-0 items-center justify-center text-icon-default">
                        <Icon src={ENV_ICON[env.name]} />
                      </span>
                    }
                    onClick={() => {
                      onOpen(env.name);
                      close();
                    }}
                  />
                ))}
                <span className="my-[2px] h-px w-full bg-border-main" />
                <MenuItem
                  label="Rename"
                  icon={
                    <span className="flex size-[16px] shrink-0 items-center justify-center text-icon-default">
                      <Icon src={assets.navCode} />
                    </span>
                  }
                  onClick={() => {
                    close();
                    onRename();
                  }}
                />
                <MenuItem
                  label="Duplicate"
                  icon={
                    <span className="flex size-[16px] shrink-0 items-center justify-center text-icon-default">
                      <Icon src={assets.navFiles} />
                    </span>
                  }
                  onClick={() => {
                    close();
                    onDuplicate();
                  }}
                />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close();
                    onDelete();
                  }}
                  className="flex h-[28px] w-full shrink-0 items-center gap-[8px] rounded-small px-[8px] text-danger transition-colors hover:bg-hover"
                >
                  <span className="flex size-[16px] shrink-0 items-center justify-center">
                    <Icon src={assets.stop} size={14} />
                  </span>
                  <span className="text-h6 flex-1 text-left whitespace-nowrap">Delete</span>
                </button>
              </>
            )}
          </Dropdown>
        </div>
      </div>
    </article>
  );
}

/** Rename flow — a single field, pre-filled and selected, Enter to confirm. */
function RenameDialog({
  app,
  onCancel,
  onConfirm,
}: {
  app: App;
  onCancel: () => void;
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState(app.name);
  const trimmed = name.trim();
  const valid = trimmed.length > 0 && trimmed !== app.name;

  return (
    <Modal title="Rename application" onClose={onCancel}>
      <form
        className="flex flex-col gap-[16px]"
        onSubmit={(event) => {
          event.preventDefault();
          if (valid) onConfirm(trimmed);
        }}
      >
        <label className="flex flex-col gap-[6px]">
          <span className="text-small-title text-text-secondary">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onFocus={(event) => event.target.select()}
            className="text-body h-[36px] w-full rounded-main border border-border-highlight bg-bg-element-1 px-[10px] text-text-primary outline-none focus:border-accent-purple-highlight"
          />
        </label>
        <div className="flex items-center justify-end gap-[8px]">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={!valid} className={valid ? '' : 'opacity-50'}>
            Rename
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/** Delete flow — names what is lost, and keeps the destructive action distinct. */
function DeleteDialog({
  app,
  onCancel,
  onConfirm,
}: {
  app: App;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const live = app.envs.some((env) => env.status === 'Running');

  return (
    <Modal
      title={`Delete ${app.name}?`}
      description={
        live
          ? 'This app is currently running. Deleting it takes it offline and removes every environment, deployment and log. This cannot be undone.'
          : 'This removes the app and every environment, deployment and log attached to it. This cannot be undone.'
      }
      onClose={onCancel}
    >
      <div className="flex items-center justify-end gap-[8px]">
        <Button onClick={onCancel}>Cancel</Button>
        <button
          type="button"
          onClick={onConfirm}
          className="text-h6 flex h-[26px] shrink-0 items-center justify-center rounded-[48px] bg-danger px-[12px] whitespace-nowrap text-grey-0 transition-colors hover:bg-danger-hover"
        >
          Delete app
        </button>
      </div>
    </Modal>
  );
}

/** Prompts the placeholder cycles through, as if someone were typing them. */
const APP_IDEAS = [
  'an online booking system',
  'a CRM with a pipeline view',
  'a staff availability calendar',
  'an invoice tracker',
  'a compliance policy tracker',
];

/** Every model the composer can start a build on, tagged with its agent. */
const MODEL_OPTIONS = AGENTS.flatMap((agent) => agent.models.map((name) => ({ name, agent })));

const TYPE_MS = 55;
const ERASE_MS = 26;
const HOLD_MS = 1800;
const GAP_MS = 260;

/**
 * Types one phrase out, holds it, erases it, then moves to the next — the
 * placeholder equivalent of watching someone think out loud. Pauses whenever
 * the field is not empty, since the placeholder is hidden then anyway.
 */
function useTypedIdea(enabled: boolean) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [erasing, setErasing] = useState(false);

  const idea = APP_IDEAS[index % APP_IDEAS.length];

  useEffect(() => {
    if (!enabled) return;

    if (!erasing) {
      if (length < idea.length) {
        const timer = setTimeout(() => setLength((n) => n + 1), TYPE_MS);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setErasing(true), HOLD_MS);
      return () => clearTimeout(timer);
    }

    if (length > 0) {
      const timer = setTimeout(() => setLength((n) => n - 1), ERASE_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setIndex((n) => n + 1);
      setErasing(false);
    }, GAP_MS);
    return () => clearTimeout(timer);
  }, [enabled, erasing, idea, length]);

  return enabled ? idea.slice(0, length) : idea;
}

function Composer() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(MODEL_OPTIONS[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = prompt.trim().length > 0;
  // Nothing to read while it animates, and a moving placeholder under a
  // reduced-motion preference is exactly what that preference is about.
  const still =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const idea = useTypedIdea(!canSend && !still);

  return (
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          textareaRef.current?.focus();
        }
      }}
      className="flex w-full cursor-text flex-col gap-[8px] rounded-block border border-border-highlight bg-bg-element-1 p-[12px]"
    >
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder={`Build me ${idea}`}
        className="h-[112px] w-full resize-none bg-transparent text-body-large text-text-primary placeholder:text-text-secondary focus:outline-none"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex shrink-0 items-center gap-[13px]">
          <button
            type="button"
            aria-label="Attach a file"
            className="-m-[6px] shrink-0 rounded-small p-[6px] text-main transition-colors hover:bg-hover hover:text-text-selected"
          >
            <Icon src={assets.attach} />
          </button>
          <Dropdown
            panelWidth="w-[196px]"
            trigger={({ open, toggle }) => (
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-label="Choose a model"
                className="-mx-[4px] flex h-[20px] shrink-0 items-center gap-[6px] rounded-small px-[4px] text-main transition-colors hover:bg-hover hover:text-text-selected"
              >
                <span className="flex shrink-0 items-end gap-[2px]">
                  <span className="text-h6 whitespace-nowrap">{model.name}</span>
                  <Icon
                    src={assets.chevronModel}
                    size={12}
                    className={`relative -top-[2px] transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </span>
              </button>
            )}
          >
            {({ close }) =>
              MODEL_OPTIONS.map((option) => (
                <MenuItem
                  key={option.name}
                  label={option.name}
                  selected={option.name === model.name}
                  icon={
                    <span className="flex size-[16px] shrink-0 items-center justify-center text-text-main">
                      <AgentMark agent={option.agent} size={14} />
                    </span>
                  }
                  onClick={() => {
                    setModel(option);
                    close();
                  }}
                />
              ))
            }
          </Dropdown>
        </div>
        <button
          type="button"
          aria-label="Create app"
          disabled={!canSend}
          className={`flex size-[28px] shrink-0 items-center justify-center rounded-main text-grey-0 transition-colors ${
            canSend ? 'bg-button-main-bg hover:bg-button-main-hover' : 'bg-grey-600 hover:bg-grey-500'
          }`}
        >
          <Icon src={assets.arrowUp} />
        </button>
      </div>
    </div>
  );
}

/** The Dashboard section — create a new app, import one, or open an existing one. */
export function DashboardHome({ onOpenApp }: { onOpenApp: (env: AppEnv['name']) => void }) {
  const [apps, setApps] = useState<App[]>(INITIAL_APPS);
  const [renaming, setRenaming] = useState<App | null>(null);
  const [deleting, setDeleting] = useState<App | null>(null);

  const rename = (id: string, name: string) =>
    setApps((prev) => prev.map((app) => (app.id === id ? { ...app, name, edited: 'just now' } : app)));

  const duplicate = (app: App) =>
    setApps((prev) => {
      const index = prev.findIndex((candidate) => candidate.id === app.id);
      // A copy starts fresh: same build, but nothing deployed yet.
      const copy: App = {
        ...app,
        id: `${app.id}-copy-${Date.now()}`,
        name: `${app.name} (copy)`,
        edited: 'just now',
        envs: [{ name: 'Sandbox', status: 'Paused' }],
      };
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });

  const remove = (id: string) => setApps((prev) => prev.filter((app) => app.id !== id));

  return (
    <div className="min-w-px flex-1 overflow-y-auto rounded-block border border-border-main bg-bg-container">
      <div className="mx-auto flex w-full max-w-[1024px] flex-col items-center gap-[20px] px-[24px] pt-[225px] pb-[25px]">
        <p className="flex shrink-0 items-center gap-[8px] rounded-main border border-border-main bg-bg-primary px-[14px] py-[8px]">
          <span className="shrink-0 text-accent-purple-highlight">
            <Icon src={assets.sparkle} />
          </span>
          <span className="text-body text-text-main">
            Invite teammates to your organization from the Members page so you can collaborate on the same apps.
          </span>
        </p>

        <h1 className="text-[32px] leading-[40px] font-semibold text-text-selected">What are we building today?</h1>

        {/* The glow is anchored to the composer and masked away at its top edge. */}
        <div className="relative isolate w-full">
          <PromptGlow />
          <Composer />
        </div>

        <div className="flex w-full shrink-0 flex-col items-center gap-[12px]">
          <p className="text-body text-text-main">Already have an app somewhere else?</p>
          <div className="flex flex-wrap items-center justify-center gap-[10px]">
            <Button>Import from Lovable</Button>
            <Button icon={<Icon src={assets.zap} />}>Import from Bolt</Button>
            <Button icon={<Icon src={assets.navFiles} />}>Import custom project</Button>
          </div>
        </div>

        <div className="mt-[16px] flex w-full shrink-0 flex-col items-start gap-[12px] pt-[100px]">
          <div className="flex items-center gap-[8px]">
            <h2 className="text-h3 text-text-selected">Applications</h2>
            <span className="text-h6 flex h-[20px] min-w-[20px] items-center justify-center rounded-small bg-bg-selected-2 px-[6px] text-text-main">
              {apps.length}
            </span>
          </div>
          <div className="grid w-full grid-cols-1 gap-x-[16px] gap-y-[24px] md:grid-cols-2 xl:grid-cols-3">
            {apps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onOpen={onOpenApp}
                onRename={() => setRenaming(app)}
                onDuplicate={() => duplicate(app)}
                onDelete={() => setDeleting(app)}
              />
            ))}
          </div>
        </div>
      </div>

      {renaming && (
        <RenameDialog
          app={renaming}
          onCancel={() => setRenaming(null)}
          onConfirm={(name) => {
            rename(renaming.id, name);
            setRenaming(null);
          }}
        />
      )}
      {deleting && (
        <DeleteDialog
          app={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            remove(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
