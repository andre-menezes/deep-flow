# Ferramentas para agentes de IA

## Objetivo

Definir onde vive orientação para IA (Skills, Rules, AGENTS.md, MCP) sem duplicar ADRs.

## Divisão de responsabilidades

| Artefato | Papel | Conteúdo típico |
|---|---|---|
| `AGENTS.md` | Mapa sempre visível | O que é o repo, links, regras duras curtas |
| `.cursor/skills/*/SKILL.md` | Procedimentos sob demanda | Workflows (docs, feature, arquitetura) |
| `.cursor/agents/*.md` | Subagentes especializados | Code review pré-commit, etc. |
| `.cursor/hooks.json` + `.cursor/hooks/` | Automação de eventos do Agent | Gate de `git commit` após review |
| `.cursor/rules/*.mdc` | Invariantes / escopo por arquivo | Poucas regras always-on ou por glob |
| `docs/**` | Fonte normativa | ADRs, guidelines, FEATURE/BUG |
| `.cursor/mcp.json` | Ferramentas externas | Docs de libs, issues, browser, etc. |

## Não duplicar

- Procedimento longo → Skill (não Rule).
- Decisão e consequências → ADR.
- Como aplicar no dia a dia → guideline em `docs/architecture/`.
- Manual de Vue/Spring → MCP (Context7), não colar em Rule.

## Skills do repositório

```text
.cursor/skills/
├── studia-architecture/
├── writing-project-docs/
│   └── references/templates.md
└── implementing-vue-feature/
```

Invocação: automática por `description` / `paths`, ou manual via `/skill-name`.

## Rules

```text
.cursor/rules/
└── project-invariants.mdc    # alwaysApply
```

Manter rules **curtas**. Detalhe aponta para docs.

## Subagentes

```text
.cursor/agents/
├── studia-code-reviewer.md
├── studia-docs-writer.md
├── studia-architecture-guard.md
└── studia-feature-implementer.md
```

| Subagente | Papel |
|---|---|
| `studia-code-reviewer` | Review pré-commit (gate obrigatório via hook) |
| `studia-docs-writer` | ADR / FEATURE / BUG / guidelines |
| `studia-architecture-guard` | Compliance de arquitetura em `src/` |
| `studia-feature-implementer` | Implementação Vue a partir de FEATURE |

**Obrigatório antes de cada commit:** o hook `beforeShellExecution` em `.cursor/hooks.json` bloqueia `git commit` até existir um pass válido em `.cursor/hooks/state/code-review-ok.json` (gerado pelo `studia-code-reviewer` quando o veredito é APPROVE).

## MCP recomendado

Configurado em `.cursor/mcp.json` (sem segredos commitados).

| MCP | Uso na Studia |
|---|---|
| **Context7** | Docs atualizados de Vue, Vite, Pinia, Vue Router, Tailwind, ofetch, Spring |
| Browser / Playwright (ambiente) | Validação UI quando houver app |
| GitHub (se habilitado no ambiente) | PRs/issues — somente leitura se a política do agente restringir writes |

Adiar até existir necessidade real:

- MCP de OpenAPI dedicado (quando `docs/api/openapi.json` existir)
- MCP de DB/observabilidade (backend no ar)
- Notion/Linear (se o time passar a usá-los como fonte)

## Skills futuras (quando o código existir)

- `sync-openapi-types` — gerar `src/types/api/generated` a partir de OpenAPI
- `add-e2e-journey` — Playwright em `tests/e2e`
- `spring-endpoint` — quando o backend entrar no monorepo ou repo irmão

## Cloud Agents

Skills de projeto em `.cursor/skills/` viajam com o repo. Skills pessoais em `~/.cursor/skills/` só vão para Cloud se Sync Skills estiver ativo — preferir skills **no repositório** para este projeto.

## Resultado esperado

Um agente novo no repo consegue: (1) ler `AGENTS.md`, (2) carregar a skill certa, (3) aplicar ADRs, sem depender do arquivo histórico de discussão.
