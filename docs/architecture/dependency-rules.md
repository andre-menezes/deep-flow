# Regras de dependência entre módulos

## Objetivo

Definir fronteiras de importação entre `app`, `features`, `shared` e `types`.

## Escopo

Código TypeScript/Vue em `src/`.

## Fora do escopo

- Dependências npm.
- Imports em `tests/` (podem importar o necessário).

## Regras

| De → | `app` | `features/*` | `shared` | `types` |
|---|---|---|---|---|
| `app` | sim | só `index.ts` | sim | sim |
| `features/A` | não | `A` livre; `B` só `index.ts` | sim | sim |
| `shared` | não | não | sim | sim |
| `types` | não | não | não | sim |

## API pública da feature (`index.ts`)

### Pode exportar

- `routes`
- `messages` (locales)
- tipos de domínio necessários fora da feature
- composables/stores de leitura

### Não pode exportar

- views
- componentes internos
- services
- detalhes de mutação interna

## Shared

1. Sem conhecimento de domínio de produto.
2. Só entra com dois consumidores reais.
3. Nunca importa `features` ou `app`.

## Enforcement recomendado

- `eslint-plugin-boundaries` (ou `import/no-restricted-paths`)
- Bloquear `@/features/*/**` permitindo apenas `@/features/<name>`
- Opcional: `dependency-cruiser` no CI para ciclos

## Exemplos

### Correto

```ts
import { studiesRoutes } from '@/features/studies'
import { can } from '@/features/auth'
import { http } from '@/shared/http'
import type { Paginated } from '@/types/common'
```

### Incorreto

```ts
import StudyCard from '@/features/studies/components/StudyCard.vue'
import { studyService } from '@/features/studies/services/studyService'
import { useStudyStore } from '@/features/studies/stores/studyStore' // via path interno
```

## Resultado esperado

Mudanças internas em uma feature não quebram outras features, salvo alteração deliberada do `index.ts` (breaking change documentada).

## Referências

- ADR-0002
