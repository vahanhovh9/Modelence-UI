import { useEffect, useRef, useState } from 'react';
import { assets } from '../assets';
import type { AgentApi } from '../agent/useFakeAgent';
import type { Version } from '../version';
import { AgentHeader } from './AgentHeader';
import { AGENTS } from '../agent/models';
import { TurnView } from './AgentTurn';
import { Dropdown, MenuItem } from './Dropdown';
import { Icon } from './Icon';

/** Figma "Ai chat" (883:4359) — Agent header, transcript, then the composer. */
export function ChatPanel({
  width,
  version,
  agent,
  mode = 'build',
  onCollapse,
  onToggleFloat,
  floating = false,
}: {
  width: number;
  version: Version;
  agent: AgentApi;
  /** Prod runs a different agent: it diagnoses, it does not build. */
  mode?: 'build' | 'prod';
  onCollapse: () => void;
  onToggleFloat: () => void;
  floating?: boolean;
}) {
  const isV2 = version === 'v2';
  const surface = isV2 && !floating ? '--color-bg-canvas' : '--color-bg-container';
  const { turns, busy, elapsed, send, stop } = agent;
  const isProd = mode === 'prod';
  const [message, setMessage] = useState('');
  // Agent and model are one choice: picking an agent picks its default model,
  // since the two model families are not interchangeable.
  const [coder, setCoder] = useState(AGENTS[0]);
  const [model, setModel] = useState(AGENTS[0].models[0]);
  const [scrolled, setScrolled] = useState(false);
  const [composing, setComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Whether the reader is following the stream, rather than scrolled back.
  const atBottomRef = useRef(true);

  const canSend = message.trim().length > 0 && !busy;

  // Follow the transcript as it streams.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    atBottomRef.current = true;
    setScrolled(el.scrollTop > 2);
  }, [turns, elapsed]);

  /*
   * Resizing the panel rewraps the transcript, which changes its height and
   * lets the newest message drift out of view. Re-pin to the bottom whenever
   * the box changes — but only for a reader who was already following along,
   * so scrolling back through history is not yanked away mid-drag.
   */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (!atBottomRef.current) return;
      el.scrollTop = el.scrollHeight;
      setScrolled(el.scrollTop > 2);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const submit = () => {
    if (!canSend) return;
    send(message);
    setMessage('');
  };

  return (
    <section
      style={floating ? undefined : { width }}
      className={`flex h-full flex-col items-center justify-between ${
        floating
          ? 'w-full rounded-block border border-border-highlight bg-bg-container p-[12px]'
          : isV2
            ? 'shrink-0 px-[10px] pt-[13px] pb-[13px]'
            : 'shrink-0 rounded-block border border-border-main bg-bg-container p-[12px]'
      }`}
    >
      {/* Figma "Agent works" — header pinned above the scrolling transcript. */}
      <div className="flex min-h-0 w-full flex-1 flex-col gap-[12px]">
        <AgentHeader
          agent={coder}
          onAgentChange={(next) => {
            setCoder(next);
            setModel(next.models[0]);
          }}
          eyebrow={isProd ? 'Prod agent' : undefined}
          onCollapse={onCollapse}
          onToggleFloat={onToggleFloat}
          floating={floating}
        />

        <div className="relative min-h-0 w-full flex-1">
          {/* Scrolls so the composer stays pinned once the transcript outgrows the panel. */}
          <div
            ref={scrollRef}
            onScroll={(event) => {
            const el = event.currentTarget;
            setScrolled(el.scrollTop > 2);
            atBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
          }}
            className="flex h-full w-full flex-col items-start gap-[16px] overflow-y-auto"
          >
            {/*
              The Prod agent is not the build agent. Saying so up front stops
              anyone asking it for features it will never write.
            */}
            {isProd && (
              <div className="flex w-full shrink-0 flex-col gap-[6px] rounded-main border border-border-main bg-bg-primary p-[12px]">
                <span className="flex items-center gap-[6px] text-text-primary">
                  <span className="text-accent-purple-highlight">
                    <Icon src={assets.sparkle} size={14} />
                  </span>
                  <span className="text-h5">Production agent</span>
                </span>
                <p className="text-body text-text-main">
                  This agent doesn&rsquo;t build features. It helps you diagnose and resolve production issues &mdash;
                  failed deploys, errors and configuration.
                </p>
              </div>
            )}
            {turns.map((turn) => (
              <TurnView key={turn.id} turn={turn} elapsed={elapsed} bullets={isV2} />
            ))}
          </div>

          {/*
            Softens the top edge once content scrolls under it, so text dissolves
            into the panel instead of ending on a hard cut. The mask fades the
            blur out downward; the gradient carries the panel colour with it.
          */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 top-0 h-[30px] transition-opacity duration-200 ${
              scrolled ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              // V2 has no panel fill, so the fade blends into the page instead.
              background: `linear-gradient(to bottom, var(${surface}) 15%, color-mix(in srgb, var(${surface}) 45%, transparent) 60%, transparent 100%)`,
              maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
            }}
          />
        </div>
      </div>

      <div
        // The textarea fills the writing area, and this catches the padding
        // around it — so a click anywhere outside the toolbar starts typing.
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            event.preventDefault();
            textareaRef.current?.focus();
          }
        }}
        // No overflow-clip: the model menu opens upward out of this box.
        className={`mt-[12px] flex w-full shrink-0 cursor-text flex-col gap-[8px] rounded-block border bg-bg-element-1 transition-colors ${
          composing ? 'border-border-chat' : 'border-border-highlight'
        } ${isV2 ? 'p-[10px]' : 'p-[8px]'}`}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onFocus={() => setComposing(true)}
          onBlur={() => setComposing(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder={isProd ? 'Describe a production issue...' : 'Write a message...'}
          className="h-[96px] w-full resize-none bg-transparent text-[13px] font-medium text-text-primary placeholder:text-grey-400 focus:outline-none"
        />
        <div className="flex w-full shrink-0 items-center justify-between">
          <div className="flex shrink-0 items-center gap-[13px]">
            {/* Negative margin cancels the padding, so the hover target grows without moving the icon. */}
            <button
              type="button"
              aria-label="Attach a file"
              className="-m-[6px] shrink-0 rounded-small p-[6px] text-main transition-colors hover:bg-hover hover:text-text-selected"
            >
              <Icon src={assets.attach} />
            </button>
            <Dropdown
              placement="top-start"
              panelWidth="w-[184px]"
              trigger={({ open, toggle }) => (
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={open}
                  className="-mx-[4px] flex h-[20px] shrink-0 items-center gap-[6px] rounded-small px-[4px] text-main transition-colors hover:bg-hover hover:text-text-selected"
                >
                  <span className="flex shrink-0 items-end gap-[2px]">
                    <span className="text-h6 whitespace-nowrap">{model}</span>
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
                coder.models.map((name) => (
                  <MenuItem
                    key={name}
                    label={name}
                    selected={name === model}
                    onClick={() => {
                      setModel(name);
                      close();
                    }}
                  />
                ))
              }
            </Dropdown>
          </div>
          <div className="flex shrink-0 items-center gap-[9px]">
            <button
              type="button"
              aria-label="Stop generating"
              onClick={stop}
              disabled={!busy}
              className={`-m-[6px] shrink-0 rounded-small p-[6px] text-main transition-all hover:bg-hover ${
                busy ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span className={busy ? 'block animate-spin [animation-duration:1.4s]' : 'block'}>
                <Icon src={assets.stop} size={15} />
              </span>
            </button>
            {/*
              Greys/600 and Greys/0 are primitives in the file, so the send
              button stays a dark chip with a white arrow in both themes.
              Once there is something to send it takes the Publish fill.
            */}
            <button
              type="button"
              aria-label="Send message"
              onClick={submit}
              disabled={!canSend}
              className={`flex size-[24px] shrink-0 items-center justify-center text-grey-0 transition-colors ${
                isV2 ? 'rounded-[7px]' : 'rounded-main'
              } ${canSend ? 'bg-button-main-bg hover:bg-button-main-hover' : 'bg-grey-600 hover:bg-grey-500'}`}
            >
              <Icon src={assets.arrowUp} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
