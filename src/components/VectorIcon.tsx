import { assets } from '../assets';

type IconSpec = {
  src: string;
  /** Frame size in px — icons are square in this design system. */
  size: number;
  /** Glyph bounding box within the frame, as a CSS `inset` shorthand. */
  inset: string;
  /** Stroke bleed around the glyph box — negative, so strokes are not clipped. */
  bleed?: string;
};

/**
 * Figma exports icon glyphs without their surrounding frame, so each one has to
 * be re-seated inside a fixed-size box using the insets from the design file.
 * Both dimensions are always explicit — an `auto` here blows the SVG up to its
 * intrinsic size.
 */
export function VectorIcon({ src, size, inset, bleed = '0', className = '' }: IconSpec & { className?: string }) {
  return (
    <div className={`relative shrink-0 overflow-clip ${className}`} style={{ width: size, height: size }}>
      <div className="absolute" style={{ inset }}>
        <div className="absolute" style={{ inset: bleed }}>
          <img src={src} alt="" className="block size-full max-w-none" />
        </div>
      </div>
    </div>
  );
}

export const icons = {
  box: { src: assets.iconBox, size: 16, inset: '8.34% 12.5% 8% 12.5%', bleed: '-5.23% -5.83%' },
  zapRail: { src: assets.iconZapRail, size: 16, inset: '8.33% 12.5%', bleed: '-5.25% -5.83%' },
  zapUpgrade: { src: assets.iconZapUpgrade, size: 16, inset: '8.33% 12.5%', bleed: '-4.5% -5%' },
  plus: { src: assets.iconPlus, size: 16, inset: '20.83%', bleed: '-7.5%' },
  check: { src: assets.iconCheck, size: 16, inset: '25% 16.67% 29.17% 16.67%', bleed: '-10.91% -7.5%' },
  refresh: { src: assets.iconRefresh, size: 12, inset: '12.51% 4.17%', bleed: '-6.67% -5.45%' },
  externalLink: { src: assets.iconExternalLink, size: 16, inset: '12.5%', bleed: '-5%' },
  chevronDown12: { src: assets.iconChevronDown12, size: 12, inset: '37.5% 25%', bleed: '-18.33% -9.17%' },
  chevronDown16: { src: assets.iconChevronDown16, size: 16, inset: '37.5% 25%', bleed: '-20% -10%' },
  chevronDownModel: { src: assets.iconChevronDownModel, size: 12, inset: '37.5% 25%', bleed: '-18.33% -9.17%' },
  arrowUp: { src: assets.iconArrowUp, size: 16, inset: '20.83%', bleed: '-8.57%' },
} satisfies Record<string, IconSpec>;
