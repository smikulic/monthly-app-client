// src/components/ui/Container.tsx
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Page wrapper for the form-style pages: Groups, Settings, Reports and the
 * invite acceptance page.
 *
 * No border or padding of its own. It used to be a bordered, padded card, but
 * those pages now put each section in its own `SectionCard`, so the frame drew
 * a border immediately outside a near-identical one — and wrapped the page
 * heading, which belongs outside any card.
 *
 * The margin stays: it is the side gutter, matching the inset the list pages
 * give their cards.
 */
export const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  margin: theme.spacing(2),
}));
