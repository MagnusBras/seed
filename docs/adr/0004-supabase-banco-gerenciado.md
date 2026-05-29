# ADR 0004 — Supabase como banco de dados gerenciado

**Status:** Accepted
**Data:** 2026-05-29

---

## Contexto

O projeto precisa de um banco PostgreSQL acessível tanto em desenvolvimento local quanto em produção, com gerenciamento de credenciais, backups automáticos e sem overhead de operação de infraestrutura. O time não tem capacidade de operar um cluster PostgreSQL próprio neste momento.

Alternativas consideradas:

- **PostgreSQL local via Docker**: controle total, zero custo, mas exige Docker rodando localmente e configuração de CI separada.
- **Neon**: PostgreSQL serverless com branching por PR — excelente para preview environments, mas menos integrado ao ecossistema de autenticação e storage.
- **Railway / Render**: PaaS simples para PostgreSQL, sem autenticação ou storage nativos.
- **Supabase**: PostgreSQL gerenciado com autenticação, storage, realtime e dashboard integrados. Open-source (self-hostable). MCP server oficial disponível para integração com ferramentas de IA.

## Decisão

Adotar **Supabase** como banco de dados gerenciado.

- A conexão usa a string **direta** (porta `5432`, não o pooler de transação na `6543`) para compatibilidade com `postgres.js` e prepared statements.
- A `DATABASE_URL` é armazenada em `apps/api/.env` (não versionado) e documentada em `apps/api/.env.example`.
- O schema `test` do mesmo projeto Supabase é usado para testes e2e, isolando dados de teste sem criar um projeto separado.
- O MCP server do Supabase (`@supabase/mcp-server-supabase`) está configurado em `.mcp.json` para permitir introspecção do banco via ferramentas de IA durante o desenvolvimento.

## Consequências

**Positivas:**
- Zero operação de infraestrutura: backups, HA e atualizações de patch são gerenciados pelo Supabase.
- Dashboard visual do banco facilita inspeção durante desenvolvimento, complementando o `drizzle-kit studio`.
- Autenticação e storage disponíveis nativamente caso o projeto evolua para usá-los.
- MCP server permite que o Claude Code introspete o schema e execute queries diretamente durante o desenvolvimento assistido por IA.

**Negativas / trade-offs:**
- Dependência de serviço externo: indisponibilidade do Supabase impacta diretamente o desenvolvimento.
- O pooler de transação (porta `6543`) é necessário em ambientes serverless com muitas conexões simultâneas; a string de conexão direta pode precisar ser trocada em produção.
- O plano gratuito pausa projetos após 7 dias de inatividade — o time precisa estar ciente disso em períodos sem uso.
- Dados de produção e de teste compartilham o mesmo projeto Supabase (schemas diferentes) — uma separação de projetos pode ser necessária futuramente para isolamento completo.
