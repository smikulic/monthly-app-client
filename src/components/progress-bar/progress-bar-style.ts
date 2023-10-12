import { styled } from "@mui/material/styles";

type ProgressBarInnerStyledProps = {
  width: number;
};

export const ProgressBarStyled = styled("div")({
  position: "absolute",
  left: "0",
  width: "100%",
  height: "52px",
  backgroundColor: "#41efcd",
  overflow: "hidden",
  opacity: "0.1",
  zIndex: "-1",
});

export const ProgressBarInnerStyled = styled(
  "div"
)<ProgressBarInnerStyledProps>(({ width }) => ({
  width: `${width || 0}%`,
  height: "100%",
  backgroundColor: "#ffb6bd",
  transition: "width 0.3s ease-in-out",
}));
