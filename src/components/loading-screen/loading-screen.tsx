import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingScreenStyled } from "./loading-screen-style";

export const LoadingScreen = () => {
  return (
    <LoadingScreenStyled>
      <CircularProgress
        data-testid="loading-screen"
        color="primary"
        size={80}
        thickness={2}
      />
    </LoadingScreenStyled>
  );
};
