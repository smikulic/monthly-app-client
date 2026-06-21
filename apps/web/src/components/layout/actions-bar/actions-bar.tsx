import { ReactNode } from "react";
import dayjs from "dayjs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Switch } from "@/components/ui/Switch";
import { FormGroup } from "@/components/ui/FormGroup";
import { FormControlLabel } from "@/components/ui/FormControl";
import { ScopeFilter } from "@/features/groups/scope-filter";
import {
  ActionsBarStyled,
  ToolbarStyled,
  ToolbarLeftStyled,
  ToolbarCenterStyled,
  ToolbarRightStyled,
  MonthPaginationStyled,
} from "./actions-bar-style";

export const ActionsBar = ({
  children,
  showScope,
  pageDate,
  showRollover,
  toggleRollover,
  onClickPrevious,
  onClickNext,
}: {
  children?: ReactNode;
  showScope?: boolean;
  pageDate?: Date;
  onClickPrevious?: () => void;
  onClickNext?: () => void;
  showRollover?: boolean;
  toggleRollover?: () => void;
}) => {
  const showMonth = Boolean(pageDate && onClickPrevious && onClickNext);
  // Toolbar mode is the bordered, three-zone control row that sits under the
  // topbar. Pages that only pass free-form children (investments, saving goals)
  // keep the legacy space-between layout.
  const toolbar = Boolean(showScope || showMonth || toggleRollover);

  if (!toolbar) {
    return <ActionsBarStyled>{children}</ActionsBarStyled>;
  }

  return (
    <ToolbarStyled>
      <ToolbarLeftStyled>{showScope && <ScopeFilter />}</ToolbarLeftStyled>

      <ToolbarCenterStyled>
        {showMonth && (
          <MonthPaginationStyled>
            <ChevronLeftIcon onClick={onClickPrevious} />
            {dayjs(pageDate).format("MMM YYYY")}
            <ChevronRightIcon onClick={onClickNext} />
          </MonthPaginationStyled>
        )}
      </ToolbarCenterStyled>

      <ToolbarRightStyled>
        {children}
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
      </ToolbarRightStyled>
    </ToolbarStyled>
  );
};
