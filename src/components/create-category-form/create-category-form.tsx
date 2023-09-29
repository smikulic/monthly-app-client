import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useCreateCategoryMutation } from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  refetchCategories: () => Promise<unknown>;
  closeForm: () => void;
}

export const CreateCategoryForm: React.FC<Props> = ({
  refetchCategories,
  closeForm,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [newCategoryName, setCategoryName] = useState("");

  const [createCategory, { loading }] = useCreateCategoryMutation({
    onCompleted: ({ createCategory }) => {
      refetchCategories();
      closeForm();
      setCategoryName("");
      toast.success(
        `You have successfully created ${createCategory.name} category!`
      );
    },
  });

  useEffect(() => {
    if (!newCategoryName) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [newCategoryName]);

  return (
    <>
      <TextField
        required
        id="categoryName"
        label="Category name"
        size="small"
        margin="dense"
        onChange={(e) => setCategoryName(e.target.value)}
      />

      <br />
      <Stack spacing={1} direction="row">
        <Button variant="outlined" color="warning" onClick={closeForm}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={formInvalid}
          onClick={() =>
            createCategory({
              variables: {
                name: newCategoryName,
              },
            })
          }
        >
          {loading ? "saving..." : "Create"}
        </Button>
      </Stack>
    </>
  );
};
