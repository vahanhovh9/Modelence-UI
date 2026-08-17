import { BuilderPreview } from './components/BuilderPreview';
import { ChatPanel } from './components/ChatPanel';
import { EnvironmentRail } from './components/EnvironmentRail';
import { TopBar } from './components/TopBar';

export default function App() {
  return (
    <div className="flex h-full w-full flex-col gap-[8px] bg-grey-900">
      <TopBar />
      <div className="flex min-h-0 w-full flex-1 items-stretch">
        <EnvironmentRail />
        <div className="flex min-w-0 flex-1 items-stretch px-[8px] pb-[12px]">
          <ChatPanel />
          <BuilderPreview />
        </div>
      </div>
    </div>
  );
}
