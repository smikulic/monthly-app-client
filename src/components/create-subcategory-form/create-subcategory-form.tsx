import React, { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useCreateSubcategoryMutation } from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  categoryId: string;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const CreateSubcategoryForm: React.FC<Props> = ({
  categoryId,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [subcategoryBudget, setSubcategoryBudget] = useState(0);
  const [subcategoryName, setSubcategoryName] = useState("");

  const [createSubcategory] = useCreateSubcategoryMutation({
    onCompleted: ({ createSubcategory }) => {
      refetch();
      closeForm();
      setSubcategoryName("");
      setSubcategoryBudget(0);
      toast.success(
        `You have successfully created ${createSubcategory.name} subcategory!`
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
      <DialogTitle>Create subcategory</DialogTitle>
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
            onChange={(e) => setSubcategoryName(e.target.value)}
          />
          <TextField
            required
            id="subcategoryBudget"
            label="Subcategory budget"
            size="small"
            margin="none"
            autoComplete="off"
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
            createSubcategory({
              variables: {
                categoryId,
                budgetAmount: subcategoryBudget,
                name: subcategoryName,
              },
            })
          }
        >
          Create
        </Button>
      </DialogActions>
    </>
  );
};
