# ADR-0005 — HTTP client

- **Status:** Accepted
- **Data:** 2026-09-16
- **Contexto:** `docs/architecture/open-decisions.md` item 1; ADR-0001 (ofetch); ADR-0003 (services → HTTP)

## Contexto

O frontend da Studia falará primeiro com Mock Server e depois com API Spring Boot. Sem um cliente HTTP único, cada feature tende a reinventar base URL, headers, 401/refresh e formato de erro — o que quebra o caminho Mock → API e dificulta agentes de IA.

Já está decidido (ADR-0001 / ADR-0003) que componentes não chamam HTTP e que services usam uma camada compartilhada. Faltava fechar **como** essa camada se comporta.

Política completa de autenticação (sliding session, rotação, expiração exata) permanece para ADR-0006; este ADR define o contrato do cliente HTTP com a sessão.

## Decisão

### 1. Um único cliente em `shared/http`

- Biblioteca: **ofetch** (já na stack ADR-0001).
- Local: `src/shared/http/` (ex.: `client.ts`, helpers de erro).
- Features **não** instanciam `ofetch`/`fetch` próprios para a API da Studia.
- Services de feature importam o cliente de `@/shared/http`.

Fluxo obrigatório:

```text
Component / view
      ↓
Feature service
      ↓
shared/http (ofetch + interceptors)
      ↓
Mock Server | API real
```

### 2. Responsabilidades do cliente

O cliente deve centralizar:

| Preocupação           | Comportamento                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| Base URL              | Via config de app (`import.meta.env` / `app/config`), não hardcoded em features                             |
| Headers padrão        | `Accept`, `Content-Type` quando aplicável                                                                   |
| Access token          | Anexar `Authorization: Bearer <accessToken>` quando houver token em memória                                 |
| Credenciais de cookie | `credentials: 'include'` para enviar/receber refresh HttpOnly                                               |
| Refresh em 401        | Disparar refresh **single-flight**, depois **retry uma vez** da request original                            |
| Erros HTTP            | Normalizar para um tipo de erro de app (código + status + body), sem exibir mensagem crua da API ao usuário |

### 3. Armazenamento de tokens (visão do cliente)

| Token         | Onde vive no browser                            | Quem lê                         |
| ------------- | ----------------------------------------------- | ------------------------------- |
| Access token  | **Somente memória** (módulo/sessão auth)        | `shared/http` + `features/auth` |
| Refresh token | **HttpOnly cookie** (setado pelo servidor/mock) | **Nunca** via JavaScript        |

Proibido:

- Persistir access token em `localStorage` / `sessionStorage` no MVP.
- Ler ou escrever o refresh token no frontend.

Bootstrap (alinhado a ADR-0003): ao subir o app, `app/bootstrap` tenta `POST /auth/refresh` (cookie) para obter access token antes dos guards.

### 4. Single-flight refresh

Quando N requests recebem `401` (access expirado/inválido):

1. Apenas **uma** chamada de refresh está em voo.
2. Demais callers aguardam a mesma Promise.
3. Sucesso → atualiza access token em memória → retry das requests originais (uma vez).
4. Falha de refresh → limpa sessão (via fachada auth) → requests rejeitam; UI/router tratam como não autenticado.

O **router não** chama refresh diretamente; só consome estado de sessão (ADR-0003).

Refresh concorrente **não** deve gerar N `POST /auth/refresh`.

### 5. Erros HTTP (contrato mínimo)

- Preferir corpo no espírito **RFC 9457** (`application/problem+json`) quando a API/mock fornecer.
- O cliente expõe um erro tipado com pelo menos: `status`, `code` (código de negócio estável) e dados brutos opcionais.
- UI e features mapeiam `code` → chave **i18n**; não mostram `detail`/`message` arbitrários do backend ao usuário final.
- Catálogo completo de códigos: futuro `docs/api/error-codes.md` (item ainda aberto).

### 6. O que fica fora deste ADR

- Duração exata de access/refresh, rotação detalhada e revogação multi-dispositivo → **ADR-0006** (e seguintes).
- Paths OpenAPI definitivos → `docs/api/`.
- Retry genérico por 5xx / backoff de rede → não obrigatório no MVP (pode evoluir depois).

## Consequências

- Trocar Mock → API real muda config/base URL e contratos, não a forma de chamar HTTP nas features.
- Auth e HTTP ficam acoplados só na borda (token em memória + cookie + refresh); domínio de Study não conhece ofetch.
- Exige coordenação com mock: cookie HttpOnly (ou simulação documentada) e endpoint de refresh.
- Guideline prática: `docs/architecture/http-client.md`.

## Exemplos

### Correto

```ts
// features/studies/services/studyService.ts
import { http } from "@/shared/http";

export function listStudies() {
  return http("/studies");
}
```

```ts
// shared/http: um 401 dispara refresh único; filas aguardam e retentam
```

### Incorreto

```ts
// componente ou store chamando ofetch diretamente
import { $fetch } from "ofetch";
await $fetch("/studies");

// N refreshes em paralelo sem single-flight
// access token em localStorage
// alert(error.data.message) com texto vindo cru da API
```

## Alternativas consideradas

- **axios:** descartado; stack já fixa ofetch (ADR-0001) e a API cobre interceptors via hooks.
- **ofetch “nu” por feature:** rejeitado; duplica auth/erro.
- **Refresh no Vue Router `beforeEach`:** rejeitado; mistura navegação com transporte e complica concorrência (ADR-0003).
- **Access token em storage persistente:** rejeitado no MVP por superfície XSS; memória + refresh por cookie.

## Referências

- `docs/architecture/http-client.md`
- `docs/architecture/state-management.md`
- ADR-0001, ADR-0003, ADR-0004
- `docs/architecture/open-decisions.md` (itens 2–3, 5–6 ainda abertos)
- Histórico (não normativo): discussão inicial §§20–22, 39
