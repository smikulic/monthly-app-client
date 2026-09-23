import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { IconButton } from "@/components/ui/IconButton";
import { Menu, ListItemIcon } from "@/components/ui/Menu";
import { MenuItem } from "@/components/ui/MenuItem";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { getPersonColors } from "@/utils/personColors";
import { analytics } from "@/utils/analytics";
import { useTheme } from "@/hooks/useTheme";
import {
  ProminentButtonStyled,
  TextFieldStyled,
  PageWrapperStyled,
  HelperTextStyled,
} from "@/shared";
import {
  GroupRole,
  ScopeMode,
  useMyGroupsQuery,
  useCategoriesListQuery,
  useCreateGroupMutation,
  useInviteToGroupMutation,
  useRevokeGroupInviteMutation,
  useRemoveGroupMemberMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
  type MyGroupsQuery,
} from "@/generated/graphql";
import { PersonAvatar, displayName } from "./person-avatar";
import {
  GroupCardStyled,
  GroupHeaderStyled,
  GroupNameStyled,
  GroupMetaStyled,
  MemberRowStyled,
  MemberIdentityStyled,
  MemberNameStyled,
  MemberEmailStyled,
  RoleChipStyled,
  GroupFooterActionStyled,
  PageHeaderStyled,
  InlineFormStyled,
  CardInlineFormStyled,
} from "./groups-manager-style";

// Derived from the schema rather than hand-mirrored, so it cannot drift.
type Group = MyGroupsQuery["myGroups"][number];

/** What the user is being asked to confirm, or null when nothing is pending. */
type Pending =
  | { kind: "leave"; group: Group }
  | { kind: "delete"; group: Group }
  | { kind: "remove"; group: Group; userId: string; name: string }
  | null;

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

