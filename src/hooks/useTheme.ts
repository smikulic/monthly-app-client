import { useTheme as useMuiTheme } from "@mui/material/styles";

export const useTheme = () => {
  const theme = useMuiTheme();

  return {
    palette: theme.palette,
    breakpoints: theme.breakpoints,
    spacing: theme.spacing,
    typography: theme.typography,
  };
};
