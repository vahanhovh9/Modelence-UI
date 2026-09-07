import { useState } from 'react';
import { DeploymentsView } from './DeploymentsView';
import { ConfigurationsView } from './ConfigurationsView';
import { DatabaseView } from './DatabaseView';
import { FilesView } from './FilesView';
import { MonitoringView } from './MonitoringView';
import { UsersView } from './UsersView';
import { ProdMenu, type ProdSection } from './ProdMenu';
import type { PublishPhase, StepId, StepState } from '../publish';

/**
 * Figma "Builder" in the Prod frame (732:4134) — the environment console that
 * replaces the app preview when Prod is the selected environment.
 */
/** Console sections that share the table template. */
const SECTION_VIEWS: Partial<Record<ProdSection, React.ReactNode>> = {
  Files: <FilesView />,
  Configurations: <ConfigurationsView />,
  Database: <DatabaseView />,
  Users: <UsersView />,
  Monitoring: <MonitoringView />,
};

export function ProdPanel({
  onAskAgent,
  agentBusy,
  resolved,
  onDeploy,
  onCancelDeploy,
  active,
  phase,
  steps,
}: {
  onAskAgent: () => void;
  agentBusy: boolean;
  resolved: boolean;
  onDeploy: () => void;
  onCancelDeploy: () => void;
  active: boolean;
  phase: PublishPhase;
  steps: Record<StepId, StepState>;
}) {
  const [section, setSection] = useState<ProdSection>('Deployments');

  return (
    <div className="flex h-full min-w-px flex-1 items-stretch overflow-clip rounded-block">
      <ProdMenu active={section} onSelect={setSection} />
      {section === 'Deployments' ? (
        <DeploymentsView
          onAskAgent={onAskAgent}
          agentBusy={agentBusy}
          resolved={resolved}
          onDeploy={onDeploy}
          onCancelDeploy={onCancelDeploy}
          active={active}
          phase={phase}
          steps={steps}
        />
      ) : SECTION_VIEWS[section] ? (
        <div className="min-w-px flex-1 overflow-y-auto rounded-r-block border-y border-r border-border-main bg-bg-container">
          {SECTION_VIEWS[section]}
        </div>
      ) : (
        <div className="flex min-w-px flex-1 items-center justify-center rounded-r-block border-y border-r border-border-main bg-bg-container">
          <p className="text-body text-text-secondary">{section} — not designed yet</p>
        </div>
      )}
    </div>
  );
}
