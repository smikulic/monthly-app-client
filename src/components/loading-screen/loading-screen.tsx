import * as React from "react";
import { Oval } from "react-loader-spinner";
import { LoadingScreenStyled } from "./loading-screen-style";

export const LoadingScreen = () => {
  return (
    <LoadingScreenStyled>
      <Oval
        height={80}
        width={80}
        color="#41efcd"
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#41efcd"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </LoadingScreenStyled>
  );
};
