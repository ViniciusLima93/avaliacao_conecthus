import type { ReactNode } from 'react';
import styled from 'styled-components';
import { sectionTitle } from '../../styles/mixins';

/** Grupo de campos com título e linha divisória ("Dados do Usuário ———"). */
export function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Fieldset>
      <Legend>{title}</Legend>
      {children}
    </Fieldset>
  );
}

const Fieldset = styled.fieldset`
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;

  & + & {
    margin-top: 20px;
  }
`;

const Legend = styled.legend`
  ${sectionTitle}
  float: left;
  width: 100%;
  margin-bottom: 14px;
  padding: 0;

  /* O legend flutuante precisa liberar o fluxo para os campos abaixo. */
  & + * {
    clear: both;
  }
`;
