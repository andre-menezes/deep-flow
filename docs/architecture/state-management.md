# Gerenciamento de estado

## Objetivo

Definir como estado de UI, recursos da API, sessão e entitlements são modelados no frontend.

## Escopo

Pinia, composables de feature, bootstrap de sessão.

## Fora do escopo

- Política exata de expiração de tokens (ADR futura de auth HTTP).
- Contrato OpenAPI definitivo dos endpoints.

## Conceitos

### UI state

Estado efêmero de interface. Pode viver em:

- `ref`/`reactive` locais no componente ou composable
- store Pinia de UI quando compartilhado entre árvores distantes

Exemplos: passo do wizard, painel aberto, rascunho não enviado.

### Resource state

Representa dados do servidor (mock ou real). Vive em store Pinia de recurso + service da feature.

Forma canônica:

```text
data
status: idle | loading | success | error
error
actions: fetch* / create* / update* / delete*
```

### Session state

Estado de autenticação em `features/auth`:

```text
UNKNOWN → INITIALIZING → AUTHENTICATED | UNAUTHENTICATED
```

Carrega user, plan (informativo), entitlements e usage.

## Regras

1. Componentes não chamam HTTP diretamente.
2. Resource stores chamam **services**; services usam `shared/http`.
3. Domínio não conhece wizard/step/router.
4. Features não leem `user.plan` para autorizar; usam `can` / `limits` (ADR-0004).
5. Usage de cotas vem do servidor/mock; não é inferido só pela lista local de Studies.
6. `app/bootstrap` hidrata sessão antes do router aplicar guards.
7. Router não implementa refresh token; apenas consome estado de sessão.

## Quando usar composable vs store

| Situação | Preferir |
|---|---|
| Estado local de um fluxo (wizard) | composable |
| Cache de recurso compartilhado entre views | resource store |
| Sessão / entitlements | store em `features/auth` |
| Utilitário sem estado | função em `shared/utils` ou composable sem store |

## Migração Mock → API → (opcional) Query lib

```text
Hoje:    component → composable/store → service → mock
Depois:  component → composable/store → service → API real
Futuro:  mesma fachada; store ou composable pode passar a usar query client
```

Não introduzir TanStack Query no MVP. Critérios em ADR-0003.

## Exemplos

### Correto

- `useStudyWizard()` guarda `currentStep`.
- `studyListStore.fetchStudies()` → `studyService.list()`.
- Guard de rota consulta `isAuthenticated` / `can(...)`.

### Incorreto

- `router.beforeEach` chama `refreshToken()` diretamente.
- Componente importa JSON mock.
- `if (plan === 'FREE')` dentro de `studies` store.

## Resultado esperado

UI permanece desacoplada da origem dos dados; entitlements têm um único ponto de leitura; a chegada do backend não exige reescrever views.

## Referências

- ADR-0003, ADR-0004
- `discussion.md` §§17–26