export const GroupsManager = ({
  currentUserId,
}: {
  currentUserId?: string;
}) => {
  const { palette } = useTheme();
  const { data, loading, refetch } = useMyGroupsQuery({
    fetchPolicy: "cache-and-network",
  });

  // Only to count what each group can see. Shares the cache with the budget
  // page, so on a warm cache this costs nothing.
  const { data: categoriesData } = useCategoriesListQuery({
    variables: {
      date: dayjs().format("MM-DD-YYYY"),
      scope: ScopeMode.All,
    },
    fetchPolicy: "cache-first",
  });

  const sharedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of categoriesData?.categories ?? []) {
      if (c?.groupId) counts[c.groupId] = (counts[c.groupId] ?? 0) + 1;
    }
    return counts;
  }, [categoriesData]);

  const [newGroupName, setNewGroupName] = useState("");
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState<Record<string, string>>({});
  const [invitingFor, setInvitingFor] = useState<string | null>(null);
  const [menuFor, setMenuFor] = useState<{
    id: string;
    el: HTMLElement;
  } | null>(null);
  const [pending, setPending] = useState<Pending>(null);

  const onError = (e: any) => toast.error(e.message);
  const refresh = () => refetch();
  const closeConfirm = () => setPending(null);

  // Tracked on completion, not on submit: a failed mutation is not a step of
  // the funnel, and counting it would inflate exactly the number the pricing
  // decision rests on.
  const [createGroup, { loading: creating }] = useCreateGroupMutation({
    onError,
    onCompleted: (data) => {
      analytics.trackGroupCreated(data?.createGroup?.name ?? "");
      setNewGroupName("");
      setCreatingOpen(false);
      toast.success("Group created");
      refresh();
    },
  });
  const [inviteToGroup] = useInviteToGroupMutation({
    onError,
    onCompleted: () => {
      setInvitingFor(null);
      toast.success("Invitation sent");
      refresh();
    },
  });
  const [revokeInvite] = useRevokeGroupInviteMutation({
    onError,
    onCompleted: refresh,
  });
  const [removeMember, { loading: removing }] = useRemoveGroupMemberMutation({
    onError,
    onCompleted: () => {
      closeConfirm();
      refresh();
    },
  });
  const [leaveGroup, { loading: leaving }] = useLeaveGroupMutation({
    onError,
    onCompleted: () => {
      closeConfirm();
      toast.success("Left group");
      refresh();
    },
  });
  const [deleteGroup, { loading: deleting }] = useDeleteGroupMutation({
    onError,
    onCompleted: () => {
      closeConfirm();
      toast.success("Group deleted");
      refresh();
    },
  });

  const groups: Group[] = data?.myGroups ?? [];

  const myRole = (g: Group) =>
    g.members.find((m) => m.user.id === currentUserId)?.role;
  const canManage = (g: Group) => {
    const role = myRole(g);
    return role === GroupRole.Owner || role === GroupRole.Admin;
  };

  const handleInvite = (groupId: string) => {
    const email = (inviteEmails[groupId] || "").trim();
    if (!email) {
      toast.error("Enter an email to invite");
      return;
    }
    // Counted before the invite lands, so the property describes the household
    // as it was when someone decided to grow it.
    const memberCount =
      groups.find((g) => g.id === groupId)?.members.length ?? 0;

    inviteToGroup({ variables: { groupId, email } }).then((result) => {
      // `onError` swallows failures, so data is the only success signal.
      if (result.data) analytics.trackGroupInviteSent(memberCount);
    });
    setInviteEmails((m) => ({ ...m, [groupId]: "" }));
  };

  // Both inline forms replace the button that opened them, so without an
  // explicit way out the only exit was to succeed.
  const submitNewGroup = () => {
    const name = newGroupName.trim();
    if (!name || creating) return;
    createGroup({ variables: { name } });
  };

  const cancelNewGroup = () => {
    setNewGroupName("");
    setCreatingOpen(false);
  };

  const cancelInvite = (groupId: string) => {
    setInviteEmails((m) => ({ ...m, [groupId]: "" }));
    setInvitingFor(null);
  };

  const confirmPending = () => {
    if (!pending) return;
    if (pending.kind === "leave") {
      leaveGroup({ variables: { groupId: pending.group.id } });
    } else if (pending.kind === "delete") {
      deleteGroup({ variables: { id: pending.group.id } });
    } else {
      removeMember({
        variables: { groupId: pending.group.id, userId: pending.userId },
      });
    }
  };

  return (
    <Container>
      <PageWrapperStyled>
        <PageHeaderStyled>
          <div>
            <Typography variant="h5">Shared groups</Typography>
            <HelperTextStyled>
              Create a group and invite people, then share specific budget
              categories with it from the Budget page.
            </HelperTextStyled>
          </div>
          {!creatingOpen && (
            <ProminentButtonStyled
              textCenter
              outline
              onClick={() => setCreatingOpen(true)}
            >
              <AddIcon /> New group
            </ProminentButtonStyled>
          )}
        </PageHeaderStyled>

        {/* Behind a button rather than always present: an empty text field was
            the first thing on the page even once groups existed. */}
        {creatingOpen && (
          <InlineFormStyled>
            <TextFieldStyled
              autoFocus
              placeholder="New group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNewGroup();
                if (e.key === "Escape") cancelNewGroup();
              }}
            />
            <ProminentButtonStyled
              textCenter
              disabled={!newGroupName.trim() || creating}
              onClick={submitNewGroup}
            >
              Create group
            </ProminentButtonStyled>
            <ProminentButtonStyled textCenter outline onClick={cancelNewGroup}>
              Cancel
            </ProminentButtonStyled>
          </InlineFormStyled>
        )}

        {loading && groups.length === 0 && (
          <HelperTextStyled>Loading…</HelperTextStyled>
        )}
        {!loading && groups.length === 0 && (
          <HelperTextStyled>No groups yet.</HelperTextStyled>
        )}

        {groups.map((g) => {
          // Allocated per group, so two people in the same household always
          // get different colours.
          const colors = getPersonColors(
            g.members.map((m) => m.user.id),
            palette,
          );
          const shared = sharedCounts[g.id] ?? 0;
          const manageable = canManage(g);

          return (
            <GroupCardStyled key={g.id}>
              <GroupHeaderStyled>
                <div>
                  <GroupNameStyled>{g.name}</GroupNameStyled>
                  <GroupMetaStyled>
                    {plural(g.members.length, "member", "members")} ·{" "}
                    {plural(shared, "shared category", "shared categories")}
                  </GroupMetaStyled>
                </div>
                <IconButton
                  size="small"
                  aria-label={`${g.name} actions`}
                  onClick={(e) => setMenuFor({ id: g.id, el: e.currentTarget })}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </GroupHeaderStyled>

              {g.members.map((m) => {
                const isMe = m.user.id === currentUserId;
                const name = displayName(m.user.name, m.user.email);
                return (
                  <MemberRowStyled key={m.id}>
                    <PersonAvatar name={name} color={colors[m.user.id]} />
                    <MemberIdentityStyled>
                      <MemberNameStyled>
                        {name}
                        {isMe ? " (you)" : ""}
                      </MemberNameStyled>
                      <MemberEmailStyled>{m.user.email}</MemberEmailStyled>
                    </MemberIdentityStyled>
                    <RoleChipStyled>{m.role.toLowerCase()}</RoleChipStyled>
                    {manageable && !isMe && (
                      <IconButton
                        size="small"
                        aria-label={`Remove ${name}`}
                        onClick={() =>
                          setPending({
                            kind: "remove",
                            group: g,
                            userId: m.user.id,
                            name,
                          })
                        }
                      >
                        <PersonRemoveOutlinedIcon fontSize="small" />
                      </IconButton>
                    )}
                  </MemberRowStyled>
                );
              })}

              {g.invites.map((inv) => (
                <MemberRowStyled key={inv.id}>
                  <PersonAvatar
                    name={displayName(null, inv.email)}
                    color={palette.text.disabled}
                  />
                  <MemberIdentityStyled>
                    <MemberNameStyled>
                      {displayName(null, inv.email)}
                    </MemberNameStyled>
                    <MemberEmailStyled>{inv.email}</MemberEmailStyled>
                  </MemberIdentityStyled>
                  <RoleChipStyled muted>invited</RoleChipStyled>
                  {manageable && (
                    <IconButton
                      size="small"
                      aria-label={`Cancel invite for ${inv.email}`}
                      onClick={() =>
                        revokeInvite({ variables: { inviteId: inv.id } })
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                </MemberRowStyled>
              ))}

              {manageable &&
                (invitingFor === g.id ? (
                  <CardInlineFormStyled>
                    <TextFieldStyled
                      autoFocus
                      placeholder="Invite by email"
                      value={inviteEmails[g.id] || ""}
                      onChange={(e) =>
                        setInviteEmails((map) => ({
                          ...map,
                          [g.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleInvite(g.id);
                        if (e.key === "Escape") cancelInvite(g.id);
                      }}
                    />
                    <ProminentButtonStyled
                      textCenter
                      onClick={() => handleInvite(g.id)}
                    >
                      Invite
                    </ProminentButtonStyled>
                    <ProminentButtonStyled
                      textCenter
                      outline
                      onClick={() => cancelInvite(g.id)}
                    >
                      Cancel
                    </ProminentButtonStyled>
                  </CardInlineFormStyled>
                ) : (
                  <GroupFooterActionStyled
                    type="button"
                    onClick={() => setInvitingFor(g.id)}
                  >
                    <PersonAddAltOutlinedIcon />
                    Invite someone
                  </GroupFooterActionStyled>
                ))}
            </GroupCardStyled>
          );
        })}

        {/* One menu, reused. Leave and Delete live here rather than as buttons
            of equal weight to everything else — deleting a group is
            irreversible and takes it away from everyone in it. */}
        <Menu
          anchorEl={menuFor?.el ?? null}
          open={Boolean(menuFor)}
          onClose={() => setMenuFor(null)}
          onClick={() => setMenuFor(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              const g = groups.find((x) => x.id === menuFor?.id);
              if (g) setPending({ kind: "leave", group: g });
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Leave group
          </MenuItem>
          {groups.find((x) => x.id === menuFor?.id) &&
            myRole(groups.find((x) => x.id === menuFor!.id)!) ===
              GroupRole.Owner && (
              <MenuItem
                onClick={() => {
                  const g = groups.find((x) => x.id === menuFor?.id);
                  if (g) setPending({ kind: "delete", group: g });
                }}
              >
                <ListItemIcon>
                  <DeleteOutlineIcon fontSize="small" />
                </ListItemIcon>
                Delete group
              </MenuItem>
            )}
        </Menu>

        <ConfirmDialog
          open={Boolean(pending)}
          title={
            pending?.kind === "delete"
              ? "Delete group"
              : pending?.kind === "leave"
                ? "Leave group"
                : "Remove member"
          }
          confirmLabel={
            pending?.kind === "delete"
              ? "Delete group"
              : pending?.kind === "leave"
                ? "Leave group"
                : "Remove"
          }
          busy={deleting || leaving || removing}
          onConfirm={confirmPending}
          onCancel={closeConfirm}
        >
          {pending?.kind === "delete" && (
            <>
              Delete <strong>{pending.group.name}</strong> for everyone in it?
              Its shared categories stop being shared. This{" "}
              <strong>cannot</strong> be undone.
            </>
          )}
          {pending?.kind === "leave" && (
            <>
              Leave <strong>{pending.group.name}</strong>? You will lose access
              to the categories shared with it.
            </>
          )}
          {pending?.kind === "remove" && (
            <>
              Remove <strong>{pending.name}</strong> from{" "}
              <strong>{pending.group.name}</strong>? They lose access to its
              shared categories.
            </>
          )}
        </ConfirmDialog>
      </PageWrapperStyled>
    </Container>
  );
};
