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
    <div
      className={`relative h-full min-w-0 flex-1 overflow-clip bg-grey-0 ${
        isV2 ? '' : 'rounded-block border border-border-main'
      }`}
    >
      {/*
        Scaled to the panel width and anchored top-left, so the previewed app's
        own toolbar is never cropped and any slack falls below it on white.
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
          <div className="absolute inset-x-0 top-0 h-[2px] overflow-clip bg-grey-200">
            <div className="animate-loadbar h-full w-2/5 bg-button-main-bg" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-[26px] animate-spin rounded-full border-2 border-grey-200 border-t-button-main-bg" />
          </div>
        </>
      )}
    </div>
  );
}
