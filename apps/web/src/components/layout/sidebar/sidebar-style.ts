import { styled } from "@mui/material/styles";

// App shell: sidebar + main content side by side on desktop; main only on mobile.
export const AppShellStyled = styled("div")({
  display: "flex",
  alignItems: "flex-start",
});

// Hidden on mobile (keeps the existing hub-and-spoke); sticky column on desktop.
export const SidebarStyled = styled("nav")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
    width: 240,
    flexShrink: 0,
    padding: theme.spacing(2),
    position: "sticky",
    top: theme.spacing(2),
  },
}));

export const MainContentStyled = styled("div")(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  [theme.breakpoints.up("md")]: {
    maxWidth: 960,
  },
}));

type SidebarItemProps = { active?: boolean };

export const SidebarItemStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})<SidebarItemProps>(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  color: active
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  background: active ? theme.palette.primary.main : "transparent",
  fontWeight: active ? 600 : 500,

  "&:hover": {
    background: active
      ? theme.palette.primary.main
      : theme.palette.action.hover,
  },
}));

export const SidebarLabelStyled = styled("span")({
  fontSize: "15px",
});
