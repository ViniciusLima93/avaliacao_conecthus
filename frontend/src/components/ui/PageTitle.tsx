import styled from 'styled-components';
import { media } from '../../styles/theme';

export const PageTitle = styled.h1`
  /* Spec (H3): Manrope Bold 38px/52px no desktop; menor no mobile. */
  font-size: 26px;
  font-weight: 700;
  line-height: 1.37;
  color: ${({ theme }) => theme.colors.heading};
  margin-bottom: 16px;

  ${media.md} {
    font-size: 32px;
  }

  ${media.lg} {
    font-size: 38px;
  }
`;
