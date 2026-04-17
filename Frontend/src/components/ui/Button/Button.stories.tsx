import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Confirmar Acción',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Guardar Cambios',
    variant: 'secondary',
    icon: 'save',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Acción Sutil',
    variant: 'tertiary',
    icon: 'more_horiz',
  },
};

export const Loading: Story = {
  args: {
    children: 'Enviando...',
    isLoading: true,
    variant: 'primary',
  },
};