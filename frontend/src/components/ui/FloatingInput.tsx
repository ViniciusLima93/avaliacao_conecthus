import { type ComponentProps, type ReactNode, useId } from 'react';
import styled from 'styled-components';

type FloatingInputProps = Omit<ComponentProps<'input'>, 'placeholder'> & {
  label: string;
  /** Texto de apoio alinhado à direita, abaixo do campo (ex.: "• Máx. 30 Caracteres"). */
  helper?: string;
  error?: string;
  /** Conteúdo à direita dentro do campo (ex.: botão de mostrar senha). */
  endAdornment?: ReactNode;
};

/**
 * Campo preenchido do protótipo: o rótulo fica dentro do campo como placeholder
 * e sobe quando há foco ou valor, mantendo o contexto na edição.
 */
export function FloatingInput({
  label,
  helper,
  error,
  endAdornment,
  id,
  ...inputProps
}: FloatingInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const describedBy =
    [error && errorId, helper && helperId].filter(Boolean).join(' ') ||
    undefined;

  return (
    <Wrapper>
      <Control $invalid={Boolean(error)} $hasAdornment={Boolean(endAdornment)}>
        <Input
          {...inputProps}
          id={inputId}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        <Label htmlFor={inputId}>{label}</Label>
        {endAdornment && <Adornment>{endAdornment}</Adornment>}
      </Control>

      {(error || helper) && (
        <Meta>
          {error && (
            <ErrorText id={errorId} role="alert">
              {error}
            </ErrorText>
          )}
          {helper && <Helper id={helperId}>{helper}</Helper>}
        </Meta>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 12px;
  right: 12px;
  overflow: hidden;
  /* Spec (vazio): Manrope Regular 18px, #0B2B25 a 90%. */
  font-size: 18px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.placeholder};
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none;
  transform: translateY(-50%);
  transition:
    top 0.15s ease,
    font-size 0.15s ease,
    transform 0.15s ease;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 22px 12px 6px;
  border: 0;
  background: transparent;
  /* Spec (valor): Manrope Regular 18px/24px. */
  font-size: 18px;
  line-height: 24px;
  color: rgba(11, 43, 37, 0.9);

  &:focus,
  &:focus-visible {
    outline: none;
  }

  &:focus + ${Label}, &:not(:placeholder-shown) + ${Label} {
    /* Spec (preenchido): Manrope SemiBold 12px/17px, #0290A4. */
    top: 6px;
    font-size: 12px;
    line-height: 17px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    transform: none;
  }
`;

const Control = styled.div<{ $invalid: boolean; $hasAdornment: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  /* Spec: #F4F4F4 com só os cantos de cima arredondados. */
  border-radius: ${({ theme }) => theme.radii.sm}
    ${({ theme }) => theme.radii.sm} 0 0;
  background: ${({ theme }) => theme.colors.field};
  box-shadow: inset 0 -2px 0
    ${({ theme, $invalid }) => ($invalid ? theme.colors.danger : 'transparent')};
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.fieldHover};
  }

  /* Preenchido: sublinhado fino na cor primária. */
  &:has(input:not(:placeholder-shown)) {
    box-shadow: inset 0 -1px 0
      ${({ theme, $invalid }) =>
        $invalid ? theme.colors.danger : theme.colors.primary};
  }

  &:focus-within {
    box-shadow: inset 0 -2px 0
      ${({ theme, $invalid }) =>
        $invalid ? theme.colors.danger : theme.colors.primary};
  }

  ${Input} {
    padding-right: ${({ $hasAdornment }) => ($hasAdornment ? '44px' : '12px')};
  }

  ${Label} {
    right: ${({ $hasAdornment }) => ($hasAdornment ? '44px' : '12px')};
  }
`;

const Adornment = styled.div`
  position: absolute;
  top: 50%;
  right: 6px;
  display: flex;
  transform: translateY(-50%);
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 2px 12px;
  /* Spec: Manrope Medium 10px/14px. */
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
`;

const ErrorText = styled.p`
  flex: 1 1 auto;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
`;

const Helper = styled.p`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.text};
  text-align: right;
`;
