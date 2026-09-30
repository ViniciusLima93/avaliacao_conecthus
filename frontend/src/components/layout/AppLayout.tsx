import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import styled from 'styled-components';
import { media } from '../../styles/theme';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const COLLAPSED_KEY = 'wenlock:sidebar-collapsed';

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Fecha a gaveta do mobile ao navegar para outra página.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSED_KEY, String(collapsed));
    } catch {
      // armazenamento indisponível: a preferência só não é lembrada
    }
  }, [collapsed]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  return (
    <Shell $collapsed={collapsed}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <Column>
        <Header menuOpen={mobileOpen} onOpenMenu={() => setMobileOpen(true)} />
        <Main>
          <Outlet />
        </Main>
      </Column>
    </Shell>
  );
}

const Shell = styled.div<{ $collapsed: boolean }>`
  min-height: 100dvh;

  ${media.lg} {
    padding-left: ${({ theme, $collapsed }) =>
      $collapsed
        ? theme.layout.sidebarCollapsedWidth
        : theme.layout.sidebarWidth};
    transition: padding-left 0.2s ease;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px 16px 24px;

  ${media.md} {
    padding: 24px 24px 32px;
  }

  ${media.lg} {
    padding: 24px 32px 32px;
  }
`;
