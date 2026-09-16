# ADR-0003 — State management

- **Status:** Accepted
- **Data:** 2026-09-16
- **Contexto:** discussão pós-estrutura; backend ainda inexistente; Mock Server

## Contexto

Com a estrutura `app` / `features` / `shared` / `types` definida, faltava decidir como o estado vive no frontend.

Restrição atual: o backend real (Spring Boot) **não existirá por um tempo**. O frontend falará com Mock Server. Isso favorece simplicidade agora, mas não deve forçar um rewrite completo depois.

Perguntas abertas eram:

1. Estado “UI local” agora e cache de servidor depois?
2. Onde vivem sessão e entitlements?
3. Pinia puro vs introduzir TanStack Query desde o início?

## Decisão

### 1. Pinia é a única lib de estado no MVP

Não adotar TanStack Query (nem equivalente) enquanto o backend real e os requisitos de cache (stale-while-revalidate, dedupe avançado, invalidação por query key) não existirem.

### 2. Dois tipos de store desde o dia 1

Mesmo sem backend real, **não** tratar tudo como “estado de UI”.

| Tipo | Responsabilidade | Exemplos |
|---|---|---|
| **UI store / state** | Preferências e estado efêmero de interface | passo do wizard, filtros abertos, drawer |
| **Resource store** | Dados que representam recursos da API (mesmo mockada) | lista de studies, detalhe, usage mensal |

Resource stores têm forma estável:

```text
data | status (idle|loading|success|error) | error | actions (fetch/create/update/...)
```

As actions **sempre** passam por `features/*/services/*`, nunca por HTTP direto no componente ou na store sem service.

### 3. Não fazer “UI local puro” para depois migrar

A migração desejada não é:

```text
hardcode na UI → rewrite para cache de servidor
```

É:

```text
service (mock) → resource store (Pinia)
        ↓ (depois)
service (API real) → resource store (Pinia)
        ↓ (se necessário)
service / query client → UI consome a mesma fachada
```

Ou seja: a borda `component → composable/store → service` permanece. O que muda é a implementação atrás do service / da store.

### 4. Sessão e entitlements

- Estado de autenticação e entitlements vive em `features/auth` (exportado via `index.ts`).
- `app/bootstrap/initSession` hidrata esse estado **antes** do router montar rotas protegidas.
- Detalhes normativos de entitlements: `ADR-0004`.

### 5. Critério para introduzir TanStack Query depois

Só quando existir pelo menos um destes:

- backend real com latência e necessidade clara de cache/revalidação;
- muitas telas refetchando o mesmo recurso com regras de stale;
- necessidade de dedupe/paralelismo além do single-flight de auth já previsto no HTTP client.

## Consequências

- MVP simples (só Pinia), alinhado a `discussion.md` §36.
- Caminho de migração documentado; evita acoplar componentes ao mock.
- Resource stores não devem virar “God stores”; preferir stores por agregado/contexto.
- Wizard continua fora do domínio (`useStudyWizard` em composable de feature).

## Exemplos

### Correto

```ts
// features/studies/stores/studyListStore.ts
// status + data + fetchStudies() → studyService.list()

// features/studies/composables/useStudyWizard.ts
// currentStep / nextStep() — estado de UI, não domínio
```

### Incorreto

```ts
// componente carrega JSON mock inline
// store chama ofetch diretamente
// if (user.plan === 'PREMIUM') na store de studies
```

## Alternativas consideradas

- **Só estado UI local sem services:** rejeitada; tornaria a troca Mock→API um rewrite.
- **TanStack Query desde o início:** rejeitada por complexidade prematura sem backend real.
- **Estado global único:** rejeitada; conflita com features independentes.

## Referências

- `docs/architecture/state-management.md`
- `docs/adr/ADR-0004-entitlements-and-authorization.md`
- `discussion.md` §§7, 21–26, 36
