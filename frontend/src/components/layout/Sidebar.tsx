import {
  ChartPie,
  ChevronDown,
  ChevronLeft,
  IdCardLanyard,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router';
import styled, { css } from 'styled-components';
import { media } from '../../styles/theme';
import { Logo } from './Logo';

type SidebarProps = {
  /** Desktop: menu recolhido mostrando só os ícones. */
  collapsed: boolean;
  /** Mobile: gaveta aberta sobre o conteúdo. */
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarProps) {
  const [accessOpen, setAccessOpen] = useState(true);

  return (
    <>
      <Backdrop
        $visible={mobileOpen}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <Aside
        id="sidebar"
        $collapsed={collapsed}
        $mobileOpen={mobileOpen}
        aria-label="Menu principal"
      >
        <Top $collapsed={collapsed}>
          <NavLink to="/" aria-label="WenLock — página inicial">
            <DesktopOnly $show={collapsed}>
              <Logo compact />
            </DesktopOnly>
            <FullLogo $collapsed={collapsed}>
              <Logo />
            </FullLogo>
          </NavLink>

          <CloseMobile
            type="button"
            aria-label="Fechar menu"
            onClick={onCloseMobile}
          >
            <X size={22} />
          </CloseMobile>

          <CollapseToggle
            type="button"
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            aria-controls="sidebar"
            aria-expanded={!collapsed}
            onClick={onToggleCollapsed}
            $collapsed={collapsed}
          >
            <ChevronLeft size={16} />
          </CollapseToggle>
        </Top>

        <Nav>
          <MenuLink
            to="/"
            end
            title={collapsed ? 'Home' : undefined}
            $collapsed={collapsed}
          >
            <ChartPie size={20} aria-hidden="true" />
            <Label $collapsed={collapsed}>Home</Label>
          </MenuLink>

          {/* Menu expandido (e gaveta do mobile): grupo com submenu. */}
          <GroupButton
            type="button"
            aria-expanded={accessOpen}
            aria-controls="menu-controle-acesso"
            onClick={() => setAccessOpen((open) => !open)}
            $collapsed={collapsed}
          >
            <IdCardLanyard size={20} aria-hidden="true" />
            <Label $collapsed={collapsed}>Controle de Acesso</Label>
            <Caret $open={accessOpen}>
              <ChevronDown size={16} aria-hidden="true" />
            </Caret>
          </GroupButton>

          {accessOpen && (
            <SubMenu id="menu-controle-acesso" $collapsed={collapsed}>
              <SubLink to="/usuarios" $collapsed={collapsed}>
                <User size={18} aria-hidden="true" />
                <Label $collapsed={collapsed}>Usuários</Label>
              </SubLink>
            </SubMenu>
          )}

          {/* Menu recolhido (desktop): só o ícone do grupo, levando a Usuários. */}
          <CollapsedGroupLink
            to="/usuarios"
            title="Controle de Acesso — Usuários"
            aria-label="Controle de Acesso — Usuários"
            $collapsed={collapsed}
          >
            <IdCardLanyard size={20} aria-hidden="true" />
          </CollapsedGroupLink>
        </Nav>

        <Footer $collapsed={collapsed}>
          <FullFooter $collapsed={collapsed}>
            <strong>© WenLock</strong>
            <small>Power by Conecthus</small>
          </FullFooter>
          <small>V 0.0.0</small>
        </Footer>
      </Aside>
    </>
  );
}

/* ---------- estilos ---------- */

const Backdrop = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  background: rgba(12, 26, 51, 0.5);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transition: opacity 0.2s ease;

  ${media.lg} {
    display: none;
  }
`;

const Aside = styled.aside<{ $collapsed: boolean; $mobileOpen: boolean }>`
  position: fixed;
  inset: 0 auto 0 0;
  z-index: ${({ theme }) => theme.zIndex.sidebar};
  display: flex;
  flex-direction: column;
  width: min(${({ theme }) => theme.layout.sidebarWidth}, 85vw);
  padding: 24px 12px 20px;
  background: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? '0' : '-100%')});
  transition:
    transform 0.25s ease,
    width 0.2s ease;

  ${media.lg} {
    transform: none;
    width: ${({ theme, $collapsed }) =>
      $collapsed
        ? theme.layout.sidebarCollapsedWidth
        : theme.layout.sidebarWidth};
  }
