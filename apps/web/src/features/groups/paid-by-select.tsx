import { SelectStyled } from "@/shared";
import { MenuItem } from "@/components/ui/MenuItem";
import { SelectChangeEvent } from "@/components/ui/Select";
import { useMyGroupsQuery } from "@/generated/graphql";

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
  const { data } = useMyGroupsQuery({ fetchPolicy: "cache-first" });

  if (!groupId) return null;

  const group = (data?.myGroups ?? []).find((g) => g.id === groupId);
  const members = group?.members ?? [];
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
