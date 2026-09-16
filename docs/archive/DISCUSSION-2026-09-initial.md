# Contexto e Decisões Iniciais do Projeto

> **Status:** ARCHIVED (histórico)
> **Não usar como fonte normativa.** Premissas úteis foram promovidas para `docs/product/vision.md`, ADRs e `docs/architecture/open-decisions.md`.
> **Remoção:** candidata quando o critério em `open-decisions.md` for atendido. Conteúdo permanece no Git.
>
> **Objetivo original:** Registrar decisões da fase de planejamento antes da documentação técnica definitiva.

---

## 1. Objetivo do documento

Este documento registra as principais decisões tomadas durante a fase inicial de planejamento da aplicação.

Ele **não representa ainda a especificação técnica definitiva do projeto**. Seu propósito é preservar o contexto das decisões para que o desenvolvimento da documentação arquitetural possa continuar posteriormente sem a necessidade de reconstruir todo o raciocínio realizado.

As decisões aqui registradas devem ser consideradas como **premissas atuais**, podendo ser revisadas durante a próxima fase de arquitetura.

---

# 2. Visão do produto

A aplicação será um **SaaS de planejamento e organização de estudos**.

O objetivo é permitir que uma pessoa organize seus estudos de maneira simples, intuitiva e flexível.

O sistema não deve tentar controlar rigidamente o comportamento do usuário. Sua função é:

- incentivar os estudos;
- ajudar na organização;
- auxiliar no planejamento;
- facilitar o acompanhamento;
- fornecer ferramentas para execução da rotina planejada.

O sistema deve atuar como um **assistente de planejamento**, e não como um mecanismo de fiscalização.

---

# 3. Conceito principal: Study

O conceito central da aplicação será o **Study**.

Um Study não representa uma sessão individual de estudo.

Ele representa:

> **O objetivo, plano ou área de estudo que o usuário deseja desenvolver.**

Exemplos:

- Aprender Inglês;
- Estudar Matemática;
- Aprender Programação;
- Preparar-se para uma certificação;
- Estudar para um concurso.

Um Study poderá possuir informações como:

```text
Study
├── Identidade
├── Objetivo
├── Rotina / Frequência
├── Status
├── Tasks
└── Notes
```

Funcionalidades futuras, como histórico de sessões, estatísticas e acompanhamento de tempo, poderão ser adicionadas posteriormente.

---

# 4. Status do Study

O Study terá inicialmente quatro estados:

```text
ACTIVE
PAUSED
COMPLETED
ARCHIVED
```

### ACTIVE

O estudo está atualmente em andamento.

### PAUSED

O usuário pausou temporariamente o estudo.

### COMPLETED

O usuário considera que o objetivo do estudo foi alcançado.

### ARCHIVED

O estudo foi arquivado e não faz mais parte da rotina ativa do usuário.

A mudança de status deverá representar o ciclo de vida do Study e não deve ser confundida com o estado das Tasks ou com a execução de uma sessão de estudo.

---

# 5. Criação de Study

A criação de um Study utilizará um **fluxo guiado por etapas (wizard)**.

O objetivo é permitir que o usuário configure o estudo progressivamente, evitando apresentar um formulário grande e complexo de uma única vez.

Um fluxo conceitual poderá ser:

```text
Sobre
  ↓
Objetivo
  ↓
Rotina
  ↓
Confirmação
  ↓
Study criado
```

O wizard é uma preocupação da camada de apresentação.

O domínio não deve conhecer conceitos como:

```ts
currentStep
nextStep()
previousStep()
Step 1
Step 2
```

Esses conceitos pertencem à interface.

O domínio deve trabalhar com o conceito de Study independentemente de ele ter sido criado por um wizard, formulário, API ou outra interface.

---

# 6. Edição de Study

A edição de um Study não deverá obrigatoriamente reutilizar o wizard de criação.

A criação e a edição são experiências diferentes.

### Criação

Objetivo:

> Reduzir a complexidade e orientar o usuário.

### Edição

Objetivo:

> Permitir alterações rápidas e localizadas.

Por exemplo, o usuário poderá editar separadamente:

- Objetivo;
- Rotina;
- Informações básicas.

sem precisar percorrer novamente todo o fluxo de criação.

---

