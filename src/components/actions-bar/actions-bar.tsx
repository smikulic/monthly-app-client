import React, { ReactNode } from "react";
import { format } from "date-fns";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ActionsBarStyled, MonthPaginationStyled } from "./actions-bar-style";

export const ActionsBar = ({
  children,
  pageDate,
  showRollover,
  toggleRollover,
  onClickPrevious,
  onClickNext,
}: {
  children?: ReactNode;
  pageDate?: Date;
  onClickPrevious?: () => void;
  onClickNext?: () => void;
  showRollover?: boolean;
  toggleRollover?: () => void;
}) => {
  return (
    <ActionsBarStyled>
      {children && children}
      {!children && (
        <>
          {pageDate && onClickPrevious && onClickNext && (
            <MonthPaginationStyled>
              <ChevronLeftIcon fontSize="medium" onClick={onClickPrevious} />
              {format(pageDate, "MMM yyyy")}
              <ChevronRightIcon fontSize="medium" onClick={onClickNext} />
            </MonthPaginationStyled>
          )}

          {toggleRollover && (
            <FormGroup>
              <FormControlLabel
                control={
                  <>
                    <Switch checked={showRollover} onChange={toggleRollover} />
                  </>
                }
                label="rollover"
              />
            </FormGroup>
          )}
        </>
      )}
    </ActionsBarStyled>
  );
};
