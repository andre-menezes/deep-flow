# AGENTS.md

Orienta agentes de IA (Cursor e outros) que trabalham neste repositório.

## O que é o projeto

Studia é um SaaS de planejamento e organização de estudos. Premissa de produto: **incentivar e organizar, não fiscalizar**.

Fonte normativa: `docs/` (ADRs, architecture, product, FEATURE/BUG).  
Histórico (não normativo): `docs/archive/` — não usar como regra.

## Estado atual

- Fase: documentação e arquitetura (pouco ou nenhum código de app ainda).
- Frontend alvo: Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind v4 + ofetch + Vue I18n.
- Backend alvo (ainda inexistente): Spring Boot 3 + Java 21.
- DX local: stub HTTP em `tools/mock-server/` (`bun run mock`, ADR-0008). Mock Server oficial/dedicated permanece meta **fora** deste repositório (ADR-0001).

## Mapa rápido

| Precisa de…                      | Leia…                                                           |
| -------------------------------- | --------------------------------------------------------------- |
| Visão de produto                 | `docs/product/vision.md`                                        |
| Decisões abertas / próximos docs | `docs/architecture/open-decisions.md`                           |
| Decisões arquiteturais           | `docs/adr/`                                                     |
| Estrutura e imports              | `docs/architecture/project-structure.md`, `dependency-rules.md` |
| Estado / Pinia / sessão          | `docs/architecture/state-management.md`, ADR-0003, ADR-0004     |
| Como nomear docs                 | `docs/conventions/document-naming.md`                           |
| Branches e commits               | `docs/conventions/git-workflow.md`                              |
| Skills / Rules / MCP             | `docs/architecture/ai-tooling.md`                               |

## Regras duras (sempre)

1. Não use `docs/archive/` como fonte de regras; não reative o arquivo de discussão como spec.
2. Não invente estrutura de pastas fora do que está em ADR-0001/0002.
3. Não espalhe `if (plan === 'FREE'|'PREMIUM')` — use entitlements (`can` / `limits`).
4. Não chame HTTP de componentes; use `features/*/services` + `shared/http`.
5. Não importe interno de outra feature — só via `features/<name>/index.ts`.
6. Não crie abstrações (`Repository`, `UseCase`, `Mapper`…) sem necessidade real.
7. Antes de implementar comportamento de produto, preferir existir `FEATURE-NNNN-*.md`.
8. Antes de mudar arquitetura, preferir ADR (`Proposed` → `Accepted`).
9. Responda ao usuário em **português**, salvo se ele pedir outro idioma.
10. Commits: Conventional Commits; dependências com versões fixas (Bun no frontend).
11. Git: branch a partir de `develop` antes de qualquer alteração; **nunca** push em `main`/`develop` — ver `docs/conventions/git-workflow.md`.
12. Antes de **qualquer** `git commit`, executar o subagente `studia-code-reviewer` e só commitar com Verdict **APPROVE** (hook em `.cursor/hooks.json`).

## O que NÃO fazer ainda

- Não scaffolding massivo de pastas vazias.
- Não introduzir TanStack Query no MVP.
- Não criar `features/entitlements/` isolada no MVP (vive com `auth`).
- Não acoplar o domínio ao wizard (`currentStep` é UI/composable).

## Skills do projeto

| Skill                      | Quando                                           |
| -------------------------- | ------------------------------------------------ |
| `studia-architecture`      | Qualquer mudança de código/estrutura/arquitetura |
| `writing-project-docs`     | Criar/editar ADR, FEATURE, BUG ou guideline      |
| `implementing-vue-feature` | Implementar ou alterar uma feature Vue           |

## MCPs

Ver `docs/architecture/ai-tooling.md` e `.cursor/mcp.json`. Preferir Context7 para docs de libs.

## Branching

- Base de integração: `develop`.
- **Sempre** `git checkout -b <tipo>/<descricao>` a partir de `develop` antes de editar arquivos.
- **Nunca** push direto em `main` ou `develop` — só via Pull Request.
- Convenção completa: [`docs/conventions/git-workflow.md`](docs/conventions/git-workflow.md).
- Template de PR: [`.github/pull_request_template.md`](.github/pull_request_template.md).
- Exemplos: `docs/adr-0005-http-client`, `feat/feature-0001-study-wizard`, `fix/bug-0001-token-refresh`.
- Cloud Agents: se a plataforma exigir `cursor/...`, manter o restante alinhado (`cursor/docs-adr-0005-http-client-a5fe`).

## Subagentes

| Subagente | Quando |
|---|---|
| `studia-code-reviewer` | **Sempre** antes de `git commit`; revisa o diff contra docs normativas |
| `studia-docs-writer` | Criar/editar ADR, FEATURE, BUG, guidelines; fechar itens em `open-decisions.md` |
| `studia-architecture-guard` | Após mudanças em `src/` ou dúvidas de camadas/imports/HTTP/entitlements |
| `studia-feature-implementer` | Implementar comportamento a partir de `FEATURE-NNNN` (Vue/features) |
| `studia-pr-summarizer` | Antes de `gh pr create`; título/corpo no template do repositório |
| `studia-api-contract` | Contratos em `docs/api/`, error codes, alinhamento ADR-0005 |
| `studia-i18n-checker` | Locales pt-BR/en e mapeamento de erros API → i18n |
| `studia-test-planner` | Plano mínimo de testes (unit/component/e2e) por mudança/FEATURE |
