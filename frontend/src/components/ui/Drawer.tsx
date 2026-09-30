import { X } from 'lucide-react';
import { type ReactNode, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { useDialogBehavior } from '../../hooks/useDialogBehavior';
import { blurredBackdrop } from '../../styles/mixins';
import { media } from '../../styles/theme';

type DrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

/** Painel lateral à direita: tela cheia no mobile, 450px a partir de `md`. */
export function Drawer({
  open,
  title,
  onClose,
  children,
  footer,
}: DrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehavior(open, onClose, panelRef);

  if (!open) return null;

  return createPortal(
    <Overlay onMouseDown={onClose}>
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <Title id={titleId}>{title}</Title>
          <CloseButton type="button" aria-label="Fechar" onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </Panel>
    </Overlay>,
    document.body,
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  justify-content: flex-end;
  ${blurredBackdrop}
  animation: ${fadeIn} 0.15s ease;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  outline: none;
  animation: ${slideIn} 0.25s ease;

  ${media.md} {
    width: 450px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 16px 0 24px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
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

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 16px 24px;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  padding: 16px 24px 16px;

  button {
    min-width: 110px;
  }
`;
