import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { ProdMenu, SANDBOX_SECTIONS } from './ProdMenu';

const meta = {
  component: ProdMenu,
  tags: ['ai-generated'],
  args: { active: 'Environment', onSelect: fn() },
} satisfies Meta<typeof ProdMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Production: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('button', { name: 'Environment' })).toHaveAttribute('aria-current', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Files' }));
    await expect(args.onSelect).toHaveBeenCalledWith('Files');
  },
};
export const DeploymentsSelected: Story = { args: { active: 'Deployments' } };
export const Sandbox: Story = {
  args: { sections: SANDBOX_SECTIONS, label: 'Sandbox sections', active: 'Code' },
};
