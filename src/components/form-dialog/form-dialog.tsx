import React, { ReactNode } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

interface Props {
  open: boolean;
  title: string;
  disabled: boolean;
  children: ReactNode;
  formActionText: string;
  formAction: () => void;
  closeForm: () => void;
}

export const FormDialog: React.FC<Props> = ({
  open,
  title,
  disabled,
  children,
  formActionText,
  formAction,
  closeForm,
}) => {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={closeForm}>
      <DialogTitle>{title}</DialogTitle>
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
        <Stack spacing={1}>{children}</Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "0 24px 16px 24px" }}>
        <Button variant="outlined" color="warning" onClick={closeForm}>
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={disabled}
          onClick={formAction}
        >
          {formActionText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