# 7. Dashboard

O Dashboard seguirá uma abordagem **híbrida**, combinando:

- informações gerais;
- visão dos estudos;
- tarefas relevantes;
- próximas ações;
- ações rápidas.

Entretanto, a prioridade será orientar o usuário sobre:

> **O que estou estudando e o que posso fazer agora?**

O Dashboard não deverá ser apenas um conjunto de métricas e cards.

A experiência deve ser orientada à ação.

Exemplo conceitual:

```text
Olá!

O que você quer fazer hoje?

┌───────────────────────────────────┐
│ Aprender Inglês                   │
│                                   │
│ Próxima tarefa                    │
│ Revisar vocabulário               │
│                                   │
│ Hoje · 45 min                     │
│                                   │
│ [ Começar ]                       │
└───────────────────────────────────┘

Hoje
────────────────────────────────────

□ Revisar vocabulário
□ Resolver exercícios

Meus estudos
────────────────────────────────────

Aprender Inglês       ACTIVE
Matemática            ACTIVE
Programação           PAUSED
```

O Dashboard deverá orquestrar a apresentação, mas não assumir a responsabilidade de todos os domínios.

---

# 8. Tasks

Tasks serão recursos simples associados a um Study.

O objetivo é orientar o usuário sobre o que precisa fazer dentro daquele estudo.

A primeira versão não deverá implementar um sistema completo de gerenciamento de tarefas.

Modelo conceitual:

```text
Task
├── id
├── studyId
├── title
├── status
├── dueDate?
└── createdAt
```

Os estados inicialmente considerados são:

```text
PENDING
COMPLETED
```

Não haverá inicialmente necessidade de:

- prioridades complexas;
- etiquetas;
- subtarefas;
- dependências;
- responsáveis;
- anexos;
- recorrências complexas;
- workflow avançado.

Exemplo:

```text
□ Estudar capítulo 3
□ Revisar vocabulário
✓ Fazer exercícios
□ Assistir aula 5
```

Tasks existem dentro do contexto de um Study.

Elas não serão inicialmente tratadas como um domínio independente da aplicação.

---

# 9. Notes

Notes também serão simples e existirão para auxiliar o usuário durante o estudo.

Modelo conceitual:

```text
Note
├── id
├── studyId
├── title
├── content
└── createdAt
```

A primeira versão não deverá implementar um sistema completo de gerenciamento de conhecimento.

Não haverá inicialmente necessidade de:

- tags;
- pastas;
- backlinks;
- colaboração;
- versionamento;
- anexos;
- editor complexo;
- recursos avançados de conhecimento.

Exemplo:

```text
Anotações

┌─────────────────────────────────┐
│ Vocabulário importante          │
│                                 │
│ achieve = alcançar              │
│ improve = melhorar              │
│ schedule = programação          │
└─────────────────────────────────┘
```

Assim como Tasks, Notes pertencem ao contexto de um Study.

Caso futuramente ganhem funcionalidades suficientes para justificar autonomia, poderão ser promovidas a features independentes.

---

# 10. Timer

A aplicação poderá possuir um timer para auxiliar o usuário a gerenciar o tempo dedicado ao estudo.

O timer **não será um limitador**.

Exemplo:

```text
Tempo planejado: 45 minutos

        44:32

[ Pausar ]
```

Ao atingir o tempo planejado:

```text
Seu tempo planejado terminou.

[ Continuar estudando ]
[ Encerrar ]
```

O usuário poderá continuar estudando indefinidamente.

O princípio é:

> O sistema incentiva e organiza; não dita regras ao usuário.

Inicialmente, o timer poderá existir como uma funcionalidade da experiência de Study, sem necessariamente persistir sessões no backend.

---

# 11. Study Session

Foi identificado um possível conceito futuro de `StudySession`.

Exemplo conceitual:

```text
StudySession
├── id
├── studyId
├── startedAt
├── endedAt
├── duration
└── notes?
```

Uma Study Session representaria uma ocorrência concreta de estudo.

Por exemplo:

```text
Study
└── Aprender Inglês
    ├── Session 01
    ├── Session 02
    └── Session 03
```

Esse conceito poderá futuramente suportar:

- histórico;
- estatísticas;
- tempo estudado;
- calendário;
- streaks;
- acompanhamento de produtividade.

