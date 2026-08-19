import { GroupRole, useMeIdQuery, useMyGroupsQuery } from "@/generated/graphql";

// Mirrors the server's `canManage`: you can manage an item you created/entered,
// or any item in a group where you're an OWNER/ADMIN. Returns a predicate
// `(ownerUserId, categoryGroupId) => boolean` for gating edit/remove in the UI.
export const useCanManage = () => {
  const { data: meData } = useMeIdQuery({ fetchPolicy: "cache-first" });
  const { data: groupsData } = useMyGroupsQuery({
    fetchPolicy: "cache-first",
  });

  const myId = meData?.me?.id;
  const groups = groupsData?.myGroups ?? [];

  return (
    ownerUserId?: string | null,
    categoryGroupId?: string | null
  ): boolean => {
    if (!myId) return false;
    if (ownerUserId && ownerUserId === myId) return true;
    if (categoryGroupId) {
      const group = groups.find((g) => g.id === categoryGroupId);
      const me = group?.members.find((m) => m.user.id === myId);
      return me?.role === GroupRole.Owner || me?.role === GroupRole.Admin;
    }
    return false;
  };
};
