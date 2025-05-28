// src/components/ui/Alert.tsx
import React from "react";
import { Alert as MuiAlert, AlertProps } from "@mui/material";

export const Alert: React.FC<AlertProps> = (props) => <MuiAlert {...props} />;
