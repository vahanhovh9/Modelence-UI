import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Centred dialog on a dimmed, blurred backdrop. Closes on Escape or a backdrop
 * click, moves focus in on open and restores it on close.
 */
export function Modal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    // Prefer the first field, else the first control in the panel.
    const target =
      panelRef.current?.querySelector<HTMLElement>('input, textarea') ??
      panelRef.current?.querySelector<HTMLElement>('button');
    target?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreRef.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[24px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex w-[400px] max-w-full flex-col gap-[16px] rounded-block border border-border-highlight bg-bg-primary p-[20px]"
        style={{ boxShadow: '0 24px 60px color-mix(in srgb, var(--color-bg-canvas) 75%, transparent)' }}
      >
        <div className="flex flex-col gap-[6px]">
          <h2 className="text-h3 text-text-selected">{title}</h2>
          {description && <p className="text-body text-text-main">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
