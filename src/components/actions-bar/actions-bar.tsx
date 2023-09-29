import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
        <ChevronLeftIcon onClick={onClickPrevious} />
        {format(displayDate, "MMM yyyy")}
        <ChevronRightIcon onClick={onClickNext} />
      </div>
    </div>
  );
};
