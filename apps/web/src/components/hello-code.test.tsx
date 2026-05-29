import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelloCode } from './hello-code';

// Simula apiFetch para não depender do backend nos testes
vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn().mockResolvedValue({ code: '999888' }),
  ApiError: class ApiError extends Error {
    constructor(public status: number, message: string) { super(message); }
  },
}));

describe('HelloCode', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renderiza o código inicial fornecido via prop', () => {
    render(<HelloCode initialCode="123456" />);
    expect(screen.getByText('123456')).toBeInTheDocument();
  });

  it('exibe o botão "Gerar novo"', () => {
    render(<HelloCode initialCode="000000" />);
    expect(screen.getByRole('button', { name: /gerar novo/i })).toBeInTheDocument();
  });

  it('atualiza o código ao clicar em Gerar novo', async () => {
    render(<HelloCode initialCode="111111" />);
    const btn = screen.getByRole('button', { name: /gerar novo/i });
    fireEvent.click(btn);
    await waitFor(() => expect(screen.getByText('999888')).toBeInTheDocument());
  });

  it('código inicial tem 6 caracteres', () => {
    render(<HelloCode initialCode="042000" />);
    expect(screen.getByText('042000')).toBeInTheDocument();
  });
});
