# WenLock — Frontend

Interface web de gerenciamento de usuários do **WenLock**, construída com **React 19 + Vite + TypeScript** e estilizada com **styled-components** em abordagem **mobile first**. Consome a [API do backend](../backend/README.md).

## Sumário

- [Stack](#stack)
- [Como rodar](#como-rodar)
- [Telas e funcionalidades](#telas-e-funcionalidades)
- [Validações do formulário](#validações-do-formulário)
- [Responsividade](#responsividade)
- [Arquitetura](#arquitetura)
- [Componentes](#componentes)
- [Testes](#testes)
- [Scripts](#scripts)
- [Observações](#observações)

## Stack

| Tecnologia            | Uso                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| React 19 + TypeScript | Interface                                                                                            |
| Vite                  | Dev server e build                                                                                   |
| styled-components     | Estilização, tema centralizado e breakpoints mobile first                                            |
| React Router          | Rotas, com carregamento sob demanda por página                                                       |
| TanStack Query        | Cache, sincronização com a API e invalidação após mutações                                           |
| React Hook Form + Zod | Formulários e validação                                                                              |
| Material UI           | Apenas o `Breadcrumbs`, usando o styled-components como motor (`@mui/styled-engine-sc`, sem Emotion) |
| lucide-react          | Ícones                                                                                               |

## Como rodar

### Localmente

Requer **Node.js 24+** e a API rodando em `http://localhost:3000` (veja o [README do backend](../backend/README.md)).

```bash
cp .env.example .env
npm install
npm run dev
```

Acesse **http://localhost:5173**.

| Variável       | Padrão                  | Descrição       |
| -------------- | ----------------------- | --------------- |
| `VITE_API_URL` | `http://localhost:3000` | URL base da API |

### Com Docker

O [`Dockerfile`](Dockerfile) gera o build com Node e serve os arquivos estáticos com **nginx** ([`nginx.conf`](nginx.conf)): rotas como `/usuarios/novo` caem no `index.html`, e os assets com hash no nome ficam em cache por um ano. É o serviço `web` do `docker-compose.yaml` da raiz:

```bash
cd ..
docker compose up -d --build
```

Acesse **http://localhost:8080**.

> O Vite embute `VITE_API_URL` no bundle durante o build. Por isso, no Docker ela é definida como `args` no compose e precisa ser o endereço da API visto pelo **navegador** (`http://localhost:3000`), não o nome interno do container.

## Telas e funcionalidades

| Rota                   | Tela                                                    |
| ---------------------- | ------------------------------------------------------- |
| `/`                    | **Home**: saudação ao usuário, data atual e boas-vindas |
| `/usuarios`            | **Lista de usuários**: pesquisa, paginação e ações      |
| `/usuarios/novo`       | **Cadastro de usuário**                                 |
| `/usuarios/:id/editar` | **Edição de usuário**                                   |
| `*`                    | Página não encontrada                                   |

**Lista de usuários**

- Pesquisa por nome, e-mail ou matrícula, disparada 400 ms após parar de digitar.
- Paginação com total de itens, itens por página (5, 10, 15, 20 ou 50) e navegação entre páginas.
- Página, itens por página e pesquisa ficam na URL (`?page=2&limit=15&q=maria`), então sobrevivem a recarregar a página e ao botão "voltar".
- Estados de carregamento (skeleton), lista vazia, pesquisa sem resultado e erro com "Tentar novamente".
- Ações por usuário:
  - 👁️ **Visualizar**: drawer lateral com dados, data de criação e última edição.
  - ✏️ **Editar**: abre a tela de edição.
  - 🗑️ **Excluir**: confirmação "Deseja excluir?" (Não / Sim).

**Cadastro e edição**

- Breadcrumb (`Usuários > Cadastro de Usuário`) e botão de voltar.
- Seções "Dados do Usuário" e "Dados de acesso", com senha e "Repetir Senha" (com botão para mostrar/ocultar).
- Rótulo flutuante: o texto fica dentro do campo e sobe quando ele tem foco ou valor.
- "Cadastrar" só é habilitado com o formulário válido; na edição, "Salvar" também exige alguma alteração.
- Conflito de e-mail ou matrícula (409 da API) aparece no próprio campo, que recebe o foco.
- Na edição, deixar as senhas em branco mantém a senha atual.

**Feedback e layout**

- Snackbar verde no canto superior direito: "Cadastro Realizado!" e "Exclusão Realizada!".
- Menu lateral recolhível no desktop (só ícones) e em gaveta no mobile.
- Menu de perfil no avatar, com nome, e-mail e "Sair".

## Validações do formulário

Regras idênticas às da API ([`userFormSchema.ts`](src/pages/Users/components/userFormSchema.ts)):

| Campo         | Regra                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------ |
| Nome          | Obrigatório; apenas letras (com acentos) e espaços; 3 a 30 caracteres                      |
| Matrícula     | Obrigatória; apenas números (outros caracteres são descartados ao digitar); 4 a 10 dígitos |
| E-mail        | Obrigatório; e-mail válido; até 40 caracteres                                              |
| Senha         | Obrigatória no cadastro; exatamente 6 caracteres alfanuméricos                             |
| Repetir Senha | Deve ser igual à senha                                                                     |

## Responsividade

Os estilos base são escritos para telas pequenas, e os breakpoints ([`theme.ts`](src/styles/theme.ts)) só **acrescentam** regras a partir de uma largura:

| Breakpoint | A partir de | O que muda                                                                         |
| ---------- | :---------: | ---------------------------------------------------------------------------------- |
| base       |      —      | Uma coluna; menu em gaveta; modais como painel inferior; snackbar em largura total |
| `sm`       |    480px    | Botões de diálogo lado a lado; todas as páginas visíveis na paginação              |
| `md`       |    768px    | Pesquisa e botão na mesma linha; formulário em 2 colunas; drawer de 450px          |
| `lg`       |   1024px    | Menu lateral fixo e recolhível                                                     |

## Arquitetura

```
src/
 ├── components/
 │    ├── layout/          # AppLayout, Sidebar, Header, UserMenu, Logo
 │    └── ui/              # componentes reutilizáveis (ver abaixo)
 ├── config/               # usuário exibido no cabeçalho (sessão)
 ├── hooks/                # useUsers (React Query), useDebounce, useDialogBehavior
 ├── pages/
 │    ├── Home/            # HomePage + ilustração
 │    ├── Users/           # UsersPage, UserFormPage e componentes da tela
 │    └── NotFound/
 ├── services/             # cliente HTTP (fetch + ApiError) e users.service
 ├── styles/               # tema, breakpoints, mixins, estilos globais e tema do MUI
 ├── types/                # tipos da API
 ├── routes.tsx            # rotas com carregamento sob demanda
 ├── App.tsx               # providers (tema, React Query, toasts, router)
 └── main.tsx
```

- **Dados:** [`http.ts`](src/services/http.ts) centraliza as chamadas e converte respostas de erro em `ApiError` (status + mensagens). Os hooks de [`useUsers.ts`](src/hooks/useUsers.ts) encapsulam as queries e invalidam o cache após criar, editar ou excluir.
- **Estilo:** cores, fontes, raios, sombras e medidas ficam no [tema](src/styles/theme.ts). Props só de estilo usam o prefixo `$` (transient props), para não chegarem ao DOM.
- **Desempenho:** cada página é um chunk separado, baixado só quando a rota é acessada. O Material UI e o formulário ficam fora do carregamento inicial.

## Componentes

| Componente                                    | Descrição                                                      |
| --------------------------------------------- | -------------------------------------------------------------- |
| `Button`, `IconButton`                        | Variantes `primary`, `secondary`, `confirm`, `danger`, `ghost` |
| `FloatingInput`, `PasswordInput`              | Campos preenchidos com rótulo flutuante, texto de apoio e erro |
| `FormSection`                                 | Grupo de campos com título e linha divisória                   |
| `SearchInput`                                 | Campo de pesquisa com botão de limpar                          |
| `Pagination`                                  | Total, itens por página e navegação                            |
| `Modal`, `ConfirmDialog`                      | Diálogo padrão e confirmação compacta com fundo desfocado      |
| `Drawer`                                      | Painel lateral (visualização de usuário)                       |
| `Toast`                                       | Snackbar de sucesso e erro (`useToast`)                        |
| `PageBreadcrumbs`                             | Breadcrumb do Material UI integrado ao React Router            |
| `EmptyState`, `Skeleton`, `Card`, `PageTitle` | Estados e blocos de layout                                     |

**Acessibilidade:** rótulos em todos os campos e botões de ícone, `aria-invalid` e mensagens de erro associadas aos campos, diálogos com `role`/`aria-modal`, fechamento com Esc, foco devolvido ao elemento de origem e suporte a `prefers-reduced-motion`.

## Testes

Testes com **Vitest** + **Testing Library** (ambiente jsdom), escritos do ponto de vista do usuário: os campos são encontrados pelo rótulo e os botões pelo nome acessível.

```bash
npm test             # roda uma vez
npm run test:watch   # modo observação
```

| Arquivo                                                                       | O que cobre                                                                                                    |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`userFormSchema.test.ts`](src/pages/Users/components/userFormSchema.test.ts) | Regras do schema Zod de cadastro e edição: nome, matrícula, e-mail, senha e confirmação                        |
| [`UserForm.test.tsx`](src/pages/Users/components/UserForm.test.tsx)           | Botão habilitado só com o formulário válido, filtro de dígitos, limites, erros, envio e modo de edição         |
| [`UsersPage.test.tsx`](src/pages/Users/UsersPage.test.tsx)                    | Estados vazio e de erro, listagem, pesquisa com debounce, paginação, visualizar, excluir (Sim/Não) e navegação |

- A API é mockada com `vi.mock` no `users.service`, então os testes não precisam do backend.
- [`src/test/render.tsx`](src/test/render.tsx) renderiza com os mesmos providers do app (tema, React Query, toasts e router em memória).

## Scripts

| Script               | Descrição                     |
| -------------------- | ----------------------------- |
| `npm run dev`        | Servidor de desenvolvimento   |
| `npm run build`      | Typecheck + build de produção |
| `npm run preview`    | Serve o build localmente      |
| `npm test`           | Testes (Vitest)               |
| `npm run test:watch` | Testes em modo observação     |
| `npm run lint`       | ESLint                        |
| `npm run format`     | Prettier                      |

## Observações

- **Autenticação:** a API ainda não tem login. O usuário do cabeçalho e da Home vem de [`session.ts`](src/config/session.ts), e "Sair" apenas volta para a Home. O ponto para ligar o logout real está em `handleLogout`, no [`UserMenu`](src/components/layout/UserMenu.tsx).
- **Vite no Windows:** se uma alteração não aparecer no navegador, salve o arquivo de novo ou reinicie o `npm run dev`. O observador de arquivos às vezes perde gravações feitas em sequência.
