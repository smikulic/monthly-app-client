import { useContext } from "react";
import { Link } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box } from "@/components/ui/Box";
import { Skeleton } from "@/components/ui/Skeleton";
import { Typography } from "@/components/ui/Typography";
import { tokens, tabularNums } from "@/theme/tokens";
import { formatAmount } from "../../utils/format";
import { MainListItemStyled } from "../../shared";
import { UserContext } from "../../App";

export const HomeListItemLink = ({
  linkTo,
  title,
  loading,
  value,
  valueColor,
  caption,
  tone = "neutral",
}: {
  linkTo: string;
  title: string;
  loading: boolean;
  // A number is rendered as a formatted amount; a string is shown verbatim
  // (e.g. the Insights fallback before any data loads).
  value: number | string;
  valueColor?: string;
  /** Small line under the figure, for context the figure alone cannot carry. */
  caption?: string;
  /**
   * Almost always "neutral". The dashboard is deliberately all ink so that the
   * one number which is genuinely bad news — being over budget — is the only
   * coloured figure on the screen, and therefore actually means something.
   */
  tone?: "neutral" | "positive" | "negative";
}) => {
  const userCurrency = useContext(UserContext);
  const isFigure = typeof value === "number";
  const displayValue = isFigure ? formatAmount(value, userCurrency) : value;

  return (
    <Link to={linkTo}>
      <MainListItemStyled>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              marginRight: "14px",
              width: "6px",
              background: valueColor,
              borderRadius: "10px",
            }}
          />
          <div>
            {/* The number is the content and the label is the chrome, so the
                label sits small and quiet above it. The reverse — an 18px
                label over a smaller grey amount — read as a list of links
                rather than a summary of money. */}
            <Typography
              variant="overline"
              component="div"
              color="text.secondary"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                lineHeight: 1.6,
              }}
            >
              {title.toUpperCase()}
            </Typography>
            {loading ? (
              <Skeleton
                animation="wave"
                width={140}
                height={isFigure ? 40 : 24}
              />
            ) : (
              <>
                <Typography
                  component="div"
                  color="text.primary"
                  sx={
                    isFigure
                      ? {
                          // Hero figure: the one place the serif earns its bytes.
                          fontFamily: tokens.font.serif,
                          fontSize: "30px",
                          lineHeight: 1.15,
                          color: tokens.money[tone],
                          ...tabularNums,
                        }
                      : // A sentence, not a figure — 30px serif would wrap
                        // badly and read as a headline.
                        { fontSize: "15px", color: tokens.ink.secondary }
                  }
                >
                  {displayValue}
                </Typography>
                {caption && (
                  <Typography
                    component="div"
                    color="text.secondary"
                    sx={{ fontSize: "13px", lineHeight: 1.5 }}
                  >
                    {caption}
                  </Typography>
                )}
              </>
            )}
          </div>
        </Box>
        <ArrowForwardIcon />
      </MainListItemStyled>
    </Link>
  );
};
