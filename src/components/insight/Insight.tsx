// components/Insight.tsx
import { useQuery } from "@apollo/client";
import { Typography } from "@/components/ui/Typography";
import { Box } from "@/components/ui/Box";
import { GET_YEARLY_INSIGHT } from "../expenses-list/expenses-list-queries";
import dayjs from "dayjs";

export const Insight = ({ pageDate }: { pageDate: Date }) => {
  const formattedDate = dayjs(pageDate).format("MM-DD-YYYY");

  const { data, loading, error } = useQuery(GET_YEARLY_INSIGHT, {
    variables: { date: formattedDate },
  });

  if (loading) return <p>Loading insights…</p>;
  if (error) return <p>Error loading insights: {error.message}</p>;

  const { yearly, forecast } = data.yearlyInsight;

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
      {[yearly, forecast].map((insight) => (
        <Box
          key={insight.title}
          sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2 }}
        >
          <Typography variant="h6">{insight.title}</Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
            {insight.narrative}
          </Typography>
          {/* reuse your chart components if you like, using insight.data */}
        </Box>
      ))}
      {/* <Box>
        <Typography variant="h6">{insight.title}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {insight.narrative}
        </Typography>
      </Box> */}
      {/* Repeat for categoryInsight, forecastInsight… */}
    </Box>
  );
};
