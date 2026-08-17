import { useState } from 'react';

/**
 * Sits on the seam between the agent panel and the preview. Zero-width in the
 * flex row with an 8px absolutely-positioned hit area, so grabbing it never
 * shifts the layout it controls.
 */
export function ResizeHandle({
  width,
  min,
  max,
  defaultWidth,
  onChange,
}: {
  width: number;
  min: number;
  max: number;
  defaultWidth: number;
  onChange: (width: number) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const clamp = (value: number) => Math.min(max, Math.max(min, value));

  const onPointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;
    setDragging(true);

    const move = (moveEvent: PointerEvent) => onChange(clamp(startWidth + moveEvent.clientX - startX));
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    // Held on the body so the cursor survives leaving the 8px strip mid-drag.
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div className="relative z-30 w-0 shrink-0">
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize agent panel"
        aria-valuenow={Math.round(width)}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onDoubleClick={() => onChange(defaultWidth)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') onChange(clamp(width - 16));
          if (event.key === 'ArrowRight') onChange(clamp(width + 16));
        }}
        className="group absolute inset-y-0 -left-[4px] w-[8px] cursor-col-resize focus:outline-none"
      >
        <div
          className={`absolute inset-y-[14px] left-[3px] w-[2px] rounded-full transition-colors ${
            dragging ? 'bg-publish' : 'bg-transparent group-hover:bg-border-strong group-focus:bg-border-strong'
          }`}
        />
      </div>
    </div>
  );
}