Entretanto, **não está definido como requisito obrigatório do MVP**.

O timer não deve ser tratado como uma limitação de tempo.

---

# 12. Planos

A aplicação terá inicialmente dois planos:

```text
FREE
PREMIUM
```

## FREE

O plano gratuito terá:

```text
Máximo de 3 Studies ACTIVE simultaneamente
Máximo de 10 Studies criados por mês
Funcionalidades básicas
```

## PREMIUM

O plano Premium terá:

```text
Studies ACTIVE ilimitados
Criação de Studies ilimitada
Funcionalidades adicionais
```

As funcionalidades exclusivas do Premium serão definidas posteriormente.

---

# 13. Limite mensal de criação de Studies

O limite mensal do plano Free representa:

> **Número de novos Studies criados durante o período mensal.**

O status atual do Study não interfere nesse limite.

Exemplo:

```text
Janeiro

Study 01 → ACTIVE
Study 02 → COMPLETED
Study 03 → ARCHIVED
Study 04 → PAUSED
...
Study 10 → ARCHIVED

10/10 criações utilizadas
```

Arquivar, pausar, concluir ou excluir um Study **não devolve** uma criação ao limite mensal.

Isso significa que o uso mensal não pode ser calculado simplesmente observando a quantidade atual de Studies existentes.

Conceitualmente:

```text
Study
    ↓
estado atual

Study Creation Usage
    ↓
histórico de consumo
```

O frontend poderá receber informações como:

```json
{
  "used": 7,
  "limit": 10,
  "remaining": 3
}
```

Entretanto, o backend será a autoridade final para validar o limite.

---

# 14. Entitlements

A aplicação deverá separar:

- Role;
- Subscription / Plan;
- Entitlements;
- Usage.

Um `Role` não deverá ser usado como substituto de todas as regras de negócio.

Conceitualmente:

```text
Role
├── USER
└── ADMIN

Plan
├── FREE
└── PREMIUM
```

Enquanto os entitlements representam o que o usuário pode fazer:

```text
Entitlements
├── Capabilities
│   ├── statistics.advanced
│   ├── custom.schedule
│   └── ...
│
└── Limits
    ├── studies.active.max
    └── studies.creations.monthly.max
```

Exemplo:

```text
FREE

studies.active.max = 3
studies.creations.monthly.max = 10
statistics.advanced = false
```

```text
PREMIUM

studies.active.max = unlimited
studies.creations.monthly.max = unlimited
statistics.advanced = true
```

Os valores são exemplos conceituais e poderão ser alterados.

---

# 15. Capability vs Limit

Os conceitos deverão ser mantidos separados.

### Capability

Responde:

> O usuário pode executar essa funcionalidade?

Exemplo:

```text
statistics.advanced
```

### Limit

Responde:

> Quanto o usuário pode utilizar?

Exemplo:

```text
studies.active.max = 3
```

Isso evita espalhar regras de plano pela aplicação.

Em vez de:

```ts
if (user.plan === "PREMIUM") {
  // ...
}
```

a aplicação deverá trabalhar conceitualmente com:

```ts
authorization.can("statistics.advanced");
```

E para limites:

```ts
limits.canCreateStudy(activeStudyCount);
```

---

# 16. Backend como autoridade

O frontend poderá esconder funcionalidades, apresentar mensagens e evitar ações que sabe que não são permitidas.

Entretanto:

> **O frontend nunca será a autoridade final de autorização ou de limites.**

Por exemplo, o frontend pode impedir a criação do quarto Study ativo no plano Free.

Mas a API deverá validar novamente:

```text
POST /studies
```

O mesmo vale para:

- autorização;
- assinatura;
- entitlements;
- ownership;
- limites;
- ações administrativas.

O frontend é responsável pela experiência.

O backend é responsável pela segurança e pelas regras de negócio autoritativas.

---

# 17. Autenticação

A autenticação inicial será:

```text
Usuário + Senha
```

Futuramente poderão ser adicionados logins sociais.

A autenticação utilizará:

```text
JWT
Cookies
Refresh Token
```

Será adotado o conceito de **Sliding Session**.

O usuário poderá permanecer autenticado enquanto continuar utilizando o sistema.

