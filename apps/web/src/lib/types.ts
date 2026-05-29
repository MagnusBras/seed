export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientInput {
  name: string;
  email: string;
  phone?: string;
}
