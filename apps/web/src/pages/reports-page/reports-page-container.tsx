// src/components/ReportsPageContainer.tsx
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  gql,
  useLazyQuery,
  useMutation,
  useApolloClient,
} from "@apollo/client";
import { User } from "@/generated/graphql";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { MenuItem } from "@/components/ui/MenuItem";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@/components/ui/Dialog";
import { ProminentButtonStyled, SelectStyled } from "@/shared";
import {
  ReportsWrapperStyled,
  YearSelectStyled,
  ButtonGroupStyled,
  SectionDividerStyled,
  HelperTextStyled,
  HiddenFileInputStyled,
  FileRowStyled,
  FileNameStyled,
} from "./reports-page-style";

const GENERATE_REPORT = gql`
  query GenerateReport($year: Int!) {
    generateReport(year: $year)
  }
`;

const GENERATE_CSV_REPORT = gql`
  query GenerateCsvReport($year: Int!) {
    generateCsvReport(year: $year)
  }
`;

const GENERATE_DATA_EXPORT = gql`
  query GenerateDataExport {
    generateDataExport
  }
`;

const IMPORT_DATA = gql`
  mutation ImportData($payload: String!, $mode: ImportMode!) {
    importData(payload: $payload, mode: $mode) {
      categories
      subcategories
      expenses
      savingGoals
      investments
    }
  }
`;

// Trigger a browser download from a base64-encoded payload returned by the API.
const downloadBase64 = (base64: string, mime: string, filename: string) => {
  const link = document.createElement("a");
  link.href = `data:${mime};base64,${base64}`;
  link.download = filename;
  link.click();
};

