import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const LeadNuevo: Story = {
  args: {
    children: 'Lead Nuevo',
    variant: 'primary',
  },
};

export const Contactado: Story = {
  args: {
    children: 'Contactado',
    variant: 'success',
  },
};

export const EnNegociacion: Story = {
  args: {
    children: 'En Negociación',
    variant: 'info',
  },
};

export const Perdido: Story = {
  args: {
    children: 'Perdido',
    variant: 'neutral',
  },
};