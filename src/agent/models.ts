import { assets } from '../assets';

/**
 * The coding agents the panel can run, and the models each one offers. The
 * agent picker in the header and the model picker in the composer are one
 * choice in two halves: switching agent swaps the model list underneath it,
 * because a Codex session cannot run Claude's models and vice versa.
 */
export type Agent = {
  name: string;
  mark: string;
  /**
   * True for a polychrome mark that must render as-is (the Claude glyph).
   * Monochrome marks go through the icon mask instead, so they follow the
   * surrounding text colour and stay legible in both themes.
   */
  brand: boolean;
  models: string[];
};

export const AGENTS: Agent[] = [
  {
    name: 'Claude Code',
    mark: assets.claude,
    brand: true,
    models: ['Fable', 'Opus 5', 'Sonnet 5', 'Haiku 4.5'],
  },
  {
    name: 'Codex',
    mark: assets.codex,
    brand: false,
    models: ['GPT-5.1-Codex', 'GPT-5.1-Codex-Mini', 'GPT-5.1'],
  },
];
