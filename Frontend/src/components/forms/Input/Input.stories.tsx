import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Nombre del Cliente',
    placeholder: 'Escribe aquí...',
    icon: 'person',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'El formato del correo es inválido',
    placeholder: 'usuario@correo.com',
    icon: 'mail',
  },
};