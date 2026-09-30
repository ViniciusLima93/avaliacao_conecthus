# WenLock — Desafio Full Stack Conecthus

Sistema **CRUD de gerenciamento de usuários**, com backend em **NestJS + Prisma + PostgreSQL** e frontend em **React + styled-components**, desenvolvido como avaliação prática para a vaga de Desenvolvedor Full Stack.

```
desafio_conecthus/
├── docker-compose.yaml   # sobe banco, API e frontend com um comando
├── backend/              # API REST — NestJS, Prisma, PostgreSQL, Swagger
└── frontend/             # Interface web — React, Vite, styled-components
```

## Início rápido

**Pré-requisito:** [Docker](https://www.docker.com/) com Docker Compose.

Na raiz do repositório:

```bash
docker compose up -d --build
```

| Serviço | Endereço                      | Descrição                         |
| ------- | ----------------------------- | --------------------------------- |
| `web`   | http://localhost:8080         | Frontend (nginx)                  |
| `api`   | http://localhost:3000         | API REST                          |
|         | http://localhost:3000/swagger | Documentação interativa (Swagger) |
|         | http://localhost:3000/health  | Saúde da API e do banco           |
| `db`    | `localhost:5432`              | PostgreSQL 17                     |

As migrations do banco são aplicadas automaticamente quando a API inicia.

### Comandos úteis

```bash
docker compose ps                 # status dos containers
docker compose logs -f api        # logs da API
docker compose up -d --build web  # recriar só o frontend após mudanças
docker compose down               # parar tudo (os dados do banco são mantidos)
```

> ⚠️ `docker compose down -v` também apaga o volume do banco, **removendo todos os dados**.

### Acessar o banco (DBeaver, pgAdmin etc.)

| Campo   | Valor       |
| ------- | ----------- |
| Host    | `localhost` |
| Porta   | `5432`      |
| Banco   | `conecthus` |
| Usuário | `postgres`  |
| Senha   | `postgres`  |

Os dados ficam em `public.users`. Usuários excluídos continuam na tabela com `deleted_at` preenchido (soft delete).

## Stack

| Camada   | Tecnologias                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Backend  | NestJS 11, TypeScript, Prisma 7, class-validator, Joi, bcrypt, Swagger, Jest, Supertest                                      |
| Banco    | PostgreSQL 17                                                                                                                |
| Frontend | React 19, Vite, TypeScript, styled-components, React Router, TanStack Query, React Hook Form, Zod, Material UI (Breadcrumbs) |
| Infra    | Docker, Docker Compose, nginx                                                                                                |

## Requisitos do desafio

### Frontend

| Requisito                                                 | Status |
| --------------------------------------------------------- | :----: |
| Framework de front-end (React)                            |   ✅   |
| Interface de usuário e validações                         |   ✅   |
| Tela de Apresentação (Home)                               |   ✅   |
| Lista de usuários com pesquisa por nome                   |   ✅   |
| Lista de usuários com paginação                           |   ✅   |
| Cadastro — Nome: apenas letras                            |   ✅   |
| Cadastro — E-mail: apenas e-mails válidos                 |   ✅   |
| Cadastro — Matrícula: apenas números                      |   ✅   |
| Cadastro — Senha: alfanumérica de 6 dígitos               |   ✅   |
| Botão de salvar habilitado só com todos os campos válidos |   ✅   |
| Todos os campos obrigatórios                              |   ✅   |
| Edição de usuário                                         |   ✅   |
| Exclusão de usuário                                       |   ✅   |

### Backend e banco de dados

| Requisito                          | Status |
| ---------------------------------- | :----: |
| Endpoints de CRUD de usuários      |   ✅   |
| API RESTful com NestJS             |   ✅   |
| Documentação com Swagger UI        |   ✅   |
| Banco relacional (PostgreSQL)      |   ✅   |
| Tabelas para os dados dos usuários |   ✅   |

### Além do escopo

- **Arquitetura em camadas** no backend (domain / application / infrastructure), com casos de uso, entidade rica, value object e repositório como porta.
- **Soft delete** com filtro global via extensão do Prisma: usuários excluídos nunca aparecem nas consultas.
- **Validação em duas pontas**, com as mesmas regras no frontend (Zod) e no backend (DTO + validador de domínio).
- **Testes automatizados**: unitários (domínio e casos de uso) e e2e contra um banco PostgreSQL real.
- **Layout responsivo (mobile first)**, menu lateral recolhível, notificações (snackbar), drawer de visualização e menu de perfil.
- **Pesquisa** por nome, e-mail ou matrícula, com o estado da listagem preservado na URL.
- **Docker Compose** que sobe o sistema completo com um comando.

## Desenvolvimento

Para rodar backend e frontend fora do Docker, com hot reload:

```bash
# 1. banco no Docker
docker compose up -d db

# 2. API (http://localhost:3000)
cd backend
cp .env.example .env
npm install
npm run prisma:deploy
npm run start:dev

# 3. frontend (http://localhost:5173), em outro terminal
cd frontend
cp .env.example .env
npm install
npm run dev
```

Detalhes de arquitetura, regras, testes e scripts de cada parte:

- 📘 [backend/README.md](backend/README.md)
- 📗 [frontend/README.md](frontend/README.md)
