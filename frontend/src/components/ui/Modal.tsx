import { X } from 'lucide-react';
import { type ReactNode, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { useDialogBehavior } from '../../hooks/useDialogBehavior';
import { blurredBackdrop } from '../../styles/mixins';
import { media } from '../../styles/theme';

type ModalVariant = 'default' | 'alert';

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md';
  /**
   * `default`: bottom sheet no mobile e diálogo centralizado a partir de `md`.
   * `alert`: confirmação compacta e centralizada em qualquer tela, sem "X",
   * com o fundo desfocado.
   */
  variant?: ModalVariant;
};

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
  variant = 'default',
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const isAlert = variant === 'alert';
  useDialogBehavior(open, onClose, panelRef);

  if (!open) return null;

  return createPortal(
    <Overlay $variant={variant} onMouseDown={onClose}>
      <Panel
        ref={panelRef}
        role={isAlert ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        $size={size}
        $variant={variant}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header $variant={variant}>
          <Title id={titleId} $variant={variant}>
            {title}
          </Title>
          {!isAlert && (
            <CloseButton type="button" aria-label="Fechar" onClick={onClose}>
              <X size={20} />
            </CloseButton>
          )}
        </Header>
        <Body $variant={variant}>{children}</Body>
        {footer && <Footer $variant={variant}>{footer}</Footer>}
      </Panel>
    </Overlay>,
    document.body,
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const popIn = keyframes`
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

type VariantProps = { $variant: ModalVariant };

const Overlay = styled.div<VariantProps>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(12, 26, 51, 0.55);
  animation: ${fadeIn} 0.15s ease;

  ${media.md} {
    align-items: center;
    padding: 24px;
  }

  ${({ $variant }) =>
    $variant === 'alert' &&
    css`
      align-items: center;
      padding: 16px;
      ${blurredBackdrop}
    `}
`;

const Panel = styled.div<VariantProps & { $size: 'sm' | 'md' }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 90dvh;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg}
    ${({ theme }) => theme.radii.lg} 0 0;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  outline: none;
  animation: ${slideUp} 0.2s ease;

  ${media.md} {
    max-width: ${({ $size }) => ($size === 'sm' ? '420px' : '560px')};
    border-radius: ${({ theme }) => theme.radii.lg};
  }

  ${({ $variant, theme }) =>
    $variant === 'alert' &&
    css`
      max-width: 350px;
      padding: 28px 24px 20px;
      border-radius: ${theme.radii.sm};
      box-shadow: ${theme.shadows.md};
      text-align: center;
      animation: ${popIn} 0.15s ease;

      ${media.md} {
        max-width: 350px;
        border-radius: ${theme.radii.sm};
      }
    `}
`;

const Header = styled.header<VariantProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 16px 0;

  ${media.md} {
    padding: 24px 24px 0;
  }

  ${({ $variant }) =>
    $variant === 'alert' &&
    css`
      && {
        justify-content: center;
        padding: 0;
      }
    `}
`;

const Title = styled.h2<VariantProps>`
  /* Spec (alerta): Manrope Bold 26px (H4). */
  font-size: ${({ $variant }) => ($variant === 'alert' ? '26px' : '18px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.heading};
`;

const CloseButton = styled.button`
  display: inline-flex;
  padding: 6px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.full};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const Body = styled.div<VariantProps>`
  overflow-y: auto;
  padding: 16px;

  ${media.md} {
    padding: 20px 24px;
  }

  ${({ $variant, theme }) =>
    $variant === 'alert' &&
    css`
      && {
        padding: 12px 0 0;
        /* Spec: Manrope Medium 18px/24px (B1). */
        font-size: 18px;
        font-weight: 500;
        line-height: 24px;
        color: ${theme.colors.heading};
      }
    `}
`;

const Footer = styled.footer<VariantProps>`
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  padding: 0 16px 16px;

  ${media.sm} {
    flex-direction: row;
    justify-content: flex-end;
  }

  ${media.md} {
    padding: 0 24px 24px;
  }

  ${({ $variant }) =>
    $variant === 'alert' &&
    css`
      && {
        flex-direction: row;
        justify-content: center;
        gap: 6px;
        padding: 30px 0 0;
      }

      button {
        min-width: 92px;
      }
    `}
`;
