import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../services/http';
import { usersService } from '../../services/users.service';
import { renderPage } from '../../test/render';
import type { Paginated, User } from '../../types/user';
import { UsersPage } from './UsersPage';

vi.mock('../../services/users.service', () => ({
  usersService: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const api = vi.mocked(usersService);

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'a1b2c3d4-0000-4000-8000-000000000001',
    name: 'Raimundo Neto Abreu Teixeira',
    registration: '809987',
    email: 'raimundo@email.com',
    createdAt: '2024-05-08T12:00:00.000Z',
    updatedAt: '2024-05-08T12:00:00.000Z',
    ...overrides,
  };
}

function pageOf(
  data: User[],
  meta: Partial<Paginated<User>['meta']> = {},
): Paginated<User> {
  const limit = meta.limit ?? 15;
  const total = meta.total ?? data.length;
  return {
    data,
    meta: {
      page: 1,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      ...meta,
    },
  };
}

function renderUsersPage(route = '/usuarios') {
  return renderPage(<UsersPage />, { route, path: '/usuarios' });
}

describe('UsersPage', () => {
  beforeEach(() => {
    api.list.mockResolvedValue(pageOf([]));
  });

  it('mostra o estado vazio quando não há usuários', async () => {
    renderUsersPage();

    expect(
      await screen.findByText('Nenhum Usuário Registrado'),
    ).toBeInTheDocument();
    expect(api.list).toHaveBeenCalledWith({
      page: 1,
      limit: 15,
      search: undefined,
    });
  });

  it('lista os usuários com o total de itens', async () => {
    api.list.mockResolvedValue(
      pageOf([
        makeUser(),
        makeUser({ id: 'u-2', name: 'Maria José', email: 'maria@email.com' }),
      ]),
    );

    renderUsersPage();

    expect(
      await screen.findByText('Raimundo Neto Abreu Teixeira'),
    ).toBeInTheDocument();
    expect(screen.getByText('Maria José')).toBeInTheDocument();
    expect(screen.getByText('Total de itens').parentElement).toHaveTextContent(
      'Total de itens 2',
    );
  });

  it('mostra erro com opção de tentar novamente quando a API falha', async () => {
    api.list.mockRejectedValueOnce(
      new ApiError(0, ['Não foi possível conectar à API.']),
    );

    const { user } = renderUsersPage();

    expect(
      await screen.findByText('Não foi possível carregar os usuários'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(
      await screen.findByText('Nenhum Usuário Registrado'),
    ).toBeInTheDocument();
  });

  it('pesquisa com debounce e mostra quando não há resultados', async () => {
    const { user, router } = renderUsersPage();
    await screen.findByText('Nenhum Usuário Registrado');

    await user.type(
      screen.getByRole('searchbox', {
        name: 'Pesquisar por nome, e-mail ou matrícula',
      }),
      'maria',
    );

    await waitFor(() =>
      expect(api.list).toHaveBeenLastCalledWith({
        page: 1,
        limit: 15,
        search: 'maria',
      }),
    );
    expect(router.state.location.search).toBe('?q=maria');
    expect(
      await screen.findByText('Nenhum usuário encontrado'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Nenhum resultado para “maria”.'),
    ).toBeInTheDocument();
  });

  it('navega entre as páginas', async () => {
    api.list.mockResolvedValue(pageOf([makeUser()], { total: 30 }));
    const { user, router } = renderUsersPage();

    await screen.findByText('Raimundo Neto Abreu Teixeira');
    expect(screen.getByText('de 2')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Página anterior' }),
    ).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Próxima página' }));

    await waitFor(() =>
      expect(api.list).toHaveBeenLastCalledWith({
        page: 2,
        limit: 15,
        search: undefined,
      }),
    );
    expect(router.state.location.search).toBe('?page=2');
  });

  it('abre a visualização do usuário em um painel lateral', async () => {
    api.list.mockResolvedValue(pageOf([makeUser()]));
    const { user } = renderUsersPage();

    await user.click(
      await screen.findByRole('button', {
        name: 'Visualizar Raimundo Neto Abreu Teixeira',
      }),
    );

    const drawer = await screen.findByRole('dialog', {
      name: 'Visualizar Usuário',
    });
    expect(within(drawer).getByText('raimundo@email.com')).toBeInTheDocument();
    expect(within(drawer).getByText('809987')).toBeInTheDocument();
    expect(within(drawer).getByText('Nenhuma')).toBeInTheDocument();

    // Há dois "Fechar": o "X" do topo e o botão do rodapé; clica no do rodapé.
    const [, footerClose] = within(drawer).getAllByRole('button', {
      name: 'Fechar',
    });
    await user.click(footerClose);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('exclui após confirmar em "Sim" e mostra "Exclusão Realizada!"', async () => {
    const target = makeUser();
    api.list.mockResolvedValue(pageOf([target]));
    api.remove.mockResolvedValue(undefined);
    const { user } = renderUsersPage();

    await user.click(
      await screen.findByRole('button', { name: `Excluir ${target.name}` }),
    );
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Deseja excluir?',
    });
    expect(
      within(dialog).getByText('O usuário será excluído.'),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Sim' }));

    await waitFor(() => expect(api.remove).toHaveBeenCalled());
    expect(api.remove.mock.calls[0][0]).toBe(target.id);
    expect(await screen.findByText('Exclusão Realizada!')).toBeInTheDocument();
  });

  it('não exclui ao responder "Não"', async () => {
    const target = makeUser();
    api.list.mockResolvedValue(pageOf([target]));
    const { user } = renderUsersPage();

    await user.click(
      await screen.findByRole('button', { name: `Excluir ${target.name}` }),
    );
    await user.click(await screen.findByRole('button', { name: 'Não' }));

    await waitFor(() =>
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
    );
    expect(api.remove).not.toHaveBeenCalled();
  });

  it('leva para o cadastro e para a edição', async () => {
    const target = makeUser();
    api.list.mockResolvedValue(pageOf([target]));
    const { user, router } = renderUsersPage();

    await user.click(
      await screen.findByRole('button', { name: `Editar ${target.name}` }),
    );
    expect(router.state.location.pathname).toBe(
      `/usuarios/${target.id}/editar`,
    );

    await router.navigate('/usuarios');
    await user.click(
      await screen.findByRole('button', { name: /Cadastrar Usuário/ }),
    );
    expect(router.state.location.pathname).toBe('/usuarios/novo');
  });
});
