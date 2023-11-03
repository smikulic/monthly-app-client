import React from "react";
import { Skeleton } from "@mui/material";
import { MainListItemStyled } from "../../../shared";

export const ExpensesListLoading: React.FC = () => {
  return (
    <>
      <MainListItemStyled>
        <Skeleton animation="wave" width={200} height={24} />
        <Skeleton animation="wave" width={60} height={24} />
      </MainListItemStyled>
      <MainListItemStyled>
        <Skeleton animation="wave" width={200} height={24} />
        <Skeleton animation="wave" width={60} height={24} />
      </MainListItemStyled>
    </>
  );
};
