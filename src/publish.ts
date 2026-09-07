import { useCallback, useEffect, useRef, useState } from 'react';

export type PublishPhase = 'idle' | 'running' | 'action-needed' | 'done';
export type StepId = 'build' | 'deploy' | 'start';
export type StepState = 'pending' | 'active' | 'warning' | 'done';

export const PUBLISH_STEPS: { id: StepId; title: string; subtitle: string }[] = [
  { id: 'build', title: 'Build', subtitle: 'Compiling your app' },
  { id: 'deploy', title: 'Deploy', subtitle: 'Provisioning container' },
  { id: 'start', title: 'App Started', subtitle: 'Warming up server' },
];

const IDLE_STEPS: Record<StepId, StepState> = { build: 'pending', deploy: 'pending', start: 'pending' };

/**
 * Drives the publish timeline. It lives above the popover so a deploy keeps
 * running while the popover is dismissed, and picks up where it left off when
 * the button is clicked again.
 */
export function usePublish() {
  const [phase, setPhase] = useState<PublishPhase>('idle');
  const [steps, setSteps] = useState<Record<StepId, StepState>>(IDLE_STEPS);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const at = useCallback((ms: number, run: () => void) => {
    timers.current.push(setTimeout(run, ms));
  }, []);

  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    clear();
    setPhase('running');
    setSteps({ build: 'active', deploy: 'pending', start: 'pending' });
    at(1600, () => setSteps((s) => ({ ...s, build: 'done', deploy: 'active' })));
    // The deploy pauses on the missing Prod config rather than shipping blind.
    at(3400, () => {
      setSteps((s) => ({ ...s, deploy: 'warning' }));
      setPhase('action-needed');
    });
  }, [at, clear]);

  const confirm = useCallback(() => {
    clear();
    setPhase('running');
    setSteps((s) => ({ ...s, deploy: 'active' }));
    at(1500, () => setSteps((s) => ({ ...s, deploy: 'done', start: 'active' })));
    at(3100, () => {
      setSteps((s) => ({ ...s, start: 'done' }));
      setPhase('done');
    });
  }, [at, clear]);

  const reset = useCallback(() => {
    clear();
    setPhase('idle');
    setSteps(IDLE_STEPS);
  }, [clear]);

  return { phase, steps, start, confirm, reset };
}
