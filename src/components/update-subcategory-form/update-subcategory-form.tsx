import React, { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  Subcategory,
  useUpdateSubcategoryMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  formData: Subcategory;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const UpdateSubcategoryForm: React.FC<Props> = ({
  formData,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [subcategoryName, setSubcategoryName] = useState(formData.name);
  const [subcategoryBudget, setSubcategoryBudget] = useState(
    formData.budgetAmount
  );

  const [updateSubcategory] = useUpdateSubcategoryMutation({
    onCompleted: ({ updateSubcategory }) => {
      refetch();
      closeForm();
      setSubcategoryName("");
      setSubcategoryBudget(0);
      toast.success(
        `You have successfully updated ${updateSubcategory.name} subcategory!`
      );
    },
  });

  useEffect(() => {
    if (!subcategoryName || !subcategoryBudget) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [subcategoryName, subcategoryBudget]);

  return (
    <>
      <DialogTitle>Update subcategory</DialogTitle>
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
            id="subcategoryName"
            label="Subcategory name"
            size="small"
            margin="none"
            autoComplete="off"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
          />
          <TextField
            required
            id="subcategoryBudget"
            label="Subcategory budget"
            size="small"
            margin="none"
            autoComplete="off"
            value={subcategoryBudget}
            onChange={(e) => setSubcategoryBudget(Number(e.target.value))}
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
            updateSubcategory({
              variables: {
                id: formData.id,
                name: subcategoryName,
                budgetAmount: Number(subcategoryBudget),
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
