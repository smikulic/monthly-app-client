import { gql } from "@apollo/client";

export const GET_INSIGHTS = gql`
  query Insights($date: String!, $scope: ScopeMode, $groupId: ID) {
    insights(date: $date, scope: $scope, groupId: $groupId) {
      daysElapsed
      daysInMonth
      totalBudget
      totalSpent
      totalProjected
      totalSafeToSpend
      currentMonthTotal
      previousMonthTotal
      monthOverMonthDelta
      monthOverMonthPercent
      pace {
        categoryId
        categoryName
        budget
        spent
        projected
        safeToSpend
        percentUsed
      }
      biggestMovers {
        categoryId
        categoryName
        currentTotal
        previousTotal
        delta
        percentChange
      }
      topExpenses {
        id
        amount
        description
        date
        subcategoryName
        categoryName
        paidByName
      }
      streaks {
        subcategoryId
        subcategoryName
        categoryName
        monthsUnderBudget
      }
    }
  }
`;
