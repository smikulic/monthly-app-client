// src/components/ui/Skeleton.tsx
import React from "react";
import { Skeleton as MuiSkeleton, SkeletonProps } from "@mui/material";

/**
 * A thin wrapper around MUI Skeleton for consistent placeholder styling.
 */
export const Skeleton: React.FC<SkeletonProps> = (props) => (
  <MuiSkeleton {...props} />
);
