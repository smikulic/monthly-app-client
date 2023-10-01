import React, { useState } from "react";
import { SubcategoryFormFields } from "../subcategory-form-fields/subcategory-form-fields";
import { AddFormStyled } from "../../shared";
import { ListAddField } from "../list-add-field/list-add-field";

interface Props {
  categoryId: string;
  refetchCategories: () => Promise<unknown>;
}

export const CreateSubcategoryForm: React.FC<Props> = ({
  categoryId,
  refetchCategories,
}) => {
  const [formVisible, setFormVisible] = useState(false);

  return (
    <>
      {formVisible && (
        <AddFormStyled>
          <SubcategoryFormFields
            categoryId={categoryId}
            refetchCategories={refetchCategories}
            closeForm={() => setFormVisible(false)}
          />
        </AddFormStyled>
      )}
      {!formVisible && (
        <ListAddField
          text="Add subcategory"
          onClick={() => setFormVisible(true)}
          fontSize="small"
          indent
        />
      )}
    </>
  );
};