---

# 18. Sliding Session

A sessão será renovável automaticamente.

Conceitualmente:

```text
Login
  │
  ├── Access Token
  │
  └── Refresh Token
          │
          ▼
    renovação automática
          │
          ▼
    novo Access Token
          │
          ▼
    novo Refresh Token
```

A duração exata dos tokens ainda não está definida.

Uma possibilidade conceitual:

```text
Access Token
→ curta duração

Refresh Token
→ duração maior
→ renovado enquanto a sessão estiver ativa
```

"Tempo indeterminado" significa uma sessão renovável, não um token permanente e irrevogável.

---

# 19. Refresh Token Rotation

Será considerada como regra arquitetural a rotação dos Refresh Tokens.

Conceitualmente:

```text
Refresh Token A
      ↓
Refresh
      ↓
Refresh Token B
      ↓
Refresh
      ↓
Refresh Token C
```

O token anterior deverá ser invalidado conforme a estratégia definida pelo backend.

Isso permite detectar possíveis reutilizações indevidas.

---

# 20. Armazenamento dos tokens

A preferência arquitetural é:

```text
Refresh Token
→ HttpOnly Cookie
```

O frontend não deverá ler o Refresh Token diretamente através de JavaScript.

O Access Token poderá ser mantido apenas em memória.

Conceitualmente:

```text
Browser
│
├── Memory
│   └── Access Token
│
└── HttpOnly Cookie
    └── Refresh Token
```

Ao recarregar a página:

```text
Application startup
        ↓
Session initialization
        ↓
POST /auth/refresh
        ↓
novo Access Token
```

A implementação definitiva dependerá também das decisões do backend, CORS, domínio e infraestrutura.

---

# 21. HTTP Client e Refresh

O acesso HTTP será centralizado.

A arquitetura conceitual será:

```text
Component
   ↓
Feature Service
   ↓
HTTP Client
   ↓
ofetch
   ↓
API
```

Os componentes não deverão realizar chamadas HTTP diretamente.

O HTTP Client será responsável por preocupações como:

- Base URL;
- headers;
- autenticação;
- tratamento de respostas;
- refresh de sessão;
- tratamento de erros HTTP.

---

# 22. Refresh concorrente

O mecanismo de refresh deverá evitar múltiplas renovações simultâneas.

Problema:

```text
GET /studies → 401
GET /tasks   → 401
GET /notes   → 401
GET /profile → 401
```

Não queremos:

```text
refresh()
refresh()
refresh()
refresh()
```

Queremos:

```text
401
 │
 ▼
Refresh único
 │
 ▼
Novo Access Token
 │
 ├── retry /studies
 ├── retry /tasks
 ├── retry /notes
 └── retry /profile
```

A implementação deverá utilizar uma estratégia de **single-flight refresh**.

---

# 23. Logout

Logout deverá ser tratado de maneira centralizada.

Conceitualmente:

```text
POST /auth/logout
        ↓
invalidar sessão no backend
        ↓
limpar Access Token
        ↓
limpar estado da sessão
        ↓
redirecionar para /login
```

Não será suficiente apenas remover o usuário de uma store local.

---

# 24. Sessões de usuário

A arquitetura deverá considerar que um usuário poderá futuramente possuir múltiplas sessões/dispositivos.

Conceitualmente:

```text
User
│
├── Session A
├── Session B
└── Session C
```

Isso permitirá futuramente funcionalidades como:

```text
Dispositivos conectados

Chrome · Windows
Safari · iPhone
Firefox · Linux

[Encerrar sessão]
```

Essa funcionalidade não precisa existir no MVP.

---

# 25. Estado de autenticação

O estado de autenticação não deverá ser representado simplesmente por:

```ts
isLoggedIn = false;
```

Durante o carregamento inicial existe uma terceira possibilidade:

> ainda não sabemos se o usuário está autenticado.

Estados conceituais:

```text
UNKNOWN
   ↓
INITIALIZING
   ├── AUTHENTICATED
   └── UNAUTHENTICATED
```

Isso evita:

- redirects prematuros;
- flickering;
- tela de login aparecendo brevemente;
- chamadas desnecessárias.

---

# 26. Router e autenticação

O Router não deverá ser responsável pela implementação do refresh token.