`;

const Top = styled.div<{ $collapsed: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: 0 8px;
  margin-bottom: 40px;

  ${media.lg} {
    justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
    padding: 0 ${({ $collapsed }) => ($collapsed ? '0' : '8px')};
  }
`;

const DesktopOnly = styled.span<{ $show: boolean }>`
  display: none;

  ${media.lg} {
    display: ${({ $show }) => ($show ? 'inline-flex' : 'none')};
  }
`;

const FullLogo = styled.span<{ $collapsed: boolean }>`
  display: inline-flex;

  ${media.lg} {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline-flex')};
  }
`;

const CloseMobile = styled.button`
  display: inline-flex;
  padding: 6px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.full};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};

  ${media.lg} {
    display: none;
  }
`;

const CollapseToggle = styled.button<{ $collapsed: boolean }>`
  display: none;

  ${media.lg} {
    position: absolute;
    top: 50%;
    right: -26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.navy};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-50%)
      rotate(${({ $collapsed }) => ($collapsed ? '180deg' : '0')});
    transition: transform 0.2s ease;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
`;

const itemBase = css<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.navyLight};
  }

  /* Recolhido: quadrado de 44x40 centralizado, só com o ícone. */
  ${media.lg} {
    ${({ $collapsed }) =>
      $collapsed &&
      css`
        justify-content: center;
        width: 44px;
        min-height: 40px;
        margin: 0 auto;
        padding: 0;
        border-radius: ${({ theme }) => theme.radii.sm};
      `}
  }
`;

/* Item ativo: fundo verde-azulado; recolhido, o ícone fica escuro como no protótipo. */
const activeItem = css<{ $collapsed: boolean }>`
  &.active {
    background: ${({ theme }) => theme.colors.primary};
    font-weight: 700;

    ${media.lg} {
      ${({ $collapsed, theme }) =>
        $collapsed &&
        css`
          color: ${theme.colors.navy};
        `}
    }
  }
`;

const MenuLink = styled(NavLink)<{ $collapsed: boolean }>`
  ${itemBase}
  ${activeItem}
`;

const GroupButton = styled.button<{ $collapsed: boolean }>`
  ${itemBase}
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;

  ${media.lg} {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
  }
`;

/** Só aparece com o menu recolhido no desktop. */
const CollapsedGroupLink = styled(NavLink)<{ $collapsed: boolean }>`
  ${itemBase}
  ${activeItem}
  display: none;

  ${media.lg} {
    display: ${({ $collapsed }) => ($collapsed ? 'flex' : 'none')};
  }
`;

const Label = styled.span<{ $collapsed: boolean }>`
  flex: 1;
  white-space: nowrap;

  ${media.lg} {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  }
`;

const Caret = styled.span<{ $open: boolean }>`
  display: inline-flex;
  transform: rotate(${({ $open }) => ($open ? '0' : '-90deg')});
  transition: transform 0.15s ease;
`;

const SubMenu = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 24px;

  ${media.lg} {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
  }
`;

const SubLink = styled(NavLink)<{ $collapsed: boolean }>`
  ${itemBase}
  ${activeItem}
  min-height: 36px;
  font-size: 13px;
`;

const Footer = styled.footer<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 16px 8px 0;

  small {
    font-size: 10px;
    opacity: 0.75;
  }

  ${media.lg} {
    align-items: ${({ $collapsed }) => ($collapsed ? 'center' : 'stretch')};
    padding: 16px ${({ $collapsed }) => ($collapsed ? '0' : '8px')} 0;
  }
`;

const FullFooter = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 14px;
  }

  ${media.lg} {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
  }
`;
