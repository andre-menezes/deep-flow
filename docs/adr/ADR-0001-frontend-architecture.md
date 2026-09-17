# ADR-0001 — Frontend architecture

- **Status:** Accepted *(amenda parcial: [ADR-0008](./ADR-0008-local-http-mock-stub.md) — stub HTTP de DX em `tools/mock-server/`)*
- **Data:** 2026-09-16
- **Contexto:** `docs/archive/DISCUSSION-2026-09-initial.md` §§31–37, 55–58

## Contexto

A Studia precisa de uma arquitetura frontend explícita antes da implementação, para evitar abstrações prematuras e para que humanos e agentes de IA consigam evoluir o código com segurança.

O backend (Spring Boot 3 / Java 21) ainda não existe. O frontend será desenvolvido contra HTTP mockada (stub local de DX e/ou Mock Server oficial externo) e, depois, contra API REST real.

## Decisão

1. A arquitetura física é organizada em quatro camadas de topo em `src/`:
   - `app` — bootstrap e composição (sem domínio de produto)
   - `features` — funcionalidades por contexto
   - `shared` — código reutilizável sem conhecimento de domínio de produto
   - `types` — contratos, transversais e primitivos compartilhados
2. As camadas conceituais Presentation / Application / Domain / Infrastructure existem **dentro** das features (vertical slicing), não como pastas horizontais de topo.
3. Stack obrigatória do frontend:
   - Vue 3 + Composition API + TypeScript
   - Vite, Pinia, Vue Router 4, TailwindCSS v4, ofetch, Vue I18n
4. TypeScript é obrigatório.
5. O frontend consome API REST (OpenAPI + RFC 9457), desacoplado da implementação concreta do backend.
6. Abstrações (`Repository`, `UseCase`, `Mapper`, etc.) só existem quando resolvem complexidade real.
7. Documentação em `docs/` é requisito de primeira classe (adequada a humanos e agentes de IA).

## Consequências

- Há uma árvore previsível para localizar responsabilidades.
- O Mock Server **oficial / dedicado** permanece fora do repositório do frontend. Stub HTTP mínimo de DX em `tools/mock-server/` é permitido pela [ADR-0008](./ADR-0008-local-http-mock-stub.md) e **não** substitui essa meta.
- Decisões de produto vivem em `docs/product/vision.md`; mudanças arquiteturais exigem ADR.
- Trocar Mock → Spring Boot não deve exigir reestruturar `src/`, apenas contratos e configuração HTTP.

## Exemplos

### Correto

- `app/bootstrap/initSession.ts` inicializa sessão antes do router.
- `features/studies/services/studyService.ts` encapsula chamadas HTTP da feature.
- Componente de página não chama `ofetch` diretamente.

### Incorreto

- Criar `repositories/StudyRepositoryImpl.ts` sem necessidade.
- Colocar regra de domínio de Study em `shared/`.
- Fazer o domínio conhecer `currentStep` do wizard.

## Alternativas consideradas

- Organização horizontal (`components/`, `services/`, `stores/` globais): descartada por acoplamento e baixa descoberta por feature.
- Clean Architecture física completa no frontend: descartada por verbosidade prematura (ver `docs/archive/DISCUSSION-2026-09-initial.md` §35).

## Referências

- `docs/adr/ADR-0002-feature-oriented-project-structure.md`
- `docs/adr/ADR-0008-local-http-mock-stub.md` (amenda parcial: stub DX local)
- `docs/architecture/project-structure.md`
- `docs/archive/DISCUSSION-2026-09-initial.md`
