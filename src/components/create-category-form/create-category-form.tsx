import React, { useState } from "react";
import { CategoryFormFields } from "../category-form-fields/category-form-fields";
import { AddFormStyled } from "../../shared";
import { ListAddField } from "../list-add-field/list-add-field";

interface Props {
  refetchCategories: () => Promise<unknown>;
}

export const CreateCategoryForm: React.FC<Props> = ({ refetchCategories }) => {
  const [formVisible, setFormVisible] = useState(false);

  return (
    <>
      {formVisible && (
        <AddFormStyled>
          <CategoryFormFields
            refetchCategories={refetchCategories}
            closeForm={() => setFormVisible(false)}
          />
        </AddFormStyled>
      )}
      {!formVisible && (
        <ListAddField
          text="Add category"
          onClick={() => setFormVisible(true)}
        />
      )}
    </>
  );
};
