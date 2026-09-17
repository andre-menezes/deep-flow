# API

Contratos e códigos de erro da API Studia.

Enquanto o backend Spring Boot não existir, o **Mock Server** (repositório externo) deve respeitar estes documentos.

## Conteúdo

| Arquivo | Papel |
|---|---|
| [`openapi.yaml`](./openapi.yaml) | OpenAPI 3.1 — auth + studies MVP |
| [`error-codes.md`](./error-codes.md) | `code` → chave i18n |

## Premissas

- Base path: `/api/v1`
- Access: `Authorization: Bearer`
- Refresh: cookie HttpOnly + `credentials: 'include'`
- Erros: `application/problem+json` com campo `code`

## Referências

- ADR-0005, ADR-0006, ADR-0007
- FEATURE-0001
