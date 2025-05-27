import { Tab, TabProps, Tabs, TabsProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ListItemStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
});

type MainListItemStyledProps = {
  active?: boolean;
};

export const MainListItemStyled = styled(ListItemStyled, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: (prop) => prop !== "active",
})<MainListItemStyledProps>(({ theme, active }) => ({
  margin: "10px 12px",
  padding: "16px 20px",
  border: active
    ? `1px solid ${theme.palette.text.secondary}`
    : `1px solid ${theme.palette.text.disabled}`,
  borderRadius: "16px",

  "&:hover": {
    borderColor: theme.palette.text.secondary,
  },
}));

type SubcategoryListItemStyledProps = {
  actionable?: boolean;
};

export const SubcategoryListItemStyled = styled(ListItemStyled, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: (prop) => prop !== "actionable",
})<SubcategoryListItemStyledProps>(({ theme, actionable }) => ({
  height: "52px",
  margin: "6px 12px",
  padding: "8px 24px 8px 38px",
  border: `1px solid ${theme.palette.text.disabled}`,
  borderRadius: "16px",

  "&:hover": {
    borderColor: actionable
      ? theme.palette.text.secondary
      : theme.palette.text.disabled,
  },
}));

export const ProminentButtonStyled = styled("div")(({ theme }) => ({
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  height: "40px",
  fontSize: "16px",
  color: theme.palette.primary.contrastText,
  border: `1px solid ${theme.palette.primary.contrastText}`,
  background: theme.palette.primary.main,
  borderRadius: "10px",
  cursor: "pointer",

  "&:hover": {
    opacity: 0.7,
  },
}));

export const FooterPaddingStyled = styled("div")({
  marginBottom: "56px",
});

export const ErrorTextStyled = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
}));
export const WarningTextStyled = styled("span")(({ theme }) => ({
  color: theme.palette.warning.main,
}));
export const UnderlineTextStyled = styled("span")(({ theme }) => ({
  fontWeight: "500",
  borderBottom: `1px dotted ${theme.palette.primary.contrastText}`,
}));

export const TabsStyled = styled((props: TabsProps) => <Tabs {...props} />)(
  ({ theme }) => ({
    marginLeft: theme.spacing(2),
    minHeight: theme.spacing(6),
    "& .MuiTabs-indicator": {
      height: 2,
      borderRadius: 2,
      backgroundColor: theme.palette.primary.main,
    },
  })
);

export const TabStyled = styled((props: TabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  minHeight: theme.spacing(4),
  padding: "8px 16px",
  fontSize: "14px",
  fontWeight: "normal",
  borderRadius: "10px",
  marginRight: theme.spacing(2),
  // unselected
  background: "transparent",
  color: theme.palette.primary.contrastText,
  // color: theme.palette.text.secondary,
  // border: `1px solid ${theme.palette.primary.contrastText}`,

  "&.Mui-selected": {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },

  "&:hover": {
    opacity: 0.8,
    background: theme.palette.action.hover,
    "&.Mui-selected": {
      background: theme.palette.primary.main,
    },
  },
}));
