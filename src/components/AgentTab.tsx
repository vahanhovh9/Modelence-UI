import { assets } from '../assets';
import { BrandIcon, maskStyle } from './Icon';

/**
 * Figma "Agent collapsed" (1069:7111) — the stub the agent panel leaves behind,
 * pinned to the left edge of the canvas area and vertically centred.
 *
 * The tab shape is a single Figma path filled with Bg Selected, so it is drawn
 * as a mask over that token and themes itself (#363636 dark, #ffffff bright).
 */
export function AgentTab({ collapsed, onExpand }: { collapsed: boolean; onExpand: () => void }) {
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label="Expand agent panel"
      aria-expanded={!collapsed}
      // Slides out to the left as it fades, and is inert while the panel is open.
      style={{
        transform: `translateY(calc(-50% - 27.5px)) translateX(${collapsed ? '0' : '-100%'})`,
        transitionDelay: collapsed ? '120ms' : '0ms',
      }}
      className={`absolute top-1/2 left-0 z-30 h-[100px] w-[30px] transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
        collapsed ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-y-[3.87%] left-0 block w-[30px] bg-bg-selected"
        style={maskStyle(assets.agentCollapsed, { maskSize: '100% 100%', WebkitMaskSize: '100% 100%' })}
      />
      <BrandIcon src={assets.claude} size={16} className="absolute top-[28px] left-[7px]" />
      <span className="absolute top-[57.5px] left-[calc(50%-8px)] flex h-[27px] w-[16px] -translate-y-1/2 items-center justify-center">
        <span className="-rotate-90 text-[8px] leading-[16px] font-semibold whitespace-nowrap text-text-selected">
          AGENT
        </span>
      </span>
    </button>
  );
}
