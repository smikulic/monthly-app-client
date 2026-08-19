import { useMyGroupsQuery } from "@/generated/graphql";
import { SharedGroupBadgeStyled } from "./shared-group-badge-style";

// Small pill showing the group a category is shared with. Renders nothing for
// personal categories or unknown groups. Intended for the "All" view where
// personal and shared categories are mixed.
export const SharedGroupBadge = ({ groupId }: { groupId?: string | null }) => {
  const { data } = useMyGroupsQuery({ fetchPolicy: "cache-first" });

  if (!groupId) return null;

  const group = (data?.myGroups ?? []).find((g) => g.id === groupId);
  if (!group) return null;

  return <SharedGroupBadgeStyled>{group.name}</SharedGroupBadgeStyled>;
};
