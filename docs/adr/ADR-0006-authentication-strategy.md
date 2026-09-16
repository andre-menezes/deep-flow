# ADR-0006 — Authentication strategy

- **Status:** Accepted
- **Data:** 2026-09-16
- **Contexto:** `docs/architecture/open-decisions.md` itens 1–2; ADR-0003; ADR-0005

## Contexto

A Studia precisa de uma estratégia de autenticação no client alinhada ao HTTP client (ADR-0005) e ao estado de sessão (ADR-0003), antes do Mock Server e do Spring Boot. Sem isso, cada feature inventa login, storage de token e bootstrap.

Premissas já fechadas em ADR-0005: access token só em memória; refresh em cookie HttpOnly; refresh single-flight no `shared/http`.

## Decisão

### 1. Credenciais do MVP

- Login inicial: **e-mail + senha**.
- Logins sociais: fora do MVP (podem ser ADRs futuras).
- Tokens: **JWT** (access) + **refresh token** (opaco ou JWT conforme backend; o client não interpreta o refresh).

### 2. Sliding session

Enquanto o usuário usa o app, a sessão permanece renovável via refresh:

```text
Login → access (memória) + refresh (HttpOnly cookie)
         ↓
Uso contínuo → 401 ou refresh proativo → POST /auth/refresh
         ↓
novo access (+ novo refresh com rotação)
```

“Sessão indeterminada” significa **renovável enquanto houver atividade e refresh válido**, não token eterno irrevogável.

### 3. Refresh token rotation

Cada `POST /auth/refresh` bem-sucedido **rota** o refresh: o anterior é invalidado no servidor/mock; um novo cookie HttpOnly é emitido.

Reuso de refresh já rotacionado deve ser tratado no backend como incidente de segurança (revogar a família de sessão). Detalhe de detecção fica no servidor; o client apenas cai para `UNAUTHENTICATED` se o refresh falhar.

### 4. Durações MVP (política inicial)

Valores **normativos para o MVP** (Mock e API devem respeitar; podem ser ajustados depois via ADR/contrato sem mudar o modelo):

| Token | Duração alvo MVP | Notas |
|---|---|---|
| Access | **15 minutos** | Curta; renovado via refresh / 401 |
| Refresh | **14 dias** de inatividade máxima | Renovado a cada refresh bem-sucedido (sliding) |

O client **não** agenda timers obrigatórios de refresh preventivo no MVP; pode confiar no 401 + single-flight. Refresh proativo opcional (ex.: perto do expiry do access) é permitido se não duplicar voos (ADR-0005).

### 5. Bootstrap e estados de sessão

Máquina de estados (ADR-0003), dono em `features/auth`:

```text
UNKNOWN → INITIALIZING → AUTHENTICATED | UNAUTHENTICATED
```

Fluxo de subida do app:

```text
app/bootstrap
  → status INITIALIZING
  → POST /auth/refresh (credentials include)
  → sucesso: grava access em memória, carrega user/plan/entitlements/usage → AUTHENTICATED
  → falha: limpa access → UNAUTHENTICATED
  → só então o router aplica guards
```

O **router não** chama refresh; só lê o estado de sessão.

### 6. Endpoints conceituais (client)

| Ação | Método/path conceitual | Notas |
|---|---|---|
| Login | `POST /auth/login` | Body credenciais; seta cookie refresh; retorna access (+ user/entitlements ou seguido de `/me`) |
| Refresh | `POST /auth/refresh` | Cookie; retorna novo access; rota refresh |
| Logout | `POST /auth/logout` | Invalida sessão no servidor; client limpa access e estado |
| Sessão atual | `GET /auth/me` (ou equivalente) | user, plan informativo, entitlements, usage |

Paths finais no OpenAPI (`docs/api/`) podem usar prefixos versionados; a fachada `features/auth` permanece estável.

### 7. Logout

Logout é centralizado em `features/auth`:

1. `POST /auth/logout` (melhor esforço; mesmo se falhar a rede, limpar client)
2. Limpar access token em memória
3. Sessão → `UNAUTHENTICATED`
4. Navegar para rota de login

Não basta “apagar a store” sem tentar invalidar no servidor/mock.

### 8. Fora de escopo deste ADR

- UI de “dispositivos conectados” / revogação seletiva multi-dispositivo (adiado; modelo deve **permitir** N sessões no backend sem o client MVP listá-las).
- MFA, magic link, OAuth social.
- Catálogo completo de error codes (`docs/api/error-codes.md`).

## Consequências

- Mock Server e API real devem emitir cookie HttpOnly Secure (em produção) + SameSite adequado ao domínio do frontend.
- CORS e credentials precisam estar alinhados (`credentials: 'include'`).
- Guideline prática: `docs/architecture/authentication.md`.
- Entitlements continuam hidratados com a sessão (ADR-0004).

## Exemplos

### Correto

```ts
// bootstrap
await initSession() // refresh → AUTHENTICATED | UNAUTHENTICATED

// shared/http em 401 → single-flight refresh → retry
// features/auth.logout() → POST /auth/logout + limpar memória
```

### Incorreto

```ts
localStorage.setItem('accessToken', token)
router.beforeEach(() => refreshToken()) // refresh no router
document.cookie = 'refresh=...' // client escrevendo refresh
```

## Alternativas consideradas

- **Só session cookie (sem access em memória):** rejeitada no MVP; access em memória + refresh HttpOnly equilibra XSS e UX com ofetch Bearer.
- **Refresh em localStorage:** rejeitada (XSS).
- **Access longo (horas) sem refresh:** rejeitada; amplia janela de roubo do Bearer em memória/rede.
- **TTL indefinido sem política numérica:** rejeitada para Mock/API; valores MVP acima fecham o item de open-decisions.

## Referências

- `docs/architecture/authentication.md`
- ADR-0003, ADR-0004, ADR-0005
- `docs/architecture/state-management.md`
- `docs/architecture/http-client.md`
- `docs/architecture/open-decisions.md`
