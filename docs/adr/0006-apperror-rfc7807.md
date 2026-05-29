# ADR 0006 — AppError + RFC 7807 para tratamento de erros

**Status:** Accepted
**Data:** 2026-05-29

---

## Contexto

Sem uma convenção de erros, cada endpoint pode retornar respostas de erro em formatos diferentes — alguns com `{ message: string }`, outros com `{ error: string, statusCode: number }`, outros com stack traces expostos. Isso dificulta o tratamento consistente no frontend e gera respostas imprevisíveis para consumidores da API.

O NestJS tem um formato padrão de erro (`{ statusCode, message, error }`) que não segue nenhum padrão de mercado e não é extensível o suficiente para carregar detalhes estruturados (campo inválido, código de erro de negócio, link de documentação).

Alternativas consideradas:

- **Formato NestJS padrão**: zero configuração, mas sem padronização de mercado e difícil de estender.
- **Formato customizado ad-hoc**: liberdade total, mas sem contrato formal — cada desenvolvedor pode inventar campos.
- **RFC 7807 (Problem Details for HTTP APIs)**: padrão IETF amplamente adotado, com campos bem definidos (`type`, `title`, `status`, `detail`, `instance`) e extensível com campos adicionais.

## Decisão

Adotar **RFC 7807** como formato canônico de respostas de erro, implementado via classe **`AppError`** e um **`HttpExceptionFilter`** global no NestJS.

### Formato da resposta de erro (RFC 7807)

```json
{
  "type": "https://sidi.app/errors/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "O campo 'email' deve ser um endereço de e-mail válido.",
  "instance": "/clients",
  "errors": [
    { "field": "email", "message": "must be an email" }
  ]
}
```

### Implementação

- `AppError` estende `Error` com propriedades `type`, `title`, `status`, `detail` e `extensions` (campos adicionais livres).
- O `HttpExceptionFilter` intercepta todas as exceções, mapeia `AppError` e exceções nativas do NestJS para o formato RFC 7807, e suprime stack traces em produção.
- Exceções não tratadas retornam `status: 500` com `title: "Internal Server Error"` e `detail` genérico — nunca com stack trace exposto.
- O `Content-Type` das respostas de erro é `application/problem+json`, conforme a RFC.
- O campo `type` usa URIs descritivas sob o domínio da aplicação (ex: `/errors/not-found`, `/errors/validation-error`).

## Consequências

**Positivas:**
- Contratos de erro previsíveis: o frontend pode tratar qualquer erro verificando `response.type` ou `response.status`.
- RFC 7807 é reconhecido por ferramentas de API (Postman, Swagger, clientes HTTP) e por times acostumados com REST moderno.
- `AppError` pode ser lançado em qualquer camada (service, guard, pipe) e será formatado corretamente pelo filter global.
- Extensível: campos adicionais (ex: `errors` para validação em batch, `retryAfter` para rate limiting) são adicionados sem quebrar o contrato base.

**Negativas / trade-offs:**
- Requer implementação manual do `HttpExceptionFilter` e mapeamento das exceções nativas do NestJS para o formato RFC 7807.
- O campo `type` exige URIs estáveis — mudar o domínio da aplicação exige atualizar os valores de `type` em todos os erros.
- Clientes que esperam o formato padrão do NestJS (`{ statusCode, message, error }`) precisarão ser atualizados.
