import { FC } from "react";
import {
  ProgressBarInnerStyled,
  ProgressBarStyled,
} from "./progress-bar-style";

interface ProgressBarProps {
  value: number;
  maxValue: number;
  reverse?: boolean;
  /**
   * Whether the row has passed its budget. Decided by the caller, because what
   * counts as over depends on the rollover toggle: with rollover on the budget
   * figure is what remains (so over means it went negative), with it off the
   * figure is the month's budget (so over means spend exceeded it).
   */
  over?: boolean;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  maxValue,
  reverse,
  over,
}) => {
  // Once over, the row is full: there is no meaningful ratio left to draw,
  // and in rollover mode the budget figure is negative anyway.
  const progress = over ? 100 : (value / maxValue) * 100;

  return (
    <ProgressBarStyled reverse={reverse}>
      <ProgressBarInnerStyled
        data-testid="progress-bar-inner"
        width={progress}
        reverse={reverse}
        over={over}
      />
    </ProgressBarStyled>
  );
};
