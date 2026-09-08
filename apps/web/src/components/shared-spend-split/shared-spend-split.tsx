import { useContext, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";
import { Box } from "@/components/ui/Box";
import { Typography } from "@/components/ui/Typography";

export interface SharedSpender {
  userId: string;
  name: string;
  spent: number;
}

export interface SharedSplit {
  subcategoryId: string;
  subcategoryName: string;
  categoryName: string;
  total: number;
  perUser: SharedSpender[];
}

/**
 * Who paid what in shared categories, as proportions rather than numbers to
 * compare by eye.
 *
 * Colour is keyed on `userId` rather than position, so a person keeps the same
 * colour between the headline and every row, and between months where the
 * ordering by spend changes.
 */
export const SharedSpendSplit = ({
  totalsByUser,
  splits,
}: {
  totalsByUser: SharedSpender[];
  splits: SharedSplit[];
}) => {
  const theme = useTheme();
  const userCurrency = useContext(UserContext);
  const fmt = (n: number) => formatAmount(n, userCurrency);
  const { palette } = theme;

  const colorFor = useMemo(() => {
    const colors = [
      palette.primary.main,
      palette.secondary.main,
      palette.warning.main,
      palette.info.main,
      palette.success.main,
      palette.error.main,
    ];
    // Sorted by id so the assignment does not shift when spend does.
    const ids = [...totalsByUser.map((u) => u.userId)].sort();
    const map: Record<string, string> = {};
    ids.forEach((id, i) => {
      map[id] = colors[i % colors.length];
    });
    return map;
  }, [
    totalsByUser,
    palette.primary.main,
    palette.secondary.main,
    palette.warning.main,
    palette.info.main,
    palette.success.main,
    palette.error.main,
  ]);

  const Bar = ({
    segments,
    height,
  }: {
    segments: SharedSpender[];
    height: number;
  }) => {
    const total = segments.reduce((sum, s) => sum + s.spent, 0);

    return (
      <Box
        sx={{
          display: "flex",
          height,
          borderRadius: height / 2,
          overflow: "hidden",
          backgroundColor: palette.action.hover,
        }}
      >
        {total > 0 &&
          segments
            .filter((s) => s.spent > 0)
            .map((s) => (
              <Box
                key={s.userId}
                sx={{
                  width: `${(s.spent / total) * 100}%`,
                  backgroundColor: colorFor[s.userId],
                }}
              />
            ))}
      </Box>
    );
  };

  const monthTotal = totalsByUser.reduce((sum, u) => sum + u.spent, 0);

  return (
    <>
      <Bar segments={totalsByUser} height={12} />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 1.5,
          mb: 1,
        }}
      >
        {totalsByUser.map((u) => (
          <Box
            key={u.userId}
            sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: colorFor[u.userId],
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" component="span">
              {u.name} {fmt(u.spent)}
            </Typography>
            {monthTotal > 0 && (
              <Typography variant="body2" component="span" color="textSecondary">
                · {Math.round((u.spent / monthTotal) * 100)}%
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {splits.map((s) => (
        <Box key={s.subcategoryId} sx={{ pt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {s.subcategoryName}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {fmt(s.total)}
            </Typography>
          </Box>
          <Typography variant="caption" color="textSecondary">
            {s.categoryName}
          </Typography>

          <Box sx={{ mt: 0.75 }}>
            <Bar segments={s.perUser} height={6} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              mt: 0.75,
            }}
          >
            {s.perUser.map((u) => (
              <Typography
                key={u.userId}
                variant="caption"
                // Nobody's contribution is hidden, but a zero is muted so the
                // eye lands on who actually paid.
                color={u.spent > 0 ? "textPrimary" : "textSecondary"}
              >
                {u.name} {fmt(u.spent)}
              </Typography>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
};
