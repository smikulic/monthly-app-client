import * as React from "react";
import { Oval } from "react-loader-spinner";

export const LoadingScreen = () => {
  return (
    <div className="loadingScreen">
      <Oval
        height={80}
        width={80}
        color="#277bc0"
        // wrapperStyle={{}}
        // wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#277bc0"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};
