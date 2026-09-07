import { useState } from 'react';
import { CodeView } from './CodeView';
import { ConfigurationsView } from './ConfigurationsView';
import { DatabaseView } from './DatabaseView';
import { FilesView } from './FilesView';
import { MonitoringView } from './MonitoringView';
import { UsersView } from './UsersView';
import { ProdMenu, SANDBOX_SECTIONS, type ProdSection } from './ProdMenu';
import { TableSection } from './ConsoleTable';

/**
 * The Sandbox console — what the Dashboard tab opens instead of the app
 * preview. It is the Prod console's shell and navigation, so moving between
 * environments does not mean learning a second layout.
 */
/** Sections that have a designed view; anything else falls through to the placeholder. */
const SECTION_VIEWS: Partial<Record<ProdSection, React.ReactNode>> = {
  Code: (
    <TableSection title="Code">
      <CodeView />
    </TableSection>
  ),
  Files: <FilesView />,
  Configurations: <ConfigurationsView />,
  Database: <DatabaseView />,
  Users: <UsersView />,
  Monitoring: <MonitoringView />,
};

export function SandboxPanel() {
  const [section, setSection] = useState<ProdSection>('Code');

  return (
    <div className="flex h-full min-w-px flex-1 items-stretch overflow-clip rounded-block">
      <ProdMenu
        sections={SANDBOX_SECTIONS}
        label="Sandbox sections"
        active={section}
        onSelect={setSection}
      />
      <div className="min-w-px flex-1 overflow-y-auto rounded-r-block border-y border-r border-border-main bg-bg-container">
        {SECTION_VIEWS[section] ? (
          SECTION_VIEWS[section]
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-body text-text-secondary">{section} — not designed yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
