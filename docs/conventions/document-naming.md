# Convenção de nomenclatura de documentos

## Objetivo

Padronizar nomes de arquivos de documentação para facilitar descoberta por humanos e agentes de IA.

## Escopo

Aplica-se a ADRs, especificações de feature e registros de bug dentro de `docs/`.

## Fora do escopo

- Arquivos de guideline em `docs/architecture/` (usam slug descritivo sem prefixo numérico).
- Código-fonte e testes.

## Padrão

```text
<TIPO>-<NNNN>-<slug>.md
```

| Parte | Regra |
|---|---|
| `TIPO` | `ADR`, `FEATURE` ou `BUG` (maiúsculas) |
| `NNNN` | Número sequencial com 4 dígitos, zero-padded |
| `slug` | kebab-case, inglês técnico curto, sem espaços |

## Exemplos corretos

```text
ADR-0001-frontend-architecture.md
ADR-0002-feature-oriented-project-structure.md
ADR-0003-state-management.md
FEATURE-0001-study-creation-wizard.md
FEATURE-0002-dashboard-action-oriented.md
BUG-0001-concurrent-token-refresh.md
```

## Exemplos incorretos

```text
adr-1-frontend.md
ADR-1-Frontend_Architecture.md
feature_study_wizard.md
0001-adr-structure.md
```

## Onde cada tipo vive

| Tipo | Pasta | Conteúdo |
|---|---|---|
| `ADR` | `docs/adr/` | Decisão arquitetural e suas consequências |
| `FEATURE` | `docs/features/` | Spec de funcionalidade (comportamento, regras, UX) |
| `BUG` | `docs/features/` ou `docs/features/bugs/` | Spec do defeito, causa, correção esperada |

## Numeração

- A sequência é **por tipo**, não global.
- O próximo número é o maior existente daquele tipo + 1.
- Números não são reutilizados após remoção/supersede.
- Quando uma ADR substitui outra, a nova ADR referencia a antiga e declara o status `Superseded` na antiga.

## Status de documento

Documentos `ADR`, `FEATURE` e `BUG` devem declarar status no cabeçalho:

```text
Proposed | Accepted | Deprecated | Superseded
```

Para `FEATURE` / `BUG`, status adicionais úteis:

```text
Draft | Ready | In Progress | Done
```

## Estrutura mínima recomendada

Para documentos importantes, usar:

```text
Objetivo
Escopo
Fora do escopo
Conceitos
Regras
Exemplos
Anti-exemplos
Exceções
Resultado esperado
```

ADRs podem usar o template em `docs/adr/README.md`.
