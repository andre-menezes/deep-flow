---
name: writing-project-docs
description: >-
  Writes and updates Deep Flow documentation using ADR-NNNN-slug, FEATURE-NNNN-slug,
  and BUG-NNNN-slug conventions with explicit examples and anti-examples.
  Use when creating or editing docs under docs/, ADRs, feature specs, bug specs,
  architecture guidelines, or documentation naming.
---

# Deep Flow — Writing project docs

## When to use

- Criar ou editar arquivos em `docs/`.
- Formalizar uma decisão da conversa em ADR.
- Especificar uma funcionalidade (`FEATURE`) ou defeito (`BUG`) antes/durante implementação.

## Naming (obrigatório)

```text
ADR-NNNN-<slug>.md
FEATURE-NNNN-<slug>.md
BUG-NNNN-<slug>.md
```

- `NNNN` = 4 dígitos, sequência **por tipo**.
- `slug` = kebab-case.
- Guia completo: `docs/conventions/document-naming.md`.

## Where files live

| Tipo | Pasta |
|---|---|
| ADR | `docs/adr/` |
| FEATURE / BUG | `docs/features/` |
| Guidelines | `docs/architecture/` (slug sem prefixo numérico) |
| Convenções | `docs/conventions/` |
| API | `docs/api/` |

## Workflow — ADR

1. Liste `docs/adr/ADR-*.md` e escolha o próximo número.
2. Use o template de `docs/adr/README.md`.
3. Status inicial: `Proposed` (ou `Accepted` se o usuário já fechou a decisão na conversa).
4. Atualize a tabela em `docs/adr/README.md`.
5. Se impacto estrutural, atualize a guideline correspondente em `docs/architecture/`.
6. **Não reescreva** ADR antiga em silêncio — supersede com nova ADR e marque a antiga.

## Workflow — FEATURE / BUG

1. Liste specs existentes e pegue o próximo número do tipo.
2. Estrutura mínima FEATURE:

```text
Objetivo
Escopo
Fora do escopo
Comportamento
Regras
UX
Entitlements / limites (se houver)
Exemplos
Anti-exemplos
Resultado esperado
Referências
```

3. Atualize `docs/features/README.md`.
4. FEATURE deve referenciar ADRs aplicáveis; não reinventar arquitetura na spec.

## Style rules (IA + humano)

- Normativo: “deve / não deve”.
- Incluir **exemplos** e **anti-exemplos**.
- Evitar: “use composables quando necessário” sem critério.
- Preferir apontar para arquivos canônicos a colar paredes de texto.
- Português para docs do projeto (código/ids técnicos em inglês).

## Do not

- Não tratar `docs/archive/` como spec normativa.
- Não duplicar o texto inteiro de uma ADR dentro de uma guideline — guideline aplica; ADR justifica.
- Não criar FEATURE sem Escopo/Fora do escopo.
- Ao fechar item de `open-decisions.md`, atualizar a tabela Closed/Open.

## Optional templates

Ver `references/templates.md` nesta skill se precisar de esqueleto copiável.
