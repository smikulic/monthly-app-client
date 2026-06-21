import { styled } from "@mui/material/styles";
import { Avatar } from "@/components/ui/Avatar";

export const HeaderStyled = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  height: "64px",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const HeaderLeftStyled = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const BrandStyled = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: theme.palette.primary.main,
  cursor: "pointer",
}));

export const BackButtonStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "40px",
  fontSize: "16px",
  color: theme.palette.text.primary,
  cursor: "pointer",

  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

export const AccountTriggerStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: "4px 8px",
  borderRadius: "10px",
  cursor: "pointer",

  "&:hover": {
    background: theme.palette.action.hover,
  },
}));

export const AccountAvatarStyled = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  fontSize: "14px",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

export const MenuHeaderStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(1, 2),
}));

export const MenuHeaderNameStyled = styled("span")(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const MenuHeaderEmailStyled = styled("span")(({ theme }) => ({
  fontSize: "12px",
  color: theme.palette.text.secondary,
}));

export const MenuDividerStyled = styled("div")(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  margin: theme.spacing(0.5, 0),
}));
