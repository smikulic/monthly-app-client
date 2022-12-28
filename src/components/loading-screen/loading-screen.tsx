import * as React from "react";
import { Triangle } from "react-loader-spinner";

export const LoadingScreen = () => {
  return (
    <div className="loadingScreen">
      <Triangle
        height="80"
        width="80"
        color="#277bc0"
        ariaLabel="triangle-loading"
        // wrapperStyle={{}}
        // wrapperClassName=""
        visible={true}
      />
    </div>
  );
};
