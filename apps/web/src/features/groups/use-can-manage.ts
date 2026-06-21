import { useQuery } from "@apollo/client";
import { ME, MY_GROUPS } from "./groups-queries";

type Member = { role: string; user: { id: string } };
type Group = { id: string; members: Member[] };

// Mirrors the server's `canManage`: you can manage an item you created/entered,
// or any item in a group where you're an OWNER/ADMIN. Returns a predicate
// `(ownerUserId, categoryGroupId) => boolean` for gating edit/remove in the UI.
export const useCanManage = () => {
  const { data: meData } = useQuery(ME, { fetchPolicy: "cache-first" });
  const { data: groupsData } = useQuery(MY_GROUPS, {
    fetchPolicy: "cache-first",
  });

  const myId: string | undefined = meData?.me?.id;
  const groups: Group[] = groupsData?.myGroups ?? [];

  return (
    ownerUserId?: string | null,
    categoryGroupId?: string | null
  ): boolean => {
    if (!myId) return false;
    if (ownerUserId && ownerUserId === myId) return true;
    if (categoryGroupId) {
      const group = groups.find((g) => g.id === categoryGroupId);
      const me = group?.members.find((m) => m.user.id === myId);
      return me?.role === "OWNER" || me?.role === "ADMIN";
    }
    return false;
  };
};
