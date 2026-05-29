'use client';

import { useState, useTransition } from 'react';
import { apiFetch, ApiError } from '@/lib/api';

interface Props {
  initialCode: string;
}

export function HelloCode({ initialCode }: Props) {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      try {
        const data = await apiFetch<{ code: string }>('/hello', {
          cache: 'no-store',
        });
        setCode(data.code);
        setError(null);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? `Erro ${err.status}: ${err.message}`
            : 'Não foi possível conectar ao servidor.';
        setError(message);
      }
    });
  }

  return (
    <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
      <p style={{ fontSize: '4rem', fontWeight: 'bold', letterSpacing: '0.3em', margin: '1rem 0' }}>
        {code}
      </p>

      {error && (
        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
      )}

      <button
        onClick={handleGenerate}
        disabled={isPending}
        style={{
          padding: '0.6rem 1.4rem',
          fontSize: '1rem',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
          borderRadius: '6px',
          border: '1px solid #555',
          background: '#111',
          color: '#fff',
        }}
      >
        {isPending ? 'Gerando...' : 'Gerar novo'}
      </button>
    </div>
  );
}
