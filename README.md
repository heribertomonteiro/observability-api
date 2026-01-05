## Observability API

API de observabilidade construída com NestJS e Prisma para monitorar:

- **APIs internas** – toda requisição HTTP que chega na própria API.
- **APIs externas** – chamadas realizadas via um proxy HTTP para serviços cadastrados.

A aplicação registra métricas de latência por rota, separa métricas internas e externas e expõe endpoints de estatísticas agregadas.

---

## Visão geral

Principais conceitos do projeto:

- **Service**: representa um serviço que será monitorado (por exemplo, uma API externa como PokeAPI ou Rick and Morty).
  - Campos principais: `name`, `baseUrl`, `isActive`.
- **Metric**: registro de uma chamada HTTP.
  - Campos principais: `serviceId`, `route`, `method`, `responseTime`, `origin` (`INTERNAL` ou `EXTERNAL`), `createdAt`.
- **MetricsInterceptor**: interceptor global do Nest que mede o tempo de resposta de todas as rotas da própria API e grava métricas internas.
- **Proxy de serviços externos**: endpoint que chama APIs externas usando o `baseUrl` de `Service` e grava métricas externas dessas chamadas.

Fluxo resumido:

1. Você cadastra um serviço em `/services` com uma `baseUrl` externa.
2. Chama a API externa via proxy: `/services/:id/proxy/*path`.
3. O sistema grava métricas internas (sua API) **e** externas (API chamada).
4. Você consulta métricas e estatísticas em `/metrics` e `/metrics/stats/*`.

---

## Stack

- [NestJS](https://nestjs.com/) (TypeScript)
- [Prisma](https://www.prisma.io/) + PostgreSQL
- [@nestjs/axios](https://docs.nestjs.com/techniques/http-module) (proxy HTTP)
- [Swagger](https://docs.nestjs.com/openapi/introduction) em `/docs`

---

## Rodando o projeto

Pré-requisitos:

- Node.js >= 20
- Banco PostgreSQL rodando e variável `DATABASE_URL` configurada.

Instalação das dependências:

```bash
pnpm install
```

Aplicar migrations do Prisma:

```bash
pnpm prisma migrate dev
```

Subir a API em modo desenvolvimento:

```bash
pnpm start:dev
```

Por padrão a API sobe em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/docs`.

---

## Endpoints principais

### Serviços (`/services`)

- `POST /services` – cadastra um serviço para monitorar.
  - Exemplo de body:
    ```json
    {
      "name": "PokeAPI",
      "baseUrl": "https://pokeapi.co/api/v2",
      "isActive": true
    }
    ```
- `GET /services` – lista todos os serviços.
- `GET /services/:id` – detalhes de um serviço.
- `PATCH /services/:id` – atualiza um serviço.
- `DELETE /services/:id` – remove um serviço.

### Proxy de APIs externas

- `GET /services/:id/proxy/*path` – faz proxy para a API externa cadastrada.
  - Exemplo (PokeAPI):
    - Cadastro prévio:
      ```json
      {
        "name": "PokeAPI",
        "baseUrl": "https://pokeapi.co/api/v2",
        "isActive": true
      }
      ```
    - Chamada via proxy:
      ```
      GET /services/<ID_POKEAPI>/proxy/pokemon
      ```
      Resultado externo: `GET https://pokeapi.co/api/v2/pokemon`.

Cada chamada via proxy gera **duas métricas**:

- Interna: rota `/services/:id/proxy/*path` (latência da sua API).
- Externa: rota real da API externa (por exemplo `/pokemon`).

### Métricas (`/metrics`)

- `GET /metrics` – lista todas as métricas (internas e externas).
- `GET /metrics/internal` – apenas métricas internas (todas as rotas da própria API Nest).
- `GET /metrics/external` – apenas métricas externas (APIs chamadas via proxy).

### Estatísticas de latência (`/metrics/stats`)

Os endpoints de estatísticas agregam métricas por `serviceId` + `route` e retornam:

- `count` – quantidade de chamadas.
- `avgResponseTime` – tempo médio de resposta.
- `minResponseTime` – menor tempo de resposta.
- `maxResponseTime` – maior tempo de resposta.
- `firstSeenAt` – primeira vez que a rota foi observada.
- `lastSeenAt` – última vez que a rota foi observada.

Endpoints:

- `GET /metrics/stats/internal` – estatísticas apenas para métricas internas.
- `GET /metrics/stats/external` – estatísticas apenas para métricas externas.

---

## Interceptor de métricas

O interceptor global (`MetricsInterceptor`) é registrado no `AppModule` como `APP_INTERCEPTOR` e roda em todas as requisições HTTP.

Para cada request ele:

1. Mede o tempo de resposta.
2. Identifica `serviceId` com base no nome do controller (por exemplo, `ServicesController` → `services`).
3. Envia os dados para o `MetricsService`, que grava a métrica no banco com `origin = INTERNAL`.

Isso permite adicionar novos módulos/controllers e automaticamente começar a observá-los sem alterar o interceptor.

---

## Como explicar este projeto em entrevista

- Problema: "Quero entender como as minhas APIs (e APIs externas que consumo) estão se comportando em produção em termos de latência e rotas acessadas".
- Solução:
  - Usei NestJS com um **interceptor global** para registrar métricas de todas as rotas internas.
  - Criei um **proxy HTTP** para chamar APIs externas a partir de serviços cadastrados, registrando também a latência dessas chamadas.
  - Modelei as entidades com Prisma (`Service`, `Metric`) e separei as métricas em `INTERNAL` e `EXTERNAL`.
  - Exponho endpoints de **estatísticas agregadas** para análise rápida de performance por rota/serviço.

Isso demonstra conhecimento de:

- NestJS (módulos, interceptors, DI, Swagger).
- Acesso a dados com Prisma e PostgreSQL.
- Conceitos de observabilidade (métricas, latência, APIs internas vs externas).
- Design de APIs pensadas para monitoramento e diagnóstico.

