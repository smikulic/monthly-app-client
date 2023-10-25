import React from "react";
import {
  ProgressBarInnerStyled,
  ProgressBarStyled,
} from "./progress-bar-style";

interface ProgressBarProps {
  value: number;
  maxValue: number;
  reverse?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue,
  reverse,
}) => {
  const progress = (value / maxValue) * 100;

  return (
    <ProgressBarStyled reverse={reverse}>
      <ProgressBarInnerStyled
        data-testid="progress-bar-inner"
        width={progress}
        reverse={reverse}
      />
    </ProgressBarStyled>
  );
};
