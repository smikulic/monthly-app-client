import React from "react";
import { styled } from "@mui/material/styles";

type ProgressBarInnerStyledProps = {
  width: number;
};

const ProgressBarStyled = styled("div")({
  position: "absolute",
  left: "0",
  width: "100%",
  height: "52px",
  backgroundColor: "#7fb77e",
  overflow: "hidden",
  opacity: "0.1",
  zIndex: "-1",
});

const ProgressBarInnerStyled = styled("div")<ProgressBarInnerStyledProps>(
  ({ width }) => ({
    width: `${width || 0}%`,
    height: "100%",
    backgroundColor: "#ff7777",
    transition: "width 0.3s ease-in-out",
  })
);

interface ProgressBarProps {
  value: number;
  maxValue: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue,
}) => {
  const progress = (value / maxValue) * 100;

  return (
    <ProgressBarStyled>
      <ProgressBarInnerStyled width={progress} />
    </ProgressBarStyled>
  );
};
