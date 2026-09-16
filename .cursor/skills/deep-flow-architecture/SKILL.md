---
name: deep-flow-architecture
description: >-
  Applies Deep Flow frontend architecture invariants (app/features/shared/types,
  dependency rules, Pinia UI vs resource stores, entitlements via auth).
  Use when creating or changing source structure, features, stores, services,
  shared modules, types, routing, or auth-related client code.
---

# Deep Flow — Architecture

## When to use

- Qualquer tarefa que toque `src/`, estrutura de pastas, estado, HTTP client, auth client ou fronteiras entre módulos.
- Antes de gerar scaffolding ou “estrutura completa” do app.

## Before coding

1. Leia `AGENTS.md`.
2. Confirme a regra em:
   - `docs/adr/ADR-0001-frontend-architecture.md`
   - `docs/adr/ADR-0002-feature-oriented-project-structure.md`
   - `docs/architecture/dependency-rules.md`
   - `docs/architecture/state-management.md`
3. Se a mudança for arquitetural nova, use a skill `writing-project-docs` e registre ADR **antes** de espalhar código.

## Layer map

```text
src/app        → bootstrap, plugins, router composition (sem domínio de produto)
src/features   → contextos de produto (auth, studies, dashboard, settings)
src/shared     → UI base, http, utils, i18n compartilhado (sem Study/Task/Note)
src/types      → API/generated, auth, entitlements, common primitives
```

## Hard rules

1. **Imports**
   - `features/A` → `features/B` **somente** via `@/features/B` (`index.ts`).
   - `shared` nunca importa `features` ou `app`.
   - `types` não importa outras camadas.
2. **`index.ts` da feature** exporta: routes, messages, tipos necessários, leitura (composables/stores de query).  
   Não exporta: views, components internos, services, mutações internas.
3. **HTTP**: componente ↛ ofetch. Caminho: component → composable/store → `*Service` → `shared/http`.
4. **Estado**
   - UI state (wizard step, drawer): composable/UI store.
   - Resource state: Pinia com `data/status/error/actions` + service.
   - Sem TanStack Query no MVP.
5. **Entitlements**: `can('…')` / `limits.…` via `@/features/auth`. Proibido `user.plan === 'PREMIUM'` como autorização.
6. **Wizard**: `currentStep` / `nextStep` só em composable de apresentação — nunca em `domain/`.
7. **Pastas sob demanda**: não criar árvores vazias “para o futuro”.
8. **Alias**: apenas `@/*` → `src/*`.

## Checklist rápido (PR)

- [ ] Mudança respeita tabela de dependências
- [ ] Nenhum import profundo `@/features/x/...` de fora da feature
- [ ] Services encapsulam API
- [ ] Sem checagem por `plan` para liberar feature
- [ ] Docs atualizados se a regra mudou (ADR/guideline)

## Anti-examples

```ts
// ERRADO
import { studyStore } from '@/features/studies/stores/studyStore'
if (session.user.plan === 'FREE') { /* bloquear */ }
await ofetch('/api/studies') // dentro do .vue
```

```ts
// CERTO
import { useStudySummary } from '@/features/studies'
import { can, limits } from '@/features/auth'
await studyService.list() // dentro da store/action da feature
```

## References

- Detalhe longo: `docs/architecture/*` e `docs/adr/*` (carregue sob demanda; não resuma de memória se houver dúvida).
