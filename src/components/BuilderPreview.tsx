import { assets } from '../assets';

/**
 * In Figma the builder pane is a flat screenshot of the generated app, not a
 * live layer tree — so it is reproduced here as the exported image, cropped to
 * the region the design frames.
 */
export function BuilderPreview() {
  return (
    <div className="relative h-full min-w-0 flex-1 overflow-clip rounded-r-[12px] border border-grey-100 bg-white">
      {/*
        Scaled to the panel width and anchored top-left, matching Figma's 713px
        image inside a 737px pane — so the previewed app's own toolbar is never
        cropped, and any slack falls below it on the white background.
      */}
      <img
        src={assets.builderPreview}
        alt="Preview of the generated calendar app"
        className="absolute top-0 left-0 block w-full max-w-none"
      />
    </div>
  );
}
