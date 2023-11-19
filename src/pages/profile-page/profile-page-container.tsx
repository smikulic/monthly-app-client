import React, { useState } from "react";
import { User, useUpdateUserMutation } from "../../generated/graphql";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

export const PageContainerStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  margin: "10px 12px",
  padding: "16px 20px",
  border: `1px solid ${theme.palette.text.disabled}`,
  borderRadius: "16px",
}));

const currencies = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "EUR",
    label: "€",
  },
  {
    value: "GBP",
    label: "£",
  },
  {
    value: "CAD",
    label: "$",
  },
];

export const ProfilePageContainer = ({
  userData,
  refetchUserData,
}: {
  userData: User;
  refetchUserData: () => void;
}) => {
  const userCurrency = userData.currency || "EUR";
  const [currency, setCurrency] = useState(userCurrency);
  const disabled = currency === userCurrency;

  const [updateUser] = useUpdateUserMutation({
    onCompleted: () => {
      refetchUserData();
      toast.success(`You have successfully updated your profile!`);
    },
  });

  return (
    <>
      <PageContainerStyled>
        <Typography variant="h5" color="text.primary">
          Profile information
        </Typography>

        <br />
        <TextField label={userData.email} fullWidth disabled />

        <br />
        <Select
          labelId="userCurrency-label"
          id="userCurrency"
          value={currency}
          label="Currency"
          onChange={(e) => {
            setCurrency(e.target.value);
          }}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <div>{option.value}</div>
                <div>({option.label})</div>
              </Box>
            </MenuItem>
          ))}
        </Select>

        <br />
        <Button
          variant="contained"
          autoFocus
          onClick={() => {
            updateUser({ variables: { id: userData.id, currency } });
          }}
          disabled={disabled}
        >
          Save
        </Button>
      </PageContainerStyled>
    </>
  );
};
