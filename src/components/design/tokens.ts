import { useEffect, useState } from 'react';

/**
 * The library reads every value out of the running stylesheet rather than
 * repeating it here. A swatch can therefore never drift from index.css, and
 * flipping the theme re-resolves the whole page for free.
 */

export type Group = { name: string; note?: string; tokens: string[] };

export const COLOUR_GROUPS: Group[] = [
  {
    name: 'Surfaces',
    note: 'Canvas is the page, container the pane, primary the card.',
    tokens: [
      'bg-canvas',
      'bg-container',
      'bg-primary',
      'bg-container-secondary',
      'bg-element-1',
      'bg-element-2',
      'bg-selected',
      'bg-selected-2',
      'bg-chat',
    ],
  },
  {
    name: 'Text',
    note: 'Selected is the strongest; button is the fill-free action colour.',
    tokens: ['text-selected', 'text-primary', 'text-main', 'text-secondary', 'text-button'],
  },
  { name: 'Borders', tokens: ['border-main', 'border-secondary', 'border-highlight', 'border-chat'] },
  { name: 'Icons', tokens: ['icon', 'icon-default', 'icon-selected'] },
  {
    name: 'Buttons',
    tokens: [
      'button-main-bg',
      'button-main-hover',
      'button-primary-bg',
      'button-primary-text',
      'button-secondary-bg',
      'button-secondary-hover',
      'button-secondary-text',
    ],
  },
  {
    name: 'Accents',
    note: 'Only green, red and amber are ever used on text; the rest carry meaning in a fill.',
    tokens: [
      'accent-purple-highlight',
      'accent-bg-success',
      'accent-badge-success',
      'accent-green-text',
      'accent-green-border',
      'accent-bg-alert',
      'accent-alert-text',
      'alert-strong',
      'danger',
      'danger-hover',
      'code-text',
    ],
  },
  {
    name: 'Primitives',
    note: 'No modes. These hold the same value in every theme, and the semantic roles above point at them.',
    tokens: [
      'grey-0',
      'grey-50',
      'grey-200',
      'grey-300',
      'grey-400',
      'grey-500',
      'grey-600',
      'grey-900',
      'green-300',
      'green-800',
      'purple-500',
      'purple-800',
      'brand',
      'claude',
    ],
  },
  {
    name: 'Editor & terminal',
    note: 'Two surfaces that break the usual roles — the terminal keeps one dark ground in both themes, and Code carries its own ramp restated per theme.',
    tokens: [
      'terminal',
      'terminal-line',
      'terminal-text',
      'terminal-ok',
      'terminal-warn',
      'code-line',
      'code-plain',
      'code-muted',
      'code-key',
      'code-string',
      'code-number',
      'code-keyword',
    ],
  },
];

const ALL = COLOUR_GROUPS.flatMap((group) => group.tokens);

/** Resolves every colour token against the document, re-reading on theme change. */
export function useColours(theme: string) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      for (const token of ALL) next[token] = style.getPropertyValue(`--color-${token}`).trim();
      setValues(next);
    };
    read();

    /*
     * The theme reaches the page as a data attribute that App writes in its own
     * effect — which React runs after this one, so reading on the prop alone
     * would always be a theme behind. Watching the attribute is the truth.
     */
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-version'] });
    return () => observer.disconnect();
  }, [theme]);

  return values;
}

export const TEXT_STYLES = [
  { name: 'text-h1', sample: 'Deployments' },
  { name: 'text-h3', sample: 'Cloud Containers' },
  { name: 'text-h4', sample: 'Custom Domains' },
  { name: 'text-h5', sample: 'Build Logs' },
  { name: 'text-h6', sample: 'Connect GitHub' },
  { name: 'text-body-large', sample: 'Describe an app you want to build' },
  { name: 'text-body', sample: 'The agent added the missing configuration values.' },
  { name: 'text-small-title', sample: 'Last deployed: 5 days ago' },
  { name: 'text-xs-title', sample: 'ENVIRONMENT' },
  { name: 'text-large-number', sample: '1.24M' },
  { name: 'font-mono-code', sample: 'modelence deploy --env prod' },
];

export const RADII = [
  { name: 'radius-small', use: 'Chips, menu items, icon buttons' },
  { name: 'radius-main', use: 'Cards, fields, the switcher track' },
  { name: 'radius-block', use: 'Panels and the app shell' },
];
