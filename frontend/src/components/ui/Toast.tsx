import { Check, CircleAlert, TriangleAlert, X } from 'lucide-react';
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

type ToastType = 'success' | 'warning' | 'error';

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  success: (message: string) => void;
  /** Aviso (laranja), ex.: "Cadastro cancelado". */
  warning: (message: string) => void;
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
      warning: (message: string) => show('warning', message),
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
            <ToastIcon type={toast.type} />
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

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success') {
    return <Check size={24} strokeWidth={3} aria-hidden="true" />;
  }
  if (type === 'warning') {
    return <TriangleAlert size={24} strokeWidth={2.5} aria-hidden="true" />;
  }
  return <CircleAlert size={24} strokeWidth={2.5} aria-hidden="true" />;
}

/** Spec: sucesso #00C857, aviso #FF7700. */
const backgrounds = {
  success: 'snackbarSuccess',
  warning: 'snackbarWarning',
  error: 'danger',
} as const;

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  }
  return context;
}

const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

/**
 * Snackbars logo abaixo do cabeçalho, na altura do título da página e do lado
 * oposto a ele (direita). No mobile ocupam a largura toda.
 */
const Region = styled.div`
  position: fixed;
  top: calc(${({ theme }) => theme.layout.headerHeight} + 8px);
  left: 16px;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;

  /* Spec: 329px, colado à borda direita da tela. */
  ${media.md} {
    left: auto;
    width: 329px;
  }
`;

/** Snackbar preenchido do protótipo: fundo sólido, ícone, texto e "X" em branco. */
const Item = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 8px 12px 8px 16px;
  /* Spec: #00C857, só os cantos da esquerda arredondados (6px). */
  border-radius: ${({ theme }) => theme.radii.md} 0 0
    ${({ theme }) => theme.radii.md};
  background: ${({ theme, $type }) => theme.colors[backgrounds[$type]]};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
  /* Spec: Manrope Bold 16px. */
  font-size: 16px;
  font-weight: 700;
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
