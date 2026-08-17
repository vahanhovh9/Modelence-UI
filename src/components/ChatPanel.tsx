import { useEffect, useRef, useState } from 'react';
import { assets } from '../assets';
import { useFakeAgent } from '../agent/useFakeAgent';
import type { Version } from '../version';
import { TurnView } from './AgentTurn';
import { Dropdown, MenuItem } from './Dropdown';
import { MaskIcon, VectorIcon, icons } from './VectorIcon';

const MODELS = ['Fable', 'Opus 5', 'Sonnet 5', 'Haiku 4.5'];

export function ChatPanel({ width, version }: { width: number; version: Version }) {
  const isV2 = version === 'v2';
  const surface = isV2 ? '--color-app' : '--color-panel';
  const { turns, busy, elapsed, send, stop } = useFakeAgent();
  const [message, setMessage] = useState('');
  const [model, setModel] = useState(MODELS[0]);
  const [scrolled, setScrolled] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const canSend = message.trim().length > 0 && !busy;

  // Follow the transcript as it streams.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setScrolled(el.scrollTop > 2);
  }, [turns, elapsed]);

  const submit = () => {
    if (!canSend) return;
    send(message);
    setMessage('');
  };

  return (
    <section
      style={{ width }}
      className={`flex h-full shrink-0 flex-col items-center justify-between ${
        isV2 ? 'px-[10px] pt-[13px] pb-[13px]' : 'rounded-l-[12px] border border-border bg-panel p-[12px]'
      }`}
    >
      <div className="relative min-h-0 w-full flex-1">
        {/* Scrolls so the composer stays pinned once the transcript outgrows the panel. */}
        <div
          ref={scrollRef}
          onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 2)}
          className="flex h-full w-full flex-col items-start gap-[16px] overflow-y-auto"
        >
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
        className={`mt-[12px] flex w-full shrink-0 cursor-text flex-col gap-[8px] rounded-[12px] border border-border-strong bg-field ${
          isV2 ? 'p-[10px]' : 'p-[8px]'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder="Write a message..."
          className="h-[96px] w-full resize-none bg-transparent text-[13px] font-medium text-text placeholder:text-text-muted focus:outline-none"
        />
        <div className="flex w-full shrink-0 items-center justify-between">
          <div className="flex shrink-0 items-center gap-[13px]">
            {/* Negative margin cancels the padding, so the hover target grows without moving the icon. */}
            <button
              type="button"
              aria-label="Attach a file"
              className="-m-[6px] shrink-0 rounded-(--radius-small) p-[6px] text-text-muted transition-colors hover:bg-hover hover:text-text-secondary"
            >
              <MaskIcon src={assets.iconAttach} />
            </button>
            <Dropdown
              placement="top-start"
              panelWidth="w-[152px]"
              trigger={({ open, toggle }) => (
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={open}
                  className="group -mx-[4px] flex h-[20px] shrink-0 items-center gap-[6px] rounded-(--radius-small) px-[4px] text-text-muted transition-colors hover:bg-hover hover:text-text-secondary"
                >
                  <span className="flex shrink-0 items-end gap-[2px]">
                    <span className="text-[12px] font-medium whitespace-nowrap">{model}</span>
                    <VectorIcon
                      {...icons.chevronDownModel}
                      className={`-top-[2px] transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>
              )}
            >
              {({ close }) =>
                MODELS.map((name) => (
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
              className={`-m-[6px] shrink-0 rounded-(--radius-small) p-[6px] text-text-muted transition-all hover:bg-hover ${
                busy ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span className={busy ? 'block animate-spin [animation-duration:1.4s]' : 'block'}>
                <MaskIcon src={assets.iconStop} size={15} />
              </span>
            </button>
            {/* Once there is something to send, this takes on the Publish button's treatment. */}
            <button
              type="button"
              aria-label="Send message"
              onClick={submit}
              disabled={!canSend}
              className={`flex size-[24px] shrink-0 items-center justify-center transition-colors ${isV2 ? 'rounded-[7px]' : 'rounded-[8px]'} ${
                canSend
                  ? 'border border-publish-border bg-publish text-publish-text hover:bg-publish-hover'
                  : 'bg-send text-text-secondary hover:bg-control-hover'
              }`}
            >
              <VectorIcon {...icons.arrowUp} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
