import { useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
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
  MY_GROUPS,
  CREATE_GROUP,
  INVITE_TO_GROUP,
  REVOKE_GROUP_INVITE,
  REMOVE_GROUP_MEMBER,
  LEAVE_GROUP,
  DELETE_GROUP,
} from "./groups-queries";
import {
  GroupCardStyled,
  GroupNameStyled,
  MemberRowStyled,
  MemberMetaStyled,
  InlineFormStyled,
  RowActionStyled,
} from "./groups-manager-style";

type Member = {
  id: string;
  role: string;
  user: { id: string; name?: string | null; email: string };
};
type Invite = { id: string; email: string; status: string };
type Group = { id: string; name: string; members: Member[]; invites: Invite[] };

export const GroupsManager = ({
  currentUserId,
}: {
  currentUserId?: string;
}) => {
  const { data, loading, refetch } = useQuery(MY_GROUPS, {
    fetchPolicy: "cache-and-network",
  });
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteEmails, setInviteEmails] = useState<Record<string, string>>({});

  const onError = (e: any) => toast.error(e.message);
  const refresh = () => refetch();

  const [createGroup, { loading: creating }] = useMutation(CREATE_GROUP, {
    onError,
    onCompleted: () => {
      setNewGroupName("");
      toast.success("Group created");
      refresh();
    },
  });
  const [inviteToGroup] = useMutation(INVITE_TO_GROUP, {
    onError,
    onCompleted: () => {
      toast.success("Invitation sent");
      refresh();
    },
  });
  const [revokeInvite] = useMutation(REVOKE_GROUP_INVITE, {
    onError,
    onCompleted: refresh,
  });
  const [removeMember] = useMutation(REMOVE_GROUP_MEMBER, {
    onError,
    onCompleted: refresh,
  });
  const [leaveGroup] = useMutation(LEAVE_GROUP, {
    onError,
    onCompleted: () => {
      toast.success("Left group");
      refresh();
    },
  });
  const [deleteGroup] = useMutation(DELETE_GROUP, {
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
    return role === "OWNER" || role === "ADMIN";
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
              {myRole(g) === "OWNER" && (
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
