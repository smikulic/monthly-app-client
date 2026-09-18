/**
 * The budget offered at the end of onboarding.
 *
 * Starter categories are created *here*, by a person who chose them, rather
 * than seeded into every account at signup. Rows nobody asked for are rows
 * somebody has to delete before they can start, and an account quietly
 * pre-filled with a stranger's idea of a budget is the wrong first impression
 * for an app about your own money.
 *
 * Amounts are whole currency units and deliberately round: they are a prompt
 * to be corrected, not a claim about anyone's life. Everything is editable in
 * the second step and afterwards.
 */

export interface StarterLine {
  name: string;
  amount: number;
}

export interface StarterCategory {
  name: string;
  /** Preselected unless the line is genuinely optional for most households. */
  selected: boolean;
  lines: StarterLine[];
}

export const starterBudget: StarterCategory[] = [
  {
    name: "Home",
    selected: true,
    lines: [
      { name: "Rent or mortgage", amount: 800 },
      { name: "Utilities", amount: 120 },
      { name: "Internet and phone", amount: 40 },
    ],
  },
  {
    name: "Food",
    selected: true,
    lines: [
      { name: "Groceries", amount: 400 },
      { name: "Eating out", amount: 120 },
    ],
  },
  {
    name: "Transport",
    selected: true,
    lines: [
      { name: "Fuel or tickets", amount: 100 },
      { name: "Car and repairs", amount: 50 },
    ],
  },
  {
    name: "Fun",
    selected: true,
    lines: [
      { name: "Subscriptions", amount: 30 },
      { name: "Going out", amount: 80 },
    ],
  },
  {
    name: "Health",
    selected: false,
    lines: [
      { name: "Pharmacy", amount: 40 },
      { name: "Appointments", amount: 40 },
    ],
  },
  {
    name: "Family",
    selected: false,
    lines: [
      { name: "Childcare", amount: 200 },
      { name: "School and activities", amount: 80 },
    ],
  },
];
