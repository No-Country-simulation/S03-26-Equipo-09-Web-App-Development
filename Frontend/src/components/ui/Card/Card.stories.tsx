
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'dark', 'glass'] },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <div className="space-y-2">
        <h3 className="font-bold text-[#182442]">Información de Lead</h3>
        <p className="text-sm text-slate-500">Detalles de contacto y última interacción.</p>
      </div>
    ),
  },
};

export const Dark: Story = {
  args: {
    variant: 'dark',
    children: (
      <div className="text-center">
        <span className="text-3xl font-bold">91%</span>
        <p className="text-xs uppercase tracking-widest opacity-70">Tasa de Cierre</p>
      </div>
    ),
  },
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: <p>Card con efecto de desenfoque para modales o overlays.</p>,
  },
};