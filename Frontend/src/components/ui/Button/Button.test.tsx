import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('debe renderizar correctamente el texto del hijo', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
  });

  it('debe llamar a onClick cuando se hace clic', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('debe estar deshabilitado cuando isLoading es true', () => {
    render(<Button isLoading>Cargando</Button>);
    const button = screen.getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(screen.getByLabelText('loading')).toBeDefined();
  });

  it('debe aplicar la clase de variante correcta', () => {
    render(<Button variant="secondary">Botón Verde</Button>);
    expect(screen.getByRole('button').className).toContain('bg-[#008f60]');
  });

  it('debe aplicar la clase de variante tertiary correctamente', () => {
    render(<Button variant="tertiary">Botón Sutil</Button>);
    expect(screen.getByRole('button').className).toContain('text-[#45464e]');
  });

  it('debe renderizar el icono cuando se proporciona', () => {
    render(<Button icon="add">Agregar</Button>);
    expect(screen.getByText('add')).toBeDefined();
  });
});