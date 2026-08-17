/**
 * Canned agent turns. Nothing here talks to a model — it replays a fixed script
 * so the builder screen demonstrates what a working session looks like.
 */

export type Step =
  | { kind: 'text'; text: string }
  | { kind: 'tool'; tool: string; label: string; input: string; output: string };

export type Turn =
  | { id: number; role: 'user'; text: string }
  | {
      id: number;
      role: 'agent';
      steps: Step[];
      /** Set once the turn finishes; null while working or for the seeded turn. */
      durationMs: number | null;
      /** Steps sit in the dotted gutter while a turn is unfinished. */
      rail: boolean;
      working: boolean;
    };

/** The conversation the Figma frame shows on first paint. */
export const INITIAL_TURNS: Turn[] = [
  {
    id: 1,
    role: 'agent',
    working: false,
    rail: false,
    durationMs: 75_000,
    steps: [
      { kind: 'text', text: "Let me verify what's actually on disk." },
      {
        kind: 'tool',
        tool: 'Bash',
        label: 'Show working tree diff',
        input: 'git diff --stat && echo "=== diff ===" && git diff',
        output:
          ' src/client/app-builder/ChatInput.tsx | 2 +- src/client/index.css                 | 1 + 2 files changed, 2 insertions(+), 1 deletion(-) === diff === diff --git a/src/client/app-builder/ChatInput.tsx b/src/client/app-builder/',
      },
    ],
  },
  { id: 2, role: 'user', text: 'Nice. Can you highlight today and show a couple of sample events?' },
  {
    id: 3,
    role: 'agent',
    working: false,
    rail: true,
    durationMs: null,
    steps: [
      { kind: 'text', text: "Let me verify what's actually on disk." },
      {
        kind: 'tool',
        tool: 'Bash',
        label: 'Show working tree diff',
        input: 'git diff --stat && echo "=== diff ===" && git diffChatInput.tsx b/src/client/app-builder/',
        output: '',
      },
    ],
  },
];

export const SCRIPTS: Step[][] = [
  [
    { kind: 'text', text: "I'll read the month grid before changing anything." },
    {
      kind: 'tool',
      tool: 'Read',
      label: 'src/client/calendar/MonthGrid.tsx',
      input: 'offset 1, limit 80',
      output:
        'const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) }); return days.map((day) => <DayCell key={day.toISOString()} day={day} />);',
    },
    { kind: 'text', text: 'Day cells come straight off the interval, so the highlight belongs in DayCell.' },
    {
      kind: 'tool',
      tool: 'Edit',
      label: 'src/client/calendar/DayCell.tsx',
      input: '+ const today = isToday(day);\n+ className={today ? "bg-black text-white rounded-full" : undefined}',
      output: 'Applied 1 edit to src/client/calendar/DayCell.tsx',
    },
    {
      kind: 'tool',
      tool: 'Bash',
      label: 'Typecheck and build',
      input: 'npm run build',
      output: 'tsc -b && vite build ✓ 35 modules transformed ✓ built in 384ms',
    },
    { kind: 'text', text: "Today's cell now renders as a filled pill and events stack beneath it." },
  ],
  [
    { kind: 'text', text: 'Let me find where the sample events are seeded.' },
    {
      kind: 'tool',
      tool: 'Grep',
      label: 'sampleEvents across the client',
      input: 'rg -n "sampleEvents" src/client',
      output:
        'src/client/calendar/data.ts:12: export const sampleEvents: Event[] = [ src/client/calendar/MonthGrid.tsx:4: import { sampleEvents } from "./data";',
    },
    {
      kind: 'tool',
      tool: 'Edit',
      label: 'src/client/calendar/data.ts',
      input: '+ { id: 9, title: "Retro", date: "2026-07-29" },\n+ { id: 10, title: "Release 2.0", date: "2026-07-24" },',
      output: 'Applied 1 edit to src/client/calendar/data.ts',
    },
    { kind: 'text', text: 'Two more events added — the month header count picks them up automatically.' },
  ],
  [
    { kind: 'text', text: "Let me verify what's actually on disk." },
    {
      kind: 'tool',
      tool: 'Bash',
      label: 'Show working tree diff',
      input: 'git diff --stat',
      output:
        ' src/client/calendar/DayCell.tsx  | 6 ++++-- src/client/calendar/data.ts      | 2 ++ 2 files changed, 6 insertions(+), 2 deletions(-)',
    },
    {
      kind: 'tool',
      tool: 'Bash',
      label: 'Run the calendar tests',
      input: 'npm test -- calendar',
      output: 'Test Files 2 passed (2) Tests 11 passed (11) Duration 1.24s',
    },
    { kind: 'text', text: 'All green, and the diff is limited to the two files we touched.' },
  ],
];
