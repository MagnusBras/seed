import Link from 'next/link';
import { HelloCode } from '@/components/hello-code';

interface HelloResponse {
  code: string;
}

async function fetchHelloCode(): Promise<HelloResponse | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
    const res = await fetch(`${apiUrl}/hello`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const data = await fetchHelloCode();

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        Hello World — SIDI
      </h1>

      {data ? (
        <HelloCode initialCode={data.code} />
      ) : (
        <p style={{ color: '#dc2626', fontSize: '1.1rem' }}>
          ⚠️ Não foi possível conectar ao servidor. Verifique se a API está rodando em{' '}
          <code>localhost:3001</code>.
        </p>
      )}

      <Link href="/clients" style={{ marginTop: '1.5rem', color: '#60a5fa', fontSize: '0.9rem' }}>
        → Gestão de Clients
      </Link>
    </main>
  );
}
