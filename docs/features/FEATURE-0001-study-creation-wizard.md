# FEATURE-0001 — Study creation wizard

- **Status:** Ready
- **Data:** 2026-09-16

## Objetivo

Permitir que o usuário autenticado crie um **Study** por um fluxo guiado em etapas (wizard), sem expor um formulário único enorme e sem acoplar o domínio ao conceito de “passo”.

## Escopo

- Fluxo de criação de Study no frontend (feature `studies`).
- Etapas de UI: identidade → objetivo → rotina/frequência → confirmação → persistência.
- Checagens de entitlement/limites na UX antes de concluir.
- Integração via `studyService` → `shared/http` → Mock/API.

## Fora do escopo

- Edição de Study (rápida/localizada — FEATURE futura).
- Tasks e Notes além do necessário para criar Study “vazio” delas no MVP.
- Timer, StudySession, estatísticas.
- Definição visual final (design tokens, marketing) — apenas comportamento e regras.
- Contrato OpenAPI definitivo (paths podem ser `POST /studies`; detalhe em `docs/api/`).

## Comportamento

1. Usuário autenticado inicia “Criar Study”.
2. Wizard apresenta etapas sequenciais; pode voltar para etapas anteriores **antes** de confirmar.
3. Ao confirmar, o client envia **um** payload de Study completo (não um “save parcial por step” obrigatório no MVP).
4. Sucesso: Study criado (status inicial tipicamente `ACTIVE` ou conforme regra do servidor) e navegação para detalhe/dashboard contextual.
5. Falha (rede, validação, limite): mensagem via i18n a partir de `error.code`; wizard permanece utilizável.

Fluxo conceitual de UI:

```text
Sobre (identidade)
  → Objetivo
  → Rotina / Frequência
  → Confirmação
  → POST Study
  → Sucesso
```

## Regras

1. `currentStep` / `nextStep` / `previousStep` vivem só em composable de UI (ex.: `useStudyWizard`) — **nunca** em `domain/`.
2. O domínio `Study` não conhece wizard, router ou componentes Vue.
3. Componentes não chamam HTTP; `studyService.create` (ou equivalente) usa `@/shared/http`.
4. Validação de campos obrigatórios por etapa na UI; o servidor/mock revalida no `POST`.
5. Status do Study ≠ status de Task ≠ sessão de estudo.
6. Não exigir wizard completo para edições futuras (esta FEATURE não cobre edição).

### Campos mínimos (MVP)

| Área | Conteúdo mínimo |
|---|---|
| Identidade | Nome/título do Study |
| Objetivo | Descrição curta do que se quer alcançar |
| Rotina | Frequência ou disponibilidade declarada (formato simples acordado com API/mock) |
| Confirmação | Resumo editável voltando às etapas |

Detalhe de schema → `docs/api/` / tipos gerados quando existirem.

## UX

- Uma etapa visível por vez; progresso claro (indicador de steps).
- Linguagem de assistente (incentivar/organizar), não punitiva.
- CTA primário: Continuar / Criar Study; secundário: Voltar; cancelar com confirmação se houver dados preenchidos.
- Em bloqueio de entitlement: explicar o limite e CTA de upgrade **sem** checar `plan ===` na feature (usar `can` / `limits`).

## Entitlements / limites

Antes de abrir o wizard ou antes do submit (ambos aceitáveis; preferir **antes do submit** + disable CTA se já souber):

- `limits.canCreateStudy(usage)` (cota mensal de criações — ADR-0004).
- Se aplicável ao ativar já como `ACTIVE`: `limits.canActivateStudy(activeCount)`.

Usage e limites vêm da sessão/servidor — **não** inferir cota mensal só contando Studies locais.

Mutação `POST /studies` é revalidada no backend/mock.

## Exemplos

### Correto

```ts
// composable UI
const { currentStep, next, back, draft } = useStudyWizard()

// submit
await studyService.create(toCreateStudyPayload(draft))
```

```ts
import { limits, useUsage } from '@/features/auth'
if (!limits.canCreateStudy(usage.value)) { /* CTA upgrade i18n */ }
```

### Anti-exemplos

```ts
// domain conhece passo
study.nextStep()

// HTTP no .vue
await ofetch('/studies', { method: 'POST', body })

// autorização por plano
if (user.plan === 'FREE' && studies.length >= 3) { … }
```

## Resultado esperado

Usuário cria um Study de ponta a ponta pelo wizard; código respeita camadas ADR-0001…0006; Mock/API podem evoluir o schema sem reescrever o domínio em torno de `currentStep`.

## Referências

- `docs/product/vision.md`
- ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006
- `docs/architecture/{project-structure,dependency-rules,state-management,http-client,authentication}.md`
