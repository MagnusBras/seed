'use client';

import { useState, useTransition } from 'react';
import type { Client, ClientInput } from '@/lib/types';
import { createClient, updateClient } from '@/lib/clients';
import { ApiError } from '@/lib/api';

interface Props {
  client?: Client;
  onSaved: () => void;
  onClose: () => void;
}

export function ClientFormModal({ client, onSaved, onClose }: Props) {
  const isEdit = !!client;
  const [form, setForm] = useState<ClientInput>({
    name: client?.name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<ClientInput>>({});
  const [isPending, startTransition] = useTransition();

  function validate() {
    const errs: Partial<ClientInput> = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.email.trim()) errs.email = 'E-mail obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'E-mail inválido';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});

    startTransition(async () => {
      try {
        const payload: ClientInput = {
          name: form.name.trim(),
          email: form.email.trim(),
          ...(form.phone?.trim() ? { phone: form.phone.trim() } : {}),
        };
        if (isEdit) await updateClient(client.id, payload);
        else await createClient(payload);
        onSaved();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Erro inesperado');
      }
    });
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px', marginTop: '4px',
    border: '1px solid #444', borderRadius: '4px',
    background: '#1a1a1a', color: '#fff', fontSize: '14px',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '12px', fontSize: '14px',
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>
          {isEdit ? 'Editar client' : 'Novo client'}
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>
            Nome *
            <input style={inputStyle} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            {fieldErrors.name && <span style={errStyle}>{fieldErrors.name}</span>}
          </label>

          <label style={labelStyle}>
            E-mail *
            <input style={inputStyle} type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {fieldErrors.email && <span style={errStyle}>{fieldErrors.email}</span>}
          </label>

          <label style={labelStyle}>
            Telefone
            <input style={inputStyle} value={form.phone ?? ''}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </label>

          {error && <p style={{ color: '#f87171', marginBottom: '12px', fontSize: '13px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={btnSecondary} disabled={isPending}>
              Cancelar
            </button>
            <button type="submit" style={btnPrimary} disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const errStyle: React.CSSProperties = { color: '#f87171', fontSize: '12px', marginTop: '2px', display: 'block' };
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
const modal: React.CSSProperties = { background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '24px', width: '420px', maxWidth: '90vw' };
const btnPrimary: React.CSSProperties = { padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' };
const btnSecondary: React.CSSProperties = { padding: '8px 16px', background: 'transparent', color: '#aaa', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' };
