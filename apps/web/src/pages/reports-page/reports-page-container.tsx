// src/components/ReportsPageContainer.tsx
import { useState } from "react";
import { toast } from "react-toastify";
import { gql, useLazyQuery } from "@apollo/client";
import { User } from "@/generated/graphql";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Box } from "@/components/ui/Box";
import { MenuItem } from "@/components/ui/MenuItem";
import { ProminentButtonStyled, SelectStyled } from "@/shared";

const GENERATE_REPORT = gql`
  query GenerateReport($year: Int!) {
    generateReport(year: $year)
  }
`;

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
    </>
  );
};
