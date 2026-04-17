
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Confirmar Asignación',
    onClose: () => { console.log('Close clicked'); },
    children: (
      <div className="space-y-4">
        <p>¿Estás seguro de que deseas asignar este lead a <strong>José Rivera</strong>?</p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline">Cancelar</Button>
          <Button variant="secondary">Confirmar</Button>
        </div>
      </div>
    ),
  },
};

export const LargeContent: Story = {
  args: {
    isOpen: true,
    title: 'Términos de Servicio',
    maxWidth: 'lg',
    children: <div className="h-64 overflow-y-auto pr-2">Contenido extenso para probar scroll...</div>,
  },
};