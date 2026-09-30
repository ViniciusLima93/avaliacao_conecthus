import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useId } from 'react';
import styled, { css } from 'styled-components';
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

/** Janela de páginas visíveis centrada na atual (ex.: 3 4 [5] 6 7). */
function visiblePages(page: number, totalPages: number, size = 5): number[] {
  const half = Math.floor(size / 2);
  const start = Math.max(1, Math.min(page - half, totalPages - size + 1));
  const end = Math.min(totalPages, start + size - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

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
            {pageSizeOptions.map((option) => (
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
            <ChevronFirst size={16} />
          </NavButton>
          <NavButton
            aria-label="Página anterior"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={16} />
          </NavButton>

          {visiblePages(page, lastPage).map((number) => (
            <PageButton
              key={number}
              $active={number === page}
              aria-current={number === page ? 'page' : undefined}
              aria-label={`Página ${number}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </PageButton>
          ))}

          <NavButton
            aria-label="Próxima página"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={16} />
          </NavButton>
          <NavButton
            aria-label="Última página"
            disabled={isLast}
            onClick={() => onPageChange(lastPage)}
          >
            <ChevronLast size={16} />
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
  font-size: 12px;
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
  gap: 12px;

  ${media.md} {
    justify-content: flex-end;
    gap: 24px;
  }
`;

const PageSize = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  select {
    min-height: 32px;
    padding: 0 6px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.sm};
    background: ${({ theme }) => theme.colors.surface};
    font-weight: 700;
  }
`;

const Pages = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const baseButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.heading};
  font-weight: 600;
`;

const NavButton = styled.button.attrs({ type: 'button' })`
  ${baseButton}

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.border};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const PageButton = styled.button.attrs({ type: 'button' })<{
  $active: boolean;
}>`
  ${baseButton}

  /* No mobile, mostra apenas a página atual para caber na tela. */
  display: ${({ $active }) => ($active ? 'inline-flex' : 'none')};

  ${media.sm} {
    display: inline-flex;
  }

  ${({ $active, theme }) =>
    $active
      ? css`
          min-width: 36px;
          height: 36px;
          background: ${theme.colors.primaryDark};
          color: ${theme.colors.white};
        `
      : css`
          &:hover {
            background: ${theme.colors.border};
          }
        `}
`;

const OfTotal = styled.span`
  margin-left: 4px;
  font-weight: 700;
`;
