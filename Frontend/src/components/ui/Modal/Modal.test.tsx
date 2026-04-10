import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal Component', () => {
  it('no debe renderizar nada si isOpen es false', () => {
    render(<Modal isOpen={false} title="Test" onClose={vi.fn()}>Content</Modal>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('debe renderizar el título y contenido cuando está abierto', () => {
    render(<Modal isOpen title="Título Modal" onClose={vi.fn()}>Contenido</Modal>);
    expect(screen.getByText('Título Modal')).toBeDefined();
    expect(screen.getByText('Contenido')).toBeDefined();
  });

  it('debe llamar a onClose al hacer clic en el botón de cierre', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Modal isOpen title="Test" onClose={onClose}>Content</Modal>);
    
    await user.click(screen.getByLabelText(/Cerrar modal/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('debe llamar a onClose al hacer clic en el backdrop', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Modal isOpen title="Test" onClose={onClose}>Content</Modal>);
    
    await user.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});