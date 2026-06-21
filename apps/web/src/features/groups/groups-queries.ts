import { gql } from "@apollo/client";

// Minimal current-user id; served from the cached `me` root field.
export const ME = gql`
  query MeId {
    me {
      id
    }
  }
`;

export const MY_GROUPS = gql`
  query MyGroups {
    myGroups {
      id
      name
      members {
        id
        role
        user {
          id
          name
          email
        }
      }
      invites {
        id
        email
        status
      }
    }
  }
`;

export const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!) {
    createGroup(name: $name) {
      id
      name
    }
  }
`;

export const INVITE_TO_GROUP = gql`
  mutation InviteToGroup($groupId: ID!, $email: String!) {
    inviteToGroup(groupId: $groupId, email: $email) {
      id
      email
      status
    }
  }
`;

export const ACCEPT_GROUP_INVITE = gql`
  mutation AcceptGroupInvite($token: String!) {
    acceptGroupInvite(token: $token) {
      id
      name
    }
  }
`;

export const REVOKE_GROUP_INVITE = gql`
  mutation RevokeGroupInvite($inviteId: ID!) {
    revokeGroupInvite(inviteId: $inviteId)
  }
`;

export const REMOVE_GROUP_MEMBER = gql`
  mutation RemoveGroupMember($groupId: ID!, $userId: ID!) {
    removeGroupMember(groupId: $groupId, userId: $userId)
  }
`;

export const LEAVE_GROUP = gql`
  mutation LeaveGroup($groupId: ID!) {
    leaveGroup(groupId: $groupId)
  }
`;

export const DELETE_GROUP = gql`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`;

export const SHARE_CATEGORY = gql`
  mutation ShareCategory($categoryId: ID!, $groupId: ID!) {
    shareCategory(categoryId: $categoryId, groupId: $groupId) {
      id
      groupId
    }
  }
`;

export const UNSHARE_CATEGORY = gql`
  mutation UnshareCategory($categoryId: ID!) {
    unshareCategory(categoryId: $categoryId) {
      id
      groupId
    }
  }
`;
