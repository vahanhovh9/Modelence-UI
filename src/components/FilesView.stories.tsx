import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { FilesView } from './FilesView';

const meta = {
  component: FilesView,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FilesView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sandbox: Story = { args: { env: 'sandbox' } };
export const Production: Story = { args: { env: 'prod' } };
export const BeforeLatestDeploy: Story = { args: { env: 'prod', deployed: false } };
export const Grid: Story = {
  args: { env: 'sandbox' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Grid view' }));
    await expect(canvas.getByRole('button', { name: 'Grid view' })).toHaveAttribute('aria-pressed', 'true');
  },
};
