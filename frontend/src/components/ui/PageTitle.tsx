import styled from 'styled-components';
import { media } from '../../styles/theme';

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.heading};
  margin-bottom: 16px;

  ${media.md} {
    font-size: 28px;
  }
`;
