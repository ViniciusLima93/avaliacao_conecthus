import styled from 'styled-components';
import { media } from '../../styles/theme';

export const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 20px 16px;

  ${media.md} {
    padding: 24px;
  }
`;
