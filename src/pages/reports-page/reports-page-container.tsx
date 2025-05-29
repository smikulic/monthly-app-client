// src/components/ReportsPageContainer.tsx
import { useState } from "react";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import { User } from "@/generated/graphql";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Box } from "@/components/ui/Box";
import { MenuItem } from "@/components/ui/MenuItem";
import { ProminentButtonStyled, SelectStyled } from "@/shared";
import { GENERATE_REPORT } from "./reports-page-queries";
// import { GET_ALL_EXPENSES } from "@/components/expenses-list/expenses-list-queries";

export const ReportsPageContainer = ({ userData }: { userData: User }) => {
  const maxYear = new Date().getFullYear();
  const minYear = maxYear - 5;

  const [year, setYear] = useState(maxYear);

  const years = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  const [loadReport, { called, loading, data }] = useLazyQuery(
    GENERATE_REPORT,
    {
      variables: { year },
      fetchPolicy: "network-only",
      onError: (err) => toast.error(err.message),
      onCompleted: ({ generateReport }) => {
        const base64 = generateReport;
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64}`;
        link.download = `MonthlyApp-BudgetReport-${year}.pdf`;
        link.click();
      },
    }
  );

  // const [loadCsv, { loading: csvLoading }] = useLazyQuery(GET_ALL_EXPENSES, {
  //   fetchPolicy: "network-only",
  //   onError: (err) => toast.error(err.message),
  //   onCompleted: ({ expenses }) => {
  //     if (!expenses?.length) {
  //       toast.info("No expenses to export");
  //       return;
  //     }

  //     // Build CSV
  //     const header = ["ID", "Subcategory ID", "Amount", "Date"];
  //     const rows = expenses.map((e: any) => [
  //       e.id,
  //       e.subcategoryId,
  //       e.amount.toString(),
  //       new Date(e.date).toLocaleDateString(),
  //     ]);
  //     const csvContent = [
  //       header.join(","),
  //       ...rows.map((row: any) => row.join(",")),
  //     ].join("\r\n");

  //     // Trigger download
  //     const blob = new Blob([csvContent], {
  //       type: "text/csv;charset=utf-8;",
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `MonthlyApp-Expenses-${new Date()
  //       .toISOString()
  //       .slice(0, 10)}.csv`;
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   },
  // });

  return (
    <>
      <Container>
        <Typography variant="h5">Generate Report</Typography>
        <Box sx={{ width: 120 }}>
          <SelectStyled
            id="year-select"
            label="Year"
            value={String(year)}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <MenuItem key={y} value={String(y)}>
                {y}
              </MenuItem>
            ))}
          </SelectStyled>
        </Box>

        <ProminentButtonStyled onClick={() => loadReport()} textCenter>
          {loading ? "Generating…" : "Download PDF Report"}
        </ProminentButtonStyled>
      </Container>

      {/* <Container>
        <Typography variant="h5">
          Generate CSV export for all expenses
        </Typography>

        <br />
        <ProminentButtonStyled
          onClick={() => loadCsv()}
          textCenter
          disabled={csvLoading}
        >
          {csvLoading ? "Exporting…" : "Download CSV Expenses"}
        </ProminentButtonStyled>
      </Container> */}
    </>
  );
};
