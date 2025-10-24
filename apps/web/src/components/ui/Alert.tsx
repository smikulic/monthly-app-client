// src/components/ui/Alert.tsx
import React from "react";
import {
  Alert as MuiAlert,
  AlertProps,
  AlertTitle as MuiAlertTitle,
  AlertTitleProps,
} from "@mui/material";

export const Alert: React.FC<AlertProps> = (props) => <MuiAlert {...props} />;
export const AlertTitle: React.FC<AlertTitleProps> = (props) => (
  <MuiAlertTitle {...props} />
);
