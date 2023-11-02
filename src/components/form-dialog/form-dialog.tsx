import React, { ReactNode } from "react";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import { DialogActions } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    <Dialog
      fullScreen
      // fullWidth
      open={open}
      onClose={closeForm}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          boxShadow: "none",
          borderBottom: "1px solid rgb(223, 223, 223)",
        }}
        color="transparent"
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={closeForm}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <Button
            variant="contained"
            autoFocus
            onClick={formAction}
            disabled={disabled}
          >
            {formActionText}
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Stack spacing={1}>{children}</Stack>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={closeForm}>Cancel</Button>
        <Button variant="contained" onClick={formAction} disabled={disabled}>
          {formActionText}
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};
