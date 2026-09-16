# Visão geral da arquitetura

## Objetivo

Orientar a leitura da documentação arquitetural da Studia.

## Premissa

> Construir uma aplicação simples para o usuário, com arquitetura simples para o desenvolvedor e estrutura explícita o bastante para um agente de IA compreender, modificar e expandir o sistema com segurança.

## Pilares já aceitos

| Pilar                                | Documento                             |
| ------------------------------------ | ------------------------------------- |
| Arquitetura frontend                 | ADR-0001                              |
| Estrutura por features               | ADR-0002 + `project-structure.md`     |
| Dependências entre módulos           | `dependency-rules.md`                 |
| Estado (Pinia, UI vs resource)       | ADR-0003 + `state-management.md`      |
| Entitlements / autorização no client | ADR-0004                              |
| Nomenclatura de docs                 | `docs/conventions/document-naming.md` |
| Visão de produto                     | `docs/product/vision.md`              |
| Tooling de IA                        | `ai-tooling.md`                       |
| HTTP client                          | ADR-0005 + `http-client.md`           |
| Autenticação (client)                | ADR-0006 + `authentication.md`        |
| Contrato API                         | ADR-0007 + `docs/api/`                |
| Backlog de decisões                  | `open-decisions.md`                   |

## Backend (direção, ainda não implementado)

- Direção atual: **Spring Boot 3 + Java 21**
- Frontend não bloqueia: Mock Server externo
- Contrato: OpenAPI 3.1 em `docs/api/openapi.yaml` + RFC 9457 + cookies para refresh token

## Próximos documentos recomendados

Em ordem sugerida:

1. Guideline de i18n (e UI mínima)
2. FEATURE de edição de Study / dashboard (após FEATURE-0001)
3. Scaffolding mínimo do app Vue contra Mock Server

## Fonte de premissas

A discussão inicial foi **arquivada** em `docs/archive/DISCUSSION-2026-09-initial.md` e não é fonte normativa.  
Use `docs/product/vision.md`, ADRs e `open-decisions.md`. O arquivo histórico pode ser removido quando o critério em `open-decisions.md` for atendido (o Git preserva o conteúdo).
