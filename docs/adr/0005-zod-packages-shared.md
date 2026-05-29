# ADR 0005 — Zod compartilhado em packages/shared para validação

**Status:** Accepted
**Data:** 2026-05-29

---

## Contexto

A API (NestJS) e o frontend (Next.js) precisam validar e tipar os mesmos contratos de dados — por exemplo, o payload de criação de um `Client` (campos `name` e `email`, com as mesmas regras de negócio). Sem um ponto único de verdade, as regras de validação ficam duplicadas: `class-validator` no backend e validação ad-hoc ou outro schema no frontend, com risco de divergência silenciosa.

Alternativas consideradas:

- **`class-validator` apenas no backend, nada no frontend**: simples, mas a validação client-side fica sem tipagem de schema.
- **Zod apenas no backend**: Zod pode substituir `class-validator` no NestJS via `nestjs-zod`, mas sem pacote compartilhado o frontend ainda duplica as regras.
- **Zod em `packages/shared`**: schemas Zod são código TypeScript puro, sem dependência de runtime framework-específico — podem ser importados tanto pelo NestJS quanto pelo Next.js.
- **Protobuf / OpenAPI codegen**: adequado para contratos entre times, mas overhead excessivo para um monorepo de time pequeno.

## Decisão

Criar o pacote **`packages/shared`** (`@sidi/shared`) contendo schemas Zod que definem os contratos de entrada e saída da API.

- Schemas de criação/atualização (ex: `CreateClientSchema`, `UpdateClientSchema`) são definidos em `packages/shared/src/schemas/`.
- Os tipos TypeScript são inferidos dos schemas via `z.infer<>` e exportados para uso em api e web.
- No `apps/api`, os schemas Zod são usados via `nestjs-zod` (ou adaptador manual de `ZodValidationPipe`) em substituição a DTOs com `class-validator`.
- No `apps/web`, os schemas são usados na validação de formulários (react-hook-form + zodResolver ou validação manual em server actions).
- `packages/shared` é adicionado como dependência de workspace em `apps/api` e `apps/web` (`"@sidi/shared": "workspace:*"`).

## Consequências

**Positivas:**
- Contrato único: alterar uma regra de validação em `packages/shared` propaga automaticamente para api e web na próxima build.
- Tipos inferidos do schema eliminam duplicação de interfaces TypeScript entre frontend e backend.
- Zod valida em runtime com mensagens de erro descritivas — útil tanto para respostas de API quanto para feedback de formulário.
- Schema-first: o contrato é legível por humanos e auditável em um único arquivo.

**Negativas / trade-offs:**
- Introduz um pacote adicional no workspace que precisa ser buildado antes dos apps que dependem dele (` dependsOn: ["^build"]` no turbo.json já cobre isso).
- `nestjs-zod` adiciona uma camada de adaptação entre o sistema de pipes do NestJS e o Zod — manutenção adicional se o pacote ficar sem suporte.
- Schemas muito complexos (transformações, refinements com acesso a banco) não devem viver em `packages/shared` — apenas regras de domínio puras.