export const ReportsPageContainer = ({ userData }: { userData: User }) => {
  const maxYear = new Date().getFullYear();
  const minYear = maxYear - 5;

  const [year, setYear] = useState(maxYear);

  const years = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  const [loadReport, { loading }] = useLazyQuery(GENERATE_REPORT, {
    variables: { year },
    fetchPolicy: "network-only",
    onError: (err) => toast.error(err.message),
    onCompleted: ({ generateReport }) => {
      downloadBase64(
        generateReport,
        "application/pdf",
        `MonthlyApp-BudgetReport-${year}.pdf`,
      );
    },
  });

  const [loadCsv, { loading: loadingCsv }] = useLazyQuery(GENERATE_CSV_REPORT, {
    variables: { year },
    fetchPolicy: "network-only",
    onError: (err) => toast.error(err.message),
    onCompleted: ({ generateCsvReport }) => {
      downloadBase64(
        generateCsvReport,
        "text/csv;charset=utf-8",
        `MonthlyApp-Expenses-${year}.csv`,
      );
    },
  });

  const [loadDataExport, { loading: loadingDataExport }] = useLazyQuery(
    GENERATE_DATA_EXPORT,
    {
      fetchPolicy: "network-only",
      onError: (err) => toast.error(err.message),
      onCompleted: ({ generateDataExport }) => {
        const today = new Date().toISOString().slice(0, 10);
        downloadBase64(
          generateDataExport,
          "application/json",
          `MonthlyApp-DataExport-${today}.json`,
        );
      },
    },
  );

  const client = useApolloClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [confirmReplaceOpen, setConfirmReplaceOpen] = useState(false);
  const [importingMode, setImportingMode] = useState<
    "MERGE" | "REPLACE" | null
  >(null);

  const [runImport, { loading: importing }] = useMutation(IMPORT_DATA, {
    onError: (err) => {
      setImportingMode(null);
      toast.error(err.message);
    },
    onCompleted: async ({ importData }) => {
      setImportingMode(null);
      toast.success(
        `Imported ${importData.expenses} expenses, ${importData.categories} categories, ${importData.savingGoals} saving goals, ${importData.investments} investments.`,
      );
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      try {
        await client.resetStore();
      } catch {
        // ignore refetch errors; the import itself already succeeded
      }
    },
  });

  const doImport = async (mode: "MERGE" | "REPLACE") => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const payload = await file.text();
    setImportingMode(mode);
    runImport({ variables: { payload, mode } });
  };

  const requestImport = (mode: "MERGE" | "REPLACE") => {
    if (importing) return;
    if (!fileInputRef.current?.files?.[0]) {
      toast.error("Choose a JSON export file first.");
      return;
    }
    if (mode === "REPLACE") {
      setConfirmReplaceOpen(true);
      return;
    }
    doImport("MERGE");
  };

  const confirmReplace = () => {
    setConfirmReplaceOpen(false);
    doImport("REPLACE");
  };

  return (
    <Container>
      <ReportsWrapperStyled>
        <Typography variant="h5">Generate Report</Typography>

        <YearSelectStyled>
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
        </YearSelectStyled>

        <ButtonGroupStyled>
          <ProminentButtonStyled
            onClick={() => loadReport()}
            textCenter
            outline
          >
            {loading ? "Generating…" : "Download PDF"}
          </ProminentButtonStyled>

          <ProminentButtonStyled onClick={() => loadCsv()} textCenter outline>
            {loadingCsv ? "Generating…" : "Download CSV"}
          </ProminentButtonStyled>
        </ButtonGroupStyled>

        <SectionDividerStyled />

        <Typography variant="h5">Export all data</Typography>
        <HelperTextStyled>
          A complete, re-importable copy of all your data (categories, expenses,
          saving goals, investments) as JSON.
        </HelperTextStyled>
        <ButtonGroupStyled>
          <ProminentButtonStyled
            onClick={() => loadDataExport()}
            textCenter
            outline
          >
            {loadingDataExport ? "Exporting…" : "Download full data (JSON)"}
          </ProminentButtonStyled>
        </ButtonGroupStyled>

        <SectionDividerStyled />

        <Typography variant="h5">Import data</Typography>
        <HelperTextStyled>
          Restore from a JSON export. Merge adds new records and updates
          matching ones while keeping everything else. Replace all permanently
          deletes your current data first, then imports the file. Both run
          all-or-nothing.
        </HelperTextStyled>
        <FileRowStyled>
          <ProminentButtonStyled
            onClick={() => fileInputRef.current?.click()}
            textCenter
            outline
          >
            Choose file
          </ProminentButtonStyled>
          <FileNameStyled>{fileName ?? "No file chosen"}</FileNameStyled>
          <HiddenFileInputStyled
            type="file"
            accept="application/json,.json"
            ref={fileInputRef}
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </FileRowStyled>
        <ButtonGroupStyled>
          <ProminentButtonStyled
            onClick={() => requestImport("MERGE")}
            textCenter
            outline
            disabled={!fileName || importing}
          >
            {importingMode === "MERGE" ? "Importing…" : "Merge import"}
          </ProminentButtonStyled>
          <ProminentButtonStyled
            onClick={() => requestImport("REPLACE")}
            textCenter
            outline
            disabled={!fileName || importing}
          >
            {importingMode === "REPLACE" ? "Importing…" : "Replace all"}
          </ProminentButtonStyled>
        </ButtonGroupStyled>

        <Dialog
          open={confirmReplaceOpen}
          onClose={() => setConfirmReplaceOpen(false)}
        >
          <DialogTitle>Replace all data?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This permanently deletes all your current categories, expenses,
              saving goals and investments, then imports the file. This cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ProminentButtonStyled
              onClick={() => setConfirmReplaceOpen(false)}
              textCenter
              outline
            >
              Cancel
            </ProminentButtonStyled>
            <ProminentButtonStyled
              onClick={confirmReplace}
              textCenter
              color="error"
            >
              Replace all
            </ProminentButtonStyled>
          </DialogActions>
        </Dialog>
      </ReportsWrapperStyled>
    </Container>
  );
};
