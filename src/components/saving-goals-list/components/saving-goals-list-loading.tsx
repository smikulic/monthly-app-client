import React from "react";
import { MainListItemStyled } from "../../../shared";
import { Skeleton } from "@mui/material";
import { CategoryDetailsStyled } from "../../categories-list/categories-list-style";

export const SavingGoalsListLoading: React.FC = () => {
  return (
    <>
      <MainListItemStyled>
        <Skeleton animation="wave" width={200} height={44} />
        <CategoryDetailsStyled>
          <Skeleton animation="wave" width={60} height={44} />
        </CategoryDetailsStyled>
      </MainListItemStyled>
      <MainListItemStyled>
        <Skeleton animation="wave" width={200} height={44} />
        <CategoryDetailsStyled>
          <Skeleton animation="wave" width={60} height={44} />
        </CategoryDetailsStyled>
      </MainListItemStyled>
      <MainListItemStyled>
        <Skeleton animation="wave" width={200} height={44} />
        <CategoryDetailsStyled>
          <Skeleton animation="wave" width={60} height={44} />
        </CategoryDetailsStyled>
      </MainListItemStyled>
    </>
  );
};
