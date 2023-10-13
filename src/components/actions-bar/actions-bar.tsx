import React from "react";
import { format } from "date-fns";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ActionsBarStyled, MonthPaginationStyled } from "./actions-bar-style";
import Tooltip from "@mui/material/Tooltip";

export const ActionsBar = ({
  displayDate,
  showRollover,
  toggleRollover,
  onClickPrevious,
  onClickNext,
}: {
  displayDate: Date;
  onClickPrevious: () => void;
  onClickNext: () => void;
  showRollover?: boolean;
  toggleRollover?: () => void;
}) => {
  return (
    <ActionsBarStyled>
      <MonthPaginationStyled>
        <ChevronLeftIcon fontSize="large" onClick={onClickPrevious} />
        {format(displayDate, "MMM yyyy")}
        <ChevronRightIcon fontSize="large" onClick={onClickNext} />
      </MonthPaginationStyled>

      {toggleRollover && (
        <FormGroup>
          <FormControlLabel
            control={
              <>
                <Tooltip
                  title="A rollover budget is when the subcategory budget rollover into the next
        month. This means you could start the month in the negative if you have
        overspent, or start with the positive if you underspent."
                >
                  <InfoOutlinedIcon fontSize="small" color="primary" />
                </Tooltip>
                <Switch checked={showRollover} onChange={toggleRollover} />
              </>
            }
            label="rollover"
          />
        </FormGroup>
      )}
    </ActionsBarStyled>
  );
};
