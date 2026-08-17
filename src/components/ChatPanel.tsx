import { assets } from '../assets';
import { VectorIcon, icons } from './VectorIcon';

const FIRST_TRANSCRIPT = [
  "Let me verify what's actually on disk.",
  'Bash Show working tree diff',
  'IN',
  'git diff --stat && echo "=== diff ===" && git diff',
  'OUT',
  ' src/client/app-builder/ChatInput.tsx | 2 +- src/client/index.css                 | 1 + 2 files changed, 2 insertions(+), 1 deletion(-) === diff === diff --git a/src/client/app-builder/ChatInput.tsx b/src/client/app-builder/',
];

const SECOND_TRANSCRIPT = [
  "Let me verify what's actually on disk.",
  'Bash Show working tree diff',
  '​',
  'IN',
  '​',
  'git diff --stat && echo "=== diff ===" && git diffChatInput.tsx b/src/client/app-builder/',
];

function Transcript({ lines, className = '' }: { lines: readonly string[]; className?: string }) {
  return (
    <div className={`text-[13px] whitespace-pre-wrap break-words text-grey-300 ${className}`}>
      {lines.map((line, index) => (
        <p key={index} className="leading-[20px]">
          {line}
        </p>
      ))}
    </div>
  );
}

function Composer() {
  return (
    <div className="flex w-[263px] shrink-0 flex-col gap-[88px] overflow-clip rounded-[12px] border border-grey-500 bg-black p-[8px]">
      <textarea
        rows={1}
        placeholder="Write a message..."
        className="w-full resize-none bg-transparent text-[13px] font-medium text-white placeholder:text-grey-400 focus:outline-none"
      />
      <div className="flex w-full shrink-0 items-center justify-between">
        <div className="flex shrink-0 items-center gap-[13px]">
          {/* Negative margin cancels the padding, so the hover target grows without moving the icon. */}
          <button
            type="button"
            aria-label="Attach a file"
            className="-m-[6px] shrink-0 rounded-(--radius-small) p-[6px] transition-colors hover:bg-white/10"
          >
            <span className="relative block size-[16px]">
              <img src={assets.iconAttach} alt="" className="absolute inset-0 block size-full max-w-none" />
            </span>
          </button>
          <button
            type="button"
            className="group -mx-[4px] flex h-[20px] shrink-0 items-center gap-[6px] rounded-(--radius-small) px-[4px] transition-colors hover:bg-white/10"
          >
            <span className="flex shrink-0 items-end gap-[2px]">
              <span className="text-[12px] font-medium whitespace-nowrap text-grey-400 transition-colors group-hover:text-grey-200">
                Fable
              </span>
              <VectorIcon {...icons.chevronDownModel} className="-top-[4px]" />
            </span>
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-[9px]">
          <button
            type="button"
            aria-label="Stop generating"
            className="-m-[6px] shrink-0 rounded-(--radius-small) p-[6px] transition-colors hover:bg-white/10"
          >
            <span className="relative block size-[15px]">
              <span className="absolute -inset-y-[0.7%] -right-[0.7%] left-0">
                <img src={assets.iconStop} alt="" className="block size-full max-w-none" />
              </span>
            </span>
          </button>
          <button
            type="button"
            aria-label="Send message"
            className="flex size-[24px] shrink-0 items-center justify-center rounded-[8px] bg-grey-600 transition-colors hover:bg-grey-500"
          >
            <VectorIcon {...icons.arrowUp} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatPanel() {
  return (
    <section className="flex h-full w-[287px] shrink-0 flex-col items-center justify-between rounded-l-[12px] border border-grey-700 bg-grey-800 p-[12px]">
      {/* Scrolls so the composer stays pinned once the transcript outgrows the panel. */}
      <div className="flex w-full min-h-0 flex-1 flex-col items-start gap-[16px] overflow-y-auto">
        <div className="flex shrink-0 flex-col items-start gap-[4px]">
          {/* Fixed at 220px in Figma; min-height instead so a fallback font cannot clip it. */}
          <Transcript lines={FIRST_TRANSCRIPT} className="min-h-[220px] w-[254px]" />
          <div className="flex shrink-0 items-center gap-[4px]">
            <VectorIcon {...icons.check} />
            <span className="text-[13px] leading-[20px] whitespace-nowrap text-white">worked for 1m 15 s</span>
          </div>
        </div>

        <div className="flex w-[261px] shrink-0 items-center justify-center rounded-[8px] border border-purple-300 bg-purple-400 px-[12px] py-[8px]">
          <p className="min-w-px flex-1 text-[13px] leading-[20px] text-white">
            Nice. Can you highlight today and show a couple of sample events?
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-[8px]">
          <div className="flex shrink-0 items-center pt-[7px]">
            <div className="relative h-[105px] w-[5px] shrink-0">
              <img src={assets.thinkingRail} alt="" className="absolute inset-0 block size-full max-w-none" />
            </div>
          </div>
          <Transcript lines={SECOND_TRANSCRIPT} className="w-[242px]" />
        </div>
      </div>

      <Composer />
    </section>
  );
}
