import { assets } from '../assets';
import { AGENTS, type Agent } from '../agent/models';
import { Dropdown, MenuItem } from './Dropdown';
import { BrandIcon, Icon } from './Icon';

/** The agent's mark: polychrome marks render as-is, monochrome ones are tinted. */
export function AgentMark({ agent, size = 16 }: { agent: Agent; size?: number }) {
  return agent.brand ? (
    <BrandIcon src={agent.mark} size={size} />
  ) : (
    <Icon src={agent.mark} size={size} />
  );
}

/**
 * Figma component "Agent" (728:3387) — the strip above the transcript naming
 * the running agent, with expand and collapse affordances on the right. The
 * name is a picker: it swaps which coding agent is driving the session.
 */
export function AgentHeader({
  agent,
  onAgentChange,
  eyebrow,
  onCollapse,
  onToggleFloat,
  floating = false,
}: {
  agent: Agent;
  onAgentChange: (agent: Agent) => void;
  /** Names the agent's role when it is not the default build agent. */
  eyebrow?: string;
  onCollapse?: () => void;
  onToggleFloat?: () => void;
  floating?: boolean;
}) {
  return (
    // Marked as the drag handle so the floating window moves by its header.
    <div data-drag-handle className={`flex w-full shrink-0 items-center justify-between ${floating ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <div className="flex min-w-px items-center gap-[8px]">
        {eyebrow && (
          <span className="text-[10px] font-semibold tracking-[0.08em] whitespace-nowrap text-text-secondary uppercase">
            {eyebrow}
          </span>
        )}
        <Dropdown
          panelWidth="w-[168px]"
          trigger={({ open, toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              className="-mx-[4px] flex h-[20px] shrink-0 items-center gap-[4px] rounded-small px-[4px] text-text-selected transition-colors hover:bg-hover"
            >
              <span className="flex shrink-0 items-center gap-[4px]">
                <AgentMark agent={agent} />
                <span className="text-h6 whitespace-nowrap">{agent.name}</span>
              </span>
              <Icon
                src={assets.chevronAgent}
                size={12}
                className={`transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        >
          {({ close }) =>
            AGENTS.map((option) => (
              <MenuItem
                key={option.name}
                label={option.name}
                selected={option.name === agent.name}
                icon={
                  <span className="flex size-[16px] shrink-0 items-center justify-center text-text-main">
                    <AgentMark agent={option} />
                  </span>
                }
                onClick={() => {
                  onAgentChange(option);
                  close();
                }}
              />
            ))
          }
        </Dropdown>
      </div>

      <div className="flex shrink-0 items-center gap-[12px] text-icon">
        <button
          type="button"
          aria-label={floating ? 'Dock panel back' : 'Undock panel into a floating window'}
          onClick={onToggleFloat}
          className="-m-[4px] shrink-0 rounded-small p-[4px] transition-colors hover:bg-hover"
        >
          {/* The same arrow, turned inward, reads as the inverse of undocking. */}
          <Icon src={assets.expand} size={12} className={floating ? 'rotate-180' : ''} />
        </button>
        <button
          type="button"
          aria-label="Collapse panel"
          onClick={onCollapse}
          className="-m-[4px] flex size-[20px] shrink-0 items-center justify-center rounded-small transition-colors hover:bg-hover"
        >
          {/* Figma draws this as a bar inset within a 12px box, not an icon. */}
          <span aria-hidden className="block h-[1.5px] w-[9px] rounded-[3px] bg-current" />
        </button>
      </div>
    </div>
  );
}
