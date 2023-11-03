import React from "react";
import { MainListItemStyled } from "../../../shared";
import { CategoryDetailsStyled } from "../categories-list-style";
import { Skeleton } from "@mui/material";

export const CategoriesListLoading: React.FC = () => {
  return (
    <>
      <MainListItemStyled>
        <Skeleton animation="wave" width={200} height={34} />
        <CategoryDetailsStyled>
          <Skeleton animation="wave" width={60} height={34} />
        </CategoryDetailsStyled>
      </MainListItemStyled>
      <MainListItemStyled>
        <Skeleton animation="wave" width={200} height={34} />
        <CategoryDetailsStyled>
          <Skeleton animation="wave" width={60} height={34} />
        </CategoryDetailsStyled>
      </MainListItemStyled>
    </>
  );
};
