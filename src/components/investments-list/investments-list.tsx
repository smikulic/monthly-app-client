import { FC, MouseEvent } from "react";
import { Investment } from "@/generated/graphql";
import { AnchorActionDropdownElProps } from "@/hooks/useActionDropdown";
import { ListLoading } from "@/components/ui/ListLoading";
import { InvestmentsListNoData } from "./components/investments-list-no-data";
import { InvestmentsListData } from "./components/investments-list-data";

interface Props {
  loading: boolean;
  investments?: Investment[];
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  onEditInvestment: (investment: Investment) => void;
  onRemoveInvestment: (investmentId: string) => void;
  onActionsDropdownClick: (
    event: MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => void;
  onActionsDropdownClose: (anchorIndex: string) => void;
  calculatePercentageChange: (initial: number, current: number) => number;
}

export const InvestmentsList: FC<Props> = ({
  loading,
  investments,
  anchorActionDropdownEl,
  onEditInvestment,
  onRemoveInvestment,
  onActionsDropdownClick,
  onActionsDropdownClose,
  calculatePercentageChange,
}) => {
  const noDataAvailable = !investments || investments.length === 0;
  const dataAvailable = investments !== undefined && investments.length > 0;

  return (
    <div>
      {loading && (
        <ListLoading height={44} itemCount={3} showDetails showActions />
      )}
      {!loading && noDataAvailable && <InvestmentsListNoData />}
      {!loading && dataAvailable && (
        <InvestmentsListData
          investments={investments}
          anchorActionDropdownEl={anchorActionDropdownEl}
          onEditInvestment={onEditInvestment}
          onRemoveInvestment={onRemoveInvestment}
          onActionsDropdownClick={onActionsDropdownClick}
          onActionsDropdownClose={onActionsDropdownClose}
          calculatePercentageChange={calculatePercentageChange}
        />
      )}
    </div>
  );
};
