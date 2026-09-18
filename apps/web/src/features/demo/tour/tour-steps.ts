/**
 * What the first-run tour says, and where it says it.
 *
 * Separated from the machinery so the copy can be read as copy. Each step names
 * the route it needs and the `data-tour` anchor it points at; the runner
 * handles getting there.
 *
 * ## Anchors are `data-tour` attributes, never class names
 *
 * Emotion hashes its class names and rewrites them on any style change, so a
 * tour anchored on styling breaks invisibly the first time somebody adjusts
 * padding. A `data-tour` attribute turns up in a grep when the component is
 * edited, which is the difference between a break someone notices and one
 * nobody does.
 *
 * ## The mobile list is shorter on purpose
 *
 * Below `sm` the month toolbar is fixed to the bottom of the viewport, so a
 * spotlight on something behind it teaches nothing. Those steps are dropped
 * rather than repositioned — a tour that skips a control is better than one
 * that highlights a control the reader cannot see.
 */

export interface TourStep {
  /** Route this step needs, if it differs from the one before. */
  route?: string;
  /** The `data-tour` value to spotlight. Omitted for a centred message. */
  anchor?: string;
  title: string;
  description: string;
  /** Dropped below the `sm` breakpoint. */
  desktopOnly?: boolean;
  /**
   * Run before the step is shown — expanding a row the step points inside of,
   * for instance. The runner waits for the anchor afterwards.
   */
  prepare?: () => void;
}

const expandFirstCategory = () => {
  // The add-expense row only exists once its category is open. Clicking the
  // real header rather than reaching into React state keeps this honest: if
  // the header stops being clickable, the tour fails the same way a user would.
  document
    .querySelector<HTMLElement>('[data-tour="expense-category-header"]')
    ?.click();
};

export const tourSteps: TourStep[] = [
  {
    route: "/",
    title: "This is someone else's money",
    description:
      "A sample household with a year of spending behind it, so there is something to actually look at. None of it touches your account. Leave at any time from the bar at the top.",
  },
  {
    anchor: "home-expenses",
    title: "What you actually spent",
    description:
      "Every expense this household recorded this month, added up. Tap through to see where it went.",
  },
  {
    anchor: "home-budget",
    title: "What you planned to spend",
    description:
      "The budget is the other half. The gap between these two numbers is the whole point of the app.",
  },
  {
    anchor: "month-nav",
    title: "One month at a time",
    description:
      "Everything on screen belongs to the month shown here. Step back through the year and the figures follow.",
  },
  {
    route: "/budget",
    anchor: "budget-category",
    title: "Categories, then the detail",
    description:
      "Budgets live in categories like Home and Food, each holding the lines you actually spend on. Open one to set amounts.",
  },
  {
    route: "/expenses",
    anchor: "expense-category",
    title: "Spending against the plan",
    description:
      "The same categories, now showing what has gone out against what was budgeted. The bar fills as the month does.",
  },
  {
    anchor: "rollover-toggle",
    title: "Rollover: what you didn't spend",
    description:
      "Underspend a category and the difference carries forward. Turn this on to budget against everything saved so far rather than this month alone — the Pharmacy line here has been building up for months.",
    desktopOnly: true,
  },
  {
    anchor: "add-expense",
    title: "And this is where one gets added",
    description:
      "Recording an expense moves the category total, the budget bar and every figure in Insights at once. That loop — spend, record, see where you stand — is the whole app.",
    prepare: expandFirstCategory,
  },
  {
    route: "/insights",
    anchor: "insights-this-month",
    title: "Where you stand today",
    description:
      "Safe to spend is what is left after the month's budget meets the month's spending, compared against where you were last month.",
  },
  {
    anchor: "insights-pace",
    title: "Which categories are running hot",
    description:
      "Pace projects each category to the end of the month from how fast it is being spent, so you find out in week two rather than week four.",
  },
  {
    anchor: "insights-shared",
    title: "And who paid for what",
    description:
      "Share a category with your household and every expense records who paid. Nobody has to keep a tally in their head, or a spreadsheet nobody else opens.",
  },
  {
    title: "Now for yours",
    description:
      "That is the whole app. Next you can set up your own budget in a couple of minutes, or leave the demo and start from a blank sheet.",
  },
];
