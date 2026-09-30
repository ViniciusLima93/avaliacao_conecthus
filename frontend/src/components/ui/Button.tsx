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
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.navy};
    border-color: ${({ theme }) => theme.colors.navy};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceHover};
      border-color: ${({ theme }) => theme.colors.primary};
    }
  `,
  confirm: css`
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
  min-height: 44px;
  padding: 0 18px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 15px;
  font-weight: 700;
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
