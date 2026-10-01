/**
 * Tokens de design extraídos da spec do Adobe XD (WENLOCK TEST).
 * Os comentários indicam o nome da cor/estilo na spec quando existe.
 */
export const theme = {
  colors: {
    /** Menu lateral, cabeçalho da tabela, saudação da Home. */
    navy: '#0D1931',
    navyLight: '#1B2A47',
    /** "Verde escuro 3": títulos e textos. */
    heading: '#0B2B25',
    text: '#0B2B25',
    /** "Verde escuro 2 para texto título": placeholder da pesquisa. */
    textSecondary: '#0A453A',
    /** "Cinza": textos desabilitados e secundários. */
    textMuted: '#6F7D7D',
    /** Botões, paginação ativa, rótulo flutuante e foco. */
    primary: '#0290A4',
    primaryHover: '#027D8F',
    primaryDark: '#0290A4',
    /** Item ativo do menu, logo e anel do avatar. */
    accent: '#00AAC1',
    background: '#F3F3F3',
    surface: '#FFFFFF',
    surfaceHover: '#F8F9F9',
    border: '#DFE3E8',
    inputBorder: '#86868645',
    field: '#F4F4F4',
    fieldHover: '#ECECEC',
    placeholder: 'rgba(11, 43, 37, 0.9)',
    disabled: '#E2E2E2',
    disabledText: '#6F7D7D',
    /** Rodapé do menu ("Power by Conecthus"). */
    footerText: '#AACBC4',
    /** Fundo do avatar. */
    avatar: '#032221',
    /** Hover/foco de item de menu (ex.: "Sair"): #0290A4 a 18% sobre branco. */
    menuItemActive: '#D1EBEF',
    /** Borda da caixa "Bem-vindo ao WenLock!". */
    outline: '#272846',
    danger: '#D93F3F',
    dangerHover: '#B83232',
    dangerSoft: '#FDECEC',
    success: '#00C857',
    successSoft: '#E6F9EE',
    /** "Alertas green light": snackbar de sucesso. */
    snackbarSuccess: '#00C857',
    /** Snackbar de aviso (ex.: "Cadastro cancelado"). */
    snackbarWarning: '#FF7700',
    confirm: '#0290A4',
    confirmHover: '#027D8F',
    white: '#FFFFFF',
  },
  fonts: {
    body: "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif",
    /** Usada pontualmente na spec (botão "Sim", página ativa, iniciais do avatar). */
    accent: "'Satoshi', 'Manrope', system-ui, sans-serif",
  },
  radii: {
    sm: '4px',
    card: '5px',
    md: '6px',
    search: '7px',
    lg: '8px',
    full: '999px',
  },
  shadows: {
    /** Card e linhas da tabela. */
    sm: '0 1px 4px #00000029',
    md: '0 3px 6px #00000029',
    lg: '0 16px 40px rgba(13, 25, 49, 0.2)',
    header: '0 3px 5px #15223214',
    sidebar: '7px 0 6px #0000002C',
    search: '0 3px 5px #00000029',
  },
  layout: {
    sidebarWidth: '248px',
    sidebarCollapsedWidth: '76px',
    headerHeight: '64px',
  },
  zIndex: {
    header: 10,
    overlay: 40,
    sidebar: 50,
    modal: 60,
    toast: 70,
  },
} as const;

export type Theme = typeof theme;

/** Breakpoints mobile-first: cada um aplica estilos a partir da largura indicada. */
export const media = {
  sm: '@media (min-width: 480px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1280px)',
} as const;
