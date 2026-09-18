import { alpha, styled } from "@mui/material/styles";

type ProgressBarInnerStyledProps = {
  width: number;
  over?: boolean;
  tone?: "neutral" | "positive";
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
 *
 * There was a `reverse` flag whose only effect was to drop the track, used by
 * saving goals. Once the track fell to a couple of percent it was
 * imperceptible either way, so the flag distinguished nothing while leaving one
 * concept with two code paths.
 */
export const ProgressBarStyled = styled("div")(({ theme }) => ({
  position: "absolute",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  overflow: "hidden",
  // Above the card's own background, below the row's text. It used to sit at
  // -1 and show through to the page, which forced the card to stay unfilled —
  // and left the whole list flat beige against a beige ground.
  zIndex: 0,
}));

export const ProgressBarInnerStyled = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "over" && prop !== "width" && prop !== "tone",
})<ProgressBarInnerStyledProps>(({ theme, width, over, tone }) => ({
  // Clamped: the caller's ratio can exceed 100, and an over-wide child would
  // otherwise just be silently clipped by the track.
  width: `${Math.min(100, Math.max(0, width || 0))}%`,
  height: "100%",
  // Spending against a budget you set is the normal state, so it takes the
  // accent and earns the warning colour only by passing the limit. Saving
  // toward a goal is not neutral — it is good news — so it takes the positive
  // hue, and a fully funded goal reads as achieved rather than greyed out.
  backgroundColor: alpha(
    over
      ? theme.palette.money.negative
      : tone === "positive"
        ? theme.palette.money.positive
        : theme.palette.primary.main,
    over ? 0.14 : 0.16,
  ),
  transition: "width 0.3s ease-in-out",
}));