Evitar:

```ts
router.beforeEach(async () => {
  await refreshToken();
});
```

O gerenciamento de sessão pertence à camada de autenticação/application.

O Router deverá consumir o estado da sessão e aplicar as regras de navegação.

Conceitualmente:

```text
Application Bootstrap
        ↓
Session Initialization
        ↓
Router
        ↓
Application
```

---

# 27. Layout e navegação

A aplicação deverá evitar um layout excessivamente tradicional baseado em:

```text
Header
Sidebar
Content
Footer
```

A proposta é utilizar uma interface mais fluida e contextual.

Não haverá obrigatoriamente uma sidebar global permanente.

A navegação poderá ser contextual à área em que o usuário estiver.

Exemplo:

```text
┌──────────────────────────────────────────────────────┐
│ Logo       Início    Estudos       ⋯       ☼    ◉   │
└──────────────────────────────────────────────────────┘

← Estudos

Aprender Inglês

Visão geral    Tarefas    Anotações
──────────────────────────────────────
```

A navegação deve mostrar os controles relevantes para o contexto atual.

---

# 28. Ações contextuais

A interface deverá priorizar ações principais e esconder ações secundárias quando apropriado.

Exemplo:

```text
Aprender Inglês

                     [ + Adicionar ] [ ⋯ ]
```

Menu de adição:

```text
Nova tarefa
Nova anotação
Registrar sessão
```

Menu secundário:

```text
Editar estudo
Pausar estudo
Concluir estudo
Arquivar estudo
Excluir estudo
```

Ações destrutivas deverão receber tratamento específico e confirmação quando necessário.

---

# 29. Princípio de UX

Um princípio importante para a interface:

> **Mostrar primeiro o que o usuário precisa saber; revelar ações secundárias conforme o contexto.**

Outro princípio:

> **O sistema recomenda e organiza, mas não controla excessivamente o usuário.**

Isso deve influenciar funcionalidades futuras.

---

# 30. Exclusão de Study

O Study poderá ser excluído.

Entretanto, a ação deverá ser tratada como destrutiva.

Exemplo:

```text
Excluir estudo?

Esta ação removerá o estudo e seus dados associados.
Ela não poderá ser desfeita.

[Cancelar] [Excluir estudo]
```

Como Tasks e Notes existem dentro do contexto de um Study, a premissa atual é que sua exclusão acompanhe a exclusão do Study.

Essa regra deverá ser confirmada e formalizada posteriormente na especificação da API.

---

# 31. Estrutura arquitetural conceitual

A aplicação deverá manter uma separação clara de responsabilidades.

Conceitualmente:

```text
┌──────────────────────────────────────────┐
│ Presentation                             │
│ Pages, Components, Forms, Navigation     │
├──────────────────────────────────────────┤
│ Application                              │
│ Use cases, orchestration, capabilities   │
├──────────────────────────────────────────┤
│ Domain                                   │
│ Study, Task, Note, rules, types           │
├──────────────────────────────────────────┤
│ Infrastructure                           │
│ HTTP, API, storage, browser APIs         │
└──────────────────────────────────────────┘
```

A implementação física não necessariamente deverá replicar essas quatro camadas em todas as features.

A separação é principalmente **conceitual e de responsabilidades**.

---

# 32. Organização por features

A organização deverá ser orientada a features/domínios.

Estrutura conceitual:

```text
features/
└── studies/
    ├── components/
    ├── forms/
    ├── composables/
    ├── services/
    ├── stores/
    └── types/
```

Subpastas deverão existir somente quando houver necessidade real.

Não será adotada uma política de criação de dezenas de diretórios vazios antecipadamente.

A regra é:

> **Criar estrutura para representar responsabilidades reais, não para preencher uma arquitetura teórica.**

---

# 33. Evolução de Features

Tasks e Notes inicialmente pertencem ao contexto de Studies.

Não é obrigatório iniciar com:

```text
features/
├── studies/
├── tasks/
└── notes/
```

Caso no futuro Tasks ou Notes adquiram funcionalidades próprias suficientes para justificar autonomia, poderão ser promovidas para features independentes.

A arquitetura deverá permitir essa evolução sem exigir uma reestruturação completa da aplicação.

---

# 34. Services

