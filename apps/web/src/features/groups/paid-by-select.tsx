import { SelectStyled } from "@/shared";
import { MenuItem } from "@/components/ui/MenuItem";
import { SelectChangeEvent } from "@/components/ui/Select";
import { useMyGroupsQuery } from "@/generated/graphql";

/*
 * Who to show for a member who has not set a name.
 *
 * The field is half a row wide and the full address does not come close to
 * fitting — and the domain is the half that distinguishes nobody, since a
 * household is two or three people choosing between each other. The local part
 * is both shorter and the part they would recognise.
 */
const displayName = (user: { name?: string | null; email: string }) =>
  user.name || user.email.split("@")[0];

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
          {displayName(m.user)}
        </MenuItem>
      ))}
    </SelectStyled>
  );
};
