import React from "react";

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
    <div className="progress-bar">
      <div
        className="progress-bar__fill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
