import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error de Autenticación',
    children: 'Las credenciales ingresadas no coinciden con nuestros registros. Por favor, verifica e intenta de nuevo.',
    onClose: () => { alert('Cerrado'); },
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Acción Exitosa',
    children: 'El lead ha sido reasignado correctamente a José Rivera.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Se han sincronizado 45 mensajes nuevos de WhatsApp.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Tu cuota de correos de Brevo está al 90% de su capacidad.',
  },
};