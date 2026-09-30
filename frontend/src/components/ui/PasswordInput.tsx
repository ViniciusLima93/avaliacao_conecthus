import { Eye, EyeOff } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import styled from 'styled-components';
import { FloatingInput } from './FloatingInput';

type PasswordInputProps = Omit<
  ComponentProps<typeof FloatingInput>,
  'type' | 'endAdornment'
>;

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FloatingInput
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <Toggle
          type="button"
          aria-label={
            visible ? `Ocultar ${props.label}` : `Mostrar ${props.label}`
          }
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </Toggle>
      }
    />
  );
}

const Toggle = styled.button`
  display: inline-flex;
  padding: 6px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.placeholder};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
