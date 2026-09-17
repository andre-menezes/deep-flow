# ADR-0007 — API contract (OpenAPI + error codes)

- **Status:** Accepted
- **Data:** 2026-09-16
- **Contexto:** `docs/architecture/open-decisions.md` itens API/erros; ADR-0005; ADR-0006; FEATURE-0001

## Contexto

Mock Server e futuro Spring Boot precisam de um contrato comum para o frontend não divergir. Sem OpenAPI e códigos de erro estáveis, cada lado inventa paths e mensagens.

## Decisão

1. A fonte de verdade HTTP do MVP vive em `docs/api/`:
   - `openapi.yaml` — OpenAPI 3.1 (paths auth + studies mínimos)
   - `error-codes.md` — `code` estável → chave i18n
2. Respostas de erro preferem **RFC 9457** (`application/problem+json`) com extensão `code` (string de negócio).
3. O frontend mapeia **somente** `code` → i18n; não exibe `detail`/`title` crus ao usuário (ADR-0005).
4. Mock Server **fora** deste repositório deve implementar o contrato; geração de tipos TypeScript (`src/types/api/`) virá depois (`sync-openapi-types`).
5. Base path MVP: `/api/v1`.

## Consequências

- Mudança breaking de path/schema exige atualizar `openapi.yaml` no mesmo PR do client/mock.
- Catálogo de erros cresce em `error-codes.md` (não espalhar strings mágicas no código).

## Exemplos

### Correto

- `POST /api/v1/auth/login` conforme `openapi.yaml`
- UI: `$t('errors.STUDY_CREATE_LIMIT_REACHED')` a partir de `error.code`

### Incorreto

- Endpoint só documentado no chat
- `toast(error.detail)` com texto do servidor

## Alternativas consideradas

- **Contrato só no código Spring:** rejeitada; frontend e mock viriam antes do backend.
- **GraphQL:** fora do escopo MVP (REST + OpenAPI).

## Referências

- `docs/api/openapi.yaml`, `docs/api/error-codes.md`
- ADR-0005, ADR-0006, FEATURE-0001
