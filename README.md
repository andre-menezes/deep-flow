# deep-flow
O **Deep Flow** é uma plataforma web para planejamento e gerenciamento de estudos contínuos. Projetado para estudantes e autodidatas, o sistema ajuda a transformar grandes metas de aprendizado em cronogramas práticos, combinando técnicas comprovadas de produtividade com acompanhamento visual de desempenho.

## Funcionalidades

- **Metas**: cadastre objetivos de aprendizado (carga horária, prazo e cadência) e gere cronogramas automaticamente.
- **Cronograma**: acompanhe as sessões de estudo planejadas e marque o que foi concluído.
- **Foco**: um cronômetro Pomodoro que registra o tempo focado direto na meta escolhida.
- **Painel**: acompanhamento visual de desempenho com gráficos e progresso por meta.

Os dados são persistidos localmente no navegador (`localStorage`), então a aplicação roda de ponta a ponta sem back-end nem credenciais.

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- [React Router](https://reactrouter.com/) para navegação
- [Recharts](https://recharts.org/) para os gráficos
- [Vitest](https://vitest.dev/) + Testing Library para testes

## Desenvolvimento

Requisitos: Node.js 20+ e npm.

```bash
npm install        # instala as dependências
npm run dev        # inicia o servidor de desenvolvimento em http://localhost:5173
npm run build      # gera o build de produção
npm run preview    # serve o build de produção localmente
npm test           # roda os testes unitários
npm run lint       # roda o ESLint
```
