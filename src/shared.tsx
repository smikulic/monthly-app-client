import { Tab, TabProps, Tabs, TabsProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SelectField } from "./components/ui/Select";
import { TextField } from "./components/ui/TextField";
import shadows from "@mui/material/styles/shadows";

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

interface ProminentButtonProps {
  textCenter?: boolean;
  disabled?: boolean;
  color?: "primary" | "error";
  outline?: boolean;
}

export const ProminentButtonStyled = styled("div")<ProminentButtonProps>(
  ({ theme, textCenter, disabled, color = "primary", outline = false }) => {
    const palette = theme.palette[color];

    // Determine colors based on disabled and outline flags
    let textColor: string;
    let bgColor: string;
    let borderColor: string;

    if (disabled) {
      // disabled state overrides outline
      textColor = theme.palette.action.disabled;
      bgColor = theme.palette.action.disabledBackground;
      borderColor = theme.palette.action.disabled;
    } else if (outline) {
      // outline variant
      textColor = palette.main;
      bgColor = "transparent";
      borderColor = palette.main;
    } else {
      // filled variant
      textColor = palette.contrastText;
      bgColor = palette.main;
      borderColor = palette.contrastText;
    }

    return {
      padding: "8px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: textCenter ? "center" : "flex-start",
      textAlign: textCenter ? "center" : "left",
      height: "40px",
      fontSize: "16px",

      color: textColor,
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: "10px",

      cursor: disabled ? "not-allowed" : "pointer",
      pointerEvents: disabled ? "none" : "auto",
      opacity: disabled ? 0.5 : 1,

      "&:hover": disabled
        ? {}
        : {
            opacity: 0.7,
          },
    };
  }
);

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

export const SelectStyled = styled(SelectField)(({ theme }) => ({
  height: "40px",
  // style the OutlinedInput root
  "& .MuiOutlinedInput-root": {
    height: "100%",
    borderRadius: "10px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.primary.contrastText}`,
    // the outline itself
    "& fieldset": {
      borderColor: theme.palette.primary.contrastText,
    },
    "&:hover fieldset": {
      opacity: 0.7,
    },
    // ensure the select arrow is also light
    "& .MuiSelect-icon": {
      color: theme.palette.primary.contrastText,
    },
    // pad the “display area” of the select to match your button
    "& .MuiSelect-select": {
      padding: "8px 16px",
      display: "flex",
      alignItems: "center",
    },
  },
}));

export const TextFieldStyled = styled(TextField)(({ theme }) => ({
  marginBottom: 0,
  height: "40px",

  "& .MuiOutlinedInput-root": {
    height: "40px",
    borderRadius: "10px",
  },
}));
