import { Eye, Pencil, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import { IconButton } from '../../../components/ui/IconButton';
import { Skeleton } from '../../../components/ui/Skeleton';
import { media } from '../../../styles/theme';
import type { User } from '../../../types/user';

type UsersTableProps = {
  users: User[];
  fetching?: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export function UsersTable({
  users,
  fetching = false,
  onView,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <Scroll $fetching={fetching} aria-busy={fetching}>
      <Table>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <ActionsHeader scope="col">Ações</ActionsHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <NameCell>{user.name}</NameCell>
              <td>
                <Actions>
                  <IconButton
                    aria-label={`Visualizar ${user.name}`}
                    title="Visualizar"
                    onClick={() => onView(user)}
                  >
                    <Eye size={18} />
                  </IconButton>
                  <IconButton
                    aria-label={`Editar ${user.name}`}
                    title="Editar"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton
                    $tone="danger"
                    aria-label={`Excluir ${user.name}`}
                    title="Excluir"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Actions>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Scroll>
  );
}

export function UsersTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Scroll $fetching={false} aria-busy="true" aria-label="Carregando usuários">
      <Table>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <ActionsHeader scope="col">Ações</ActionsHeader>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, index) => (
            <tr key={index}>
              <NameCell>
                <Skeleton $width={`${40 + ((index * 17) % 35)}%`} />
              </NameCell>
              <td>
                <Actions>
                  <Skeleton $width="120px" $height="36px" />
                </Actions>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Scroll>
  );
}

const Scroll = styled.div<{ $fetching: boolean }>`
  flex: 1;
  overflow-x: auto;
  opacity: ${({ $fetching }) => ($fetching ? 0.6 : 1)};
  transition: opacity 0.15s ease;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-top: -8px;
  font-size: 13px;

  thead th {
    padding: 10px 12px;
    background: ${({ theme }) => theme.colors.navy};
    color: ${({ theme }) => theme.colors.white};
    font-weight: 500;
    text-align: left;

    &:first-child {
      border-radius: ${({ theme }) => theme.radii.sm} 0 0
        ${({ theme }) => theme.radii.sm};
    }

    &:last-child {
      border-radius: 0 ${({ theme }) => theme.radii.sm}
        ${({ theme }) => theme.radii.sm} 0;
    }
  }

  tbody tr {
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transition: background 0.15s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceHover};
    }
  }

  tbody td {
    padding: 8px 12px;
    vertical-align: middle;

    &:first-child {
      border-radius: ${({ theme }) => theme.radii.sm} 0 0
        ${({ theme }) => theme.radii.sm};
    }

    &:last-child {
      border-radius: 0 ${({ theme }) => theme.radii.sm}
        ${({ theme }) => theme.radii.sm} 0;
    }
  }

  ${media.md} {
    font-size: 14px;

    thead th,
    tbody td {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
`;

const NameCell = styled.td`
  width: 100%;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.text};
`;

const ActionsHeader = styled.th`
  && {
    text-align: center;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 4px;

  ${media.md} {
    gap: 6px;
  }
`;
