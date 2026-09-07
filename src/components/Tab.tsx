/**
 * Figma component "Tab" (884:5063) built from "Tab Element" (307:2549).
 * The track is h-28 with a 1px border, so a h-26 element fills it exactly; the
 * selected element adds its own border and sits flush against the track edge.
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
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`flex h-[26px] shrink-0 items-center justify-center rounded-small px-[16px] text-h6 whitespace-nowrap transition-colors ${
              selected
                ? 'border border-border-highlight bg-bg-selected text-text-selected'
                : 'border border-transparent text-text-main hover:text-text-selected'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
