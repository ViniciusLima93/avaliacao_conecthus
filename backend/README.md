# WenLock — Backend

API REST de gerenciamento de usuários construída com **NestJS 11**, **Prisma ORM 7** e **PostgreSQL 17**, organizada em camadas (**domain / application / infrastructure**) e documentada com **Swagger**.

## Sumário

- [Stack](#stack)
- [Como rodar](#como-rodar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Endpoints](#endpoints)
- [Regras de validação](#regras-de-validação)
- [Erros](#erros)
- [Soft delete](#soft-delete)
- [Banco de dados](#banco-de-dados)
- [Arquitetura](#arquitetura)
- [Testes](#testes)
- [Scripts](#scripts)
- [Observações técnicas](#observações-técnicas)

## Stack

| Tecnologia                          | Uso                                                          |
| ----------------------------------- | ------------------------------------------------------------ |
| NestJS 11 + TypeScript              | Framework HTTP, injeção de dependência, módulos              |
| Prisma 7 + `@prisma/adapter-pg`     | ORM, migrations e client tipado                              |
| PostgreSQL 17                       | Banco relacional                                             |
| class-validator / class-transformer | Validação e transformação dos dados de entrada (DTOs)        |
| Joi                                 | Invariantes de domínio e validação das variáveis de ambiente |
| bcryptjs                            | Hash de senhas                                               |
| @nestjs/swagger                     | Documentação OpenAPI / Swagger UI                            |
| Jest + Supertest                    | Testes unitários e e2e                                       |

## Como rodar

### Com Docker (recomendado)

O `docker-compose.yaml` fica na **raiz do repositório** e sobe banco, API e frontend:

```bash
cd ..
docker compose up -d --build
```

A API fica em http://localhost:3000 e o Swagger em http://localhost:3000/swagger. O [`entrypoint.sh`](entrypoint.sh) aplica as migrations (`prisma migrate deploy`) antes de iniciar a aplicação.

### Localmente (API na máquina, banco no Docker)

Requer **Node.js 24+**.

```bash
cp .env.example .env
docker compose -f ../docker-compose.yaml up -d db
npm install            # o postinstall roda `prisma generate`
npm run prisma:deploy  # aplica as migrations
npm run start:dev      # http://localhost:3000, com hot reload
```

## Variáveis de ambiente

Validadas com Joi na inicialização ([`env.validation.ts`](src/core/config/env/env.validation.ts)). Se alguma estiver inválida, a API não sobe.

| Variável       | Obrigatória | Padrão        | Descrição                                               |
| -------------- | :---------: | ------------- | ------------------------------------------------------- |
| `DATABASE_URL` |     sim     | —             | URL de conexão do PostgreSQL                            |
| `PORT`         |     não     | `3000`        | Porta HTTP                                              |
| `NODE_ENV`     |     não     | `development` | `development`, `production` ou `test`                   |
| `CORS_ORIGIN`  |     não     | `*`           | Origens permitidas; aceita várias separadas por vírgula |

Arquivos: `.env.example` (modelo), `.env` (desenvolvimento, não versionado) e `.env.test` (testes e2e, banco `conecthus_test`).

## Endpoints

Documentação interativa em **`/swagger`**. O OpenAPI também fica disponível em `/swagger-json` e `/swagger-yaml`.

| Método | Rota         | Descrição                              | Sucesso |
| ------ | ------------ | -------------------------------------- | :-----: |
| GET    | `/health`    | Status da API e da conexão com o banco |   200   |
| POST   | `/users`     | Cria um usuário                        |   201   |
| GET    | `/users`     | Lista paginada, com pesquisa opcional  |   200   |
| GET    | `/users/:id` | Busca um usuário pelo id (UUID)        |   200   |
| PATCH  | `/users/:id` | Atualiza parcialmente                  |   200   |
| DELETE | `/users/:id` | Exclui (soft delete)                   |   204   |

### Criar usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria Silva","registration":"2024001","email":"maria@email.com","password":"Abc123"}'
```

```json
{
  "id": "3f8b2c1e-4d5a-4b6c-9e7f-1a2b3c4d5e6f",
  "name": "Maria Silva",
  "registration": "2024001",
  "email": "maria@email.com",
  "isActive": true,
  "createdAt": "2026-09-30T00:26:19.500Z",
  "updatedAt": "2026-09-30T00:26:19.500Z"
}
```

A senha é armazenada com bcrypt e **nunca** é retornada. O campo `isActive` é opcional e o padrão é `true`.

### Listar e pesquisar

```
GET /users?page=1&limit=10&search=maria
```

| Parâmetro | Padrão | Descrição                                                               |
| --------- | :----: | ----------------------------------------------------------------------- |
| `page`    |   1    | Página (a partir de 1)                                                  |
| `limit`   |   10   | Itens por página (1 a 100)                                              |
| `search`  |   —    | Busca parcial por nome, e-mail ou matrícula, sem diferenciar maiúsculas |

```json
{
  "data": [{ "id": "…", "name": "Maria Silva" }],
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

Os resultados são ordenados do mais recente para o mais antigo.

### Atualizar

`PATCH` aceita qualquer subconjunto dos campos do cadastro. Se `password` for enviado, a nova senha é criptografada.

```bash
curl -X PATCH http://localhost:3000/users/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria Souza"}'
```

## Regras de validação

As regras são aplicadas em duas camadas: no **DTO** (entrada HTTP, erro 400) e no **validador de domínio** da entidade (erro 422). As expressões ficam centralizadas em [`user.rules.ts`](src/modules/user/domain/validators/user.rules.ts).

| Campo          | Regra                                                           | Único |
| -------------- | --------------------------------------------------------------- | :---: |
| `name`         | Apenas letras (com acentos) e espaço simples; 3 a 30 caracteres |       |
| `registration` | Apenas números; 4 a 10 dígitos                                  |  ✅   |
| `email`        | E-mail válido; até 40 caracteres; salvo em minúsculas           |  ✅   |
| `password`     | Exatamente 6 caracteres alfanuméricos (letras e números)        |       |
| `isActive`     | Booleano (opcional)                                             |       |

Campos não previstos no corpo da requisição são rejeitados (`forbidNonWhitelisted`).

## Erros

| Status | Quando                                           | Formato de `message` |
| ------ | ------------------------------------------------ | -------------------- |
| 400    | Payload inválido ou `id` que não é UUID          | lista de mensagens   |
| 404    | Usuário não encontrado (ou excluído)             | texto                |
| 409    | E-mail ou matrícula já pertencem a outro usuário | texto                |
| 422    | Violação de regra de domínio                     | lista + `details`    |
| 503    | Banco de dados indisponível (`/health`)          | —                    |

```json
{
  "statusCode": 409,
  "error": "ConflictException",
  "message": "Já existe um usuário com este e-mail"
}
```

Os erros de domínio são convertidos em respostas HTTP pelo [`DomainExceptionFilter`](src/core/domain/exception/domain-exception.filter.ts), então os casos de uso não dependem do HTTP.

## Soft delete

`DELETE /users/:id` **não apaga a linha**: preenche `deleted_at`. A partir daí, o usuário:

- não aparece em nenhuma consulta: busca por id, listagem, pesquisa e contagem;
- não pode ser editado nem excluído de novo (404).

**Como funciona.** Uma extensão do Prisma ([`soft-delete.extension.ts`](src/core/config/database/extensions/soft-delete.extension.ts)) acrescenta `deletedAt: null` ao `where` de toda operação de `User` (`findUnique`, `findFirst`, `findMany`, `count`, `update` etc.). O [`PrismaService`](src/core/config/database/prisma.service.ts) expõe dois clientes:

| Cliente              | Filtra excluídos | Uso                             |
| -------------------- | :--------------: | ------------------------------- |
| `prisma.client`      |        ✅        | **Padrão.** Todas as consultas. |
| `prisma.withDeleted` |        ❌        | Só em exceções justificadas.    |

**Exceção deliberada.** `findByEmail` e `findByRegistration` usam `withDeleted`. As colunas `email` e `registration` mantêm a constraint `UNIQUE` no banco mesmo após o soft delete, então o registro antigo continua ocupando o índice. Enxergá-lo permite devolver um **409 controlado** em vez de o `INSERT` falhar com erro de constraint. Consequência: e-mail e matrícula de um usuário excluído **continuam reservados**.

> SQL bruto (`$queryRaw` / `$executeRaw`) não passa pela extensão. Consultas manuais em `users` precisam de `WHERE deleted_at IS NULL`.

## Banco de dados

Tabela `users` (schema em [`schema.prisma`](src/core/config/database/prisma/schema.prisma)):

| Coluna         | Tipo           | Restrições                  |
| -------------- | -------------- | --------------------------- |
| `id`           | `uuid`         | PK (gerado pela aplicação)  |
| `name`         | `varchar(30)`  | not null                    |
| `registration` | `varchar(10)`  | not null, **unique**        |
| `email`        | `varchar(40)`  | not null, **unique**        |
| `password`     | `varchar(255)` | not null (hash bcrypt)      |
| `is_active`    | `boolean`      | default `true`              |
| `created_at`   | `timestamp`    | default `now()`             |
| `updated_at`   | `timestamp`    | atualizado a cada alteração |
| `deleted_at`   | `timestamp`    | nullable (soft delete)      |

Migrations em [`src/core/config/database/prisma/migrations`](src/core/config/database/prisma/migrations):

| Migration                          | Descrição                                      |
| ---------------------------------- | ---------------------------------------------- |
| `20260929000000_init`              | Cria a tabela `users`                          |
| `20260930014139_user_field_limits` | Ajusta os tamanhos de nome, matrícula e e-mail |
| `20260930024437_user_soft_delete`  | Adiciona `deleted_at`                          |

## Arquitetura

```
src/
 ├── core/                              # infraestrutura transversal
 │    ├── config/
 │    │    ├── app/                     # configureApp: ValidationPipe + filtro de erros
 │    │    ├── database/                # PrismaService, extensão de soft delete, schema e migrations
 │    │    └── env/                     # validação das variáveis de ambiente (Joi)
 │    ├── docs/swagger/                 # configuração, DTOs e decorators de erro
 │    ├── domain/
 │    │    ├── exception/               # DomainException + DomainExceptionFilter
 │    │    ├── notification/            # Notification e NotificationErrors
 │    │    └── validator/               # ValidatorInterface
 │    ├── pagination/                   # DTO de paginação e helper paginate()
 │    ├── services/                     # HashService (bcrypt)
 │    └── utils/                        # UserMessages
 └── modules/
      ├── health/                       # GET /health
      └── user/
           ├── domain/
           │    ├── entities/           # UserEntity: regras de negócio
           │    ├── factories/          # UserFactory
           │    ├── repositories/       # UserRepositoryPort + token USER_REPOSITORY
           │    ├── validators/         # UserValidator (Joi) e user.rules
           │    └── value-objects/      # Email
           ├── application/
           │    ├── dtos/               # entrada (class-validator) e saída
           │    └── use-cases/          # create, find-all, find-by-id, update, delete
           ├── infrastructure/
           │    ├── http/               # UserController + documentação Swagger
           │    └── persistence/        # UserRepository (Prisma) + UserMapper
           └── user.module.ts
```

**Fluxo de uma requisição:**

```
HTTP → Controller → DTO (class-validator) → Caso de uso → Entidade (regras + Joi)
                                                 ↓
                                  UserRepositoryPort ← UserRepository (Prisma)
```

- **Casos de uso** dependem só da **porta** do repositório (`USER_REPOSITORY`), não do Prisma. Por isso são testados com um repositório em memória.
- A **entidade** garante as invariantes e acumula as violações em um `Notification`, lançando todas de uma vez.
- O **mapper** converte entre o modelo do Prisma e a entidade de domínio.

## Testes

```bash
npm test          # unitários (sem banco)
npm run test:e2e  # e2e (requer o PostgreSQL rodando)
npm run test:cov  # cobertura dos unitários
```

- **Unitários** (`*.spec.ts`): entidade, validações e todos os casos de uso, usando um [repositório em memória](test/doubles/in-memory-user.repository.ts) com as mesmas regras de soft delete do real.
- **E2e** ([`test/app.e2e-spec.ts`](test/app.e2e-spec.ts)): sobem a aplicação inteira contra o banco **`conecthus_test`** (definido em `.env.test`, separado do banco de desenvolvimento). O `globalSetup` aplica as migrations antes de rodar. Cobrem CRUD, pesquisa, hash de senha, 409, validações (400) e soft delete.

## Scripts

| Script                    | Descrição                                        |
| ------------------------- | ------------------------------------------------ |
| `npm run start:dev`       | API com hot reload                               |
| `npm run build`           | Compila para `dist/`                             |
| `npm run start:prod`      | Executa a versão compilada                       |
| `npm run lint`            | ESLint (com correção automática)                 |
| `npm run format`          | Prettier                                         |
| `npm test`                | Testes unitários                                 |
| `npm run test:e2e`        | Testes e2e                                       |
| `npm run prisma:migrate`  | Cria/aplica migration em dev e regenera o client |
| `npm run prisma:deploy`   | Aplica as migrations pendentes                   |
| `npm run prisma:generate` | Regenera o Prisma Client                         |
| `npm run prisma:studio`   | Interface visual do banco                        |

## Observações técnicas

- **Prisma 7** usa o gerador `prisma-client` (client gerado em `src/core/config/database/generated`, fora do versionamento) e o driver adapter `@prisma/adapter-pg`. A configuração do CLI fica em [`prisma.config.ts`](prisma.config.ts).
- **`prisma migrate dev` não regenera o client** no Prisma 7. O script `prisma:migrate` já roda o `generate` em seguida.
- **Testes e2e** rodam com `node --experimental-vm-modules`, porque o client do Prisma 7 carrega o query compiler com `import()` dinâmico. O aviso `ExperimentalWarning` é esperado.
- **npm 12** bloqueia scripts de instalação por padrão. O `package.json` libera apenas os do Prisma (`allowScripts`), necessários para o `migrate`.
