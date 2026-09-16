import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Tab } from './Tab';

const meta = {
  component: Tab,
  tags: ['ai-generated'],
  args: {
    options: ['Web', 'Mobile app', 'Dashboard'],
    value: 'Web',
    onChange: fn(),
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Web: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('button', { name: 'Web' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Mobile app' }));
    await expect(args.onChange).toHaveBeenCalledWith('Mobile app');
  },
};
export const MobileApp: Story = { args: { value: 'Mobile app' } };
export const Dashboard: Story = { args: { value: 'Dashboard' } };
