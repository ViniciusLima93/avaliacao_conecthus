import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { currentUser, getInitials } from '../../config/session';

/** Avatar do cabeçalho que abre o menu de perfil (nome, e-mail e "Sair"). */
export function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logoutRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const initials = getInitials(currentUser.name);

  useEffect(() => {
    if (!open) return;
    logoutRef.current?.focus();

    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  // Sem autenticação por enquanto: "Sair" só volta para a Home.
  // Quando houver login, encerre a sessão aqui (limpar token, redirecionar ao login).
  const handleLogout = () => {
    setOpen(false);
    navigate('/');
  };

  return (
    <Wrapper ref={wrapperRef}>
      <Trigger
        ref={triggerRef}
        type="button"
        aria-label={`Menu do perfil de ${currentUser.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar $size={40}>{initials}</Avatar>
        <Badge aria-hidden="true">
          {open ? (
            <ChevronDown size={10} strokeWidth={3} />
          ) : (
            <ChevronUp size={10} strokeWidth={3} />
          )}
        </Badge>
      </Trigger>

      {open && (
        <Menu id={menuId} role="menu" aria-label="Perfil">
          <Profile>
            <Avatar $size={44} aria-hidden="true">
              {initials}
            </Avatar>
            <Identity>
              <Name>{currentUser.name}</Name>
              <Email>{currentUser.email}</Email>
            </Identity>
          </Profile>
          <MenuItem
            ref={logoutRef}
            type="button"
            role="menuitem"
            onClick={handleLogout}
          >
            <LogOut size={20} aria-hidden="true" />
            Sair
          </MenuItem>
        </Menu>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const Trigger = styled.button`
  position: relative;
  display: inline-flex;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
`;

const Avatar = styled.span<{ $size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.heading};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ $size }) => Math.round($size * 0.38)}px;
  font-weight: 600;
  user-select: none;
`;

const Badge = styled.span`
  position: absolute;
  right: -3px;
  bottom: -3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.navy};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.header + 1};
  width: max-content;
  min-width: 260px;
  max-width: calc(100vw - 32px);
  padding: 16px 12px 8px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px 12px;

  ${Avatar} {
    border: 0;
  }
`;

const Identity = styled.div`
  min-width: 0;
`;

const Name = styled.p`
  overflow: hidden;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryHover};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Email = styled.p`
  overflow: hidden;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.heading};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 0 8px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.heading};
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;
