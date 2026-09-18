/**
 * Design tokens — "kitchen table".
 *
 * Warm paper ground, ink text, one restrained accent. Colour carries money
 * meaning and nothing else.
 *
 * Two rules keep this readable as entity types multiply:
 *
 * 1. `money.*` applies only to numeric values. `accent` applies only to
 *    interactive chrome (buttons, links, focus rings). They never take the
 *    same role, which is why a pine button does not read as income.
 * 2. `person[]` is a separate axis and never borrows from `money.*`. Money
 *    colour says what happened; person colour says whose it is.
 *
 * Name tokens for meaning, never appearance: `money.overBudget`, not
 * `orange500`. A palette name has to be reinterpreted at every call site the
 * day the palette changes, and in a finance app the palette changes long
 * before the meanings do.
 *
 * ## Why values live here and not only in CSS
 *
 * This file is the source of truth. `tokens.css` mirrors it as custom
 * properties and `tokens.test.ts` fails if the two drift.
 *
 * The duplication is deliberate. MUI cannot take `var(--accent)` in its
 * palette, because it runs `alpha()` and `lighten()` over those values and
 * needs something parseable; echarts has the same constraint. So JS consumers
 * read this file, while CSS and any future Tailwind `@theme` read the stylesheet
 * — which is what keeps the design identity framework-independent.
 */

export const tokens = {
  /** Page background. Warm paper, not cold grey. */
  ground: "#FAF8F5",
  /** Cards and sheets, lifted off the ground. */
  surface: "#FFFFFF",
  /** Hairline borders and dividers. */
  hairline: "#E8E3DB",

  ink: {
    primary: "#14120F",
    /** Warm grey, deliberately not blue-grey — it sits on a warm ground. */
    secondary: "#6B665E",
    disabled: "#B8B2A8",
  },

  /**
   * Interactive chrome only, never a number. Pine is close to `money.positive`
   * in hue, so it is kept darker and less saturated to stay perceptually
   * distinct from income.
   */
  accent: {
    main: "#2F5D50",
    hover: "#24483E",
    contrastText: "#FAF8F5",
  },

  /**
   * Numeric values only.
   *
   * `neutral` is ink on purpose. Spending is the normal state of a budgeting
   * app, so painting every expense red makes an ordinary month look like
   * failure — which is the 30-day churn cliff rendered in colour. Red is
   * reserved for a limit the user themselves set.
   *
   * `negative` covers any amount that is bad news — over a self-set budget,
   * or an investment down on its cost. It and `error` are close in hue by
   * design but must differ in treatment: `negative` tints the number, `error`
   * carries an icon and a border.
   */
  money: {
    positive: "#3F7D55",
    neutral: "#14120F",
    negative: "#B4552D",
    error: "#8F2E26",
  },

  /**
   * One stable colour per person in a shared household. Chosen to avoid every
   * money hue (green, terracotta, deep red) so an avatar can never be misread
   * as a value. Always paired with an avatar or initial, so colour is never the only channel.
   */
  person: [
    "#6B5B95", // plum
    "#3E6E8E", // dusty blue
    "#8E5572", // mauve
    "#C08A2E", // gold
    "#4A7C87", // teal
    "#7D6B58", // taupe
  ],

  /**
   * Wayfinding only — the marker bars on the dashboard rows, in row order:
   * expenses, budget, saving goals, investments, insights.
   *
   * Categorical, and deliberately clear of every money hue. Red for Expenses
   * or green for Saving Goals would make a standing claim that spending is a
   * failure and saving a success — and would compete with `money.negative` on
   * the one row where red actually means something.
   *
   * This was briefly a single hue in five lightness steps, which was safe and
   * useless: at 6px wide the steps are imperceptible, so the rows had no
   * wayfinding at all.
   *
   * The hues overlap the `person` family. That is harmless rather than
   * accidental — person colours appear in the Insights chart and on the Groups
   * page, these only on the dashboard, so the two never share a screen.
   */
  section: [
    "#4A6FA5", // slate blue — expenses
    "#C08A2E", // ochre — budget
    "#4A7C87", // teal — saving goals
    "#6B5B95", // plum — investments
    "#8E5572", // mauve — insights
  ],

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },

  /**
   * Width of the app's content column. Rows are `space-between`, so uncapped
   * on a wide monitor a label sits against one edge and its amount against the
   * other with a metre of empty paper between them.
   *
   * Full-bleed bars keep their own edge-to-edge border and centre their
   * contents on this instead, so the chrome spans the window while everything
   * inside it lines up with the cards.
   */
  contentMaxWidth: 960,

  /**
   * Horizontal inset of a card inside the content column. Full-bleed bars
   * align to the cards' edge (`contentMaxWidth - cardInset * 2`) rather than
   * the column's, or their contents sit out by exactly this much.
   */
  cardInset: 12,

  /**
   * Shared height for toolbar controls, so the scope filter, month navigation
   * and rollover toggle sit on one baseline instead of each picking its own.
   * Taller on phones, where they are thumb targets.
   */
  controlHeight: 36,
  controlHeightMobile: 40,

  /**
   * Type scale. The app had thirteen distinct hardcoded sizes and no scale, so
   * every new screen invented its own.
   *
   * `md` is the base and is deliberately 16: below that, iOS Safari zooms the
   * page when a form input takes focus, which is a real annoyance in the
   * Android wrapper's sibling on iOS and on mobile web.
   *
   * `hero` is for the Literata figures only — one per card, never body text.
   */
  fontSize: {
    /** Chips and role labels. */
    xs: 12,
    /** Captions and second lines under a figure. */
    sm: 14,
    /** Body, list rows, controls. */
    md: 16,
    /** Card and section titles. */
    lg: 18,
    /** Page headings. */
    xl: 22,
    /** Hero figures, set in the serif. */
    hero: 32,
  },

  /**
   * Personality lives in the display face, neutrality in the text face. The
   * sans does the dense-table work at 13-14px where character is a liability;
   * Literata appears a handful of times per screen at large sizes, which is
   * where the identity can sit at no cost to legibility.
   *
   * The `Variable` suffix is not decorative — `@fontsource-variable/*` registers
   * the family under that exact name, and a stack saying `"Literata"` silently
   * falls through to the next entry.
   *
   * Both `latin-ext` subsets cover U+0100-02BA, so Croatian `č ć đ š ž`,
   * Slovenian, Hungarian `ő ű` and Polish `ł` are all present
   * and drawn by the same hand. `€` (U+20AC) ships in the `latin` subset.
   * Coverage is not the same claim as quality: render the strings named in the
   * plan's verification section before trusting this.
   */
  font: {
    sans: '"Source Sans 3 Variable", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    /** Hero figures only: net worth, month and category totals. */
    serif: '"Literata Variable", Georgia, "Times New Roman", serif',
  },
} as const;

