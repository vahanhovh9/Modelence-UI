import { useCallback, useEffect, useRef, useState } from 'react';
import { INITIAL_TURNS, SCRIPTS, type Step, type Turn } from './script';

const TYPE_INTERVAL_MS = 14;
const TYPE_CHUNK = 3;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function formatDuration(ms: number) {
  const seconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}m ${rest} s` : `${seconds} s`;
}

/**
 * Replays a scripted agent turn: steps appear one at a time, text and tool
 * output type in, and a live timer runs until the turn settles.
 */
export function useFakeAgent() {
  const [turns, setTurns] = useState<Turn[]>(INITIAL_TURNS);
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Bumped on stop/unmount so an in-flight replay knows to abandon itself.
  const runId = useRef(0);
  const nextId = useRef(INITIAL_TURNS.length + 1);
  const scriptIndex = useRef(0);

  useEffect(() => {
    return () => {
      runId.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!busy) return;
    const startedAt = Date.now();
    setElapsed(0);
    const timer = setInterval(() => setElapsed(Date.now() - startedAt), 200);
    return () => clearInterval(timer);
  }, [busy]);

  const patchAgentTurn = useCallback((id: number, patch: (turn: Extract<Turn, { role: 'agent' }>) => Turn) => {
    setTurns((prev) => prev.map((turn) => (turn.id === id && turn.role === 'agent' ? patch(turn) : turn)));
  }, []);

  const stop = useCallback(() => {
    runId.current += 1;
    setBusy(false);
    setTurns((prev) =>
      prev.map((turn) =>
        turn.role === 'agent' && turn.working
          ? { ...turn, working: false, rail: false, durationMs: turn.durationMs ?? 0 }
          : turn
      )
    );
  }, []);

  const send = useCallback(
    async (text: string) => {
      const prompt = text.trim();
      if (!prompt || busy) return;

      runId.current += 1;
      const myRun = runId.current;
      const alive = () => runId.current === myRun;

      const userId = nextId.current++;
      const agentId = nextId.current++;
      const script = SCRIPTS[scriptIndex.current % SCRIPTS.length];
      scriptIndex.current += 1;

      setTurns((prev) => [
        ...prev,
        { id: userId, role: 'user', text: prompt },
        { id: agentId, role: 'agent', steps: [], durationMs: null, rail: true, working: true },
      ]);
      setBusy(true);

      const startedAt = Date.now();
      const acc: Step[] = [];
      const flush = () => patchAgentTurn(agentId, (turn) => ({ ...turn, steps: [...acc] }));

      /** Types `full` into the last accumulated step via `apply`. */
      const typeInto = async (full: string, apply: (partial: string) => void) => {
        for (let i = 0; i < full.length; i += TYPE_CHUNK) {
          if (!alive()) return false;
          apply(full.slice(0, i + TYPE_CHUNK));
          flush();
          await sleep(TYPE_INTERVAL_MS);
        }
        if (!alive()) return false;
        apply(full);
        flush();
        return true;
      };

      await sleep(320);

      for (const step of script) {
        if (!alive()) return;

        if (step.kind === 'text') {
          acc.push({ kind: 'text', text: '' });
          const last = acc.length - 1;
          if (!(await typeInto(step.text, (partial) => (acc[last] = { kind: 'text', text: partial })))) return;
        } else {
          acc.push({ kind: 'tool', tool: step.tool, label: step.label, input: '', output: '' });
          const last = acc.length - 1;
          flush();
          await sleep(260);

          if (!(await typeInto(step.input, (partial) => (acc[last] = { ...step, input: partial, output: '' })))) return;
          await sleep(520);
          if (!(await typeInto(step.output, (partial) => (acc[last] = { ...step, output: partial })))) return;
        }

        await sleep(340);
      }

      if (!alive()) return;
      patchAgentTurn(agentId, (turn) => ({
        ...turn,
        working: false,
        rail: false,
        durationMs: Date.now() - startedAt,
      }));
      setBusy(false);
    },
    [busy, patchAgentTurn]
  );

  return { turns, busy, elapsed, send, stop };
}
