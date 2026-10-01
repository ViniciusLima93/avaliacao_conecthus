import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import styled from 'styled-components';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageTitle } from '../../components/ui/PageTitle';
import { Pagination } from '../../components/ui/Pagination';
import { SearchInput } from '../../components/ui/SearchInput';
import { useToast } from '../../components/ui/Toast';
import { useDebounce } from '../../hooks/useDebounce';
import { useDeleteUser, useUsersQuery } from '../../hooks/useUsers';
import { ApiError } from '../../services/http';
import { media } from '../../styles/theme';
import type { User } from '../../types/user';
import { UserDetailsDrawer } from './components/UserDetailsDrawer';
import { UsersTable, UsersTableSkeleton } from './components/UsersTable';

const DEFAULT_LIMIT = 15;

function toPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function UsersPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Página, tamanho e busca ficam na URL: sobrevivem a recarregar e ao "voltar".
  const page = toPositiveInt(searchParams.get('page'), 1);
  const limit = Math.min(
    toPositiveInt(searchParams.get('limit'), DEFAULT_LIMIT),
    100,
  );
  const search = searchParams.get('q') ?? '';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput.trim());

  // Se a URL mudar por fora (menu, voltar, link), o campo acompanha. Quando a
  // mudança veio da própria digitação, `search` já é igual ao termo digitado
  // e o campo não é tocado (não atrapalha quem ainda está digitando).
  const [lastSearch, setLastSearch] = useState(search);
  if (search !== lastSearch) {
    setLastSearch(search);
    if (search !== debouncedSearch) {
      setSearchInput(search);
    }
  }

  const [viewing, setViewing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);

  const usersQuery = useUsersQuery({
    page,
    limit,
    search: search || undefined,
  });
  const deleteUser = useDeleteUser();

  const updateParams = (changes: Record<string, string | number | null>) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        Object.entries(changes).forEach(([key, value]) => {
          if (value === null || value === '') next.delete(key);
          else next.set(key, String(value));
        });
        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (debouncedSearch !== search) {
      updateParams({ q: debouncedSearch, page: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reage apenas ao termo digitado
  }, [debouncedSearch]);

  // Se a página atual ficou vazia (ex.: após excluir o último item), volta para a última válida.
  const totalPages = usersQuery.data?.meta.totalPages ?? 0;
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      updateParams({ page: totalPages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, totalPages]);

  const goToEdit = (user: User) => navigate(`/usuarios/${user.id}/editar`);

  const confirmDelete = () => {
    if (!deleting) return;
    deleteUser.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Exclusão Realizada!');
        setDeleting(null);
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError
            ? error.message
            : 'Não foi possível excluir o usuário.',
        );
      },
    });
  };

  const renderContent = () => {
    if (usersQuery.isPending) {
      return <UsersTableSkeleton />;
    }

    if (usersQuery.isError) {
      return (
        <EmptyState
          title="Não foi possível carregar os usuários"
          description={usersQuery.error.message}
          action={
            <Button $variant="secondary" onClick={() => usersQuery.refetch()}>
              Tentar novamente
            </Button>
          }
        />
      );
    }

    const { data } = usersQuery.data;

    if (data.length === 0 && !search) {
      return (
        <EmptyState
          title="Nenhum Usuário Registrado"
          description="Clique em “Cadastrar Usuário” para começar a cadastrar."
        />
      );
    }

    if (data.length === 0) {
      return (
        <EmptyState
          title="Nenhum usuário encontrado"
          description={`Nenhum resultado para “${search}”.`}
          action={
            <Button $variant="secondary" onClick={() => setSearchInput('')}>
              Limpar pesquisa
            </Button>
          }
        />
      );
    }

    return (
      <UsersTable
        users={data}
        fetching={usersQuery.isFetching}
        onView={setViewing}
        onEdit={goToEdit}
        onDelete={setDeleting}
      />
    );
  };

  return (
    <>
      <PageTitle>Usuários</PageTitle>

      <Toolbar>
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          label="Pesquisar por nome, e-mail ou matrícula"
        />
        <Button onClick={() => navigate('/usuarios/novo')}>
          <Plus size={20} aria-hidden="true" />
          Cadastrar Usuário
        </Button>
      </Toolbar>

      <Content>{renderContent()}</Content>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={usersQuery.data?.meta.total ?? 0}
        limit={limit}
        onPageChange={(next) => updateParams({ page: next })}
        onLimitChange={(next) => updateParams({ limit: next, page: null })}
      />

      <UserDetailsDrawer user={viewing} onClose={() => setViewing(null)} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Deseja excluir?"
        loading={deleteUser.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
        description={<p>O usuário será excluído.</p>}
      />
    </>
  );
}

const Toolbar = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  margin-bottom: 16px;

  ${media.sm} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 280px;
`;
