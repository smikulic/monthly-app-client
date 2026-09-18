// src/components/ui/Collapse.tsx
import React from "react";
import { Collapse as MuiCollapse, CollapseProps } from "@mui/material";

/**
 * Expand/collapse for list rows.
 *
 * `unmountOnExit` keeps the old `{open && ...}` behaviour: children are gone
 * from the tree when closed, so a long expense list is not mounted for every
 * collapsed category on the page.
 *
 * 150ms is deliberately short. Collapse animates height, which triggers
 * layout every frame, and these lists can run to dozens of rows on a
 * mid-range phone in the Android wrapper.
 */
export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  (props, ref) => (
    <MuiCollapse ref={ref} timeout={150} unmountOnExit {...props} />
  ),
);

export type { CollapseProps };
