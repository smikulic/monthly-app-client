import { ReactNode } from "react";
import dayjs from "dayjs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckIcon from "@mui/icons-material/Check";
import { ScopeFilter } from "@/features/groups/scope-filter";
import {
  ActionsBarStyled,
  ToolbarStyled,
  ToolbarLeftStyled,
  ToolbarCenterStyled,
  ToolbarRightStyled,
  MonthPaginationStyled,
  MonthLabelStyled,
  MonthNavButtonStyled,
  RolloverToggleStyled,
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

  const monthNav = showMonth && (
    <MonthPaginationStyled data-tour="month-nav">
      <MonthNavButtonStyled
        type="button"
        onClick={onClickPrevious}
        aria-label="Previous month"
      >
        <ChevronLeftIcon />
      </MonthNavButtonStyled>
      <MonthLabelStyled>{dayjs(pageDate).format("MMM YYYY")}</MonthLabelStyled>
      <MonthNavButtonStyled
        type="button"
        onClick={onClickNext}
        aria-label="Next month"
      >
        <ChevronRightIcon />
      </MonthNavButtonStyled>
    </MonthPaginationStyled>
  );

  return (
    <ToolbarStyled>
      <ToolbarLeftStyled>{showScope && <ScopeFilter />}</ToolbarLeftStyled>

      <ToolbarCenterStyled>{monthNav}</ToolbarCenterStyled>

      <ToolbarRightStyled>
        {children}
        {toggleRollover && (
          <RolloverToggleStyled
            type="button"
            active={showRollover}
            onClick={toggleRollover}
            aria-pressed={showRollover}
            data-testid="rollover-toggle"
            data-tour="rollover-toggle"
          >
            {showRollover && <CheckIcon />}
            Rollover
          </RolloverToggleStyled>
        )}
      </ToolbarRightStyled>
    </ToolbarStyled>
  );
};
