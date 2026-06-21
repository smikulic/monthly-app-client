import { useQuery } from "@apollo/client";
import { SelectStyled } from "@/shared";
import { MenuItem } from "@/components/ui/MenuItem";
import { SelectChangeEvent } from "@/components/ui/Select";
import { MY_GROUPS } from "./groups-queries";

type Member = {
  id: string;
  user: { id: string; name?: string | null; email: string };
};
type Group = { id: string; members: Member[] };

// "Paid by" picker for an expense in a shared category. Lists the group's
// members. Renders nothing for a personal category (no groupId).
export const PaidBySelect = ({
  groupId,
  value,
  onChange,
}: {
  groupId?: string | null;
  value: string;
  onChange: (userId: string) => void;
}) => {
  const { data } = useQuery(MY_GROUPS, { fetchPolicy: "cache-first" });

  if (!groupId) return null;

  const group = (data?.myGroups ?? []).find((g: Group) => g.id === groupId);
  const members: Member[] = group?.members ?? [];
  if (members.length === 0) return null;

  return (
    <SelectStyled
      id="paid-by"
      label="Paid by"
      margin="none"
      value={value}
      onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
    >
      {members.map((m) => (
        <MenuItem key={m.user.id} value={m.user.id}>
          {m.user.name || m.user.email}
        </MenuItem>
      ))}
    </SelectStyled>
  );
};
