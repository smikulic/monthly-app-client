import React from "react";
import { MainListItemStyled } from "@/shared";
import { Skeleton } from "@/components/ui/Skeleton";
import { CategoryDetailsStyled } from "../categories-list-style";

interface Props {
  height: number;
}

export const CategoriesListLoading: React.FC<Props> = ({ height }) => {
  return (
    <>
      <MainListItemStyled>
        <Skeleton animation="wave" width={200} height={height} />
        <CategoryDetailsStyled>
          <Skeleton animation="wave" width={60} height={height} />
        </CategoryDetailsStyled>
      </MainListItemStyled>
      <MainListItemStyled>
        <Skeleton animation="wave" width={200} height={height} />
        <CategoryDetailsStyled>
          <Skeleton animation="wave" width={60} height={height} />
        </CategoryDetailsStyled>
      </MainListItemStyled>
    </>
  );
};
