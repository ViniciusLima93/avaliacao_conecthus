import { Menu } from 'lucide-react';
import styled from 'styled-components';
import { media } from '../../styles/theme';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

type HeaderProps = {
  menuOpen: boolean;
  onOpenMenu: () => void;
};

export function Header({ menuOpen, onOpenMenu }: HeaderProps) {
  return (
    <Bar>
      <Left>
        <MenuButton
          type="button"
          aria-label="Abrir menu"
          aria-controls="sidebar"
          aria-expanded={menuOpen}
          onClick={onOpenMenu}
        >
          <Menu size={24} />
        </MenuButton>
        <MobileLogo>
          <Logo />
        </MobileLogo>
      </Left>

      <UserMenu />
    </Bar>
  );
}

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.layout.headerHeight};
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 2px 4px rgba(12, 26, 51, 0.06);

  ${media.lg} {
    justify-content: flex-end;
    padding: 0 40px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${media.lg} {
    display: none;
  }
`;

const MenuButton = styled.button`
  display: inline-flex;
  padding: 8px;
  margin-left: -8px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.navy};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

/* A logo branca precisa de fundo escuro no cabeçalho claro do mobile. */
const MobileLogo = styled.span`
  display: inline-flex;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.navy};

  > span {
    font-size: 22px;
  }
`;
