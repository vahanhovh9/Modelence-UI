import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ConfigurationsView } from './ConfigurationsView';

const meta = {
  component: ConfigurationsView,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ConfigurationsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sandbox: Story = { args: { env: 'sandbox' } };
export const ProductionMissingKeys: Story = {
  args: { env: 'prod', deployed: false, fixed: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('payments.stripeKey')).not.toBeInTheDocument();
  },
};
export const ProductionResolved: Story = {
  args: { env: 'prod', deployed: false, fixed: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('payments.stripeKey')).toBeVisible();
  },
};
