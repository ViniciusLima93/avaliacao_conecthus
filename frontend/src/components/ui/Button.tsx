import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'confirm' | 'danger' | 'ghost';

type ButtonProps = {
  $variant?: Variant;
  $fullWidth?: boolean;
};

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
      border-color: ${({ theme }) => theme.colors.primaryHover};
    }

    &&:disabled {
      background: ${({ theme }) => theme.colors.disabled};
      border-color: ${({ theme }) => theme.colors.disabled};
      color: ${({ theme }) => theme.colors.disabledText};
      opacity: 1;
    }
  `,
  /* Spec ("Cancelar", "Não"): transparente, borda e texto #0B2B25. */
  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.heading};
    border-color: ${({ theme }) => theme.colors.heading};

    &:hover:not(:disabled) {
      background: rgba(11, 43, 37, 0.05);
    }
  `,
  /* Spec ("Sim"): #0290A4 com Satoshi Bold. */
  confirm: css`
    font-family: ${({ theme }) => theme.fonts.accent};
    background: ${({ theme }) => theme.colors.confirm};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.confirm};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.confirmHover};
      border-color: ${({ theme }) => theme.colors.confirmHover};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.danger};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.dangerHover};
      border-color: ${({ theme }) => theme.colors.dangerHover};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.heading};
    border-color: transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceHover};
    }
  `,
};

export const Button = styled.button.attrs<ButtonProps>(({ type }) => ({
  type: type ?? 'button',
}))<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 20px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border: 1px solid transparent;
  /* Spec: Manrope Bold 18px/24px, raio de 8px. */
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  white-space: nowrap;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;

  ${({ $variant = 'primary' }) => variants[$variant]}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
  }
`;
