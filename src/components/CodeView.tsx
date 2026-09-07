import { useState } from 'react';
import { assets } from '../assets';
import { Icon } from './Icon';
import { inSync, type Env } from '../environment';

/* ------------------------------------------------------------ the project */

type Node = {
  name: string;
  /** Present on files; a folder has children instead. */
  body?: string;
  children?: Node[];
};

const TREE: Node[] = [
  {
    name: 'user-app',
    children: [
      {
        name: '.cursor',
        children: [
          {
            name: 'mcp.json',
            body: `{
  "mcpServers": {
    "modelence": {
      "url": "https://docs.modelence.com/mcp"
    }
  }
}
`,
          },
        ],
      },
      {
        name: '.modelence',
        children: [
          {
            name: 'tsconfig.tsbuildinfo',
            body: `{"root":["./src/client/index.tsx"],"version":"5.6.3"}
`,
          },
        ],
      },
      { name: 'mobile', children: [{ name: 'app.json', body: '{\n  "expo": { "name": "Modelence Dashboard" }\n}\n' }] },
      { name: 'scripts', children: [{ name: 'postinstall.mjs', body: "import { prepare } from 'modelence/cli';\n\nawait prepare();\n" }] },
      {
        name: 'src',
        children: [
          {
            name: 'client',
            children: [
              {
                name: 'CalendarApp.tsx',
                body: `// CalendarApp.tsx

export default function CalendarApp() {
  return <MonthGrid month="July" year={2026} />;
}
`,
              },
            ],
          },
          {
            name: 'server',
            children: [
              {
                name: 'events.ts',
                body: `import { Module } from 'modelence/server';

export default new Module('events', {
  queries: {
    async list() {
      return db.events.fetch({});
    },
  },
});
`,
              },
            ],
          },
        ],
      },
      { name: '.gitignore', body: 'node_modules\ndist\n.modelence/\n*.local\n' },
      {
        name: '.modelence.env',
        body: '# Written by `modelence setup` — do not commit\nMODELENCE_SERVICE_ENDPOINT=https://api.modelence.com\nMODELENCE_SERVICE_TOKEN=••••••••••••\n',
      },
      { name: '.npmrc', body: '@modelence:registry=https://registry.npmjs.org/\nsave-exact=true\n' },
      {
        name: 'AGENTS.md',
        body: '# user-app\n\nRun `npm run dev` to start the local server.\nClient code lives in `src/client`, server modules in `src/server`.\n',
      },
      {
        name: 'modelence.config.ts',
        body: `import { defineConfig } from 'modelence/config';
import events from './src/server/events';

export default defineConfig({
  modules: [events],
  server: { port: 3000 },
});
`,
      },
      { name: 'package-lock.json', body: '{\n  "name": "user-app",\n  "lockfileVersion": 3,\n  "requires": true\n}\n' },
      {
        name: 'package.json',
        body: `{
  "name": "user-app",
  "private": true,
  "scripts": {
    "dev": "modelence dev",
    "build": "modelence build"
  }
}
`,
      },
      { name: 'tsconfig.json', body: '{\n  "extends": "modelence/tsconfig",\n  "include": ["src"]\n}\n' },
      {
        name: 'vite.config.ts',
        body: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ plugins: [react()] });
`,
      },
    ],
  },
];

const SELECTED = 'user-app/.cursor/mcp.json';
/** Folders the explorer opens on: everything on the path to the selected file. */
const OPEN = ['user-app', 'user-app/.cursor', 'user-app/.modelence', 'user-app/src'];

/*
 * Prod is running deployment #183, which predates the editor config and the
 * mobile target — and its CalendarApp still passes the year as a string. A
 * deploy ships the source, so Deploying brings all of this up to Sandbox.
 */
const NOT_DEPLOYED = ['user-app/.cursor', 'user-app/mobile'];
const OLD_SOURCE: Record<string, string> = {
  'user-app/src/client/CalendarApp.tsx': `// CalendarApp.tsx

export default function CalendarApp() {
  return <MonthGrid month="July" />;
}
`,
};
const PROD_SELECTED = 'user-app/src/client/CalendarApp.tsx';
const PROD_OPEN = ['user-app', 'user-app/.modelence', 'user-app/src', 'user-app/src/client'];

/** The tree as the given environment has it, pruned and rolled back in place. */
function project(nodes: Node[], deployed: boolean, path = ''): Node[] {
  if (deployed) return nodes;
  return nodes.flatMap((node) => {
    const here = path ? `${path}/${node.name}` : node.name;
    if (NOT_DEPLOYED.includes(here)) return [];
    if (node.children) return [{ ...node, children: project(node.children, deployed, here) }];
    const older = OLD_SOURCE[here];
    return [older ? { ...node, body: older } : node];
  });
}

/* ------------------------------------------------------------ highlighting */

const COMMENT = 'text-code-muted';
const KEY = 'text-code-key';
const STRING = 'text-code-string';
const NUMBER = 'text-code-number';
const KEYWORD = 'text-code-keyword';
const PLAIN = 'text-code-plain';

/*
 * A deliberately small tokenizer. It is not a parser — it colours the shapes a
 * reader looks for (comments, strings, JSON keys, keywords, numbers) and leaves
 * everything else plain, which is enough for a still of a file.
 */
const RULES: [RegExp, string][] = [
  [/^(?:\/\/|#).*/, COMMENT],
  // A quoted run followed by a colon is a key, not a value.
  [/^"(?:[^"\\]|\\.)*"(?=\s*:)/, KEY],
  [/^"(?:[^"\\]|\\.)*"/, STRING],
  [/^'(?:[^'\\]|\\.)*'/, STRING],
  [/^`(?:[^`\\]|\\.)*`/, STRING],
  [/^\b(?:import|from|export|default|const|let|async|await|function|return|new|true|false|null)\b/, KEYWORD],
  [/^\b\d[\w.]*\b/, NUMBER],
  [/^[A-Za-z_$][\w$]*/, PLAIN],
  [/^\s+/, PLAIN],
];

function tokenize(line: string) {
  const out: [string, string][] = [];
  let rest = line;
  while (rest.length > 0) {
    const hit = RULES.find(([re]) => re.test(rest));
    if (!hit) {
      out.push([rest[0], PLAIN]);
      rest = rest.slice(1);
      continue;
    }
    const [, tone] = hit;
    const text = hit[0].exec(rest)![0];
    out.push([text, tone]);
    rest = rest.slice(text.length);
  }
  return out;
}

/* -------------------------------------------------------------- explorer */

/** File glyphs take their tint from the extension, as an editor's do. */
function tint(name: string) {
  if (name.endsWith('.json') || name.endsWith('.npmrc') || name.endsWith('.env')) return 'text-alert-strong';
  if (name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.md')) return 'text-accent-purple-highlight';
  return 'text-text-secondary';
}

function Row({
  node,
  path,
  depth,
  open,
  selected,
  onToggle,
  onSelect,
}: {
  node: Node;
  path: string;
  depth: number;
  open: Set<string>;
  selected: string;
  onToggle: (path: string) => void;
  onSelect: (path: string) => void;
}) {
  const isDir = !!node.children;
  const isOpen = open.has(path);
  const isSelected = path === selected;

  return (
    <>
      <button
        type="button"
        aria-expanded={isDir ? isOpen : undefined}
        aria-current={isSelected || undefined}
        onClick={() => (isDir ? onToggle(path) : onSelect(path))}
        style={{ paddingLeft: 8 + depth * 14 }}
        className={`flex h-[26px] w-full shrink-0 items-center gap-[6px] pr-[8px] text-left transition-colors ${
          isSelected
            ? 'bg-button-main-bg text-grey-0'
            : 'text-text-main hover:bg-hover hover:text-text-selected'
        }`}
      >
        <span className={`flex size-[14px] shrink-0 items-center justify-center ${isSelected ? '' : 'text-text-secondary'}`}>
          {isDir ? (
            <Icon
              src={assets.chevron12}
              size={12}
              className={`transition-transform ${isOpen ? '' : '-rotate-90'}`}
            />
          ) : null}
        </span>
        {!isDir && (
          <span className={`shrink-0 ${isSelected ? '' : tint(node.name)}`}>
            <Icon src={assets.navFiles} size={13} />
          </span>
        )}
        <span className="text-body truncate">{node.name}</span>
      </button>

      {isDir &&
        isOpen &&
        node.children!.map((child) => (
          <Row
            key={child.name}
            node={child}
            path={`${path}/${child.name}`}
            depth={depth + 1}
            open={open}
            selected={selected}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
    </>
  );
}

/** Walks the tree for the node a path points at. */
function find(nodes: Node[], parts: string[]): Node | undefined {
  const node = nodes.find((candidate) => candidate.name === parts[0]);
  if (!node) return undefined;
  return parts.length === 1 ? node : node.children && find(node.children, parts.slice(1));
}

/* ------------------------------------------------------------------ view */

/**
 * The Code section: the project's files beside the one that is open. The tree
 * and the editor are a single control — picking a file swaps the breadcrumb
 * and the source, so it reads as an editor rather than a screenshot of one.
 */
export function CodeView({ env = 'sandbox', deployed = true }: { env?: Env; deployed?: boolean }) {
  const synced = inSync(env, deployed);
  const [open, setOpen] = useState(() => new Set(synced ? OPEN : PROD_OPEN));
  const [selected, setSelected] = useState(synced ? SELECTED : PROD_SELECTED);

  const tree = project(TREE, synced);
  // A file can vanish under you when a deploy rolls the tree back or forward,
  // so the breadcrumb follows whatever is actually open, not the last click.
  const open_ = find(tree, selected.split('/')) ? selected : PROD_SELECTED;
  const parts = open_.split('/');
  const file = find(tree, parts);
  const lines = (file?.body ?? '').replace(/\n$/, '').split('\n');

  return (
    <div className="flex h-[min(660px,calc(100vh-240px))] w-full overflow-hidden rounded-main border border-border-main">
      <nav
        aria-label="Project files"
        className="w-[248px] shrink-0 overflow-y-auto border-r border-border-main bg-bg-canvas py-[8px]"
      >
        {tree.map((node) => (
          <Row
            key={node.name}
            node={node}
            path={node.name}
            depth={0}
            open={open}
            selected={open_}
            onToggle={(path) =>
              setOpen((current) => {
                const next = new Set(current);
                if (!next.delete(path)) next.add(path);
                return next;
              })
            }
            onSelect={setSelected}
          />
        ))}
      </nav>

      <div className="flex min-w-px flex-1 flex-col bg-bg-canvas">
        <div className="flex h-[40px] shrink-0 items-center gap-[6px] overflow-hidden border-b border-code-line px-[16px]">
          {parts.map((part, index) => (
            <span key={index} className="flex shrink-0 items-center gap-[6px]">
              {index > 0 && (
                <span className="text-code-muted">
                  <Icon src={assets.chevron12} size={10} className="-rotate-90" />
                </span>
              )}
              <span
                className={`font-mono-code text-[12px] whitespace-nowrap ${
                  index === parts.length - 1 ? 'text-code-plain' : 'text-code-muted'
                }`}
              >
                {part}
              </span>
            </span>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-auto py-[12px]">
          <div className="font-mono-code flex text-[12px] leading-[24px]">
            <div aria-hidden className="shrink-0 px-[16px] text-right text-code-muted select-none">
              {lines.map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>
            <pre className="min-w-px flex-1 pr-[16px]">
              {lines.map((line, index) => (
                <div key={index} className="whitespace-pre">
                  {line.length === 0
                    ? ' '
                    : tokenize(line).map(([text, tone], token) => (
                        <span key={token} className={tone}>
                          {text}
                        </span>
                      ))}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
