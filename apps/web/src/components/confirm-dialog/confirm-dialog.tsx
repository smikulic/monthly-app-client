import { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@/components/ui/Dialog";
import { ProminentButtonStyled } from "@/shared";

/**
 * Confirmation for an action that cannot be undone.
 *
 * Extracted from the copies in the profile and reports pages once Groups
 * needed two more. Destructive actions there previously fired on a single
 * click — deleting a group is irreversible and affects everyone in it.
 */
export const ConfirmDialog = ({
  open,
  title,
  children,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{children}</DialogContentText>
    </DialogContent>
    <DialogActions>
      {/* Cancel first and outlined, so the destructive button is never the
          one under a thumb resting on the primary position. */}
      <ProminentButtonStyled onClick={onCancel} textCenter outline>
        Cancel
      </ProminentButtonStyled>
      <ProminentButtonStyled
        onClick={onConfirm}
        disabled={busy}
        color="error"
        textCenter
      >
        {busy ? "Working…" : confirmLabel}
      </ProminentButtonStyled>
    </DialogActions>
  </Dialog>
);
