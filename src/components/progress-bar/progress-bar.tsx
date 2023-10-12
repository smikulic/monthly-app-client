import React from "react";
import {
  ProgressBarInnerStyled,
  ProgressBarStyled,
} from "./progress-bar-style";

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
