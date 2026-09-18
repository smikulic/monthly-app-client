import { alpha, styled } from "@mui/material/styles";

type ProgressBartSyledProps = {
  reverse?: boolean;
};

type ProgressBarInnerStyledProps = {
  width: number;
  reverse?: boolean;
  over?: boolean;
};

/**
 * A wash across the whole row, with the spent portion stronger.
 *
 * Tint is set per element with `alpha` rather than by putting `opacity` on the
 * track, because opacity fades the fill inside it too — the two could then
 * only differ in hue, never in strength.
 *
 * The strengths are far below the 10% this used before. That was tuned against
 * a light mint accent; the accent is dark now, and the same 10% rendered as a
 * grey slab across the row.
 */
export const ProgressBarStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "reverse",
})<ProgressBartSyledProps>(({ theme, reverse }) => ({
  position: "absolute",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: reverse
    ? "transparent"
    : alpha(theme.palette.primary.main, 0.04),
  overflow: "hidden",
  zIndex: "-1",
}));

export const ProgressBarInnerStyled = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "reverse" && prop !== "over" && prop !== "width",
})<ProgressBarInnerStyledProps>(({ theme, width, over }) => ({
  // Clamped: the caller's ratio can exceed 100, and an over-wide child would
  // otherwise just be silently clipped by the track.
  width: `${Math.min(100, Math.max(0, width || 0))}%`,
  height: "100%",
  // Accent while there is budget left; the negative hue once the row is over.
  // Spending against a budget you set is the normal state, so the warning
  // colour is earned only by passing the limit, not by spending at all.
  backgroundColor: alpha(
    over ? theme.palette.money.negative : theme.palette.primary.main,
    over ? 0.14 : 0.12,
  ),
  transition: "width 0.3s ease-in-out",
}));
