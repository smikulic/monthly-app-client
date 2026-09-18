import { alpha, styled } from "@mui/material/styles";

/**
 * Marks an item as shared with the household.
 *
 * Takes the accent rather than a money hue or one person's colour: it says
 * "this is shared", not whose it is and not anything about an amount. Derived
 * with `alpha` so the tint follows the token instead of being a hardcoded
 * value that drifts the next time the palette moves.
 */
export const SharedGroupBadgeStyled = styled("span")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  padding: "2px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
  color: theme.palette.primary.main,
  background: alpha(theme.palette.primary.main, 0.12),
}));
