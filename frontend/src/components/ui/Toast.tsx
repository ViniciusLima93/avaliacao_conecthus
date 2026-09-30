import { Check, CircleAlert, X } from 'lucide-react';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { media } from '../../styles/theme';

type ToastType = 'success' | 'error';

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, message: string) => {
      const id = nextId++;
      setToasts((current) => [...current, { id, type, message }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      success: (message: string) => show('success', message),
      error: (message: string) => show('error', message),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Region aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <Item key={toast.id} $type={toast.type} role="status">
            {toast.type === 'success' ? (
              <Check size={24} strokeWidth={3} aria-hidden="true" />
            ) : (
              <CircleAlert size={24} strokeWidth={2.5} aria-hidden="true" />
            )}
            <span>{toast.message}</span>
            <Dismiss
              type="button"
              aria-label="Fechar notificação"
              onClick={() => dismiss(toast.id)}
            >
              <X size={26} strokeWidth={2.5} />
            </Dismiss>
          </Item>
        ))}
      </Region>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  }
  return context;
}

const slideIn = keyframes`
  from { transform: translateY(-12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

/**
 * Snackbars logo abaixo do cabeçalho, na altura do título da página e do lado
 * oposto a ele (direita). No mobile ocupam a largura toda.
 */
const Region = styled.div`
  position: fixed;
  top: calc(${({ theme }) => theme.layout.headerHeight} + 12px);
  left: 16px;
  right: 16px;
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;

  ${media.md} {
    left: auto;
    right: 24px;
    width: 360px;
  }

  ${media.lg} {
    right: 32px;
  }
`;

/** Snackbar preenchido do protótipo: fundo sólido, ícone, texto e "X" em branco. */
const Item = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 10px 12px 10px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $type }) =>
    $type === 'success' ? theme.colors.snackbarSuccess : theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
  font-size: 16px;
  font-weight: 600;
  pointer-events: auto;
  animation: ${slideIn} 0.2s ease;

  > svg {
    flex-shrink: 0;
  }

  > span {
    flex: 1;
  }
`;

const Dismiss = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  padding: 2px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: inherit;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }

  &:focus-visible {
    outline-color: ${({ theme }) => theme.colors.white};
  }
`;
