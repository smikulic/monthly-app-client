import { createTheme } from "@mui/material/styles";
import { tokens } from "./tokens";

export { tokens, tabularNums } from "./tokens";

/**
 * Semantic token families exposed on the MUI palette, so styled components can
 * reach them the same way they reach `text` or `divider`.
 *
 * `money` and `person` are separate axes on purpose: money colour says what
 * happened to an amount, person colour says whose it is. They must never
 * borrow from each other, or a shared avatar starts reading as income.
 */
declare module "@mui/material/styles" {
  interface Palette {
    ground: string;
    surface: string;
    hairline: string;
    money: {
      positive: string;
      neutral: string;
      negative: string;
      error: string;
    };
    person: string[];
    /** Wayfinding only. Never a money value. */
    section: string[];
  }

  interface PaletteOptions {
    ground?: string;
    surface?: string;
    hairline?: string;
    money?: Palette["money"];
    person?: string[];
    section?: string[];
  }
}

export const theme = createTheme({
  palette: {
    /**
     * Interactive chrome. Note `contrastText` is now light, because the accent
     * is dark — it means "text that sits on the accent", and is not a synonym
     * for ink. Anything wanting dark text should use `text.primary`.
     */
    primary: {
      main: tokens.accent.main,
      dark: tokens.accent.hover,
      contrastText: tokens.accent.contrastText,
    },
    /** Muted, for de-emphasised labels and icons. Never a money value. */
    secondary: {
      main: tokens.ink.secondary,
      contrastText: tokens.surface,
    },

    // MUI's semantic slots point at the money palette so built-in components
    // stay coherent with it. App code should prefer `palette.money.*`, which
    // says what it means.
    success: { main: tokens.money.positive },
    warning: { main: tokens.money.negative },
    error: { main: tokens.money.error },
    info: { main: tokens.person[1] },

    text: {
      primary: tokens.ink.primary,
      secondary: tokens.ink.secondary,
      disabled: tokens.ink.disabled,
    },
    background: {
      default: tokens.ground,
      paper: tokens.surface,
    },
    divider: tokens.hairline,

    ground: tokens.ground,
    surface: tokens.surface,
    hairline: tokens.hairline,
    money: { ...tokens.money },
    person: [...tokens.person],
    section: [...tokens.section],
  },

  shape: {
    borderRadius: tokens.radius.sm,
  },

  typography: {
    fontFamily: tokens.font.sans,
    // MUI defaults to 14. Anything not sized explicitly now inherits the base
    // of the scale instead, which is also the threshold below which iOS
    // Safari zooms the page on input focus.
    fontSize: tokens.fontSize.md,
    body1: { fontSize: tokens.fontSize.md },
    body2: { fontSize: tokens.fontSize.sm },
    h5: { fontSize: tokens.fontSize.xl, fontWeight: 600 },
  },

  components: {
    // Modern dropdown menus: rounded paper, soft shadow, padded list, and
    // rounded item highlights. Applies to every Menu (account, row actions,
    // scope filter, ...).
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: tokens.radius.md,
          marginTop: 6,
          minWidth: 184,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 8px 28px rgba(20, 18, 15, 0.12)",
        }),
        list: {
          padding: 6,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: tokens.radius.sm,
          padding: "8px 12px",
          fontSize: tokens.fontSize.md,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
          },
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 32,
        },
      },
    },
    /*
     * A floating label sits in a notch cut out of the field's outline. MUI
     * builds that notch from a hidden `<legend>` holding the same text at
     * `font-size: 0.75em`, while the label itself is the full size shrunk by
     * `transform: scale(0.75)`. The gap only covers the text as long as those
     * two measure the same, and a geometric scale and a real font size do not
     * have to agree — fonts hint differently at different sizes. When they
     * disagree by more than the legend's 5px of slack, the outline draws
     * straight through the label.
     *
     * An opaque background takes the label out of that bargain entirely. Every
     * field in the app sits on `surface`, so where the notch was already
     * correct this changes nothing visible.
     */
    MuiInputLabel: {
      styleOverrides: {
        outlined: ({ theme }) => ({
          "&.MuiInputLabel-shrink": {
            backgroundColor: theme.palette.surface,
            paddingLeft: 5,
            paddingRight: 5,
            /*
             * `transform-origin` is the top left, so 5px of left padding moves
             * the text 5 × 0.75 = 3.75px to the right. Take that back out of
             * MUI's own 14px offset, or the label stops lining up with the
             * value underneath it.
             */
            transform: "translate(10.25px, -9px) scale(0.75)",
          },
        }),
      },
    },
  },
});
