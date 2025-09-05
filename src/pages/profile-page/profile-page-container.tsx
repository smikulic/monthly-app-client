// src/components/ProfilePageContainer.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "@/constants";
import {
  useDeleteAccountMutation,
  User,
  useUpdateUserMutation,
} from "@/generated/graphql";
import { Container } from "@/components/ui/Container";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@/components/ui/Dialog";
import { MenuItem } from "@/components/ui/MenuItem";
import { Typography } from "@/components/ui/Typography";
import { Switch } from "@/components/ui/Switch";
import { FormGroup } from "@/components/ui/FormGroup";
import { FormControlLabel } from "@/components/ui/FormControl";
import { ProminentButtonStyled, SelectStyled, TextFieldStyled } from "@/shared";
import { CURRENCY_OPTIONS } from "@/constants/forms";

export const ProfilePageContainer = ({
  userData,
  refetchUserData,
}: {
  userData: User;
  refetchUserData: () => void;
}) => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState(userData.currency || "EUR");
  const [weeklyReminder, setWeeklyReminder] = useState(
    userData.weeklyReminder || false
  );
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
        <TextFieldStyled placeholder={userData.email} disabled />
        <SelectStyled
          id="userCurrency"
          label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as string)}
        >
          {CURRENCY_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.value} ({opt.label})
            </MenuItem>
          ))}
        </SelectStyled>
        <FormGroup>
          <FormControlLabel
            control={
              <>
                <Switch
                  aria-describedby="weekly-help"
                  checked={weeklyReminder}
                  onChange={(e) => setWeeklyReminder(!weeklyReminder)}
                />
              </>
            }
            label="Weekly expense email (Saturday recap: total spent & budget left)"
          />
        </FormGroup>
        <ProminentButtonStyled
          onClick={() =>
            updateUser({
              variables: { id: userData.id, currency, weeklyReminder },
            })
          }
          disabled={
            currency === userData.currency &&
            weeklyReminder === userData.weeklyReminder
          }
          textCenter
        >
          Save
        </ProminentButtonStyled>
      </Container>

      <Container>
        <Typography variant="h5" color="error">
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Permanently delete your account and all data.
        </Typography>
        <ProminentButtonStyled
          onClick={() => setOpenDialog(true)}
          color="error"
          textCenter
          outline
        >
          Delete my account
        </ProminentButtonStyled>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm account deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure? This action <strong>cannot</strong> be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ProminentButtonStyled onClick={() => setOpenDialog(false)}>
              Cancel
            </ProminentButtonStyled>
            <ProminentButtonStyled
              onClick={() => deleteAccount()}
              disabled={deleting}
              color="error"
              outline
            >
              {deleting ? "Deleting…" : "Delete my account"}
            </ProminentButtonStyled>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};
