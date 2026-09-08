import type { Theme } from "@mui/material";

/**
 * A stable colour per person, shared by the yearly chart and the monthly split
 * so someone is the same colour everywhere.
 *
 * Keyed on sorted `userId` rather than position: the server orders people by
 * spend, which changes month to month, and a positional palette would swap
 * colours whenever one person overtook another.
 */
export const getPersonColors = (
  userIds: string[],
  palette: Theme["palette"],
): Record<string, string> => {
  const colors = [
    palette.primary.main,
    palette.secondary.main,
    palette.warning.main,
    palette.info.main,
    palette.success.main,
    palette.error.main,
  ];

  const map: Record<string, string> = {};
  [...userIds].sort().forEach((id, i) => {
    map[id] = colors[i % colors.length];
  });

  return map;
};
