import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usersService } from '../../services/users.service';
import { renderPage } from '../../test/render';
import { UserFormPage } from './UserFormPage';

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

describe('UserFormPage', () => {
  it('ao cancelar o cadastro, mostra "Cadastro cancelado" e volta para a lista', async () => {
    const { user, router } = renderPage(<UserFormPage />, {
      route: '/usuarios/novo',
      path: '/usuarios/novo',
    });

    await user.click(await screen.findByRole('button', { name: 'Cancelar' }));

    expect(await screen.findByText('Cadastro cancelado')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/usuarios');
    expect(api.create).not.toHaveBeenCalled();
  });

  it('ao cancelar a edição, volta para a lista sem o aviso de cadastro', async () => {
    api.getById.mockResolvedValue({
      id: 'u-1',
      name: 'Maria José',
      registration: '2024001',
      email: 'maria@email.com',
      createdAt: '2024-05-08T12:00:00.000Z',
      updatedAt: '2024-05-08T12:00:00.000Z',
    });
    const { user, router } = renderPage(<UserFormPage />, {
      route: '/usuarios/u-1/editar',
      path: '/usuarios/:id/editar',
    });

    await user.click(await screen.findByRole('button', { name: 'Cancelar' }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/usuarios'),
    );
    expect(screen.queryByText('Cadastro cancelado')).not.toBeInTheDocument();
  });

  it('ao cadastrar, mostra "Cadastro Realizado!"', async () => {
    api.create.mockResolvedValue({
      id: 'u-2',
      name: 'Maria José',
      registration: '2024001',
      email: 'maria@email.com',
      createdAt: '2024-05-08T12:00:00.000Z',
      updatedAt: '2024-05-08T12:00:00.000Z',
    });
    const { user } = renderPage(<UserFormPage />, {
      route: '/usuarios/novo',
      path: '/usuarios/novo',
    });

    await user.type(
      await screen.findByLabelText('Insira o nome completo*'),
      'Maria José',
    );
    await user.type(
      screen.getByLabelText('Insira o Nº da matrícula'),
      '2024001',
    );
    await user.type(
      screen.getByLabelText('Insira o E-mail*'),
      'maria@email.com',
    );
    await user.type(screen.getByLabelText('Senha'), 'Abc123');
    await user.type(screen.getByLabelText('Repetir Senha'), 'Abc123');
    const submit = screen.getByRole('button', { name: 'Cadastrar' });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    expect(await screen.findByText('Cadastro Realizado!')).toBeInTheDocument();
    expect(api.create.mock.calls[0][0]).toEqual({
      name: 'Maria José',
      registration: '2024001',
      email: 'maria@email.com',
      password: 'Abc123',
    });
  });
});
