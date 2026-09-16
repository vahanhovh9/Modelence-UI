import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { DeploymentsView } from './DeploymentsView';

const meta = {
  component: DeploymentsView,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
  args: {
    onAskAgent: fn(),
    agentBusy: false,
    resolved: false,
    onDeploy: fn(),
    onCancelDeploy: fn(),
    active: false,
    phase: 'done',
    steps: { build: 'done', deploy: 'done', start: 'done' },
  },
} satisfies Meta<typeof DeploymentsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Settled: Story = {};
export const Deploying: Story = {
  args: { active: true, phase: 'running', steps: { build: 'done', deploy: 'active', start: 'pending' } },
};
export const NeedsAttention: Story = {
  args: { active: true, phase: 'action-needed', steps: { build: 'done', deploy: 'warning', start: 'pending' } },
};
export const Resolved: Story = {
  args: { active: true, phase: 'action-needed', resolved: true, steps: { build: 'done', deploy: 'warning', start: 'pending' } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /^Deploy$/ }));
    await expect(args.onDeploy).toHaveBeenCalledOnce();
  },
};
