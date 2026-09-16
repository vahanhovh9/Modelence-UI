import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from './Button';

const meta = {
  component: Button,
  tags: ['ai-generated'],
  args: { children: 'Publish' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = { args: { variant: 'main' } };
export const Primary: Story = { args: { variant: 'primary', children: 'Confirm' } };
export const Secondary: Story = { args: { children: 'View Schema' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Upgrade' } };
export const Text: Story = { args: { variant: 'text', children: 'See migrations' } };
export const Disabled: Story = {
  args: { variant: 'main', disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Publish' })).toBeDisabled();
  },
};

export const CssCheck: Story = {
  args: { variant: 'main' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Publish' });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(113, 81, 245)');
  },
};
