'use client';

import { useTransition } from 'react';
import { deleteClient } from '@/lib/clients';
import { ApiError } from '@/lib/api';

interface Props {
  clientId: string;
  clientName: string;
  onDeleted: () => void;
  onClose: () => void;
}

export function ConfirmDeleteModal({ clientId, clientName, onDeleted, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteClient(clientId);
        onDeleted();
      } catch (err) {
        alert(err instanceof ApiError ? err.message : 'Erro ao excluir');
      }
    });
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Confirmar exclusão</h2>
        <p style={{ marginBottom: '20px', color: '#ccc', fontSize: '14px' }}>
          Deseja excluir <strong>{clientName}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={btnSecondary} disabled={isPending}>
            Cancelar
          </button>
          <button onClick={handleConfirm} style={btnDanger} disabled={isPending}>
            {isPending ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
const modal: React.CSSProperties = { background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '24px', width: '360px', maxWidth: '90vw' };
const btnDanger: React.CSSProperties = { padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' };
const btnSecondary: React.CSSProperties = { padding: '8px 16px', background: 'transparent', color: '#aaa', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' };