O acesso à API deverá ser encapsulado por services da respectiva feature.

Exemplo conceitual:

```ts
studyService.getStudies();
studyService.createStudy();
studyService.updateStudy();
studyService.archiveStudy();
studyService.deleteStudy();
```

Evitar:

```ts
await $fetch("/api/studies");
```

diretamente em componentes.

A feature conhece sua API.

O componente conhece a interface da feature.

O componente não precisa conhecer detalhes do HTTP client.

---

# 35. Abstrações

Não será adotada uma arquitetura excessivamente abstrata.

Evitar criar automaticamente estruturas como:

```text
Repository
RepositoryImpl
Service
ServiceImpl
Mapper
Factory
UseCase
```

quando elas não resolverem um problema real.

Princípio:

> **Abstração deve existir para resolver complexidade, não para demonstrar arquitetura.**

Se um `service` simples for suficiente, ele deverá ser utilizado.

---

# 36. Stack Frontend

A aplicação utilizará:

- Vue 3;
- Composition API;
- TypeScript;
- Vite;
- Pinia;
- Vue Router V4;
- TailwindCSS v4;
- ofetch;
- Vue I18n.

TypeScript será obrigatório.

---

# 37. Backend e API

O backend ainda não foi definido.

A arquitetura frontend deverá ser preparada para consumir uma API REST.

Será utilizado:

- OpenAPI;
- RFC 9457 para respostas de erro;
- paginação;
- filtros;
- ordenação.

Inicialmente não haverá necessidade de upload/download de arquivos.

O frontend deverá ser desenvolvido de maneira desacoplada da implementação concreta do backend.

---

# 38. Mock Server

Será utilizado um Mock Server durante o desenvolvimento.

O Mock Server ficará **fora do repositório do frontend**.

Isso permite:

```text
Frontend
   ↓
Mock API

ou

Frontend
   ↓
Backend real
```

sem que a implementação de mock faça parte da aplicação de produção.

---

# 39. Tratamento de erros da API

O backend deverá retornar códigos de erro.

A aplicação frontend será responsável por mapear esses códigos para mensagens localizadas.

Conceitualmente:

```text
API
 ↓
error code
 ↓
Frontend error mapping
 ↓
i18n
 ↓
mensagem para o usuário
```

Não deverá ser adotada uma estratégia de simplesmente exibir mensagens arbitrárias retornadas pelo backend ao usuário.

---

# 40. Internacionalização

Idiomas iniciais:

```text
pt-BR
en
```

O usuário poderá alterar o idioma manualmente.

O sistema também poderá detectar inicialmente o idioma do sistema/navegador.

A organização das traduções será feita por domínio/feature.

Exemplo conceitual:

```text
i18n/
├── en/
└── pt-BR/
```

As mensagens deverão suportar:

- interpolação;
- pluralização;
- localização de datas;
- localização de números.

O sistema deverá evitar strings de interface espalhadas diretamente nos componentes quando forem conteúdos localizáveis.

---

# 41. Tema

A aplicação terá:

```text
light
dark
system
```

A preferência será inicialmente persistida em:

```text
localStorage
```

Futuramente poderá ser sincronizada com o backend.

O estado local deverá respeitar a preferência:

```text
system
```

utilizando a preferência de tema do sistema operacional.

---

# 42. Design e UI

Não será utilizado inicialmente um Design System externo completo.

A aplicação utilizará o **Material Design do Google como referência visual e de interação**.

Serão construídos componentes próprios.

Componentes previstos incluem:

- Modal;
- DataTable;
- Form;
- Select;
- Toast;
- Drawer;
- entre outros.

Os componentes deverão possuir comportamento consistente e acessível.

---

# 43. Ícones

Os ícones deverão utilizar:

> **Material Symbols**

e não Material Design Icons.

---

# 44. Responsividade

A aplicação será desenvolvida para:

- mobile;
- tablet;
- desktop.

Serão definidos breakpoints adequados para esses contextos.

A interface não deverá simplesmente reduzir o layout desktop para telas menores.

Alguns componentes poderão alterar sua forma de interação conforme o espaço disponível.

Exemplo:

```text
Desktop
→ navegação contextual horizontal

Mobile
→ navegação compacta / drawer / controles contextuais
```

