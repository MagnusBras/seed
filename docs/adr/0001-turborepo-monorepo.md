# ADR 0001 — Estrutura de monorepo com Turborepo e diretório apps/

**Status:** Accepted
**Data:** 2026-05-29

---

## Contexto

O projeto precisa abrigar ao menos dois artefatos independentes — um backend (NestJS) e um frontend (Next.js) — que compartilham convenções de TypeScript, utilitários e, futuramente, tipos de domínio. Sem uma estrutura de monorepo, cada repositório exigiria sincronização manual de versões, configurações duplicadas e pipelines de CI separados.

Alternativas consideradas:

- **Repositórios separados**: simplicidade inicial, mas alto custo de sincronização de tipos e contratos entre api e web.
- **Nx**: ecossistema rico, porém complexo de configurar e com opinião forte sobre geradores de código.
- **Turborepo**: camada de orquestração leve que se apoia no gerenciador de pacotes existente (pnpm workspaces) sem impor estrutura de geração de código.

## Decisão

Adotar **Turborepo ^2.9** com **pnpm workspaces** como estrutura raiz do monorepo.

- `apps/` contém os artefatos executáveis: `apps/api` (NestJS) e `apps/web` (Next.js).
- `packages/` contém bibliotecas internas compartilhadas: `packages/tsconfig`, `packages/shared` (futuro).
- O `turbo.json` define o grafo de tasks (`build → dev → lint → test`), permitindo cache incremental e execução paralela.
- O `package.json` raiz é privado, sem `main` nem `version`, servindo apenas como ponto de entrada do workspace.

## Consequências

**Positivas:**
- Cache de build incremental: tasks não reexecutam se os inputs não mudaram.
- `pnpm dev` na raiz sobe api e web em paralelo com um único comando.
- Pacotes internos (`@sidi/*`) são resolvidos pelo workspace sem publicação em registro externo.
- CI simples: um único pipeline na raiz cobre todos os apps.

**Negativas / trade-offs:**
- Todos os colaboradores precisam usar pnpm (não npm/yarn) — reforçado pelo campo `packageManager` no `package.json`.
- `pnpm-lock.yaml` único na raiz: PRs que tocam dependências de apps diferentes geram conflitos no lockfile.
- Turborepo não oferece gerador de código nativo; scaffolding de novos apps exige passos manuais documentados.
