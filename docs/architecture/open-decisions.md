# Decisões em aberto

## Objetivo

Substituir a lista §56–57 da discussão inicial por um backlog vivo de decisões ainda não formalizadas em ADR/guideline/FEATURE.

## Como usar

- Ao fechar uma decisão: criar ADR ou guideline, depois marcar o item como **Closed** aqui (com link).
- Não implementar comportamento de produto crítico sem tirar o item correspondente deste backlog (ou criar FEATURE).

## Já fechadas (promovidas)

| Tema | Destino |
|---|---|
| Arquitetura geral frontend | ADR-0001 |
| Estrutura de diretórios / camadas | ADR-0002 + `project-structure.md` |
| Dependências / fronteiras de feature | ADR-0002 + `dependency-rules.md` |
| Estratégia de estado (Pinia, UI vs resource) | ADR-0003 + `state-management.md` |
| Entitlements no client (modelo inicial) | ADR-0004 |
| Nomenclatura ADR/FEATURE/BUG | `docs/conventions/document-naming.md` |
| Tooling de agentes (skills/rules/MCP) | `docs/architecture/ai-tooling.md` |
| Visão de produto / Study | `docs/product/vision.md` |
| HTTP client / single-flight / erros HTTP (mínimo) | ADR-0005 + `http-client.md` |
| Auth (sliding session, rotation, bootstrap, TTLs MVP) | ADR-0006 + `authentication.md` |
| FEATURE Study creation wizard | FEATURE-0001 |

## Abertas (próximos passos sugeridos)

Ordenado pela sequência útil de documentação:

| # | Tema | Artefato sugerido |
|---|---|---|
| 1 | Sessões multi-dispositivo / revogação (UI) | ADR (pode adiar pós-MVP) |
| 2 | Contratos de API + OpenAPI generation | `docs/api/` + ADR |
| 3 | Tratamento de erros (RFC 9457 → i18n) catálogo | guideline + `docs/api/error-codes.md` |
| 4 | Período exato da cota mensal de criações | ADR de billing/usage |
| 5 | Critérios de composables e componentes | guideline UI |
| 6 | Layouts, navegação, design tokens, breakpoints | guideline + FEATURE dashboard |
| 7 | Sistema de componentes / a11y / SEO | guidelines |
| 8 | i18n (organização já esboçada; fechar regras) | ADR ou guideline |
| 9 | Estratégia de testes + coverage mínimo | guideline `testing.md` |
| 10 | CI/CD + versionamento do app | guideline / ADR |
| 11 | Modelo definitivo de Task / Note | FEATURE ou domain spec |
| 12 | Necessidade de StudySession no roadmap | product decision |

## Critério para apagar o arquivo histórico

O arquivo `docs/archive/DISCUSSION-2026-09-initial.md` pode ser **removido do repositório** quando:

1. Os itens abertos acima que ainda dependiam só da discussão estiverem cobertos por docs normativas, **ou** conscientemente adiados com dono/ADR; e
2. Nenhuma skill/rule/`AGENTS.md` apontar para ele como leitura obrigatória.

O conteúdo permanece recuperável via histórico Git (`git show` / commit de arquivamento).

## Referências

- `docs/product/vision.md`
- `docs/architecture/overview.md`
- `docs/archive/README.md`
