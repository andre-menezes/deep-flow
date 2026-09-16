# Studia

A **Studia** é uma plataforma web para planejamento e gerenciamento de estudos contínuos. Projetada para estudantes e autodidatas, ajuda a transformar grandes metas de aprendizado em cronogramas práticos, combinando técnicas comprovadas de produtividade com acompanhamento visual de desempenho.

## Documentação

- Visão de produto: [`docs/product/vision.md`](docs/product/vision.md)
- Arquitetura e ADRs: [`docs/`](docs/README.md)
- API (OpenAPI): [`docs/api/`](docs/api/README.md)
- Orientações para agentes de IA: [`AGENTS.md`](AGENTS.md)
- Decisões em aberto: [`docs/architecture/open-decisions.md`](docs/architecture/open-decisions.md)

## App (frontend)

Requer [Bun](https://bun.sh) e um Mock Server externo alinhado a `docs/api/openapi.yaml`.

```bash
cp .env.example .env
bun install
bun run dev
```

`VITE_API_BASE_URL` deve apontar para o Mock (ex.: `http://localhost:3000/api/v1`).
