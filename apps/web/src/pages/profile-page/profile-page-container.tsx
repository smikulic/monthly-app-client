// src/pages/profile-page/profile-page-container.tsx
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
import { MenuItem } from "@/components/ui/MenuItem";
import { Typography } from "@/components/ui/Typography";
import { Switch } from "@/components/ui/Switch";
import { FormGroup } from "@/components/ui/FormGroup";
import { FormControlLabel } from "@/components/ui/FormControl";
import { SectionCard } from "@/components/section-card/section-card";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import {
  ProminentButtonStyled,
  SelectStyled,
  TextFieldStyled,
  PageWrapperStyled,
  ButtonGroupStyled,
} from "@/shared";
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
    userData.weeklyReminder || false,
  );
  const [openDialog, setOpenDialog] = useState(false);

  const [updateUser] = useUpdateUserMutation({
    onCompleted: () => {
      refetchUserData();
      toast.success("Settings saved");
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
        <PageWrapperStyled>
          <Typography variant="h5">Settings</Typography>

          <SectionCard
            title="Account"
            description="Your sign-in email and how amounts are shown."
          >
            <TextFieldStyled
              label="Email"
              defaultValue={userData.email}
              disabled
            />
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
                  <Switch
                    aria-describedby="weekly-help"
                    checked={weeklyReminder}
                    onChange={() => setWeeklyReminder(!weeklyReminder)}
                  />
                }
                label="Weekly expense email (Saturday recap: total spent & budget left)"
              />
            </FormGroup>
            <ButtonGroupStyled>
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
            </ButtonGroupStyled>
          </SectionCard>

          <SectionCard
            danger
            title="Danger zone"
            description="Permanently delete your account and all data."
          >
            <ButtonGroupStyled>
              <ProminentButtonStyled
                onClick={() => setOpenDialog(true)}
                color="error"
                textCenter
                outline
              >
                Delete my account
              </ProminentButtonStyled>
            </ButtonGroupStyled>
          </SectionCard>

          <ConfirmDialog
            open={openDialog}
            title="Delete account"
            confirmLabel="Delete my account"
            busy={deleting}
            onConfirm={() => deleteAccount()}
            onCancel={() => setOpenDialog(false)}
          >
            This deletes your account and every category, expense, saving goal
            and investment in it. This <strong>cannot</strong> be undone.
          </ConfirmDialog>
        </PageWrapperStyled>
      </Container>
    </>
  );
};
