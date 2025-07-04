import { ReactNode } from "react";
import dayjs from "dayjs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Switch } from "@/components/ui/Switch";
import { FormGroup } from "@/components/ui/FormGroup";
import { FormControlLabel } from "@/components/ui/FormControl";
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
              <ChevronLeftIcon fontSize="large" onClick={onClickPrevious} />
              {dayjs(pageDate).format("MMM YYYY")}
              <ChevronRightIcon fontSize="large" onClick={onClickNext} />
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
