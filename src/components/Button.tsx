import type { ReactNode } from 'react';

/**
 * Figma component "button" (307:1412 main / 307:1419 secondary) plus the
 * "text button" variant (732:3998).
 *
 * The filled variants are h-26, radius 48, px-12, gap-2 and differ only in fill
 * and text role. The outline variant keeps that shape but trades the fill for a
 * Borders/Border chat edge, so it stands apart from both the filled actions and
 * the plain ones. The text button carries no fill or border at all — it is
 * h-20, px-4, gap-4 on Buttons/Text button, with a hover wash as its only
 * surface — so it reads as a link-weight action beside a filled one.
 */
export function Button({
  variant = 'secondary',
  icon,
  trailing,
  children,
  className = '',
  ...rest
}: {
  variant?: 'main' | 'primary' | 'secondary' | 'outline' | 'text';
  icon?: ReactNode;
  /** Sits after the label — a chevron that says the action leads somewhere. */
  trailing?: ReactNode;
  children?: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const tone =
    variant === 'main'
      ? 'bg-button-main-bg text-grey-0 hover:bg-button-main-hover'
      : variant === 'primary'
        ? 'bg-button-primary-bg text-button-primary-text hover:opacity-90'
        : variant === 'outline'
          ? 'border border-border-chat text-text-selected hover:bg-hover'
          : 'bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover';

  const shape =
    variant === 'text'
      ? 'h-[20px] gap-[4px] rounded-small px-[4px] text-text-button hover:bg-hover'
      : `h-[26px] gap-[2px] rounded-[48px] px-[12px] ${tone}`;

  return (
    <button
      type="button"
      className={`flex shrink-0 items-center justify-center transition-colors ${shape} ${className}`}
      {...rest}
    >
      {icon}
      {children && <span className="text-h6 whitespace-nowrap">{children}</span>}
      {trailing}
    </button>
  );
}
