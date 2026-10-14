import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./index";
import { TextFieldStyled, SelectStyled } from "@/shared";
import { MenuItem } from "@/components/ui/MenuItem";

/**
 * Two defects that only showed up on a phone, both invisible to a test that
 * checks the DOM rather than the styles.
 */
const styles = () =>
  Array.from(document.querySelectorAll("style"))
    .map((s) => s.textContent ?? "")
    .join("\n");

const rulesFor = (el: Element) => {
  const cls = Array.from(el.classList).filter((c) => c.startsWith("css-"));
  return styles()
    .split("}")
    .filter((r) => cls.some((c) => r.includes(c)))
    .join("}");
};

describe("form control rendering", () => {
  /**
   * The outline is notched for the floating label by a hidden `<legend>` sized
   * at `font-size: 0.75em`, while the label is full size shrunk by
   * `transform: scale(0.75)`. Those measure the same only while the font's
   * metrics scale linearly, and on iOS they did not — the outline drew through
   * the label. The background is what makes the label not depend on it.
   */
  it("gives a shrunk outlined label an opaque background", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <TextFieldStyled id="amount" label="Amount" value="12" onChange={() => {}} />
      </ThemeProvider>,
    );

    const label = container.querySelector("label")!;
    expect(label.getAttribute("data-shrink")).toBe("true");
    expect(rulesFor(label)).toContain(theme.palette.surface);
  });

  /**
   * `text-overflow: ellipsis` only applies to inline content in a block
   * container, so centring the Select's value with `display: flex` silently
   * turned MUI's truncation off and a long value was cut mid-character at the
   * border.
   */
  it("leaves the Select's value truncatable", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <SelectStyled id="paid-by" label="Paid by" value="a">
          <MenuItem value="a">someone@example.com</MenuItem>
        </SelectStyled>
      </ThemeProvider>,
    );

    const rules = rulesFor(container.querySelector(".MuiFormControl-root")!);
    const select = rules.slice(rules.indexOf(".MuiSelect-select"));
    expect(select).not.toContain("display:-webkit-box");
    expect(select).toContain("display:block");
  });
});
