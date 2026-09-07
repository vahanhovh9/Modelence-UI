import { useState } from 'react';
import { DashboardHome } from './DashboardHome';
import { DashboardSidebar, type DashSection } from './DashboardSidebar';
import { UsageAndPlan } from './UsageAndPlan';

/**
 * Figma "Prod" account dashboard (1100:11860 dark / 1069:8818 bright).
 * Reached from the Modelence logo. Opening an application from the Dashboard
 * section is what returns you to the app builder, in the chosen environment.
 */
export function Dashboard({ onOpenApp }: { onOpenApp: (environment: string) => void }) {
  const [section, setSection] = useState<DashSection>('Dashboard');

  return (
    <div className="flex h-full w-full items-stretch bg-bg-canvas">
      <DashboardSidebar section={section} onSelect={setSection} />
      <div className="flex min-w-px flex-1 items-stretch py-[8px] pr-[8px]">
        {section === 'Dashboard' ? (
          <DashboardHome onOpenApp={onOpenApp} />
        ) : section === 'Usage and plan' ? (
          <UsageAndPlan />
        ) : (
          <div className="flex min-w-px flex-1 items-center justify-center rounded-block border border-border-main bg-bg-container">
            <p className="text-body text-text-secondary">{section} — not designed yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
