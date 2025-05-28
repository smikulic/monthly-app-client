import React from "react";
import { useLocation } from "react-router";

export const useParamsQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};