/**
 * Applied wherever a money value renders, so columns align down the page. One
 * declaration, and the cheapest change that makes the app look built rather
 * than assembled.
 */
export const tabularNums = {
  fontVariantNumeric: "tabular-nums",
  fontFeatureSettings: '"tnum"',
} as const;

/**
 * Flat `--name: value` view of the tokens above, used by `tokens.test.ts` to
 * assert `tokens.css` has not drifted. Keys match the custom property names in
 * that file exactly.
 */
export const cssVariables: Record<string, string> = {
  "--ground": tokens.ground,
  "--surface": tokens.surface,
  "--hairline": tokens.hairline,

  "--ink": tokens.ink.primary,
  "--ink-secondary": tokens.ink.secondary,
  "--ink-disabled": tokens.ink.disabled,

  "--accent": tokens.accent.main,
  "--accent-hover": tokens.accent.hover,
  "--accent-contrast": tokens.accent.contrastText,

  "--money-positive": tokens.money.positive,
  "--money-neutral": tokens.money.neutral,
  "--money-negative": tokens.money.negative,
  "--money-error": tokens.money.error,

  ...Object.fromEntries(
    tokens.person.map((color, i) => [`--person-${i + 1}`, color]),
  ),
  ...Object.fromEntries(
    tokens.section.map((color, i) => [`--section-${i + 1}`, color]),
  ),

  "--content-max-width": `${tokens.contentMaxWidth}px`,
  "--card-inset": `${tokens.cardInset}px`,
  "--control-height": `${tokens.controlHeight}px`,
  "--control-height-mobile": `${tokens.controlHeightMobile}px`,

  ...Object.fromEntries(
    Object.entries(tokens.fontSize).map(([k, v]) => [
      `--font-size-${k}`,
      `${v}px`,
    ]),
  ),

  "--radius-sm": `${tokens.radius.sm}px`,
  "--radius-md": `${tokens.radius.md}px`,
  "--radius-lg": `${tokens.radius.lg}px`,

  "--font-sans": tokens.font.sans,
  "--font-serif": tokens.font.serif,
};
