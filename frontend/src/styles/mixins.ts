import { css } from 'styled-components';

/** Fundo dos diálogos do protótipo: página desfocada com um véu bem leve. */
export const blurredBackdrop = css`
  background: rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

/** Título de seção com linha até o fim ("Dados do Usuário ————"). */
export const sectionTitle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  /* Spec: Manrope Bold 14px/19px. */
  font-size: 14px;
  line-height: 19px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.heading};

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.textMuted};
  }
`;