A decisão final será definida na documentação de UI/UX e responsividade.

---

# 45. Acessibilidade

Acessibilidade será considerada requisito prioritário.

A arquitetura de componentes deverá considerar:

- navegação por teclado;
- foco;
- leitores de tela;
- semântica HTML;
- estados visuais;
- contraste;
- mensagens de erro;
- componentes interativos acessíveis;
- dialogs/modals acessíveis;
- formulários acessíveis.

Acessibilidade não deverá ser tratada como uma etapa posterior.

---

# 46. SEO

SEO também será considerado requisito importante.

Embora a aplicação seja uma SPA, as páginas que fizerem sentido deverão possuir:

- títulos apropriados;
- metadados;
- estrutura semântica;
- URLs adequadas;
- conteúdo acessível aos mecanismos de busca quando aplicável.

Áreas autenticadas naturalmente terão requisitos diferentes de páginas públicas.

---

# 47. Testes

Stack de testes:

```text
Vitest
Vue Test Utils
Playwright
```

A estratégia deverá possuir diferentes níveis de teste:

```text
Unitários
    ↓
Componentes
    ↓
Integração
    ↓
E2E
```

O projeto terá um **percentual mínimo de cobertura de código**, que será definido posteriormente.

A cobertura não deverá ser tratada isoladamente como métrica de qualidade.

---

# 48. Qualidade de código

Ferramentas:

```text
ESLint
Prettier
```

O projeto deverá possuir regras automatizadas para manter consistência.

---

# 49. Git e commits

Será utilizado:

```text
Husky
lint-staged
Conventional Commits
```

Os hooks deverão executar validações apropriadas antes de commits.

Os commits seguirão Conventional Commits.

Exemplos:

```text
feat(studies): add study creation wizard
fix(auth): handle concurrent token refresh
test(studies): add study form coverage
refactor(http): centralize API client
```

---

# 50. Gerenciamento de dependências

O projeto utilizará **Bun**.

As versões das dependências deverão ser fixadas.

Não deverá ser utilizada uma estratégia que permita atualizações automáticas inesperadas de versões.

Exemplo conceitual:

```json
{
  "dependencies": {
    "vue": "x.y.z"
  }
}
```

em vez de permitir intervalos de versão quando isso não for desejado.

---

# 51. Agentes de IA como consumidores da arquitetura

Um requisito importante do projeto é que a documentação seja adequada tanto para:

- desenvolvedores humanos;
- agentes de IA.

A documentação deverá reduzir a necessidade de inferência.

Não será suficiente escrever:

> "Use composables quando necessário."

Será necessário explicar:

```text
Objetivo
Escopo
Quando utilizar
Quando não utilizar
Exemplo correto
Exemplo incorreto
Resultado esperado
```

As decisões arquiteturais deverão ser explícitas.

---

# 52. Princípio de documentação

Para documentos importantes, deverá ser considerada uma estrutura semelhante a:

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

Isso permitirá que um desenvolvedor ou agente de IA consiga determinar:

> "Qual é a regra?"

e:

> "Como devo aplicá-la?"

sem precisar interpretar todo o código existente.

---

# 53. Architecture Decision Records

Decisões arquiteturais importantes deverão ser registradas como ADRs.

Possíveis ADRs:

```text
ADR-001 — Frontend architecture
ADR-002 — Feature-oriented project structure
ADR-003 — REST API
ADR-004 — Authentication strategy
ADR-005 — Refresh Token Rotation
ADR-006 — Authorization and Entitlements
ADR-007 — HTTP Client
ADR-008 — State Management
ADR-009 — UI Architecture
ADR-010 — Internationalization
```

A lista acima é apenas ilustrativa e será revisada posteriormente.

---

# 54. Hierarquia conceitual da documentação

A documentação poderá ser organizada posteriormente seguindo uma hierarquia semelhante a:

```text
Product Requirements
        ↓
Architecture Decision Records
        ↓
Architecture Guidelines
        ↓
Feature Specifications
        ↓
Implementation
```

A intenção é separar:

- o que o produto precisa;
- por que uma decisão arquitetural foi tomada;
- como o projeto deve ser desenvolvido;
- como cada funcionalidade deve funcionar.

---

