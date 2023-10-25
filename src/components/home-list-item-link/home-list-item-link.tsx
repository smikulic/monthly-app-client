import React from "react";
import { Link } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import { Skeleton } from "@mui/material";
import { formatAmount } from "../../utils/format";
import { MainListItemStyled } from "../../shared";

export const HomeListItemLink = ({
  linkTo,
  title,
  loading,
  value,
  valueColor,
}: {
  linkTo: string;
  title: string;
  loading: boolean;
  value: number;
  valueColor?: "red" | "orange";
}) => {
  return (
    <Link to={linkTo}>
      <MainListItemStyled>
        {loading ? (
          <>
            <Skeleton animation="wave" width={200} height={20} />
            <Skeleton animation="wave" width={60} height={20} />
          </>
        ) : (
          <>
            <Box
              sx={(theme) => ({
                display: "flex",
                "&:hover svg": {
                  color: theme.palette.secondary.main,
                },
              })}
            >
              {title} <ChevronRightIcon />
            </Box>
            <span className={valueColor}>{formatAmount(value)}</span>
          </>
        )}
      </MainListItemStyled>
    </Link>
  );
};
