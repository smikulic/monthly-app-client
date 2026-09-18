import { styled } from "@mui/material/styles";

type ProgressBartSyledProps = {
  reverse?: boolean;
};

type ProgressBarInnerStyledProps = {
  width: number;
  reverse?: boolean;
};

export const ProgressBarStyled = styled("div")<ProgressBartSyledProps>(
  ({ theme, reverse }) => ({
    position: "absolute",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: reverse
      ? theme.palette.surface
      : theme.palette.primary.main,
    overflow: "hidden",
    opacity: "0.1",
    zIndex: "-1",
  }),
);

export const ProgressBarInnerStyled = styled(
  "div",
)<ProgressBarInnerStyledProps>(({ theme, width, reverse }) => ({
  width: `${width || 0}%`,
  height: "100%",
  backgroundColor: reverse
    ? theme.palette.primary.main
    : theme.palette.money.negative,
  transition: "width 0.3s ease-in-out",
}));
