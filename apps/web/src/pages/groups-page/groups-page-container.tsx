// src/pages/groups-page/groups-page-container.tsx
import { User } from "@/generated/graphql";
import { GroupsManager } from "@/features/groups/groups-manager";

export const GroupsPageContainer = ({ userData }: { userData: User }) => {
  return <GroupsManager currentUserId={userData.id} />;
};
