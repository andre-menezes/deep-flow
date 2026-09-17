# Estrutura de projeto (frontend)

## Objetivo

Descrever a árvore-alvo do frontend e o que pertence a cada pasta.

## Escopo

Frontend Vue em `src/`, documentação em `docs/`, testes E2E/support em `tests/`, tooling de DX em `tools/` (ADR-0008).

## Fora do escopo

- Estrutura do repositório backend Spring Boot (futuro, repositório separado ou não — TBD).
- Implementação física obrigatória de todas as pastas no dia 1.
- Mock Server oficial/dedicated (permanece fora deste repositório; ver ADR-0001 + ADR-0008).

## Árvore-alvo

```text
studia/
├── docs/
│   ├── product/
│   ├── adr/
│   ├── architecture/
│   ├── features/
│   ├── api/
│   └── conventions/
├── tools/
│   └── mock-server/          # stub HTTP de DX (ADR-0008); não é src/
├── src/
│   ├── app/
│   │   ├── main.ts
│   │   ├── App.vue
│   │   ├── config/
│   │   ├── plugins/
│   │   ├── router/
│   │   └── bootstrap/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── studies/
│   │   └── settings/
│   ├── shared/
│   │   ├── ui/
│   │   ├── layouts/
│   │   ├── http/
│   │   ├── composables/
│   │   ├── utils/
│   │   ├── i18n/
│   │   └── styles/
│   └── types/
│       ├── api/
│       ├── auth.ts
│       ├── entitlements.ts
│       └── common.ts
└── tests/
    ├── e2e/
    └── support/
```

`tools/` é tooling de desenvolvimento (ex.: `bun run mock`). Não deve ser importado por `src/` nem empacotado como parte da aplicação Vue.

## Anatomia de uma feature

```text
features/<name>/
├── index.ts
├── routes.ts
├── locales/
├── views/
├── components/
├── composables/
├── services/
├── stores/
├── domain/
└── <subcontexto>/          # ex.: tasks/, notes/ — promovível
```

Criar subpastas somente quando houver arquivos reais.

## Dia 1 (mínimo)

```text
docs/{adr,architecture,conventions}/
src/app/{main.ts,App.vue,router/,plugins/}
src/features/auth/
src/shared/{ui/,http/,i18n/,styles/}
src/types/{api/,common.ts}
tests/support/
```

## Alias de import

Um único alias: `@/*` → `src/*`.

Evitar `@types` (colide com a convenção npm `@types/*`).

## Resultado esperado

Um desenvolvedor ou agente consegue responder “onde coloco X?” usando este documento + `dependency-rules.md` sem inspecionar todo o repositório.

## Referências

- ADR-0001, ADR-0002, ADR-0008
- `docs/architecture/dependency-rules.md`
