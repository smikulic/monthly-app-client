import { useQuery } from "@apollo/client";
import { MenuItem } from "@/components/ui/MenuItem";
import { SelectStyled } from "@/shared";
import { MY_GROUPS } from "./groups-queries";
import { useScope } from "./scope-context";
import { ScopeFilterStyled } from "./scope-filter-style";

// Lets the user view All (personal + groups), Personal only, or a specific group.
// Hidden entirely when the user belongs to no groups.
export const ScopeFilter = () => {
  const { mode, groupId, setScope } = useScope();
  const { data } = useQuery(MY_GROUPS, { fetchPolicy: "cache-and-network" });
  const groups = data?.myGroups ?? [];

  if (groups.length === 0) return null;

  const value = mode === "GROUP" && groupId ? `group:${groupId}` : mode;

  const handleChange = (next: string) => {
    if (next.startsWith("group:")) {
      setScope("GROUP", next.slice("group:".length));
    } else {
      setScope(next as "ALL" | "MINE");
    }
  };

  return (
    <ScopeFilterStyled>
      <SelectStyled
        id="scope-select"
        label="View"
        value={value}
        onChange={(e) => handleChange(e.target.value as string)}
      >
        <MenuItem value="ALL">All</MenuItem>
        <MenuItem value="MINE">Personal</MenuItem>
        {groups.map((g: { id: string; name: string }) => (
          <MenuItem key={g.id} value={`group:${g.id}`}>
            {g.name}
          </MenuItem>
        ))}
      </SelectStyled>
    </ScopeFilterStyled>
  );
};
