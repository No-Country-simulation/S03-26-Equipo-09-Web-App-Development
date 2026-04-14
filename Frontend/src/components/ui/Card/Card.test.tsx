import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('debe renderizar correctamente el contenido hijo', () => {
    render(<Card>Contenido de prueba</Card>);
    expect(screen.getByText('Contenido de prueba')).toBeDefined();
  });

  it('debe aplicar la clase de variante dark correctamente', () => {
    render(<Card variant="dark">Dark Card</Card>);
    const container = screen.getByTestId('card-container');
    expect(container.className).toContain('bg-[#182442]');
    expect(container.className).toContain('text-white');
  });

  it('debe renderizarse como un elemento semántico diferente si se solicita', () => {
    const { container } = render(<Card as="article">Contenido</Card>);
    const articleElement = container.querySelector('article');
    expect(articleElement).not.toBeNull();
  });

  it('debe permitir la extensión de clases mediante className', () => {
    render(<Card className="my-custom-margin">Custom</Card>);
    const container = screen.getByTestId('card-container');
    expect(container.className).toContain('my-custom-margin');
  });
});