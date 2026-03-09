# Jitterbit Teste API

API REST de gerenciamento de pedidos e itens, construída com Fastify, TypeScript e Prisma.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Fastify 5
- **Banco de dados:** PostgreSQL 17 + Prisma ORM
- **Autenticação:** JWT (`@fastify/jwt`)
- **Documentação:** Swagger/OpenAPI (`@fastify/swagger`)
- **Testes:** Vitest
- **Linting/Formatação:** Biome

## Pré-requisitos

- Node.js 20+
- pnpm
- Docker (para o PostgreSQL)

## Setup

```bash
# 1. Instalar dependências
pnpm install

# 2. Subir o banco de dados
docker compose up -d

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Rodar migrations e gerar o client do Prisma
pnpm db:migrate
pnpm db:generate

# 5. Iniciar servidor em modo desenvolvimento
pnpm dev
```

O servidor inicia em `http://localhost:3000`.

## Documentação da API (Swagger)

Com o servidor rodando, acesse:

```
http://localhost:3000/docs
```

A documentação é gerada automaticamente a partir dos schemas das rotas.

## Endpoints

### Users

| Método | Rota             | Descrição                 | Auth |
|--------|------------------|---------------------------|------|
| POST   | `/user/register` | Registrar novo usuário    | -    |
| POST   | `/user/login`    | Login                     | -    |
| GET    | `/user/me`       | Dados do usuário logado   | JWT  |

### Orders

| Método | Rota               | Descrição            | Auth |
|--------|---------------------|----------------------|------|
| POST   | `/order`           | Criar pedido          | JWT  |
| GET    | `/order`           | Listar pedidos        | JWT  |
| GET    | `/order/:orderId`  | Buscar pedido por ID  | JWT  |
| PUT    | `/order/:orderId`  | Atualizar pedido      | JWT  |
| DELETE | `/order/:orderId`  | Deletar pedido        | JWT  |

### Items

| Método | Rota                      | Descrição               | Auth |
|--------|---------------------------|-------------------------|------|
| POST   | `/order/:orderId/item`    | Criar item no pedido    | JWT  |
| GET    | `/order/:orderId/item`    | Listar itens do pedido  | JWT  |
| GET    | `/item/:id`               | Buscar item por ID      | JWT  |
| PUT    | `/item/:id`               | Atualizar item          | JWT  |
| DELETE | `/item/:id`               | Deletar item            | JWT  |

## Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar em modo watch
pnpm test:watch
```

### Estrutura de testes

```
src/tests/
├── unit/                  # Testes unitários (services com mocks)
│   ├── orderService.test.ts
│   ├── itemsService.test.ts
│   └── userService.test.ts
├── integration/           # Testes de integração (server.inject + banco real)
│   ├── user.test.ts
│   ├── order.test.ts
│   └── item.test.ts
└── e2e/                   # Testes end-to-end (fluxos completos)
    ├── authFlow.test.ts
    ├── orderFlow.test.ts
    └── itemFlow.test.ts
```

## Scripts

| Script          | Descrição                        |
|-----------------|----------------------------------|
| `pnpm dev`      | Servidor com hot-reload          |
| `pnpm build`    | Compilar TypeScript              |
| `pnpm start`    | Rodar build compilado            |
| `pnpm test`     | Rodar testes                     |
| `pnpm lint`     | Verificar lint e formatação      |
| `pnpm lint:fix` | Corrigir lint automaticamente    |
| `pnpm db:migrate` | Rodar migrations do Prisma     |
| `pnpm db:generate` | Gerar Prisma Client           |

## Estrutura do projeto

```
src/
├── server.ts                          # Entry point
├── lib/
│   └── prisma.ts                      # Prisma client
├── infrastructure/
│   ├── auth/jwt.ts                    # Plugin JWT + middleware
│   ├── swagger/swagger.ts             # Plugin Swagger/OpenAPI
│   ├── errors/appError.ts             # Error handling
│   ├── routes/
│   │   ├── userRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── itemRoutes.ts
│   └── types.ts
└── domain/
    ├── users/
    │   ├── service/userService.ts
    │   ├── repository/userRepository.ts
    │   └── type.ts
    ├── orders/
    │   ├── service/orderService.ts
    │   ├── repository/orderRepository.ts
    │   ├── mapper/orderMapper.ts
    │   └── type.ts
    └── items/
        ├── service/itemsService.ts
        ├── repository/itemRepository.ts
        ├── mapper/itemMapper.ts
        └── type.ts
```

## Variáveis de ambiente

| Variável       | Descrição                    | Default                  |
|----------------|------------------------------|--------------------------|
| `DATABASE_URL` | Connection string PostgreSQL | (ver `.env.example`)     |
| `PORT`         | Porta do servidor            | `3000`                   |
| `JWT_SECRET`   | Secret para assinar tokens   | `default-secret`         |
