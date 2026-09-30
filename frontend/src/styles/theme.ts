export const theme = {
  colors: {
    navy: '#0c1a33',
    navyLight: '#1b2b4b',
    primary: '#00a3bf',
    primaryHover: '#008ba3',
    primaryDark: '#0a6f7f',
    heading: '#0b2e2a',
    text: '#1f2a37',
    textMuted: '#5b6573',
    background: '#f2f2f2',
    surface: '#ffffff',
    surfaceHover: '#f7f9fa',
    border: '#dfe3e8',
    field: '#f0f0f0',
    fieldHover: '#e8e8e8',
    placeholder: '#4b5563',
    disabled: '#e4e4e4',
    disabledText: '#9a9a9a',
    danger: '#d93f3f',
    dangerHover: '#b83232',
    dangerSoft: '#fdecec',
    success: '#1e9e6a',
    successSoft: '#e6f6ef',
    snackbarSuccess: '#22c55e',
    confirm: '#277c85',
    confirmHover: '#1f666d',
    white: '#ffffff',
  },
  fonts: {
    body: "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(12, 26, 51, 0.08)',
    md: '0 4px 12px rgba(12, 26, 51, 0.1)',
    lg: '0 16px 40px rgba(12, 26, 51, 0.2)',
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
