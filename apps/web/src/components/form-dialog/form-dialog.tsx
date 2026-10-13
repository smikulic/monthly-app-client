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
import { tokens } from "@/theme/tokens";

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
      sx={{
        // Bottom sheet on phones, centred dialog on desktop.
        //
        // Every one of these forms is text entry, and a vertically centred
        // dialog gets squeezed into whatever strip the soft keyboard leaves.
        // Anchored to the bottom it sits directly above the keyboard, its
        // actions land in thumb reach, and it finally matches the slide-up
        // transition — which used to rise from the bottom edge and then stop
        // in the middle.
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", sm: "center" },
        },
      }}
      PaperProps={{
        // Desktop is the base, mobile overrides it — not the other way round.
        // MUI breakpoints are min-width, so an `xs` value applies at *every*
        // width: `maxWidth: { xs: "100%", sm: undefined }` emitted nothing at
        // `sm`, leaving 100% in force on desktop where it silently beat the
        // `maxWidth="xs"` prop and stretched the dialog across the viewport.
        sx: (theme) => ({
          overflow: "hidden",
          borderRadius: "16px",
          margin: theme.spacing(4),

          [theme.breakpoints.down("sm")]: {
            // Rounded at the top only where it is flush with the bottom edge:
            // rounding corners that sit off-screen just clips the content.
            borderRadius: "16px 16px 0 0",
            margin: 0,
            width: "100%",
            maxWidth: "100%",
            // Clears the Android gesture bar, as the fixed toolbar does.
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          },
        }),
      }}
    >
      <AppBar
        sx={{
          position: "relative",
          boxShadow: "none",
          // `divider`, not a hardcoded grey. This one survived the palette
          // migration because it was written as rgb() rather than a hex.
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
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
      {/*
        A real <form>, so the keyboard's Done/Go key submits.

        On a phone the action button sits below the keyboard once a field takes
        focus, so finishing an expense meant dismissing the keyboard, finding
        the button and tapping it. Pressing the key already under your thumb is
        the whole interaction instead.

        `noValidate` because validity is `disabled` above, computed from state.
        Letting the browser also enforce `required` would mean two sources of
        truth and a native bubble the dialog cannot style.
      */}
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!disabled) formAction();
        }}
      >
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {children}
          </Stack>
        </DialogContent>
        {/* A hidden submit is what makes Enter work in browsers that only
            submit a form carrying one. */}
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
        <ProminentButtonStyled
          textCenter
          onClick={formAction}
          disabled={disabled}
          data-testid="create-button"
          sx={{
            width: "100%",
            height: 56,
            borderRadius: 0,
            fontSize: tokens.fontSize.md,
          }}
        >
          {formActionText}
        </ProminentButtonStyled>
      </form>
    </Dialog>
  );
};
