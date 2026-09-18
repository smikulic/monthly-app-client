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
  // `palette.person`, never the semantic slots. Those carry money meaning, so
  // drawing people from them made a person render in the same green as income
  // and quietly reassigned everyone's colour whenever the palette changed.
  const colors = palette.person;

  const map: Record<string, string> = {};
  [...userIds].sort().forEach((id, i) => {
    map[id] = colors[i % colors.length];
  });

  return map;
};
