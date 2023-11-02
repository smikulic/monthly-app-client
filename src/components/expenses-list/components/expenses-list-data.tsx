import React, { Dispatch, SetStateAction } from "react";
import { Expense } from "../../../generated/graphql";
import { CategoryDecoratedWithExpenses } from "../expenses-list";
import { ExpenseListItem } from "./expense-list-item";

interface Props {
  pageDate: Date;
  showRolloverBudget: boolean;
  categoriesDecoratedWithExpenses: CategoryDecoratedWithExpenses[];
  openCategory: string;
  createModalExpense: boolean;
  updateModalExpense: Expense | null;
  setOpenCategory: Dispatch<SetStateAction<string>>;
  setCreateModalExpense: Dispatch<SetStateAction<boolean>>;
  setUpdateModalExpense: Dispatch<SetStateAction<Expense | null>>;
  refetchExpenses: () => Promise<unknown>;
}

export const ExpensesListData: React.FC<Props> = ({
  pageDate,
  showRolloverBudget,
  categoriesDecoratedWithExpenses,
  openCategory,
  createModalExpense,
  updateModalExpense,
  setOpenCategory,
  setCreateModalExpense,
  setUpdateModalExpense,
  refetchExpenses,
}) => {
  return (
    <>
      {categoriesDecoratedWithExpenses.map(
        (category: CategoryDecoratedWithExpenses) => {
          const categoryId = category.id;

          return (
            <React.Fragment key={categoryId}>
              <ExpenseListItem
                pageDate={pageDate}
                showRolloverBudget={showRolloverBudget}
                category={category}
                openCategory={openCategory}
                createModalExpense={createModalExpense}
                updateModalExpense={updateModalExpense}
                setOpenCategory={setOpenCategory}
                setCreateModalExpense={setCreateModalExpense}
                setUpdateModalExpense={setUpdateModalExpense}
                refetchExpenses={refetchExpenses}
              />
            </React.Fragment>
          );
          // const categoryId = category.id;
          // const showSubcategories = openCategory === categoryId;
          // const subcategoriesExist = category.subcategories.length > 0;
          // const isActive = showSubcategories && subcategoriesExist;

          // return (
          //   <React.Fragment key={categoryId}>
          //     <MainListItemStyled active={isActive ? true : undefined}>
          //       <ListItemHeader
          //         title={category.name}
          //         showExpand={!showSubcategories && subcategoriesExist}
          //         showCollapse={isActive}
          //         onToggleExpand={() => {
          //           if (subcategoriesExist) {
          //             if (showSubcategories) {
          //               setOpenCategory("");
          //             } else {
          //               setOpenCategory(categoryId);
          //             }
          //           }
          //         }}
          //       />
          //       {category.totalExpenseAmount > 0 && (
          //         <ListItemDetails expenseValue={category.totalExpenseAmount} />
          //       )}
          //     </MainListItemStyled>
          //     {showSubcategories && (
          //       <>
          //         {subcategoriesExist &&
          //           category.subcategories.map(
          //             (
          //               subcategory: SubcategoryDecoratedWithExpenses,
          //               subcategoryKey: number
          //             ) => {
          //               if (!subcategory) return null;

          //               const subcategorySelected =
          //                 category?.subcategories[subcategoryKey];

          //               return (
          //                 <SubcategoryListItem
          //                   key={subcategory.id}
          //                   subcategory={subcategory}
          //                   subcategorySelected={subcategorySelected}
          //                   currentDate={pageDate}
          //                   showRolloverBudget={showRolloverBudget}
          //                   refetchExpenses={refetchExpenses}
          //                   setUpdateModalExpense={(expense: Expense) =>
          //                     setUpdateModalExpense(expense)
          //                   }
          //                 />
          //               );
          //             }
          //           )}

          //         <ListAddField
          //           text={`Add ${category.name} expense`}
          //           onClick={() => setCreateModalExpense(true)}
          //         />

          //         {createModalExpense && (
          //           <CreateExpenseForm
          //             open={createModalExpense}
          //             subcategories={category?.subcategories}
          //             currentDate={pageDate}
          //             closeForm={() => setCreateModalExpense(false)}
          //             refetch={refetchExpenses}
          //           />
          //         )}
          //         {updateModalExpense && (
          //           <UpdateExpenseForm
          //             open={Boolean(updateModalExpense)}
          //             formData={updateModalExpense}
          //             subcategories={category?.subcategories}
          //             closeForm={() => setUpdateModalExpense(null)}
          //             refetch={refetchExpenses}
          //           />
          //         )}
          //       </>
          //     )}
          //   </React.Fragment>
          // );
        }
      )}
    </>
  );
};
