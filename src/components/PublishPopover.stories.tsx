import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { PublishPopover } from './PublishPopover';

const meta = {
  component: PublishPopover,
  tags: ['ai-generated'],
  args: {
    phase: 'idle',
    steps: { build: 'pending', deploy: 'pending', start: 'pending' },
    onStart: fn(),
    onConfirm: fn(),
    onReview: fn(),
    onReset: fn(),
  },
} satisfies Meta<typeof PublishPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadyToPublish: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Publish' }));
    await expect(canvas.getByLabelText('Domain (URL)')).toHaveValue('product-design-diary');
    await userEvent.click(canvas.getAllByRole('button', { name: 'Publish' })[1]);
    await expect(args.onStart).toHaveBeenCalledOnce();
  },
};
export const NeedsConfirmation: Story = {
  args: { phase: 'action-needed', steps: { build: 'done', deploy: 'warning', start: 'pending' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Publishing…' }));
    await expect(canvas.getByRole('heading', { name: 'Action needed' })).toBeVisible();
  },
};
export const Published: Story = {
  args: { phase: 'done', steps: { build: 'done', deploy: 'done', start: 'done' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Published' }));
    await expect(canvas.getByRole('heading', { name: 'Published' })).toBeVisible();
  },
};
