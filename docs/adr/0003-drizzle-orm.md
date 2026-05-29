# ADR 0003 — Drizzle ORM em vez de Prisma

**Status:** Accepted
**Data:** 2026-05-29

---

## Contexto

O backend precisa de uma camada de acesso ao banco PostgreSQL (Supabase) que seja type-safe, compatível com o ambiente serverless/edge e com boa ergonomia em TypeScript. As duas opções mais relevantes no ecossistema Node.js/TypeScript em 2026 são Prisma e Drizzle.

Alternativas consideradas:

- **Prisma**: ORM maduro, schema declarativo em `.prisma`, geração de tipos automática, Prisma Studio. Desvantagens: gera um cliente opaco com binários nativos (query engine), tem dificuldades em ambientes edge/serverless restritivos, e a camada de abstração oculta o SQL gerado.
- **Drizzle ORM**: schema definido em TypeScript puro, sem binários nativos, queries construídas com API type-safe que se parece com SQL (select/from/where explícitos), compatível com qualquer runtime que suporte `pg`/`postgres.js`.
- **Kysely**: query builder sem ORM — mais verboso para migrations e sem inferência automática de tipos de schema.

## Decisão

Adotar **Drizzle ORM** com o driver **`postgres`** (postgres.js) em `apps/api`.

- O schema é definido em `src/db/schema.ts` usando helpers do Drizzle (`pgTable`, `uuid`, `varchar`, `timestamp`).
- As migrations são gerenciadas por **`drizzle-kit push`** em desenvolvimento (sincronização direta, sem arquivos SQL versionados).
- O cliente Drizzle é instanciado uma vez em `src/db/index.ts` e provido via `DatabaseModule` global usando o token de injeção `DRIZZLE`.
- `drizzle-kit studio` está disponível como script para inspeção visual do banco durante o desenvolvimento.

## Consequências

**Positivas:**
- Zero binários nativos: o pacote funciona em qualquer ambiente onde `postgres.js` funcione, incluindo runtimes edge.
- Queries type-safe sem abrir mão do controle SQL: `db.select().from(clients).where(eq(clients.id, id))` é legível e verificado pelo compilador.
- Schema em TypeScript elimina o indirection do arquivo `.prisma` — o mesmo arquivo define a estrutura e exporta os tipos `Client` e `NewClient`.
- `drizzle-kit push` acelera o ciclo de desenvolvimento sem exigir geração de arquivos de migration em cada alteração de schema.

**Negativas / trade-offs:**
- `drizzle-kit push` não gera histórico de migrations — para produção, será necessário migrar para `drizzle-kit generate` + `drizzle-kit migrate` (ADR futuro).
- Drizzle não tem equivalente ao Prisma Client Extensions ou ao Prisma Middleware; hooks de auditoria precisam ser implementados manualmente.
- A API de `db.query.*` (relational queries) requer que o schema seja passado ao inicializar o cliente (`drizzle(client, { schema })`).
