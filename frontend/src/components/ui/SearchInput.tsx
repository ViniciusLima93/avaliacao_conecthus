import { Search, X } from 'lucide-react';
import styled from 'styled-components';
import { media } from '../../styles/theme';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = 'Pesquisa',
  label = 'Pesquisar',
}: SearchInputProps) {
  return (
    <Wrapper>
      <Search size={18} aria-hidden="true" />
      <Input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <ClearButton
          type="button"
          aria-label="Limpar pesquisa"
          onClick={() => onChange('')}
        >
          <X size={16} />
        </ClearButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  color: ${({ theme }) => theme.colors.heading};
  cursor: text;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${media.md} {
    max-width: 280px;
  }
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 14px;

  /* O foco é indicado pela borda do wrapper (:focus-within). */
  &:focus-visible {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.heading};
    opacity: 0.8;
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
`;

const ClearButton = styled.button`
  display: inline-flex;
  padding: 4px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.full};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;
