import { useCallback, useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react';

export type Rect = { x: number; y: number; w: number; h: number };
export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const MIN_W = 320;
const MIN_H = 360;
/** Keeps the window from being dragged flush against the viewport edge. */
const MARGIN = 8;

/** Opens centred over the canvas at roughly twice the docked width. */
export function defaultRect(): Rect {
  const w = Math.min(560, window.innerWidth - MARGIN * 2);
  const h = Math.min(620, window.innerHeight - MARGIN * 2);
  return {
    x: Math.round((window.innerWidth - w) / 2),
    y: Math.round((window.innerHeight - h) / 2),
    w,
    h,
  };
}

function clamp(rect: Rect): Rect {
  const w = Math.min(Math.max(rect.w, MIN_W), window.innerWidth - MARGIN * 2);
  const h = Math.min(Math.max(rect.h, MIN_H), window.innerHeight - MARGIN * 2);
  return {
    w,
    h,
    x: Math.min(Math.max(rect.x, MARGIN), window.innerWidth - w - MARGIN),
    y: Math.min(Math.max(rect.y, MARGIN), window.innerHeight - h - MARGIN),
  };
}

/** Drag-to-move and edge/corner resize for the undocked agent window. */
export function useFloatingWindow(active: boolean) {
  const [rect, setRect] = useState<Rect>(() => ({ x: 0, y: 0, w: 560, h: 620 }));

  const reset = useCallback(() => setRect(defaultRect()), []);

  // Keep the window on screen when the viewport changes under it.
  useEffect(() => {
    if (!active) return;
    const onResize = () => setRect((current) => clamp(current));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active]);

  const track = (onMove: (dx: number, dy: number) => void, event: ReactPointerEvent, cursor: string) => {
    const startX = event.clientX;
    const startY = event.clientY;

    const move = (moveEvent: PointerEvent) => onMove(moveEvent.clientX - startX, moveEvent.clientY - startY);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    // Held on the body so the cursor survives leaving the handle mid-gesture.
    document.body.style.cursor = cursor;
    document.body.style.userSelect = 'none';
  };

  const startDrag = (event: ReactPointerEvent) => {
    event.preventDefault();
    const start = rect;
    track((dx, dy) => setRect(clamp({ ...start, x: start.x + dx, y: start.y + dy })), event, 'grabbing');
  };

  const startResize = (event: ReactPointerEvent, dir: ResizeDir) => {
    event.preventDefault();
    event.stopPropagation();
    const s = rect;
    const cursor =
      dir === 'n' || dir === 's' ? 'ns-resize'
      : dir === 'e' || dir === 'w' ? 'ew-resize'
      : dir === 'ne' || dir === 'sw' ? 'nesw-resize'
      : 'nwse-resize';

    track((dx, dy) => {
      let { x, y, w, h } = s;
      if (dir.includes('e')) w = s.w + dx;
      if (dir.includes('w')) { w = s.w - dx; x = s.x + dx; }
      if (dir.includes('s')) h = s.h + dy;
      if (dir.includes('n')) { h = s.h - dy; y = s.y + dy; }
      // At the minimum, pin the edge being dragged rather than sliding the window.
      if (w < MIN_W) { if (dir.includes('w')) x = s.x + s.w - MIN_W; w = MIN_W; }
      if (h < MIN_H) { if (dir.includes('n')) y = s.y + s.h - MIN_H; h = MIN_H; }
      setRect(clamp({ x, y, w, h }));
    }, event, cursor);
  };

  return { rect, reset, startDrag, startResize };
}

export const RESIZE_HANDLES: { dir: ResizeDir; className: string }[] = [
  { dir: 'n', className: 'top-0 right-[12px] left-[12px] h-[6px] cursor-ns-resize' },
  { dir: 's', className: 'bottom-0 right-[12px] left-[12px] h-[6px] cursor-ns-resize' },
  { dir: 'w', className: 'top-[12px] bottom-[12px] left-0 w-[6px] cursor-ew-resize' },
  { dir: 'e', className: 'top-[12px] right-0 bottom-[12px] w-[6px] cursor-ew-resize' },
  { dir: 'nw', className: 'top-0 left-0 size-[14px] cursor-nwse-resize' },
  { dir: 'ne', className: 'top-0 right-0 size-[14px] cursor-nesw-resize' },
  { dir: 'sw', className: 'bottom-0 left-0 size-[14px] cursor-nesw-resize' },
  { dir: 'se', className: 'right-0 bottom-0 size-[14px] cursor-nwse-resize' },
];
