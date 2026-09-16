import type { Preview } from '@storybook/react-vite';
import { mswLoader } from 'msw-storybook-addon/csf3';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.parameters.theme ?? 'dark';
      document.documentElement.dataset.version = context.parameters.version ?? 'v1';
      return <Story />;
    },
  ],
  loaders: [mswLoader()],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
