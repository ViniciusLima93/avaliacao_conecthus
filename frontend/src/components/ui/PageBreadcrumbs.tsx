import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ChevronRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router';
import { muiTheme } from '../../styles/muiTheme';

export type Crumb = {
  label: string;
  /** Rota do item; o último item (página atual) não precisa. */
  to?: string;
};

/**
 * O MUI usa o styled-components como motor (@mui/styled-engine-sc). O ThemeProvider
 * do MUI fica aqui (e não no App) para o MUI só ser baixado nas páginas que o usam;
 * ele adiciona o tema do MUI ao contexto sem sobrescrever o nosso.
 */
export function PageBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <BreadcrumbTrail items={items} />
    </MuiThemeProvider>
  );
}

function BreadcrumbTrail({ items }: { items: Crumb[] }) {
  return (
    <Breadcrumbs
      aria-label="Trilha de navegação"
      separator={<ChevronRight size={12} aria-hidden="true" />}
      sx={{
        // Spec: Manrope Medium 10px/14px, #0B2B25.
        fontSize: 10,
        fontWeight: 500,
        lineHeight: '14px',
        color: 'text.primary',
        '& .MuiBreadcrumbs-separator': { mx: 0.5 },
      }}
    >
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;
        return isCurrent || !item.to ? (
          <Typography
            key={item.label}
            aria-current={isCurrent ? 'page' : undefined}
            sx={{ fontSize: 'inherit', color: 'text.primary' }}
          >
            {item.label}
          </Typography>
        ) : (
          <MuiLink
            key={item.label}
            component={RouterLink}
            to={item.to}
            underline="hover"
            color="inherit"
            sx={{ fontSize: 'inherit' }}
          >
            {item.label}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
}
