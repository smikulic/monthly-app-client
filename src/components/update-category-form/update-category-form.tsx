import React, { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Category, useUpdateCategoryMutation } from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  formData: Category;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const UpdateCategoryForm: React.FC<Props> = ({
  formData,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [categoryName, setCategoryName] = useState(formData.name);

  const [updateCategory] = useUpdateCategoryMutation({
    onCompleted: ({ updateCategory }) => {
      refetch();
      closeForm();
      setCategoryName("");
      toast.success(
        `You have successfully updated ${updateCategory.name} category!`
      );
    },
  });

  useEffect(() => {
    if (!categoryName) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [categoryName]);

  return (
    <>
      <DialogTitle>Update category</DialogTitle>
      <IconButton
        onClick={closeForm}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Stack spacing={1}>
          <TextField
            required
            id="categoryName"
            label="Category name"
            size="small"
            margin="none"
            autoComplete="off"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "0 24px 16px 24px" }}>
        <Button variant="outlined" color="warning" onClick={closeForm}>
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={formInvalid}
          onClick={() =>
            updateCategory({
              variables: {
                id: formData.id,
                name: categoryName,
              },
            })
          }
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
};
