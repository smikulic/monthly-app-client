import { toast } from "react-toastify";
import ListItemIcon from "@mui/material/ListItemIcon";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { MenuItem } from "@/components/ui/MenuItem";
import {
  useMeIdQuery,
  useMyGroupsQuery,
  useShareCategoryMutation,
  useUnshareCategoryMutation,
} from "@/generated/graphql";

// Renders share/unshare entries for a category's actions (⋮) menu.
// Self-contained: queries groups, mutates, and refetches the categories list by
// operation name. Returns null when the user has no groups.
export const CategoryShareMenuItems = ({
  categoryId,
  groupId,
  creatorId,
  onDone,
}: {
  categoryId: string;
  groupId?: string | null;
  creatorId?: string | null;
  onDone?: () => void;
}) => {
  const { data: meData } = useMeIdQuery({ fetchPolicy: "cache-first" });
  const { data } = useMyGroupsQuery({ fetchPolicy: "cache-first" });
  const myId = meData?.me?.id;
  const groups = data?.myGroups ?? [];

  const mutationOpts = {
    refetchQueries: ["CategoriesList"],
    onError: (e: { message: string }) => toast.error(e.message),
  };
  const [shareCategory] = useShareCategoryMutation(mutationOpts);
  const [unshareCategory] = useUnshareCategoryMutation(mutationOpts);

  // Sharing/unsharing is creator-only (matches the server), and needs a group.
  if (groups.length === 0 || !creatorId || creatorId !== myId) return null;

  const run = (fn: () => void) => {
    fn();
    onDone?.();
  };

  if (groupId) {
    return (
      <MenuItem
        onClick={() =>
          run(() => unshareCategory({ variables: { categoryId } }))
        }
      >
        <ListItemIcon>
          <LockOutlinedIcon fontSize="small" />
        </ListItemIcon>
        Make personal
      </MenuItem>
    );
  }

  return (
    <>
      {groups.map((g) => (
        <MenuItem
          key={g.id}
          onClick={() =>
            run(() =>
              shareCategory({ variables: { categoryId, groupId: g.id } }),
            )
          }
        >
          <ListItemIcon>
            <GroupAddOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Share with {g.name}
        </MenuItem>
      ))}
    </>
  );
};
