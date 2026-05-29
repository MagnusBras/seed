# ADR 0002 — NestJS como framework do backend

**Status:** Accepted
**Data:** 2026-05-29

---

## Contexto

O backend precisa expor uma API REST com rotas tipadas, injeção de dependências, validação de entrada e uma estrutura de módulos que escale conforme o domínio cresce. O time já tem familiaridade com TypeScript e prefere convenções explícitas sobre "magic" implícita.

Alternativas consideradas:

- **Fastify puro**: alta performance, mas exige montar à mão cada camada (DI, validação, serialização, pipes).
- **Express + camadas manuais**: familiar, porém sem estrutura de módulos — leva a inconsistências conforme o projeto cresce.
- **NestJS**: opinionado, baseado em decorators e módulos, com DI nativo, pipes de validação e integração consolidada com class-validator, Drizzle, e outros.

## Decisão

Adotar **NestJS** como framework do `apps/api`.

- Módulos NestJS mapeiam diretamente para domínios (`HelloModule`, `ClientsModule`).
- `class-validator` + `class-transformer` são usados nos DTOs, habilitados via `ValidationPipe` global com `{ whitelist: true, transform: true }`.
- O app escuta na porta `3001` (configurável via `PORT`) para não conflitar com o Next.js na `3000`.
- CORS é habilitado explicitamente para `http://localhost:3000` (origem do frontend em dev).

## Consequências

**Positivas:**
- Estrutura de módulos força separação de responsabilidades desde o início.
- `ValidationPipe` rejeita automaticamente campos desconhecidos e transforma tipos primitivos.
- Ecossistema maduro: interceptors, guards, pipes e filtros de exceção são primitivos de primeira classe.
- Decorators TypeScript (`@Controller`, `@Injectable`) tornam as intenções explícitas e fáceis de testar.

**Negativas / trade-offs:**
- `emitDecoratorMetadata: true` e `experimentalDecorators: true` são obrigatórios no `tsconfig` — incompatíveis com alguns bundlers modernos que não processam metadata de decorators.
- O `type: "module"` foi removido do `package.json` raiz para evitar conflito com o sistema de módulos CommonJS do NestJS CLI e do `ts-jest`.
- Overhead de aprendizado para quem vem de frameworks menos opinados.
