/**
 * Figma component "Tab" (884:5063) built from "Tab Element" (307:2549).
 *
 * The track is h-28 with a 1px border. Every element is the full 28px and is
 * pulled out by that 1px, so the selected one covers the track's border rather
 * than sitting inside it — its own edge lands exactly where the track's was,
 * and the chip reads as standing on the switcher instead of inset within it.
 * Every element reserves the same box, so selecting one never reflows the row.
 */
export function Tab<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex h-[28px] shrink-0 items-center rounded-main border border-border-main bg-bg-element-2">
      {options.map((option, index) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`-my-px flex h-[28px] shrink-0 items-center justify-center rounded-main border px-[16px] text-h6 whitespace-nowrap transition-colors ${
              index === 0 ? '-ml-px' : ''
            } ${index === options.length - 1 ? '-mr-px' : ''} ${
              selected
                ? 'border-border-highlight bg-bg-selected text-text-selected'
                : 'border-transparent text-text-main hover:text-text-selected'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
