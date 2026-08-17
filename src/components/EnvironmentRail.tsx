import { assets } from '../assets';
import { VectorIcon, icons } from './VectorIcon';

function Separator() {
  return (
    <div className="relative h-[20px] w-0 shrink-0">
      <div className="absolute inset-y-0 -inset-x-[0.5px]">
        <img src={assets.railSeparator} alt="" className="block size-full max-w-none" />
      </div>
    </div>
  );
}

export function EnvironmentRail() {
  return (
    <nav
      aria-label="Environment"
      className="flex w-[56px] shrink-0 items-start justify-center self-stretch overflow-clip p-[8px]"
    >
      <div className="flex w-[36px] shrink-0 flex-col items-center gap-[4px]">
        <div className="flex w-full shrink-0 flex-col items-center gap-[4px]">
          <button
            type="button"
            aria-current="true"
            className="flex size-[28px] shrink-0 items-center justify-center rounded-[8px] bg-grey-600 p-[6px] transition-colors hover:bg-grey-500"
          >
            <VectorIcon {...icons.box} />
          </button>
          <span className="w-full text-center text-[9px] whitespace-nowrap text-white">Sandbox</span>
        </div>

        <Separator />

        <div className="flex w-full shrink-0 flex-col items-center gap-[4px]">
          <button
            type="button"
            className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] p-[6px] transition-colors hover:bg-white/10"
          >
            <VectorIcon {...icons.zapRail} />
          </button>
          <span className="w-full text-center text-[9px] whitespace-nowrap text-grey-400">Prod</span>
        </div>

        <Separator />

        <div className="flex w-full shrink-0 flex-col items-center">
          <button
            type="button"
            aria-label="Add environment"
            className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] p-[6px] transition-colors hover:bg-white/10"
          >
            <VectorIcon {...icons.plus} />
          </button>
        </div>
      </div>
    </nav>
  );
}
