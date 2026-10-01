import { ChevronLeft } from 'lucide-react';
import type { UseFormSetError } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageBreadcrumbs } from '../../components/ui/PageBreadcrumbs';
import { PageTitle } from '../../components/ui/PageTitle';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import {
  useCreateUser,
  useUpdateUser,
  useUserQuery,
} from '../../hooks/useUsers';
import { ApiError } from '../../services/http';
import type { UpdateUserInput } from '../../types/user';
import { UserForm } from './components/UserForm';
import {
  emptyUserForm,
  type UserFormValues,
} from './components/userFormSchema';

export function UserFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const title = isEdit ? 'Edição de Usuário' : 'Cadastro de Usuário';
  const navigate = useNavigate();
  const toast = useToast();

  const userQuery = useUserQuery(id);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const backToList = () => navigate('/usuarios');

  /** Spec: cancelar o cadastro avisa com o toast laranja e volta para a lista. */
  const cancelCreate = () => {
    toast.warning('Cadastro cancelado');
    backToList();
  };

  /** Conflitos (409) viram erro no campo; o resto vira notificação. */
  const handleError = (
    error: Error,
    setError: UseFormSetError<UserFormValues>,
  ) => {
    if (error instanceof ApiError && error.status === 409) {
      const field = /matr[ií]cula/i.test(error.message)
        ? 'registration'
        : 'email';
      setError(field, { message: error.message }, { shouldFocus: true });
      return;
    }
    toast.error(
      error instanceof ApiError
        ? error.messages.join(' • ')
        : 'Não foi possível salvar o usuário.',
    );
  };

  const handleSubmit = (
    values: UserFormValues,
    setError: UseFormSetError<UserFormValues>,
  ) => {
    // "Repetir Senha" só existe na tela; a API recebe apenas a senha.
    const { name, registration, email, password } = values;
    const data = { name, registration, email };

    if (!id) {
      createUser.mutate(
        { ...data, password },
        {
          onSuccess: () => {
            toast.success('Cadastro Realizado!');
            backToList();
          },
          onError: (error) => handleError(error, setError),
        },
      );
      return;
    }

    const input: UpdateUserInput = password ? { ...data, password } : data;
    updateUser.mutate(
      { id, input },
      {
        onSuccess: () => {
          toast.success('Usuário atualizado com sucesso.');
          backToList();
        },
        onError: (error) => handleError(error, setError),
      },
    );
  };

  const renderForm = () => {
    if (!isEdit) {
      return (
        <UserForm
          mode="create"
          defaultValues={emptyUserForm}
          submitting={createUser.isPending}
          onCancel={cancelCreate}
          onSubmit={handleSubmit}
        />
      );
    }

    if (userQuery.isPending) {
      return (
        <Card aria-busy="true" aria-label="Carregando usuário">
          <SkeletonGrid>
            <Skeleton $height="48px" />
            <Skeleton $height="48px" />
            <Skeleton $height="48px" />
          </SkeletonGrid>
        </Card>
      );
    }

    if (userQuery.isError) {
      const notFound =
        userQuery.error instanceof ApiError && userQuery.error.status === 404;
      return (
        <EmptyState
          title={
            notFound
              ? 'Usuário não encontrado'
              : 'Não foi possível carregar o usuário'
          }
          description={
            notFound ? 'Ele pode ter sido excluído.' : userQuery.error.message
          }
          action={<Button onClick={backToList}>Voltar para Usuários</Button>}
        />
      );
    }

    const user = userQuery.data;
    return (
      <UserForm
        key={user.id}
        mode="edit"
        defaultValues={{
          name: user.name,
          registration: user.registration,
          email: user.email,
          password: '',
          confirmPassword: '',
        }}
        submitting={updateUser.isPending}
        onCancel={backToList}
        onSubmit={handleSubmit}
      />
    );
  };

  return (
    <>
      <PageBreadcrumbs
        items={[{ label: 'Usuários', to: '/usuarios' }, { label: title }]}
      />
      <TitleRow>
        <BackButton to="/usuarios" aria-label="Voltar para Usuários">
          <ChevronLeft size={26} strokeWidth={2.5} />
        </BackButton>
        <Title>{title}</Title>
      </TitleRow>
      {renderForm()}
    </>
  );
}

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0 12px;
`;

const Title = styled(PageTitle)`
  margin-bottom: 0;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  margin-left: -6px;
  padding: 2px;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.heading};

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const SkeletonGrid = styled.div`
  display: grid;
  gap: 16px;
`;
