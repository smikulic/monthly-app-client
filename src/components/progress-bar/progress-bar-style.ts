import { styled } from "@mui/material/styles";

type ProgressBartSyledProps = {
  reverse?: boolean;
};

type ProgressBarInnerStyledProps = {
  width: number;
  reverse?: boolean;
};

export const ProgressBarStyled = styled("div")<ProgressBartSyledProps>(
  ({ reverse }) => ({
    position: "absolute",
    left: "0",
    width: "100%",
    height: "100%",
    // height: "52px",
    backgroundColor: reverse ? "#fff" : "#41efcd",
    overflow: "hidden",
    opacity: "0.1",
    zIndex: "-1",
  })
);

export const ProgressBarInnerStyled = styled(
  "div"
)<ProgressBarInnerStyledProps>(({ width, reverse }) => ({
  width: `${width || 0}%`,
  height: "100%",
  backgroundColor: reverse ? "#41efcd" : "#ffb6bd",
  transition: "width 0.3s ease-in-out",
}));
