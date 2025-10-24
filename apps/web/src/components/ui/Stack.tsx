// src/components/ui/Stack.tsx
import React from "react";
import { Stack as MuiStack, StackProps } from "@mui/material";

export const Stack: React.FC<StackProps> = (props) => <MuiStack {...props} />;
