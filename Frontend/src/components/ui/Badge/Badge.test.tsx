import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('debe renderizar el contenido correctamente', () => {
    render(<Badge>Nuevo</Badge>);
    expect(screen.getByText('Nuevo')).toBeDefined();
  });

  it('debe aplicar la clase de variante primary (Indigo)', () => {
    render(<Badge variant="primary">Indigo</Badge>);
    const badge = screen.getByText('Indigo');
    expect(badge.className).toContain('text-[#182442]');
  });

  it('debe aplicar la clase de variante success (Emerald)', () => {
    render(<Badge variant="success">Green</Badge>);
    const badge = screen.getByText('Green');
    // Verificamos que contenga el color corporativo secundario
    expect(badge.className).toContain('text-[#008f60]');
  });

  it('debe aplicar la clase de variante error correctamente', () => {
    render(<Badge variant="error">Fallo</Badge>);
    const badge = screen.getByText('Fallo');
    expect(badge.className).toContain('text-red-700');
  });
});