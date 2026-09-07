import type { CSSProperties } from 'react';

/**
 * Figma bakes a fixed colour into every icon export, which survives neither
 * selection nor a theme change. Painting the glyph as a mask over
 * `currentColor` instead lets CSS drive it, so one asset serves both themes.
 */
export function maskStyle(src: string, extra?: CSSProperties): CSSProperties {
  return {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    ...extra,
  };
}

/** A monochrome icon that takes its colour from the nearest text colour. */
export function Icon({ src, size = 16, className = '' }: { src: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`block shrink-0 bg-current ${className}`}
      style={{ width: size, height: size, ...maskStyle(src) }}
    />
  );
}

/**
 * A multi-colour mark (the Modelence logo, the Claude glyph) — never tinted.
 * Width and height are independent: the logo mark is 19x23, so forcing a single
 * `size` onto both axes squashes it.
 */
export function BrandIcon({
  src,
  size = 16,
  width,
  height,
  className = '',
  alt = '',
}: {
  src: string;
  /** Shorthand for a square mark; `width`/`height` override it. */
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`block max-w-none shrink-0 ${className}`}
      style={{ width: width ?? size, height: height ?? size }}
    />
  );
}
