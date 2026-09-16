# Estrutura de projeto (frontend)

## Objetivo

Descrever a árvore-alvo do frontend e o que pertence a cada pasta.

## Escopo

Frontend Vue em `src/`, documentação em `docs/`, testes E2E/support em `tests/`.

## Fora do escopo

- Estrutura do repositório backend Spring Boot (futuro, repositório separado ou não — TBD).
- Implementação física obrigatória de todas as pastas no dia 1.

## Árvore-alvo

```text
deep-flow/
├── docs/
│   ├── product/
│   ├── adr/
│   ├── architecture/
│   ├── features/
│   ├── api/
│   └── conventions/
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

- ADR-0001, ADR-0002
- `docs/architecture/dependency-rules.md`
