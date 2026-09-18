// src/components/ui/MenuItem.tsx
//
// Re-exported rather than wrapped in an `React.FC<MenuItemProps>`. MUI's
// MenuItem is polymorphic — `component="a"` swaps the rendered element and
// widens its props to that element's — and wrapping it in a plain FC collapses
// that to the default `li`, so `href` and `target` stop typechecking.
//
// This still serves the facade's purpose: every import comes through here, so
// swapping the underlying library remains a one-file change.
export { MenuItem } from "@mui/material";
export type { MenuItemProps } from "@mui/material";
