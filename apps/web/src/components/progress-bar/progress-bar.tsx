import { FC } from "react";
import {
  ProgressBarInnerStyled,
  ProgressBarStyled,
} from "./progress-bar-style";

interface ProgressBarProps {
  value: number;
  maxValue: number;
  /**
   * Whether the row has passed its budget. Decided by the caller, because what
   * counts as over depends on the rollover toggle: with rollover on the budget
   * figure is what remains (so over means it went negative), with it off the
   * figure is the month's budget (so over means spend exceeded it).
   */
  over?: boolean;
  /**
   * `positive` for progress that is good news in itself — a saving goal.
   * Budgets stay neutral: spending is the normal state, not an achievement.
   */
  tone?: "neutral" | "positive";
}

/**
 * Progress toward a target, washed across the row behind its content.
 *
 * Rendered wherever there is something to measure against — a budget, a saving
 * goal — and nowhere else. Home and investment rows have no target, so a bar
 * there would be decoration pretending to be data.
 *
 * There used to be a `reverse` flag whose only effect was to drop the track.
 * Once the track fell to 1% it was imperceptible either way, so the flag
 * distinguished nothing and left one concept with two code paths.
 */
export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  maxValue,
  over,
  tone = "neutral",
}) => {
  // Once over, the row is full: there is no meaningful ratio left to draw,
  // and in rollover mode the budget figure is negative anyway.
  const progress = over ? 100 : (value / maxValue) * 100;

  return (
    <ProgressBarStyled>
      <ProgressBarInnerStyled
        data-testid="progress-bar-inner"
        width={progress}
        over={over}
        tone={tone}
      />
    </ProgressBarStyled>
  );
};
