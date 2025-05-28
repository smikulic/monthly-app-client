import React from "react";
import { Link } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import { Skeleton, Typography } from "@mui/material";
import { formatAmount } from "../../utils/format";
import { MainListItemStyled } from "../../shared";
import { UserContext } from "../../App";

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
  valueColor?: string;
}) => {
  const userCurrency = React.useContext(UserContext);

  return (
    <Link to={linkTo}>
      <MainListItemStyled>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              marginRight: "10px",
              width: "6px",
              background: valueColor,
              borderRadius: "10px",
            }}
          />
          <div>
            <Typography
              variant="body1"
              fontSize="18px"
              color="primary.contrastText"
            >
              {title}
            </Typography>
            {loading ? (
              <Skeleton animation="wave" width={60} height={24} />
            ) : (
              <Typography variant="body1" color="text.secondary">
                {formatAmount(value, userCurrency)}
              </Typography>
            )}
          </div>
        </Box>
        <ArrowForwardIcon />
      </MainListItemStyled>
    </Link>
  );
};
