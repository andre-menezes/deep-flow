# ADR-0002 — Feature-oriented project structure

- **Status:** Accepted
- **Data:** 2026-09-16
- **Contexto:** discussão de estrutura de pastas; `docs/archive/DISCUSSION-2026-09-initial.md` §§5, 32–34

## Contexto

Era necessário definir a árvore de pastas do frontend com equilíbrio entre clareza e simplicidade: não tão rasa que misture responsabilidades, não tão verbosa que exija dezenas de diretórios vazios.

## Decisão

### Camadas de topo

```text
src/
├── app/
├── features/
├── shared/
└── types/
```

Fora de `src/`:

```text
docs/
tests/
  ├── e2e/
  └── support/
```

### Regras de dependência

| Camada | Pode importar | Não pode importar |
|---|---|---|
| `app` | `features` (somente via `index.ts`), `shared`, `types` | — |
| `features` | `shared`, `types`, si mesma, outra feature **somente via `index.ts`** | `app`, interno de outra feature |
| `shared` | `shared`, `types` | `app`, `features` |
| `types` | `types` | todas as outras |

### Types (híbrido)

- Em `src/types/`: contratos de API (incl. gerados), transversais (`auth`, `entitlements`) e primitivos (`Paginated<T>`, `Id`).
- Na feature (`domain/`): tipos de domínio e de apresentação daquela feature.
- Teste rápido: *se eu apagasse a feature X, este tipo ainda faria sentido?*

### Tests (híbrido)

- Unitários e de componente: colocalizados (`*.spec.ts` ao lado do arquivo).
- E2E (Playwright): `tests/e2e/`.
- Factories/fixtures/setup: `tests/support/`.

### API pública de feature

Cada feature expõe um `index.ts` como único ponto de entrada externo.

Exporta: `routes`, `messages` (i18n), tipos de domínio necessários fora, composables/stores de **leitura**.

Não exporta: views, componentes internos, services, mutações internas.

### Shared

- Sem conhecimento de domínio de produto (`StudyCard` não entra em `shared/ui`).
- Só entra em `shared` com **dois consumidores reais**.
- Preferir `shared/http` a `shared/services`.

### Criação sob demanda

Pastas e arquivos só são criados quando há necessidade real (`docs/archive/DISCUSSION-2026-09-initial.md` §32).

## Consequências

- Fronteiras entre features ficam auditáveis (lint/`eslint-plugin-boundaries` recomendado).
- Promoção futura de Tasks/Notes para features próprias vira movimento mecânico.
- `types/` e `tests/` não espelham a árvore inteira de features.

## Exemplos

### Correto

```ts
import { useStudySummary, type Study } from '@/features/studies'
```

### Incorreto

```ts
import { studyStore } from '@/features/studies/stores/studyStore'
import StudyDetailView from '@/features/studies/views/StudyDetailView.vue'
```

## Alternativas consideradas

- `types/` totalmente centralizado espelhando features: descartado (duplicação de árvore + acoplamento).
- `tests/` totalmente centralizado: descartado para unit/component (manter colocalizados).
- Isolamento estrito sem import entre features: adiado; o barrel `index.ts` é o meio-termo adotado.

## Referências

- `docs/architecture/project-structure.md`
- `docs/architecture/dependency-rules.md`
- `docs/conventions/document-naming.md`
