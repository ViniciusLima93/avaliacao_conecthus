import { createTheme } from '@mui/material/styles';
import { theme } from './theme';

/** Tema do Material UI alinhado ao tema do styled-components. */
export const muiTheme = createTheme({
  typography: {
    fontFamily: theme.fonts.body,
  },
  palette: {
    primary: { main: theme.colors.primary },
    text: {
      primary: theme.colors.heading,
      secondary: theme.colors.textMuted,
    },
  },
});
