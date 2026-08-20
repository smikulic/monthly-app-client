import { useContext } from "react";
import { Link } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box } from "@/components/ui/Box";
import { Skeleton } from "@/components/ui/Skeleton";
import { Typography } from "@/components/ui/Typography";
import { formatAmount } from "../../utils/format";
import { MainListItemStyled } from "../../shared";
import { UserContext } from "../../App";

export const HomeListItemLink = ({
  linkTo,
  title,
  loading,
  value,
}: {
  linkTo: string;
  title: string;
  loading: boolean;
  // A number is rendered as a formatted amount; a string is shown verbatim
  // (e.g. the Insights summary line).
  value: number | string;
}) => {
  const userCurrency = useContext(UserContext);
  const displayValue =
    typeof value === "number" ? formatAmount(value, userCurrency) : value;

  return (
    <Link to={linkTo}>
      <MainListItemStyled>
        <Box sx={{ display: "flex" }}>
          {/* One brand rail on every row, marking these as the app's main
              navigation targets. Previously each row had its own hue, which
              encoded nothing: the rows are destinations, not a scale. */}
          <Box
            sx={{
              marginRight: "10px",
              width: "6px",
              background: (theme) => theme.palette.primary.main,
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
                {displayValue}
              </Typography>
            )}
          </div>
        </Box>
        <ArrowForwardIcon />
      </MainListItemStyled>
    </Link>
  );
};
