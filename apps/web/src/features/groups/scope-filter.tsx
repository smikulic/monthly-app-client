import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { FilterSelect } from "@/components/filter-select/filter-select";
import { useMyGroupsQuery } from "@/generated/graphql";
import { useScope } from "./scope-context";

const ALL = "ALL";
const MINE = "MINE";
const GROUP_PREFIX = "group:";

// Lets the user view All (personal + groups), Personal only, or a specific
// group. Hidden entirely when the user belongs to no groups.
export const ScopeFilter = () => {
  const { mode, groupId, setScope } = useScope();
  const { data } = useMyGroupsQuery({ fetchPolicy: "cache-and-network" });
  const groups = data?.myGroups ?? [];

  if (groups.length === 0) return null;

  const activeLabel =
    mode === "MINE"
      ? "Personal"
      : mode === "GROUP"
        ? (groups.find((g) => g.id === groupId)?.name ?? "All")
        : "All";

  return (
    <FilterSelect
      label="View"
      // Whose money is being shown is what this filter is for, so the icon
      // that replaces the word on a phone says people rather than "filter".
      icon={<PeopleOutlineIcon />}
      value={activeLabel}
      menuId="scope-menu"
      testId="scope-filter"
      options={[
        { id: ALL, label: "All" },
        { id: MINE, label: "Personal" },
        ...groups.map((g) => ({ id: `${GROUP_PREFIX}${g.id}`, label: g.name })),
      ]}
      onSelect={(id) => {
        if (id === ALL) return setScope("ALL");
        if (id === MINE) return setScope("MINE");
        setScope("GROUP", id.slice(GROUP_PREFIX.length));
      }}
    />
  );
};
