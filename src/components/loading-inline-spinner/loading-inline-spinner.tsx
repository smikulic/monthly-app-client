import * as React from "react";
import { Triangle } from "react-loader-spinner";

export const LoadingInlineSpinner = () => {
  return (
    <>
      <Triangle
        height="22"
        width="22"
        color="#277bc0"
        ariaLabel="triangle-loading"
        wrapperStyle={{
          display: "inline",
          marginLeft: "12px",
        }}
        visible={true}
      />
    </>
  );
};
