# Git workflow (branches e commits)

## Objetivo

Padronizar branches e commits para humanos e agentes de IA, protegendo `main` e `develop`.

## Escopo

Todo trabalho no repositório Studia (docs, código, config).

## Fora do escopo

- Política de merge queue / branch protection no GitHub (configurar no remoto).
- Versionamento de release semântico do app (ADR/guideline futura).

## Regras duras

1. **Sempre** criar uma branch a partir de `develop` **antes** de criar, alterar ou excluir arquivos.
2. **Nunca** fazer push direto em `main` ou `develop`.
3. Integração apenas via **Pull Request** → `develop` (e `develop` → `main` quando houver release).
4. Commits: **Conventional Commits**.
5. **Antes de cada commit:** executar o subagente `studia-code-reviewer` e obter **APPROVE** (hook bloqueia `git commit` sem pass válido).

```text
develop (integração)
   ↑ PR
tipo/descricao-da-tarefa
```

## Branches

### Padrão

```text
<tipo>/<descricao-da-tarefa>
```

| Parte | Regra |
|---|---|
| `tipo` | Alinhado ao Conventional Commits (tabela abaixo) |
| `descricao-da-tarefa` | kebab-case, curto, em inglês técnico |

### Tipos de branch

| Tipo | Quando usar |
|---|---|
| `feat/` | Nova funcionalidade de produto |
| `fix/` | Correção de bug |
| `docs/` | Documentação, ADR, FEATURE/BUG specs, guidelines |
| `chore/` | Manutenção, tooling, deps sem mudança de comportamento |
| `refactor/` | Refatoração sem feature/fix |
| `test/` | Só testes |
| `ci/` | Pipeline / GitHub Actions |

### Com ID de artefato (preferir quando existir)

Incluir o identificador estável no nome:

```text
docs/adr-0005-http-client
docs/feature-0001-study-creation-wizard
fix/bug-0001-concurrent-token-refresh
feat/feature-0001-study-creation-wizard
```

### Sem ID

```text
chore/add-eslint-boundaries
docs/git-workflow
refactor/studies-list-store
```

### Exemplos incorretos

```text
develop                    # não trabalhar direto
main
ANDRE-nova-feature
feature/ADR0005
cursor/random-stuff        # evitar salvo Cloud Agent com sufixo obrigatório da plataforma
```

### Cloud Agents

Se a plataforma impor prefixo `cursor/...`, manter o restante alinhado:

```text
cursor/docs-adr-0005-http-client-a5fe
```

Ainda assim: base `develop`, PR para `develop`, sem push direto.

## Commits (Conventional Commits)

### Padrão

```text
<type>(optional-scope): <description>

[optional body]

[optional footer]
```

- `description`: imperativo, minúsculo, sem ponto final; **subject em inglês técnico** (corpo opcional em português se ajudar o contexto).
- Subject ≤ ~72 caracteres.

### Types

| Type | Uso |
|---|---|
| `feat` | Nova capacidade visível |
| `fix` | Correção |
| `docs` | Só documentação |
| `chore` | Tarefa de manutenção |
| `refactor` | Mudança interna sem fix/feat |
| `test` | Testes |
| `ci` | CI |
| `build` | Build / bundler |
| `perf` | Performance |

### Scope (opcional, recomendado)

Exemplos: `auth`, `studies`, `http`, `adr-0005`, `agents`.

### Exemplos corretos

```text
docs(adr-0005): define HTTP client and single-flight refresh
feat(studies): add study creation wizard steps
fix(auth): dedupe concurrent refresh calls
chore(agents): document branch workflow from develop
```

### Exemplos incorretos

```text
Update files
ajustes
WIP
Fixed stuff.
```

## Fluxo do agente / desenvolvedor

```text
1. git fetch origin
2. git checkout develop
3. git pull origin develop
4. git checkout -b <tipo>/<descricao>
5. alterar arquivos
6. invocar subagente `studia-code-reviewer` → Verdict APPROVE
7. commits (Conventional Commits) — hook valida o pass do review
8. git push -u origin HEAD          # NUNCA develop/main
9. (opcional) subagente `studia-pr-summarizer`
10. abrir PR → base develop (template: `.github/pull_request_template.md`)
```

Se o trabalho já começou por engano em `develop`: mover commits/alterações para uma branch nova a partir de `develop` atualizada; não fazer push de `develop`.

Emergência apenas: `STUDIA_SKIP_CODE_REVIEW=1` no ambiente do comando de commit (não usar no fluxo normal).

## Pull Requests

- Template GitHub: [`.github/pull_request_template.md`](../../.github/pull_request_template.md)
- Base padrão: **`develop`**
- Subagente auxiliar: `studia-pr-summarizer`

## Resultado esperado

Nenhuma alteração chega a `develop`/`main` sem PR; nomes de branch e commits permitem rastrear ADR/FEATURE/BUG.

## Referências

- `docs/conventions/document-naming.md`
- `AGENTS.md`
- [Conventional Commits](https://www.conventionalcommits.org/)
