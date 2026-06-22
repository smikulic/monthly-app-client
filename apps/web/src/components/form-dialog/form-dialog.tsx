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
  ref: React.Ref<unknown>,
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
      open={open}
      onClose={closeForm}
      fullWidth
      maxWidth="xs"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          // Tighter margins + more width on small screens; comfortable on desktop.
          m: { xs: 1.5, sm: 4 },
          width: { xs: "calc(100% - 24px)", sm: "100%" },
        },
      }}
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
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeForm}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {children}
        </Stack>
      </DialogContent>
      <ProminentButtonStyled
        textCenter
        onClick={formAction}
        disabled={disabled}
        data-testid="create-button"
        sx={{ width: "100%", height: 52, borderRadius: 0, fontSize: "16px" }}
      >
        {formActionText}
      </ProminentButtonStyled>
    </Dialog>
  );
};
