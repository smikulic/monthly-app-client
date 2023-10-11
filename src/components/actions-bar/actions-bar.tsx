import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { format } from "date-fns";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const ActionsBarStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 32px",
  height: "56px",
  fontSize: "18px",
});

const MonthPaginationStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "18px",
  width: "158px",
  color: "#181818",

  "& svg": {
    color: "#41efcd",
    border: "1px solid #41efcd",
    borderRadius: "5px",
    cursor: "pointer",
  },
  "& svg:hover": {
    color: "black",
  },
});

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
              <Switch checked={showRollover} onChange={toggleRollover} />
            }
            label="rollover"
          />
        </FormGroup>
      )}
    </ActionsBarStyled>
  );
};
