/**
 * Answers the app's queries from the demo dataset, with no server in the loop.
 *
 * Every response is *derived* from the working copy rather than stored
 * pre-shaped. That is what makes the demo writable for free: a mutation edits
 * the copy, the next query recomputes, and the budget visibly moves. Storing
 * canned responses would have meant patching each one by hand.
 *
 * The shapes mirror `monthly-app-server/src/resolvers/`. Where the server
 * buckets by local month (expenses, insights, charts) so does this; where it
 * keys on UTC month starts (budget schedules) so does this. Getting that split
 * wrong shifts a month's figures by one in either direction.
 *
 * `__typename` is set explicitly on everything: Apollo adds the field to every
 * query, so a response without it makes the cache complain on every write.
 */
import {
  amountForMonth,
  accruedBudget,
  parseMonthStartUTC,
} from "./budget-periods";
import {
  DemoCategory,
  DemoExpense,
  DemoState,
  DemoSubcategory,
} from "./demo-dataset";

/** Every date the schema types as String is serialised as epoch milliseconds. */
const epoch = (date: Date) => String(date.getTime());

const TOP_N = 5;
const STREAK_LOOKBACK = 6;

interface ScopeArgs {
  scope?: string | null;
  groupId?: string | null;
}

/** Mirrors `categoryScopeWhere`: the viewer owns everything personal here. */
const inScope = (categories: DemoCategory[], args: ScopeArgs) => {
  if (args.scope === "MINE") return categories.filter((c) => !c.groupId);
  if (args.scope === "GROUP") {
    return categories.filter((c) => c.groupId === args.groupId);
  }
  return categories;
};

const subcategoriesOf = (categories: DemoCategory[]) =>
  categories.flatMap((category) => category.subcategories);

const monthIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth();

const monthStartFromIndex = (index: number) =>
  new Date(Date.UTC(Math.floor(index / 12), index % 12, 1));

/** Local-month window, matching the server's `getFilterDateRange`. */
const inMonth = (date: Date, year: number, month: number) =>
  date >= new Date(year, month, 1) && date < new Date(year, month + 1, 1);

const spentIn = (
  expenses: DemoExpense[],
  subcategoryId: string,
  predicate: (date: Date) => boolean,
) =>
  expenses.reduce(
    (total, expense) =>
      expense.subcategoryId === subcategoryId && predicate(expense.date)
        ? total + expense.amount
        : total,
    0,
  );

const shapeSubcategory = (
  state: DemoState,
  subcategory: DemoSubcategory,
  viewedMonth: Date,
) => {
  const monthEnd = new Date(
    Date.UTC(viewedMonth.getUTCFullYear(), viewedMonth.getUTCMonth() + 1, 1),
  );

  // Everything accrued through the end of the viewed month, minus everything
  // ever spent up to that point — the rollover figure.
  const spentToDate = spentIn(
    state.expenses,
    subcategory.id,
    (date) => date < monthEnd,
  );

  return {
    __typename: "Subcategory",
    id: subcategory.id,
    categoryId: subcategory.categoryId,
    createdAt: epoch(subcategory.createdAt),
    name: subcategory.name,
    icon: "",
    rolloverDate: epoch(subcategory.budgets[0]?.validFrom ?? new Date()),
    // The amount in force *today*, which is what the column caches server-side.
    budgetAmount: amountForMonth(subcategory.budgets, new Date()) ?? 0,
    budgetForMonth: amountForMonth(subcategory.budgets, viewedMonth) ?? 0,
    rolloverRemaining: accruedBudget(subcategory.budgets, viewedMonth) - spentToDate,
    budgets: subcategory.budgets.map((budget) => ({
      __typename: "SubcategoryBudget",
      id: budget.id,
      amount: budget.amount,
      validFrom: epoch(budget.validFrom),
    })),
  };
};

