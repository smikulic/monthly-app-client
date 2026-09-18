import { useTheme as useMuiTheme } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

export const useTheme = () => {
  const theme = useMuiTheme();

  return {
    palette: theme.palette,
    breakpoints: theme.breakpoints,
    spacing: theme.spacing,
    typography: theme.typography,
    /**
     * Raw tokens, for the things MUI's palette cannot carry: the serif stack
     * for hero figures, the radius scale, and echarts options (which need
     * parseable values, not CSS custom properties).
     */
    tokens,
  };
};
