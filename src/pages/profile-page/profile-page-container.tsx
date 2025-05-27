// src/components/ProfilePageContainer.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "@/constants";
import {
  useDeleteAccountMutation,
  User,
  useUpdateUserMutation,
} from "@/generated/graphql";
import {
  DangerButton,
  OutlineButton,
  PrimaryButton,
} from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@/components/ui/Dialog";
import { MenuItem } from "@/components/ui/MenuItem";
import { SelectField } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import { Typography } from "@/components/ui/Typography";

export const ProfilePageContainer = ({
  userData,
  refetchUserData,
}: {
  userData: User;
  refetchUserData: () => void;
}) => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState(userData.currency || "EUR");
  const [openDialog, setOpenDialog] = useState(false);

  const [updateUser] = useUpdateUserMutation({
    onCompleted: () => {
      refetchUserData();
      toast.success("Profile updated");
    },
  });

  const [deleteAccount, { loading: deleting }] = useDeleteAccountMutation({
    onCompleted: (data) => {
      if (data.deleteAccount) {
        localStorage.removeItem(AUTH_TOKEN_USER);
        localStorage.removeItem(AUTH_TOKEN);
        toast.success("Account deleted");
        navigate("/welcome");
      }
    },
    onError: (err) => {
      toast.error(err.message);
      setOpenDialog(false);
    },
  });

  return (
    <>
      <Container>
        <Typography variant="h5">Profile information</Typography>
        <TextField label={userData.email} disabled />
        <SelectField
          id="userCurrency"
          label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as string)}
        >
          {[
            { value: "USD", label: "$" },
            { value: "EUR", label: "€" },
            { value: "GBP", label: "£" },
            { value: "CAD", label: "$" },
          ].map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.value} ({opt.label})
            </MenuItem>
          ))}
        </SelectField>
        <PrimaryButton
          onClick={() =>
            updateUser({ variables: { id: userData.id, currency } })
          }
          disabled={currency === userData.currency}
        >
          Save
        </PrimaryButton>
      </Container>

      <Container>
        <Typography variant="h5" color="error">
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Permanently delete your account and all data.
        </Typography>
        <OutlineButton color="error" onClick={() => setOpenDialog(true)}>
          Delete my account
        </OutlineButton>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm account deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure? This action <strong>cannot</strong> be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <PrimaryButton onClick={() => setOpenDialog(false)}>
              Cancel
            </PrimaryButton>
            <DangerButton onClick={() => deleteAccount()} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete my account"}
            </DangerButton>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};
