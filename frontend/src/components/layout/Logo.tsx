import styled from 'styled-components';

export function Logo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Compact aria-label="WenLock">
        <Accent>W</Accent>L
        <CompactDot aria-hidden="true" />
      </Compact>
    );
  }

  return (
    <Wordmark aria-label="WenLock">
      <Accent>Wen</Accent>
      Lock
      <Dot aria-hidden="true" />
    </Wordmark>
  );
}

const Wordmark = styled.span`
  display: inline-flex;
  align-items: baseline;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.white};
`;

const Accent = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`;

const Dot = styled.span`
  width: 0.26em;
  height: 0.26em;
  margin-left: 0.12em;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
`;

/* "WL" com o ponto abaixo do L, como no menu recolhido do protótipo. */
const Compact = styled.span`
  position: relative;
  display: inline-flex;
  padding-bottom: 12px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.white};
`;

const CompactDot = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
`;
