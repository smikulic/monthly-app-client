import { useContext } from "react";
import { Link } from "react-router";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box } from "@/components/ui/Box";
import { Skeleton } from "@/components/ui/Skeleton";
import { Typography } from "@/components/ui/Typography";
import { formatAmount } from "../../utils/format";
import { BoxItemStyled } from "../../shared";
import { UserContext } from "../../App";

export const HomeListItemLink = ({
  linkTo,
  title,
  loading,
  value,
  wide = false,
}: {
  linkTo: string;
  title: string;
  loading: boolean;
  // A number is rendered as a formatted amount; a string is shown verbatim
  // (e.g. the Insights summary line).
  value: number | string;
  // Spans the full grid row rather than a single column.
  wide?: boolean;
}) => {
  const userCurrency = useContext(UserContext);
  const displayValue =
    typeof value === "number" ? formatAmount(value, userCurrency) : value;
  const isNumeric = typeof value === "number";

  return (
    <Link
      to={linkTo}
      aria-label={`${title}: ${displayValue}`}
      style={{
        display: "block",
        width: "100%",
        textDecoration: "none",
        color: "inherit",
        borderRadius: "12px",
        // Native tap flash on iOS and Android: touch feedback that does not
        // depend on hover.
        WebkitTapHighlightColor: "rgba(59, 206, 177, 0.24)",
      }}
    >
      <BoxItemStyled>
        <Box sx={{ minWidth: 0 }}>
          {/* Mint label: mint means brand and interactive throughout the app,
              so it doubles as an at-rest affordance on touch. */}
          <Typography
            variant="body2"
            color="primary.main"
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>
          {loading ? (
            <Skeleton animation="wave" width={110} height={40} />
          ) : (
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                // Amounts get the display size; the Insights summary is a
                // sentence, so it stays at reading size.
                fontSize: isNumeric ? "32px" : "17px",
                fontWeight: isNumeric ? 600 : 400,
                lineHeight: 1.2,
                marginTop: "6px",
              }}
            >
              {displayValue}
            </Typography>
          )}
        </Box>
        <ChevronRightIcon className="tile-chevron" fontSize="medium" />
      </BoxItemStyled>
    </Link>
  );
};
