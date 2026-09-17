# ADR-0008 — Stub HTTP local de DX (`tools/mock-server`)

- **Status:** Accepted
- **Data:** 2026-09-16
- **Contexto:** DX do MVP (login sem backend Spring); amenda parcialmente a consequência de Mock Server em ADR-0001

## Contexto

A ADR-0001 (Accepted) registrou que o Mock Server permanece **fora** do repositório do frontend. Essa regra mira um Mock Server **oficial / dedicado** (paridade de contrato, evolução independente do app).

No MVP, o frontend já precisa de login e sessão contra uma API HTTP (`/api/v1`), sem cadastro público e sem backend Spring. Manter *todo* mock fora do repo bloqueava DX imediata (rodar `dev` + auth seed).

É necessário distinguir:

| Papel | Onde vive | Objetivo |
|---|---|---|
| Stub HTTP de DX local | `tools/mock-server/` **neste** repositório | Desbloquear desenvolvimento do frontend |
| Mock Server oficial / dedicado | **Fora** deste repositório (meta de longo prazo) | Paridade de contrato e evolução independente |

## Decisão

1. É **permitido** um stub HTTP mínimo de DX em `tools/mock-server/` dentro do repositório do frontend.
2. Esse stub **não substitui** a regra de que o Mock Server oficial/dedicated permanece fora do repositório (ADR-0001, amenda parcial — ver abaixo).
3. Execução normativa no MVP:
   - Script: `bun run mock` → `tools/mock-server/index.ts`
   - Runtime: Bun (`Bun.serve`)
   - Prefixo de API: `/api/v1` (alinhado a `VITE_API_BASE_URL` / ADR-0005)
4. Auth seed do stub (sem cadastro público neste mock):
   - E-mail: `demo@studia.app`
   - Senha: `studia123`
5. O stub **não** entra em `src/`, **não** é dependência de produção do app Vue e **não** deve ser importado por `features/` ou `shared/`.
6. Contratos e comportamento de auth/HTTP do stub devem seguir `docs/api/`, ADR-0005 e ADR-0006 na medida do MVP; divergências devem ser documentadas no README do stub, não espalhadas em services.

### Relação com ADR-0001

- ADR-0001 permanece **Accepted**.
- A consequência “Mock Server permanece fora do repositório” passa a significar: **Mock oficial/dedicated fora**; stub DX local em `tools/` é exceção explícita desta ADR-0008.
- Não reescrever o corpo da ADR-0001 em silêncio: a ADR-0001 deve apontar para esta amenda.

## Consequências

- DX local desbloqueada (`bun run mock` + `bun run dev`) sem esperar Spring Boot nem repo externo de mock.
- Agentes e humanos devem tratar `tools/mock-server/` como tooling de desenvolvimento, não como feature ou domínio.
- Evoluir o stub para “mock oficial completo” **dentro** de `src/` ou acoplá-lo ao bundle Vite é proibido por esta decisão.
- Quando o Mock Server dedicado externo existir, o stub em `tools/` pode permanecer como atalho local ou ser descontinuado por ADR futura — sem mudar a forma de chamar HTTP em `shared/http` / services.

## Exemplos

### Correto

- `bun run mock` sobe `tools/mock-server/index.ts`; o app aponta `VITE_API_BASE_URL` para `http://localhost:3000/api/v1`.
- Login MVP usa o seed `demo@studia.app` / `studia123` via `authService` → `@/shared/http`.
- README em `tools/mock-server/` descreve CORS, seed e que o mock oficial pode viver fora do repo.

### Incorreto

- Importar handlers do stub em `features/auth` ou `shared/http` (“bypass” sem HTTP).
- Colocar mock embutido em `src/features/**/mocks/` como substituto do cliente HTTP (ADR-0003 / ADR-0005).
- Declarar que “não pode existir nenhum mock neste repositório” ignorando esta ADR.
- Expor cadastro público no stub como se fosse produto, sem FEATURE/API correspondente.
- Tratar o stub em `tools/` como o Mock Server oficial definitivo e abandonar a meta de mock dedicado externo sem nova ADR.

## Alternativas consideradas

- **Manter mock 100% externo desde o dia 1:** rejeitada para o MVP — bloqueia login/sessão sem repo/processo externo pronto.
- **MSW / handlers no browser dentro de `src/`:** rejeitada como caminho padrão — mistura tooling com app e enfraquece o caminho service → `shared/http` → API.
- **Backend Spring mínimo no mesmo repo:** fora de escopo do frontend e prematuro frente ao stub DX.

## Referências

- `docs/adr/ADR-0001-frontend-architecture.md` (amenda parcial)
- `docs/adr/ADR-0005-http-client.md`
- `docs/adr/ADR-0006-authentication-strategy.md`
- `docs/architecture/http-client.md`
- `docs/architecture/project-structure.md`
- `tools/mock-server/README.md`
