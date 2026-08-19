import { useState } from "react";
import { toast } from "react-toastify";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import {
  ProminentButtonStyled,
  TextFieldStyled,
  PageWrapperStyled,
  HelperTextStyled,
  ButtonGroupStyled,
} from "@/shared";
import {
  GroupRole,
  useMyGroupsQuery,
  useCreateGroupMutation,
  useInviteToGroupMutation,
  useRevokeGroupInviteMutation,
  useRemoveGroupMemberMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
  type MyGroupsQuery,
} from "@/generated/graphql";
import {
  GroupCardStyled,
  GroupNameStyled,
  MemberRowStyled,
  MemberMetaStyled,
  InlineFormStyled,
  RowActionStyled,
} from "./groups-manager-style";

// Derived from the schema rather than hand-mirrored, so it cannot drift.
type Group = MyGroupsQuery["myGroups"][number];

export const GroupsManager = ({
  currentUserId,
}: {
  currentUserId?: string;
}) => {
  const { data, loading, refetch } = useMyGroupsQuery({
    fetchPolicy: "cache-and-network",
  });
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteEmails, setInviteEmails] = useState<Record<string, string>>({});

  const onError = (e: any) => toast.error(e.message);
  const refresh = () => refetch();

  const [createGroup, { loading: creating }] = useCreateGroupMutation({
    onError,
    onCompleted: () => {
      setNewGroupName("");
      toast.success("Group created");
      refresh();
    },
  });
  const [inviteToGroup] = useInviteToGroupMutation({
    onError,
    onCompleted: () => {
      toast.success("Invitation sent");
      refresh();
    },
  });
  const [revokeInvite] = useRevokeGroupInviteMutation({
    onError,
    onCompleted: refresh,
  });
  const [removeMember] = useRemoveGroupMemberMutation({
    onError,
    onCompleted: refresh,
  });
  const [leaveGroup] = useLeaveGroupMutation({
    onError,
    onCompleted: () => {
      toast.success("Left group");
      refresh();
    },
  });
  const [deleteGroup] = useDeleteGroupMutation({
    onError,
    onCompleted: () => {
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
    inviteToGroup({ variables: { groupId, email } });
    setInviteEmails((m) => ({ ...m, [groupId]: "" }));
  };

  return (
    <Container>
      <PageWrapperStyled>
        <Typography variant="h5">Shared groups</Typography>
        <HelperTextStyled>
          Create a group and invite people, then share specific budget
          categories with it from the Budget page.
        </HelperTextStyled>

        <InlineFormStyled>
          <TextFieldStyled
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <ProminentButtonStyled
            textCenter
            disabled={!newGroupName.trim() || creating}
            onClick={() =>
              createGroup({ variables: { name: newGroupName.trim() } })
            }
          >
            Create group
          </ProminentButtonStyled>
        </InlineFormStyled>

        {loading && groups.length === 0 && (
          <HelperTextStyled>Loading…</HelperTextStyled>
        )}
        {!loading && groups.length === 0 && (
          <HelperTextStyled>No groups yet.</HelperTextStyled>
        )}

        {groups.map((g) => (
          <GroupCardStyled key={g.id}>
            <GroupNameStyled>{g.name}</GroupNameStyled>

            {g.members.map((m) => (
              <MemberRowStyled key={m.id}>
                <span>
                  {m.user.name || m.user.email}
                  {m.user.id === currentUserId ? " (you)" : ""}
                </span>
                <MemberMetaStyled>{m.role.toLowerCase()}</MemberMetaStyled>
                {canManage(g) && m.user.id !== currentUserId && (
                  <RowActionStyled
                    danger
                    onClick={() =>
                      removeMember({
                        variables: { groupId: g.id, userId: m.user.id },
                      })
                    }
                  >
                    Remove
                  </RowActionStyled>
                )}
              </MemberRowStyled>
            ))}

            {g.invites.map((inv) => (
              <MemberRowStyled key={inv.id}>
                <span>{inv.email}</span>
                <MemberMetaStyled>invited</MemberMetaStyled>
                {canManage(g) && (
                  <RowActionStyled
                    onClick={() =>
                      revokeInvite({ variables: { inviteId: inv.id } })
                    }
                  >
                    Cancel
                  </RowActionStyled>
                )}
              </MemberRowStyled>
            ))}

            {canManage(g) && (
              <InlineFormStyled>
                <TextFieldStyled
                  placeholder="Invite by email"
                  value={inviteEmails[g.id] || ""}
                  onChange={(e) =>
                    setInviteEmails((map) => ({
                      ...map,
                      [g.id]: e.target.value,
                    }))
                  }
                />
                <ProminentButtonStyled
                  textCenter
                  outline
                  onClick={() => handleInvite(g.id)}
                >
                  Invite
                </ProminentButtonStyled>
              </InlineFormStyled>
            )}

            <ButtonGroupStyled>
              <ProminentButtonStyled
                textCenter
                outline
                onClick={() => leaveGroup({ variables: { groupId: g.id } })}
              >
                Leave group
              </ProminentButtonStyled>
              {myRole(g) === GroupRole.Owner && (
                <ProminentButtonStyled
                  textCenter
                  outline
                  color="error"
                  onClick={() => deleteGroup({ variables: { id: g.id } })}
                >
                  Delete group
                </ProminentButtonStyled>
              )}
            </ButtonGroupStyled>
          </GroupCardStyled>
        ))}
      </PageWrapperStyled>
    </Container>
  );
};
