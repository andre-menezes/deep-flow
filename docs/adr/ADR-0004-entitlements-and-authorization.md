# ADR-0004 — Entitlements and authorization

- **Status:** Accepted
- **Data:** 2026-09-16
- **Contexto:** `discussion.md` §§12–16; pergunta sobre `/entitlements` na discussão de estado

## Contexto

O produto distingue Role, Plan, Entitlements e Usage. O frontend precisa refletir limites (ex.: Free com no máximo 3 Studies ACTIVE e 10 criações/mês) sem tornar o plano (`FREE`/`PREMIUM`) a API de decisão espalhada pelo código.

Enquanto o backend não existe, o Mock Server será a fonte dos entitlements, mas a forma de consumi-los no frontend deve ser a mesma da API real.

## Decisão

### 1. Entitlements não são uma feature de produto isolada no MVP

Não criar `features/entitlements/` agora.

Responsabilidades:

| Artefato | Local |
|---|---|
| Tipos (`Capability`, `LimitKey`, `Entitlements`, `Usage`) | `src/types/entitlements.ts` |
| Estado (entitlements + usage da sessão) | `features/auth` (junto da sessão) |
| Helpers de checagem | `features/auth` exportados via `index.ts` **ou** `shared/entitlements` se houver 2+ consumidores fora de auth |
| UX de upgrade / bloqueio | features que precisam (ex.: `studies`) consumindo a API pública de auth |

### 2. Separar Capability e Limit

- **Capability:** o usuário *pode* usar a funcionalidade? → `can('statistics.advanced')`
- **Limit:** *quanto* pode usar? → `limits.canCreateStudy(usage)` / `limits.canActivateStudy(activeCount)`

Proibido como regra de negócio no frontend:

```ts
if (user.plan === 'PREMIUM') { /* ... */ }
```

O plano pode ser exibido na UI de billing/settings; não autoriza features.

### 3. Backend (ou Mock) é a autoridade

O frontend pode esconder CTAs e mostrar mensagens com base em entitlements/usage.

Toda mutação sensível (`POST /studies`, ativar Study, etc.) é revalidada no servidor/mock.

### 4. Forma do estado na sessão

Conceitualmente a sessão autenticada carrega:

```text
Session
├── user
├── plan            # informativo / billing
├── entitlements    # capabilities + limits
└── usage           # consumo atual (ex.: creations this period)
```

O bootstrap (`UNKNOWN → INITIALIZING → AUTHENTICATED | UNAUTHENTICATED`) hidrata entitlements junto com a sessão (login ou refresh).

### 5. Endpoint conceitual

Enquanto o contrato OpenAPI não está fechado, a premissa é:

- entitlements e usage vêm no payload de sessão (`/auth/me` ou equivalente após refresh), **ou**
- em `GET /entitlements` / `GET /usage` se a sessão ficar leve demais.

A escolha exata do endpoint fica para o contrato de API; o frontend depende da **fachada** `auth` (`can`, `limits`, `usage`), não do path HTTP.

### 6. Usage mensal de criação

O usage de criações **não** é derivado da quantidade atual de Studies no cliente.

Vem do backend/mock como contadores (`used`, `limit`, `remaining`), alinhado a `discussion.md` §13.

## Consequências

- Features perguntam “posso?” via API de entitlements, não via `plan`.
- Trocar Mock → Spring Security/policies não muda a forma de checagem nas views.
- Evita-se um micro-módulo prematuro `features/entitlements`.
- Guards de router podem consultar a mesma fachada (`entitlements.guard.ts` em `app/router/guards`).

## Exemplos

### Correto

```ts
import { can, limits, useUsage } from '@/features/auth'

if (!can('statistics.advanced')) { /* CTA upgrade */ }
if (!limits.canActivateStudy(activeCount)) { /* bloquear ativação na UX */ }
```

### Incorreto

```ts
if (session.user.plan === 'FREE' && studies.length >= 3) { /* ... */ }
// contar studies locais para inferir cota mensal de criação
```

## Alternativas consideradas

- **`features/entitlements` desde o dia 1:** adiada; hoje é política de sessão, não produto autônomo.
- **Checagem só no backend, zero no frontend:** rejeitada para UX (mensagens e CTAs); mantida a regra de autoridade no backend.
- **Hardcode de limites no frontend por plan:** rejeitada; duplica regra e diverge do mock/API.

## Referências

- `docs/architecture/state-management.md`
- `docs/adr/ADR-0003-state-management.md`
- `discussion.md` §§12–16
