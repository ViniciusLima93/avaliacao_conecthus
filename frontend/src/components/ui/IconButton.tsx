import styled from 'styled-components';

type IconButtonProps = {
  $tone?: 'default' | 'danger';
};

/** Botão quadrado só com ícone. Sempre informe `aria-label`. */
export const IconButton = styled.button.attrs<IconButtonProps>(({ type }) => ({
  type: type ?? 'button',
}))<IconButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.heading};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme, $tone }) =>
      $tone === 'danger' ? theme.colors.danger : theme.colors.primary};
    color: ${({ theme, $tone }) =>
      $tone === 'danger' ? theme.colors.danger : theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
