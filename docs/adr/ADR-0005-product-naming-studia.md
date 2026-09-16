# ADR-0005 — Product naming: Studia

- **Status:** Accepted
- **Data:** 2026-09-16
- **Contexto:** Discussão de naming pós-fundação de arquitetura; nome de trabalho anterior "Deep Flow"

## Contexto

O produto foi iniciado sob o nome de trabalho **Deep Flow**. O nome não comunicava o domínio (estudo/planejamento) e competia semanticamente com apps genéricos de foco/produtividade ("flow", "deep work").

O público inicial é brasileiro, com ambição de expansão global. Era necessário um nome que funcionasse em pt-BR sem tradução forçada e que tivesse significado real em inglês.

## Decisão

O nome oficial do produto passa a ser **Studia**.

- Origem: latim `studium` (plural `studia`) — "estudo(s)", derivado de `studeō` ("dedicar-se, empenhar-se").
- Motivo da escolha: comunica o domínio (estudos) e o tom de produto (dedicação, não fiscalização), funciona em pt-BR e em inglês sem adaptação, e não colide com o termo de domínio `Study` (ver ADR-0001..0004, `docs/product/vision.md`).
- Gênero em português: tratar como substantivo feminino ("a Studia"), por analogia a "a plataforma/aplicação".

## Escopo desta ADR

Cobre apenas o **nome do produto** na documentação (`docs/`, `AGENTS.md`, skills, rules). Não cobre:

- Renomeação do repositório GitHub (slug continua `deep-flow` até decisão/ação separada).
- Domínio, redes sociais, identidade visual/marca.
- Nome de pacotes (`package.json`, etc.) — ainda não existem; devem nascer já como `studia-*` quando criados.

## Consequências

- Toda documentação nova referencia **Studia**, não "Deep Flow".
- Skill anteriormente `deep-flow-architecture` foi renomeada para `studia-architecture` (nome de skill deve casar com nome da pasta).
- O termo de domínio `Study` (uma unidade de plano de estudo) permanece inalterado — não confundir com o nome do produto `Studia`.
- Referências ao nome antigo só aparecem como nota histórica (README, AGENTS.md).

## Exemplos

### Correto

```md
A Studia é uma plataforma de planejamento de estudos.
```

```ts
// nome de skill/pasta consistente
.cursor/skills/studia-architecture/SKILL.md
```

### Incorreto

```md
O Deep Flow permite criar Studies. // nome de produto desatualizado
```

## Alternativas consideradas

Ver discussão completa em `docs/archive/DISCUSSION-2026-09-initial.md` (histórico) — não normativa. Alternativas avaliadas: Estuda, Trilha, Cadência, Pace, Studia (escolhida).

## Referências

- `docs/product/vision.md`
- `docs/architecture/ai-tooling.md`
- `README.md`