# 55. Princípios arquiteturais já estabelecidos

Os seguintes princípios foram estabelecidos durante a discussão:

### 1. Simplicidade antes de abstração

Não criar infraestrutura ou abstrações sem necessidade real.

### 2. Separação clara de responsabilidades

Cada módulo deve ter uma responsabilidade clara.

### 3. Features independentes

Uma funcionalidade deve poder evoluir com baixo acoplamento às demais.

### 4. Reutilização consciente

Reutilizar código quando existe comportamento realmente compartilhado.

Não criar abstrações genéricas apenas para evitar duplicação superficial.

### 5. Backend como autoridade

Autorização e regras críticas não podem depender da implementação do frontend.

### 6. UX orientada à ação

A aplicação deve facilitar a próxima ação do usuário.

### 7. Produto não punitivo

O sistema deve incentivar e organizar, não impor regras desnecessárias.

### 8. Domínio independente da interface

O domínio não deve depender de detalhes como wizard, componentes Vue ou navegação.

### 9. Contexto antes de complexidade

Study é o contexto principal; Tasks e Notes inicialmente existem dentro dele.

### 10. Evolução incremental

Novas abstrações e features devem surgir conforme a complexidade real do produto justificar.

### 11. Documentação explícita

Decisões devem ser documentadas com contexto, intenção, exemplos e anti-exemplos.

### 12. Código orientado tanto a humanos quanto a IA

A estrutura deve facilitar descoberta, compreensão e alteração segura do código.

---

# 56. Decisões ainda não finalizadas

As seguintes questões continuam abertas e deverão ser discutidas antes da implementação:

- Estrutura definitiva de diretórios do projeto;
- Regras formais de dependência entre módulos;
- Estrutura definitiva das camadas;
- Estratégia completa de Pinia;
- Critérios para criação de composables;
- Critérios para criação de componentes;
- Estratégia definitiva do HTTP Client;
- Contratos de API;
- Estrutura dos tipos gerados a partir do OpenAPI;
- Estratégia de tratamento de erros;
- Política exata de Access Token;
- Política exata de Refresh Token;
- Tempo de expiração dos tokens;
- Política de expiração/revogação de sessões;
- Modelo definitivo de autorização;
- Modelo de entitlements;
- Período exato de contabilização das criações mensais;
- Design definitivo do Dashboard;
- Design definitivo dos layouts;
- Estrutura de navegação;
- Sistema de componentes;
- Tokens de design;
- Breakpoints;
- Política de acessibilidade;
- Estratégia de SEO;
- Estratégia de testes;
- Percentual mínimo de coverage;
- Pipeline CI/CD;
- Estratégia de versionamento da aplicação;
- Estratégia de geração/consumo do OpenAPI;
- Modelo definitivo de Task;
- Modelo definitivo de Note;
- Necessidade futura de StudySession.

---

# 57. Próximo passo recomendado

A próxima etapa deverá ser uma **sessão formal de arquitetura do frontend**, ainda antes da implementação.

Essa sessão deverá definir principalmente:

```text
1. Arquitetura geral
2. Estrutura de diretórios
3. Dependências permitidas
4. Fronteiras entre features
5. Camadas e responsabilidades
6. Estratégia de estado
7. Estratégia de API
8. Autenticação
9. Autorização
10. Entitlements
11. Layouts e navegação
12. Componentes compartilhados
13. i18n
14. Design tokens
15. Responsividade
16. Acessibilidade
17. SEO
18. Testes
19. Tooling
20. Estratégia de documentação
```

Somente depois dessa etapa deverá ser produzida a documentação técnica definitiva.

O objetivo é evitar que a documentação seja escrita em torno de decisões tomadas prematuramente.

---

# 58. Estado atual do projeto

Até este momento, o projeto possui uma direção arquitetural clara, mas **nenhuma estrutura de código deve ser considerada definitiva ainda**.

A próxima fase deve transformar estas decisões conceituais em uma arquitetura concreta, questionando cada decisão antes de registrá-la como regra.

A premissa principal continua sendo:

> **Construir uma aplicação simples para o usuário, com uma arquitetura simples para o desenvolvedor e uma estrutura suficientemente explícita para que um agente de IA consiga compreender, modificar e expandir o sistema com segurança.**
