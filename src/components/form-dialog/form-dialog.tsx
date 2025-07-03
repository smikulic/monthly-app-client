import React, { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { DialogContent, Dialog } from "@/components/ui/Dialog";
import { IconButton } from "@/components/ui/IconButton";
import { Stack } from "@/components/ui/Stack";
import { Slide, TransitionProps } from "@/components/ui/Slide";
import { AppBar } from "@/components/ui/AppBar";
import { Toolbar } from "@/components/ui/Toolbar";
import { Typography } from "@/components/ui/Typography";
import { ProminentButtonStyled } from "@/shared";

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
          <ProminentButtonStyled
            onClick={formAction}
            disabled={disabled}
            autoFocus
            data-testid="create-button"
          >
            {formActionText}
          </ProminentButtonStyled>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Stack spacing={1}>{children}</Stack>
      </DialogContent>
    </Dialog>
  );
};
