import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useId } from 'react';
import styled from 'styled-components';
import { media } from '../../styles/theme';

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

/**
 * Paginação do protótipo: "Itens por página 15  |<  <  [1]  >  >|  de 10".
 * Mostra só a página atual, em destaque, entre os botões de navegação.
 */
export function Pagination({
  page,
  totalPages,
  total,
  limit,
  pageSizeOptions = [5, 10, 15, 20, 50],
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const selectId = useId();
  const lastPage = Math.max(totalPages, 1);
  const isFirst = page <= 1;
  const isLast = page >= lastPage;
  // Garante que o valor atual (ex.: vindo da URL) apareça entre as opções.
  const sizes = [...new Set([...pageSizeOptions, limit])].sort((a, b) => a - b);

  return (
    <Wrapper aria-label="Paginação">
      <Total>
        Total de itens <strong>{total}</strong>
      </Total>

      <Controls>
        <PageSize htmlFor={selectId}>
          Itens por página
          <select
            id={selectId}
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
          >
            {sizes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </PageSize>

        <Pages>
          <NavButton
            aria-label="Primeira página"
            disabled={isFirst}
            onClick={() => onPageChange(1)}
          >
            <ChevronFirst size={20} />
          </NavButton>
          <NavButton
            aria-label="Página anterior"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={20} />
          </NavButton>

          <CurrentPage aria-current="page" aria-label={`Página ${page}`}>
            {page}
          </CurrentPage>

          <NavButton
            aria-label="Próxima página"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={20} />
          </NavButton>
          <NavButton
            aria-label="Última página"
            disabled={isLast}
            onClick={() => onPageChange(lastPage)}
          >
            <ChevronLast size={20} />
          </NavButton>
          <OfTotal>de {lastPage}</OfTotal>
        </Pages>
      </Controls>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  /* Spec: Manrope Medium 14px/19px, #0B2B25. */
  font-size: 14px;
  font-weight: 500;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.heading};

  ${media.md} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Total = styled.p`
  strong {
    font-weight: 700;
    margin-left: 2px;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;

  ${media.md} {
    justify-content: flex-end;
    gap: 32px;
  }
`;

/* O "15" aparece como texto em negrito, mas continua sendo um select nativo. */
const PageSize = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 12px;

  select {
    appearance: none;
    padding: 2px 4px;
    border: 0;
    border-radius: ${({ theme }) => theme.radii.sm};
    background: transparent;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.heading};
    cursor: pointer;

    &:hover {
      background: rgba(11, 43, 37, 0.06);
    }
  }
`;

const Pages = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${media.sm} {
    gap: 12px;
  }
`;

const NavButton = styled.button.attrs({ type: 'button' })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.card};
  background: transparent;
  color: ${({ theme }) => theme.colors.heading};

  &:hover:not(:disabled) {
    background: rgba(11, 43, 37, 0.06);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

/* Spec: quadrado #0290A4, raio de 5px, número em Satoshi Bold 14px branco. */
const CurrentPage = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.accent};
  font-size: 14px;
  font-weight: 700;
`;

const OfTotal = styled.span`
  font-weight: 700;
  white-space: nowrap;
`;
