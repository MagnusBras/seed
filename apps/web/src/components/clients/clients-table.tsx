'use client';

import { useState, useEffect, useCallback } from 'react';
import { listClients } from '@/lib/clients';
import type { Client } from '@/lib/types';
import { ClientFormModal } from './client-form-modal';
import { ConfirmDeleteModal } from './confirm-delete-modal';

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | undefined>();
  const [deleting, setDeleting] = useState<Client | undefined>();

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setClients(await listClients());
    } catch {
      setError('Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  function handleSaved() {
    setShowForm(false);
    setEditing(undefined);
    reload();
  }

  function handleDeleted() {
    setDeleting(undefined);
    reload();
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 600 }}>Clients</h1>
        <button onClick={() => setShowForm(true)} style={btnPrimary}>
          + Incluir
        </button>
      </div>

      {loading && <p style={{ color: '#888' }}>Carregando...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {!loading && !error && clients.length === 0 && (
        <p style={{ color: '#888', textAlign: 'center', marginTop: '48px' }}>
          Nenhum client cadastrado.
        </p>
      )}

      {!loading && clients.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#888' }}>
                {['Nome', 'E-mail', 'Telefone', 'Criado em', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={td}>{c.name}</td>
                  <td style={td}>{c.email}</td>
                  <td style={{ ...td, color: c.phone ? '#fff' : '#555' }}>{c.phone ?? '—'}</td>
                  <td style={{ ...td, color: '#888' }}>{fmt(c.createdAt)}</td>
                  <td style={{ ...td, display: 'flex', gap: '6px' }}>
                    <button onClick={() => setEditing(c)} style={btnEdit}>Alterar</button>
                    <button onClick={() => setDeleting(c)} style={btnDelete}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showForm || editing) && (
        <ClientFormModal
          client={editing}
          onSaved={handleSaved}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}

      {deleting && (
        <ConfirmDeleteModal
          clientId={deleting.id}
          clientName={deleting.name}
          onDeleted={handleDeleted}
          onClose={() => setDeleting(undefined)}
        />
      )}
    </div>
  );
}

const td: React.CSSProperties = { padding: '12px' };
const btnPrimary: React.CSSProperties = { padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' };
const btnEdit: React.CSSProperties = { padding: '4px 10px', background: '#374151', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const btnDelete: React.CSSProperties = { padding: '4px 10px', background: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
