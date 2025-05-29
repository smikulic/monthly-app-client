import { gql } from "@apollo/client";

export const GENERATE_REPORT = gql`
  query GenerateReport($year: Int!) {
    generateReport(year: $year)
  }
`;
