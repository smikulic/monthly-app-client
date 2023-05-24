import React from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { format } from "date-fns";

export const ActionsBar = ({
  displayDate,
  onClickPrevious,
  onClickNext,
}: {
  displayDate: Date;
  onClickPrevious: () => void;
  onClickNext: () => void;
}) => {
  return (
    <div className="actionsBar noselect">
      <div className="monthFilter">
        <HiArrowLeft className="filterPrev" onClick={onClickPrevious} />
        {format(displayDate, "MMM yyyy")}
        <HiArrowRight className="filterNext" onClick={onClickNext} />
      </div>
    </div>
  );
};
