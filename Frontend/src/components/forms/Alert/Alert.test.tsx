import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from './Alert';

describe('Alert Component', () => {
  it('debe renderizar el título y el contenido correctamente', () => {
    render(<Alert title="Test Title">Test Message</Alert>);
    expect(screen.getByText('Test Title')).toBeDefined();
    expect(screen.getByText('Test Message')).toBeDefined();
  });

  it('debe tener el rol de accesibilidad alert', () => {
    render(<Alert>Alerta crítica</Alert>);
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('debe llamar a onClose cuando se hace clic en el botón de cerrar', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Alert onClose={onClose}>Mensaje</Alert>);
    
    const closeButton = screen.getByLabelText(/cerrar alerta/i);
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});