const categoriesList = (state: DemoState, variables: any) => {
  const viewedMonth = parseMonthStartUTC(variables.date);

  return {
    categories: inScope(state.categories, variables).map((category) => ({
      __typename: "Category",
      id: category.id,
      name: category.name,
      groupId: category.groupId,
      user: { __typename: "User", id: state.viewerId },
      subcategories: category.subcategories.map((subcategory) =>
        shapeSubcategory(state, subcategory, viewedMonth),
      ),
    })),
  };
};

const shapeExpense = (state: DemoState, expense: DemoExpense) => ({
  __typename: "Expense",
  id: expense.id,
  subcategoryId: expense.subcategoryId,
  amount: expense.amount,
  description: expense.description,
  date: epoch(expense.date),
  paidBy: { __typename: "User", id: expense.userId },
});

const expensesList = (state: DemoState, variables: any) => {
  const scoped = new Set(
    subcategoriesOf(inScope(state.categories, variables)).map((s) => s.id),
  );
  const viewed = new Date(variables.date);
  const year = viewed.getFullYear();
  const month = viewed.getMonth();

  return {
    expenses: state.expenses
      .filter(
        (expense) =>
          scoped.has(expense.subcategoryId) &&
          inMonth(expense.date, year, month),
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((expense) => shapeExpense(state, expense)),
  };
};

const displayNameFor = (state: DemoState, userId: string) => {
  const user = state.users.find((u) => u.id === userId);
  return user?.name || user?.email || "Unknown";
};

const chartExpensesList = (state: DemoState, variables: any) => {
  const scopedCategories = inScope(state.categories, variables);
  const scopedSubcategories = subcategoriesOf(scopedCategories);
  const scoped = new Set(scopedSubcategories.map((s) => s.id));
  const year = new Date(variables.date).getFullYear();

  const inYear = state.expenses.filter(
    (expense) =>
      scoped.has(expense.subcategoryId) && expense.date.getFullYear() === year,
  );

  const monthlyTotals = new Array(12).fill(0);
  for (const expense of inYear) {
    monthlyTotals[expense.date.getMonth()] += expense.amount;
  }

  /*
   * A series rather than one figure, because the amount can change mid-year:
   * drawing it flat at today's rate would re-cost January at December's budget.
   */
  const monthlyBudgets = Array.from({ length: 12 }, (_, month) =>
    scopedSubcategories.reduce(
      (total, subcategory) =>
        total +
        (amountForMonth(
          subcategory.budgets,
          new Date(Date.UTC(year, month, 1)),
        ) ?? 0),
      0,
    ),
  );

  // Shared categories only: personal spend has nobody to compare against.
  const sharedSubcategories = new Set(
    subcategoriesOf(scopedCategories.filter((c) => c.groupId)).map((s) => s.id),
  );
  const sharedExpenses = inYear.filter((e) =>
    sharedSubcategories.has(e.subcategoryId),
  );

  const memberIds = new Set<string>(
    state.groups
      .filter((group) =>
        scopedCategories.some((category) => category.groupId === group.id),
      )
      .flatMap((group) => group.members.map((member) => member.userId)),
  );
  for (const expense of sharedExpenses) memberIds.add(expense.userId);

  const sharedMonthlyByUser = [...memberIds]
    .map((userId) => {
      const months = new Array(12).fill(0);
      for (const expense of sharedExpenses) {
        if (expense.userId === userId) months[expense.date.getMonth()] += expense.amount;
      }
      return {
        __typename: "SharedUserSeries",
        userId,
        name: displayNameFor(state, userId),
        monthlyTotals: months,
        total: months.reduce((a: number, b: number) => a + b, 0),
      };
    })
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  const bySubcategory = new Map<string, number>();
  for (const expense of inYear) {
    bySubcategory.set(
      expense.subcategoryId,
      (bySubcategory.get(expense.subcategoryId) || 0) + expense.amount,
    );
  }

  const categoryExpenseTotals = [...bySubcategory.entries()].map(
    ([subcategoryId, total]) => {
      const category = scopedCategories.find((c) =>
        c.subcategories.some((s) => s.id === subcategoryId),
      );
      const subcategory = category?.subcategories.find(
        (s) => s.id === subcategoryId,
      );
      return {
        __typename: "CategoryExpenseTotal",
        categoryName: category?.name ?? "Unknown Category",
        subcategoryName: subcategory?.name ?? "Unknown Subcategory",
        total,
      };
    },
  );

  return {
    chartExpenses: {
      __typename: "ChartExpensesPayload",
      monthlyTotals,
      monthlyBudgets,
      sharedMonthlyByUser,
      categoryExpenseTotals,
    },
  };
};

const insights = (state: DemoState, variables: any) => {
  const viewed = new Date(variables.date);
  const year = viewed.getFullYear();
  const month = viewed.getMonth();
  const vIndex = year * 12 + month;

  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;
  const isFutureMonth = vIndex > now.getFullYear() * 12 + now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysElapsed = isFutureMonth
    ? 0
    : isCurrentMonth
      ? Math.min(now.getDate(), daysInMonth)
      : daysInMonth;

  const scopedCategories = inScope(state.categories, variables);
  const viewedMonthStart = monthStartFromIndex(vIndex);

  // subcategory -> its category, and the budget that applied in this month.
  const subToCat = new Map<
    string,
    { categoryId: string; categoryName: string; subcategoryName: string }
  >();
  const subBudget = new Map<string, number>();
  const catMeta = new Map<
    string,
    { name: string; groupId: string | null; budget: number }
  >();

  for (const category of scopedCategories) {
    let budget = 0;
    for (const subcategory of category.subcategories) {
      subToCat.set(subcategory.id, {
        categoryId: category.id,
        categoryName: category.name,
        subcategoryName: subcategory.name,
      });
      const inViewedMonth =
        amountForMonth(subcategory.budgets, viewedMonthStart) ?? 0;
      subBudget.set(subcategory.id, inViewedMonth);
      budget += inViewedMonth;
    }
    catMeta.set(category.id, {
      name: category.name,
      groupId: category.groupId,
      budget,
    });
  }

  const scoped = state.expenses.filter((e) => subToCat.has(e.subcategoryId));
  const curExpenses = scoped.filter((e) => inMonth(e.date, year, month));
  const prevExpenses = scoped.filter((e) => inMonth(e.date, year, month - 1));

  const curByCat = new Map<string, number>();
  const prevByCat = new Map<string, number>();
  let totalSpent = 0;
  let previousMonthTotal = 0;

  for (const expense of curExpenses) {
    const ref = subToCat.get(expense.subcategoryId)!;
    curByCat.set(ref.categoryId, (curByCat.get(ref.categoryId) || 0) + expense.amount);
    totalSpent += expense.amount;
  }
  for (const expense of prevExpenses) {
    const ref = subToCat.get(expense.subcategoryId)!;
    prevByCat.set(ref.categoryId, (prevByCat.get(ref.categoryId) || 0) + expense.amount);
    previousMonthTotal += expense.amount;
  }

  const pace = [...catMeta.entries()].map(([categoryId, meta]) => {
    const spent = curByCat.get(categoryId) || 0;
    return {
      __typename: "CategoryPace",
      categoryId,
      categoryName: meta.name,
      budget: meta.budget,
      spent,
      projected:
        daysElapsed > 0 ? Math.round((spent * daysInMonth) / daysElapsed) : spent,
      safeToSpend: meta.budget - spent,
      percentUsed: meta.budget > 0 ? (spent / meta.budget) * 100 : 0,
    };
  });

  const totalBudget = [...catMeta.values()].reduce((a, m) => a + m.budget, 0);

  const moverIds = new Set([...curByCat.keys(), ...prevByCat.keys()]);
  const biggestMovers = [...moverIds]
    .map((categoryId) => {
      const currentTotal = curByCat.get(categoryId) || 0;
      const previousTotal = prevByCat.get(categoryId) || 0;
      const delta = currentTotal - previousTotal;
      return {
        __typename: "CategoryMover",
        categoryId,
        categoryName: catMeta.get(categoryId)?.name || "Unknown",
        currentTotal,
        previousTotal,
        delta,
        percentChange: previousTotal > 0 ? (delta / previousTotal) * 100 : null,
      };
    })
    .filter((m) => m.delta !== 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, TOP_N);

  const topExpenses = [...curExpenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, TOP_N)
    .map((expense) => {
      const ref = subToCat.get(expense.subcategoryId);
      return {
        __typename: "TopExpense",
        id: expense.id,
        amount: expense.amount,
        description: expense.description,
        date: epoch(expense.date),
        subcategoryName: ref?.subcategoryName || "Unknown",
        categoryName: ref?.categoryName || "Unknown",
        paidByName: displayNameFor(state, expense.userId),
      };
    });

  // Consecutive months ending in this one at or under the budget that applied
  // in *that* month, so raising a budget cannot retroactively fix a bad month.
  const subMonthSpend = new Map<string, Map<number, number>>();
  for (const expense of scoped) {
    const index = monthIndex(expense.date);
    if (index > vIndex || index <= vIndex - STREAK_LOOKBACK) continue;
    let months = subMonthSpend.get(expense.subcategoryId);
    if (!months) {
      months = new Map();
      subMonthSpend.set(expense.subcategoryId, months);
    }
    months.set(index, (months.get(index) || 0) + expense.amount);
  }

  const scheduleFor = (subcategoryId: string) =>
    scopedCategories
      .flatMap((c) => c.subcategories)
      .find((s) => s.id === subcategoryId)?.budgets ?? [];

  const streaks = [...subBudget.entries()]
    .filter(([, budget]) => budget > 0)
    .map(([subcategoryId]) => {
      const months = subMonthSpend.get(subcategoryId);
      const schedule = scheduleFor(subcategoryId);
      let monthsUnderBudget = 0;
      for (let i = 0; i < STREAK_LOOKBACK; i++) {
        const spent = months?.get(vIndex - i) || 0;
        const budgetThen =
          amountForMonth(schedule, monthStartFromIndex(vIndex - i)) ?? 0;
        if (budgetThen > 0 && spent <= budgetThen) monthsUnderBudget++;
        else break;
      }
      const ref = subToCat.get(subcategoryId);
      return {
        __typename: "BudgetStreak",
        subcategoryId,
        subcategoryName: ref?.subcategoryName || "Unknown",
        categoryName: ref?.categoryName || "Unknown",
        monthsUnderBudget,
      };
    })
    .filter((s) => s.monthsUnderBudget >= 1)
    .sort((a, b) => b.monthsUnderBudget - a.monthsUnderBudget)
    .slice(0, TOP_N);

  /*
   * Who paid what, in shared categories only. Members who spent nothing are
   * included at 0: "Ana 300" alone cannot be read as "and you spent nothing"
   * rather than "you are missing from this list".
   */
  const sharedGroupIds = [
    ...new Set(
      [...catMeta.values()]
        .map((m) => m.groupId)
        .filter((id): id is string => !!id),
    ),
  ];

  const memberIds = new Set<string>(
    state.groups
      .filter((group) => sharedGroupIds.includes(group.id))
      .flatMap((group) => group.members.map((member) => member.userId)),
  );

  const isShared = (subcategoryId: string) => {
    const ref = subToCat.get(subcategoryId);
    return ref ? !!catMeta.get(ref.categoryId)?.groupId : false;
  };

  const sharedExpenses = curExpenses.filter((e) => isShared(e.subcategoryId));
  for (const expense of sharedExpenses) memberIds.add(expense.userId);

  const sharedBySub = new Map<string, Map<string, number>>();
  const sharedByUser = new Map<string, number>(
    [...memberIds].map((userId) => [userId, 0]),
  );

  for (const expense of sharedExpenses) {
    let perUser = sharedBySub.get(expense.subcategoryId);
    if (!perUser) {
      perUser = new Map([...memberIds].map((id) => [id, 0]));
      sharedBySub.set(expense.subcategoryId, perUser);
    }
    perUser.set(expense.userId, (perUser.get(expense.userId) || 0) + expense.amount);
    sharedByUser.set(
      expense.userId,
      (sharedByUser.get(expense.userId) || 0) + expense.amount,
    );
  }

  const toSpenders = (totals: Map<string, number>) =>
    [...totals.entries()]
      .map(([userId, spent]) => ({
        __typename: "SharedSpender",
        userId,
        name: displayNameFor(state, userId),
        spent,
      }))
      .sort((a, b) => b.spent - a.spent || a.name.localeCompare(b.name));

  return {
    insights: {
      __typename: "InsightsPayload",
      daysElapsed,
      daysInMonth,
      totalBudget,
      totalSpent,
      totalProjected:
        daysElapsed > 0
          ? Math.round((totalSpent * daysInMonth) / daysElapsed)
          : totalSpent,
      totalSafeToSpend: totalBudget - totalSpent,
      currentMonthTotal: totalSpent,
      previousMonthTotal,
      monthOverMonthDelta: totalSpent - previousMonthTotal,
      monthOverMonthPercent:
        previousMonthTotal > 0
          ? ((totalSpent - previousMonthTotal) / previousMonthTotal) * 100
          : null,
      pace,
      biggestMovers,
      topExpenses,
      streaks,
      sharedTotalsByUser: sharedGroupIds.length ? toSpenders(sharedByUser) : [],
      sharedSplits: [...sharedBySub.entries()]
        .map(([subcategoryId, perUser]) => {
          const ref = subToCat.get(subcategoryId);
          return {
            __typename: "SharedSubcategorySplit",
            subcategoryId,
            subcategoryName: ref?.subcategoryName || "Unknown",
            categoryName: ref?.categoryName || "Unknown",
            total: [...perUser.values()].reduce((a, b) => a + b, 0),
            perUser: toSpenders(perUser),
          };
        })
        .sort((a, b) => b.total - a.total),
    },
  };
};

const savingGoalsList = (state: DemoState) => ({
  savingGoals: state.savingGoals.map((goal) => ({
    __typename: "SavingGoal",
    id: goal.id,
    createdAt: epoch(goal.createdAt),
    name: goal.name,
    goalDate: epoch(goal.goalDate),
    goalAmount: goal.goalAmount,
    initialSaveAmount: goal.initialSaveAmount,
  })),
});

const myGroups = (state: DemoState) => ({
  myGroups: state.groups.map((group) => ({
    __typename: "Group",
    id: group.id,
    name: group.name,
    members: group.members.map((member) => ({
      __typename: "GroupMember",
      id: member.id,
      role: member.role,
      user: {
        __typename: "User",
        id: member.userId,
        name: state.users.find((u) => u.id === member.userId)?.name ?? null,
        email: state.users.find((u) => u.id === member.userId)?.email ?? "",
      },
    })),
    invites: group.invites.map((invite) => ({
      __typename: "GroupInvite",
      id: invite.id,
      email: invite.email,
      status: invite.status,
    })),
  })),
});

/**
 * Operations the demo answers, keyed by operation name.
 *
 * Anything absent falls through to the network. `Me` is deliberately absent:
 * it carries the real account's identity into analytics and Settings, and a
 * demo that renamed the signed-in user would be lying about whose app this is.
 * `MeId` *is* answered, because it decides what the viewer may edit — without
 * it nothing in the demo is clickable.
 */
const QUERIES: Record<string, (state: DemoState, variables: any) => object> = {
  MeId: (state) => ({ me: { __typename: "User", id: state.viewerId } }),
  CategoriesList: categoriesList,
  ExpensesList: expensesList,
  ChartExpensesList: chartExpensesList,
  Insights: insights,
  SavingGoalsList: savingGoalsList,
  InvestmentsList: () => ({ investments: [] }),
  MyGroups: myGroups,
};

export const canResolveQuery = (operationName: string) =>
  operationName in QUERIES;

export const resolveDemoQuery = (
  operationName: string,
  state: DemoState,
  variables: Record<string, any>,
) => QUERIES[operationName](state, variables ?? {});
