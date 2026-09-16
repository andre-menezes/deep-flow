---
name: implementing-vue-feature
description: >-
  Implements or changes a Studia Vue feature following feature folders,
  public index.ts, services, Pinia resource/UI stores, i18n per feature, and
  colocated unit tests. Use when adding views, components, stores, services,
  routes, or behavior inside src/features or shared UI consumed by features.
paths:
  - "src/**"
  - "tests/**"
---

# Studia — Implementing a Vue feature

## When to use

- Criar ou alterar código em `src/features/**`, `src/shared/**`, rotas, stores, services.
- Scaffolding da primeira implementação real do app.

## Preconditions

1. Siga a skill `studia-architecture`.
2. Se for comportamento de produto novo, preferir `FEATURE-NNNN-*.md` (skill `writing-project-docs`).
3. Não crie pastas vazias “por completude”.

## Default feature layout (create only what you need)

```text
src/features/<name>/
  index.ts
  routes.ts
  locales/pt-BR.json
  locales/en.json
  views/
  components/
  composables/
  services/
  stores/
  domain/
```

## Implementation order (suggested)

1. Tipos de domínio em `domain/` (ou `src/types` se transversal).
2. `*Service` falando com `shared/http` (mock ou API).
3. Resource store (`data/status/error/actions`) e/ou composables de UI.
4. Views/components + i18n da feature.
5. `routes.ts` + export em `index.ts`.
6. Registrar routes/messages em `app/` (composição).
7. Testes colocalizados `*.spec.ts`; E2E só em `tests/e2e` quando houver jornada.

## index.ts contract

Exportar o mínimo público. Tratar mudança de export como breaking change.

## UI / a11y baselines (enquanto não há guideline dedicada)

- Componentes interativos acessíveis (teclado, foco, semântica).
- Strings de UI via i18n (pt-BR + en).
- Material Symbols para ícones (não MDI).
- Sem cards no hero; seguir rules de produto quando houver UI marketing.

## Entitlements

Gate de UX com `@/features/auth` (`can` / `limits`). Mutações sensíveis sempre revalidadas no backend/mock.

## Done checklist

- [ ] Sem HTTP em `.vue`
- [ ] Sem import profundo cross-feature
- [ ] Sem autorização por `plan`
- [ ] Locales da feature atualizados
- [ ] Spec/ADR referenciados no PR se existirem
