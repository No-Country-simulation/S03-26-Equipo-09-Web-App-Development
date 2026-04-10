import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input Component', () => {
  it('debe renderizar el label correctamente', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeDefined();
  });

  it('debe mostrar el mensaje de error', () => {
    render(<Input error="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeDefined();
  });
});
