import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import { theme } from "@/theme";

/**
 * Renders under the app's ThemeProvider.
 *
 * Components read semantic tokens that only exist on our theme
 * (`palette.money`, `palette.person`, `palette.section`). MUI's default theme
 * has none of them, so a bare `render` throws as soon as a component is styled
 * from the token palette. Tests should import `render` from here rather than
 * from `@testing-library/react`.
 */
const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const render = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  rtlRender(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export { render };
