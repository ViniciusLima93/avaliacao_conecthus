import styled from 'styled-components';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { sectionTitle } from '../../../styles/mixins';
import type { User } from '../../../types/user';

type UserDetailsDrawerProps = {
  user: User | null;
  onClose: () => void;
};

const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });

/** "Nenhuma" quando o registro nunca foi alterado depois de criado. */
function lastEdit(user: User): string {
  const created = new Date(user.createdAt).getTime();
  const updated = new Date(user.updatedAt).getTime();
  return updated - created < 1000
    ? 'Nenhuma'
    : dateFormat.format(new Date(user.updatedAt));
}

export function UserDetailsDrawer({ user, onClose }: UserDetailsDrawerProps) {
  return (
    <Drawer
      open={Boolean(user)}
      title="Visualizar Usuário"
      onClose={onClose}
      footer={
        <Button $variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      {user && (
        <>
          <Section aria-labelledby="dados-usuario">
            <SectionTitle id="dados-usuario">Dados do Usuário</SectionTitle>
            <Fields>
              <Field>
                <dt>Nome</dt>
                <dd>{user.name}</dd>
              </Field>
              <Field>
                <dt>Matrícula</dt>
                <dd>{user.registration}</dd>
              </Field>
              <Field $full>
                <dt>E-mail</dt>
                <dd>{user.email}</dd>
              </Field>
            </Fields>
          </Section>

          <Section aria-labelledby="detalhes-usuario">
            <SectionTitle id="detalhes-usuario">Detalhes</SectionTitle>
            <Fields>
              <Field>
                <dt>Data de criação</dt>
                <dd>{dateFormat.format(new Date(user.createdAt))}</dd>
              </Field>
              <Field>
                <dt>Última edição</dt>
                <dd>{lastEdit(user)}</dd>
              </Field>
            </Fields>
          </Section>
        </>
      )}
    </Drawer>
  );
}

const Section = styled.section`
  & + & {
    margin-top: 28px;
  }
`;

const SectionTitle = styled.h3`
  ${sectionTitle}
  margin-bottom: 20px;
`;

const Fields = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: 28px 24px;
  margin: 0;
`;

const Field = styled.div<{ $full?: boolean }>`
  min-width: 0;
  flex-basis: ${({ $full }) => ($full ? '100%' : 'auto')};

  dt {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.heading};
  }

  dd {
    margin: 8px 0 0;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.heading};
    word-break: break-word;
  }
`;
