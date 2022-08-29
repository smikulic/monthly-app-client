import * as React from "react";
import { useCategoryListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";

export const ExpensesPageContainer = () => {
  const { data, error, loading } = useCategoryListQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>ERROR</div>;
  }

  // return <CategoriesList data={data} />;

  return (
    <>
      <CategoriesList data={data} />
      {/* <div className="listContainer">

          <div className="listItem">
            Expenses &gt;
            <span className="red">3.660,00 kn</span>
          </div>

        <div className="listItem">
          Budget &gt;
          <span className="green">15.000,00 kn</span>
        </div>
      </div> */}
    </>
  );
};
