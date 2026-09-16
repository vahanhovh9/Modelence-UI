import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { ThemeSwitcher } from './ThemeSwitcher';

const meta = {
  component: ThemeSwitcher,
  tags: ['ai-generated'],
  args: { theme: 'dark', onChange: fn() },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Bright' }));
    await expect(args.onChange).toHaveBeenCalledWith('bright');
  },
};
export const Bright: Story = { args: { theme: 'bright' }, parameters: { theme: 'bright' } };
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
