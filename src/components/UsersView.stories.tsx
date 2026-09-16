import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { UsersView } from './UsersView';

const meta = {
  component: UsersView,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UsersView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sandbox: Story = { args: { env: 'sandbox' } };
export const Production: Story = { args: { env: 'prod' } };
export const SearchNoMatches: Story = {
  args: { env: 'sandbox' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Search users' }));
    await userEvent.type(canvas.getByPlaceholderText('Search by handle or email...'), 'nobody@example.com');
    await expect(canvas.getByText('No users match “nobody@example.com”')).toBeVisible();
  },
};
