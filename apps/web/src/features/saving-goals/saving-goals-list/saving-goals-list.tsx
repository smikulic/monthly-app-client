import { FC, MouseEvent } from "react";
import { SavingGoal } from "@/generated/graphql";
import { AnchorActionDropdownElProps } from "@/hooks/useActionDropdown";
import { ListLoading } from "@/components/ui/ListLoading";
import { SavingGoalsListNoData } from "./components/saving-goals-list-no-data";
import { SavingGoalsListData } from "./components/saving-goals-list-data";

interface Props {
  loading: boolean;
  savingGoals?: SavingGoal[];
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  onEditSavingGoal: (savingGoal: SavingGoal) => void;
  onRemoveSavingGoal: (savingGoalId: string) => void;
  onActionsDropdownClick: (
    event: MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => void;
  onActionsDropdownClose: (anchorIndex: string) => void;
  calculateSavingGoalData: (savingGoal: SavingGoal) => {
    monthsLeftToSave: number;
    savePerMonth: number;
    savedTillNow: number;
  };
}

export const SavingGoalsList: FC<Props> = ({
  loading,
  savingGoals,
  anchorActionDropdownEl,
  onEditSavingGoal,
  onRemoveSavingGoal,
  onActionsDropdownClick,
  onActionsDropdownClose,
  calculateSavingGoalData,
}) => {
  const noDataAvailable = !savingGoals || savingGoals.length === 0;
  const dataAvailable = savingGoals !== undefined && savingGoals.length > 0;

  return (
    <div>
      {loading && (
        <ListLoading height={44} itemCount={3} showDetails showActions />
      )}
      {!loading && noDataAvailable && <SavingGoalsListNoData />}
      {!loading && dataAvailable && (
        <SavingGoalsListData
          savingGoals={savingGoals}
          anchorActionDropdownEl={anchorActionDropdownEl}
          onEditSavingGoal={onEditSavingGoal}
          onRemoveSavingGoal={onRemoveSavingGoal}
          onActionsDropdownClick={onActionsDropdownClick}
          onActionsDropdownClose={onActionsDropdownClose}
          calculateSavingGoalData={calculateSavingGoalData}
        />
      )}
    </div>
  );
};
