import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MonitoringView } from './MonitoringView';

const meta = {
  component: MonitoringView,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MonitoringView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sandbox: Story = { args: { env: 'sandbox' } };
export const Production: Story = { args: { env: 'prod' } };
export const PastHour: Story = {
  args: { env: 'sandbox' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '1h' }));
    await expect(canvas.getByRole('button', { name: '1h' })).toHaveAttribute('aria-pressed', 'true');
  },
};
