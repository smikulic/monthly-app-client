import { useMediaQuery } from "@mui/material";
import { useTheme } from "./useTheme";

export const useResponsive = () => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"));
  const isTablet = useMediaQuery(breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(breakpoints.up("md"));

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};
