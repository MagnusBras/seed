import { apiFetch } from './api';
import type { Client, ClientInput } from './types';

export const listClients = () =>
  apiFetch<Client[]>('/clients', { cache: 'no-store' });

export const getClient = (id: string) =>
  apiFetch<Client>(`/clients/${id}`);

export const createClient = (data: ClientInput) =>
  apiFetch<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateClient = (id: string, data: Partial<ClientInput>) =>
  apiFetch<Client>(`/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteClient = (id: string) =>
  apiFetch<void>(`/clients/${id}`, { method: 'DELETE' });
