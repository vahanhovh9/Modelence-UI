import { assets } from '../assets';
import type { Version } from '../version';

/**
 * In Figma the builder pane is a flat screenshot of the generated app, not a
 * live layer tree — so it is reproduced here as the exported image, cropped to
 * the region the design frames.
 */
export function BuilderPreview({ reloading, version }: { reloading: boolean; version: Version }) {
  const isV2 = version === 'v2';
  return (
    // -ml-px laps this pane's left border over the agent panel's right one, so
    // the seam reads as a single 1px rule instead of two stacked borders —
    // matching the 1px overlap in Figma's bright frame.
    <div
      className={`relative h-full min-w-0 flex-1 overflow-clip bg-canvas ${
        isV2 ? '' : '-ml-px rounded-r-[12px] border border-canvas-border'
      }`}
    >
      {/*
        Scaled to the panel width and anchored top-left, matching Figma's 713px
        image inside a 737px pane — so the previewed app's own toolbar is never
        cropped, and any slack falls below it on the white background.
      */}
      <img
        src={assets.builderPreview}
        alt="Preview of the generated calendar app"
        className={`absolute top-0 left-0 block w-full max-w-none transition-opacity duration-200 ${
          reloading ? 'opacity-25' : 'opacity-100'
        }`}
      />

      {reloading && (
        <>
          {/* Indeterminate bar along the top edge of the pane. */}
          <div className="absolute inset-x-0 top-0 h-[2px] overflow-clip bg-canvas-border">
            <div className="animate-loadbar h-full w-2/5 bg-brand" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-[26px] animate-spin rounded-full border-2 border-canvas-border border-t-brand" />
          </div>
        </>
      )}
    </div>
  );
}
