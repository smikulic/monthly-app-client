import { styled } from "@mui/material/styles";
import { Tab, TabProps, Tabs, TabsProps } from "./components/ui/Tabs";
import { SelectField } from "./components/ui/Select";
import { TextField } from "./components/ui/TextField";

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
  margin: "8px 12px",
  padding: "14px 18px",
  border: active
    ? `1px solid ${theme.palette.text.secondary}`
    : `1px solid ${theme.palette.text.disabled}`,
  borderRadius: "12px",
  background: active ? "rgba(59, 206, 177, 0.08)" : "transparent",

  "&:hover": {
    borderColor: theme.palette.text.secondary,
  },
}));

// A pressable tile.
//
// Touch has no hover, and :active only fires *during* a press, so it confirms a
// tap rather than advertising one. The signals that work at rest on mobile are
// the persistent chevron and the mint label (mint = interactive); the offset
// shadow and the press-into-shadow motion are confirmation on top of those.
export const BoxItemStyled = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  // Must be 0, not a fixed floor: flex and grid children default to
  // `min-width: auto`, which refuses to shrink below their content width.
  minWidth: 0,
  width: "100%",
  height: "132px",
  padding: "16px 18px",
  [theme.breakpoints.up("sm")]: {
    height: "160px",
    padding: "18px 20px",
  },
  border: `2px solid ${theme.palette.text.primary}`,
  borderRadius: "12px",
  boxShadow: `4px 4px 0 ${theme.palette.text.primary}`,
  transition: "transform 120ms ease, box-shadow 120ms ease",

  "& .tile-chevron": {
    color: theme.palette.primary.main,
    flexShrink: 0,
    transition: "transform 120ms ease",
  },

  "&:hover .tile-chevron": {
    transform: "translateX(3px)",
  },

  // Drops into its own shadow, so the tile behaves like a physical key.
  "&:active": {
    transform: "translate(4px, 4px)",
    boxShadow: `0 0 0 ${theme.palette.text.primary}`,
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "& .tile-chevron": { transition: "none" },
    "&:active": { transform: "none" },
  },
}));

interface ProminentButtonProps {
  textCenter?: boolean;
  disabled?: boolean;
  color?: "primary" | "error";
  outline?: boolean;
  small?: boolean;
}

export const ProminentButtonStyled = styled("div")<ProminentButtonProps>(({
  theme,
  textCenter,
  disabled,
  color = "primary",
  outline = false,
  small = false,
}) => {
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
    // filled variant: borderless (border matches the fill) for a cleaner look
    textColor = palette.contrastText;
    bgColor = palette.main;
    borderColor = palette.main;
  }

  return {
    padding: small ? "6px 14px" : "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: textCenter ? "center" : "flex-start",
    textAlign: textCenter ? "center" : "left",
    height: small ? "36px" : "40px",
    fontSize: small ? "14px" : "16px",

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
});

export const FooterPaddingStyled = styled("div")({
  marginBottom: "68px",
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

// ---- Shared page layout primitives (Reports, Settings, ...) ----

export const PageWrapperStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const SectionDividerStyled = styled("hr")(({ theme }) => ({
  width: "100%",
  margin: 0,
  border: "none",
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const HelperTextStyled = styled("p")(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

// Stacked + full-width on mobile; inline on larger screens with a consistent
// minimum button width so actions line up evenly (labels can still grow).
export const ButtonGroupStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    "& > *": {
      minWidth: 160,
    },
  },
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
  }),
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
  borderRadius: "10px",
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
