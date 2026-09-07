import { useState } from 'react';
import { CodeView } from './CodeView';
import { DeploymentsView } from './DeploymentsView';
import { EnvironmentView } from './EnvironmentView';
import { ConfigurationsView } from './ConfigurationsView';
import { DatabaseView } from './DatabaseView';
import { FilesView } from './FilesView';
import { MonitoringView } from './MonitoringView';
import { UsersView } from './UsersView';
import { ProdMenu, type ProdSection } from './ProdMenu';
import { TableSection } from './ConsoleTable';
import type { PublishPhase, StepId, StepState } from '../publish';

/**
 * Figma "Builder" in the Prod frame (732:4134) — the environment console that
 * replaces the app preview when Prod is the selected environment.
 */

export function ProdPanel({
  onAskAgent,
  agentBusy,
  resolved,
  onDeploy,
  onCancelDeploy,
  active,
  phase,
  steps,
  deployed,
}: {
  onAskAgent: () => void;
  agentBusy: boolean;
  resolved: boolean;
  onDeploy: () => void;
  onCancelDeploy: () => void;
  active: boolean;
  phase: PublishPhase;
  steps: Record<StepId, StepState>;
  /** True once a deploy has landed, which is what brings Prod up to Sandbox. */
  deployed: boolean;
}) {
  const [section, setSection] = useState<ProdSection>('Deployments');

  /*
   * Prod shows what was last deployed to it. Code, Files and Configurations are
   * what a deploy ships, so they lag until one lands; Users, Database and
   * Monitoring are Prod's own runtime state and never copy from Sandbox.
   */
  const views: Partial<Record<ProdSection, React.ReactNode>> = {
    Environment: <EnvironmentView />,
    Code: (
      <TableSection title="Code">
        <CodeView env="prod" deployed={deployed} />
      </TableSection>
    ),
    Files: <FilesView env="prod" deployed={deployed} />,
    Configurations: <ConfigurationsView env="prod" deployed={deployed} fixed={resolved} />,
    Database: <DatabaseView env="prod" />,
    Users: <UsersView env="prod" />,
    Monitoring: <MonitoringView env="prod" />,
  };

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
      ) : views[section] ? (
        <div className="min-w-px flex-1 overflow-y-auto rounded-r-block border-y border-r border-border-main bg-bg-container">
          {views[section]}
        </div>
      ) : (
        <div className="flex min-w-px flex-1 items-center justify-center rounded-r-block border-y border-r border-border-main bg-bg-container">
          <p className="text-body text-text-secondary">{section} — not designed yet</p>
        </div>
      )}
    </div>
  );
}
