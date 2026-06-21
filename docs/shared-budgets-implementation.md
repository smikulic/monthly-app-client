# Shared Budgets - Implementation Plan

Engineering companion to [`shared-budgets.md`](./shared-budgets.md). Scope: expenses,
categories, subcategories. Stack: `monthly-app-server` (Apollo + Prisma + Postgres) and
`monthly-app-client` (React + Apollo + codegen).

## Status: shipped (v1)

Phases 0-2 are built and shipped (one PR per repo). Phase 3 (role-management UI, VIEWER
enforcement, pricing limits) is deferred. Notable deviations from the plan below:

- **No feature flag.** `VITE_FEATURE_GROUPS` was not used; the whole feature shipped in a single
  PR per repo, so the surfaces are live rather than gated.
- **Scope args instead of `BudgetScope` input.** Scoped queries take `scope: ScopeMode`
  (`ALL | MINE | GROUP`) + optional `groupId: ID` directly, not a wrapping input object.
- **Scope helper** lives in `src/utils/scope.ts` as `categoryScopeWhere(args, context)`,
  `canAccessCategory(category, context)` (read), and `canManage(ownerUserId, category, context)`
  (edit/remove = the enterer OR a group OWNER/ADMIN). The auth context carries
  `groups: { groupId, role }[]`, loaded once in `src/context.ts`.
- **Global "View" toolbar control.** Instead of a per-page filter, a single compact "View"
  dropdown sits in the shared toolbar (`ActionsBar`) with the month navigator centered beside it,
  on Home, Expenses, and Budget. Scope is held in `ScopeContext` per session (no localStorage).
- **Manage gating in the UI.** `useCanManage()` hides Edit/Remove affordances on categories,
  subcategories, and expenses the user cannot manage; the server enforces the same rule.
- **Shared-category badge** (`SharedGroupBadge`) shows the group name in the "All" view.

## Cross-cutting notes (read first)

- **Deploys are automatic on `master`** (DO runs `prisma migrate deploy`). Every schema change
  must be additive and safe to deploy while old code runs. New tables and **nullable** columns
  are safe; avoid NOT-NULL-without-default in the same migration as code that needs backfill.
- **Feature flag the UI.** (Original plan; **not used as shipped** - the feature went out as one
  PR per repo without a flag.) The idea was to gate client surfaces behind `VITE_FEATURE_GROUPS`
  so backend + partial UI could ship to master without exposing a half-built feature.
- **Codegen**: any new/changed GraphQL operation needs `yarn codegen` (dev server running).
- **Scoping discipline**: reuse the ownership pattern from the IDOR fixes, but the rule becomes
  "owner OR group member." Centralize it in one helper and unit-test denials.
- **Attribution without a rename**: keep the DB column `Expense.userId`; reinterpret it as
  "paid by" in code and expose a GraphQL `paidBy` field resolver (avoids renaming a column on a
  2-year table).
- **Analytics**: add Mixpanel events (`group_created`, `member_invited`, `invite_accepted`,
  `category_shared`, `expense_added_shared`) for funnel + marketing measurement.

---

## Phase 0 - Group membership foundation (no sharing surface yet)

Goal: people can form groups; nothing is shared yet. Lowest-risk, purely additive.

### Server (`monthly-app-server`)

- [ ] **Prisma** (`prisma/schema.prisma`): add models
  - `Group { id, name, createdAt, members GroupMember[], invites GroupInvite[] }`
  - `GroupMember { id, groupId, userId, role Role, createdAt, @@unique([groupId, userId]) }`
  - `GroupInvite { id, groupId, email, role, token @unique, status, invitedByUserId, expiresAt, createdAt }`
  - `enum Role { OWNER ADMIN MEMBER VIEWER }`, `enum InviteStatus { PENDING ACCEPTED REVOKED EXPIRED }`
  - Add back-relations on `User` (`groupMemberships GroupMember[]`). Index `GroupMember(userId)`.
  - Generate migration via `yarn build` against dev DB.
- [ ] **Context** (`src/context.ts`): after auth, load the user's memberships once and attach
  `currentUser.groups: { groupId, role }[]` (a single query, or a DataLoader). Used by all
  scoping later.
- [ ] **Schema** (`src/schemas/groupSchemas.ts`, new): `Group`, `GroupMember`, `GroupInvite`
  types; queries `myGroups`, `group(id)`; mutations `createGroup(name)`,
  `inviteToGroup(groupId, email, role)`, `acceptGroupInvite(token)`,
  `revokeGroupInvite(inviteId)`, `removeGroupMember(groupId, userId)`, `leaveGroup(groupId)`,
  `updateGroup(id, name)`, `deleteGroup(id)`. Register typeDefs/resolvers in `src/index.ts`.
- [ ] **Resolvers** (`src/resolvers/groupResolvers.ts`, new), all `secured()`:
  - `createGroup`: creates group + OWNER membership for caller.
  - `inviteToGroup`: caller must be OWNER/ADMIN; create `GroupInvite` with a random token
    (reuse `crypto.randomUUID()` or a JWT like the email-confirm flow); send email.
  - `acceptGroupInvite`: validate token + status + expiry; create `GroupMember`; mark accepted.
  - `removeGroupMember` / `leaveGroup` / `updateGroup` / `deleteGroup`: role-gated.
  - All mutations assert caller membership/role on the target group.
- [ ] **Email** (`src/helpers/emails.ts` + Postmark template): `sendGroupInviteEmail(email, token, groupName)`.
- [ ] **Tests** (`__tests__`): non-member cannot read/modify a group; invite/accept happy path;
  role gating (MEMBER cannot remove others). Mirror the ownership-denial test style.

### Client (`monthly-app-client`) - behind `VITE_FEATURE_GROUPS`

- [ ] Settings page: "Groups & members" section, create group, list my groups, invite by email,
  list/cancel pending invites, leave/remove members. Reuse `PageWrapperStyled`, `ButtonGroupStyled`,
  dialogs.
- [ ] `/accept-invite?token=...` route + page that calls `acceptGroupInvite`.
- [ ] `yarn codegen` for the new operations.

**Done when:** two test accounts can form a group via email invite; no budget data is shared yet.

---

## Phase 1 - Category sharing + All/Mine/Group scope filter (core value)

### Server

- [ ] **Prisma**: add nullable `Category.groupId` (FK `Group`) + index `Category(groupId)`.
  Migration is additive; existing categories stay `NULL` (personal). No expense backfill.
- [ ] **Scope helper** (`src/utils/scope.ts`, new): given `scope` + `currentUser`, return a
  Prisma `where` fragment for categories:
  - `MINE` -> `{ userId: me, groupId: null }`
  - `GROUP` -> `{ groupId }` (assert membership) 
  - `ALL` -> `{ OR: [{ userId: me, groupId: null }, { groupId: { in: myGroupIds } }] }`
  - Plus `canAccessCategory(category, currentUser)` = owner OR member of `category.groupId`.
- [ ] **Schema**: `enum ScopeMode { ALL MINE GROUP }`, `input BudgetScope { mode: ScopeMode!, groupId: ID }`.
  Add `scope: BudgetScope` arg to `categories`, `category`, `expenses`, `chartExpenses`.
  Add mutations `shareCategory(categoryId, groupId)`, `unshareCategory(categoryId)`.
- [ ] **Resolvers** (change scoping from `userId` to scope-aware):
  - `categoryResolvers.categories/category`: use the scope helper instead of `where: { userId }`.
  - `subcategoryResolvers` query/update/delete: replace ownership check with `canAccessCategory`
    on the parent category.
  - `expenseResolvers.expenses/chartExpenses`: scope by `subcategory.category` matching the scope
    `where` (+ existing date filter). `createExpense/updateExpense/deleteExpense`: assert
    `canAccessCategory` of the target subcategory's category; set/keep `userId` = caller (paidBy).
  - `shareCategory/unshareCategory`: caller must own the category (or be group ADMIN per policy);
    set/clear `groupId`. On unshare with other members' expenses present, warn/block (see doc).
- [ ] **Tests**: ALL/MINE/GROUP return the right sets; a non-member is denied a group's category
  and its expenses; sharing/unsharing transitions.

### Client - behind flag

- [ ] **Scope filter control** on Expenses and Budget pages: All / Personal / one entry per group.
  Store the selected scope in context (+ localStorage); pass `scope` to the scoped queries.
- [ ] **Share/unshare** action in category management (pick a group).
- [ ] Labels adapt to the active scope (e.g. group name as the heading).
- [ ] `yarn codegen`; update the affected query hooks/usages.

**Done when:** a category shared with a group is visible/editable by all its members, and a user
can view All (combined), Personal, or a specific group on Expenses and Budget.

---

## Phase 2 - "Paid by" attribution

### Server
- [ ] Expose `Expense.paidBy: User` field resolver (resolves the existing `userId`).
- [ ] Allow `createExpense/updateExpense` to set `paidByUserId` to any member of the category's
  group (validate membership); default = caller.

### Client - behind flag
- [ ] "Paid by" selector in the expense form when the category is shared (members of that group).
- [ ] Show the payer (avatar/initial) on expense rows in shared categories.
- [ ] `yarn codegen`.

**Done when:** the baby-equipment scenario works end to end (shared category, either partner logs
it, Paid by = partner, both see it).

---

## Phase 3 - Roles and pricing limits

- [ ] Enforce `ADMIN`/`VIEWER` semantics (VIEWER read-only) in group + category mutations.
- [ ] Add `plan` (FREE | PRO) to `User`; enforce limits server-side in `createGroup` /
  `inviteToGroup` / `shareCategory` (max groups, members/group, shared categories). Return a
  typed "limit reached" error; client shows an upgrade prompt.
- [ ] Decide grandfathering for early adopters.

**Later:** settle-up/splitting, shared saving goals, group-level reports. (Out of v1 scope.)

---

## Migration & rollout summary

1. Phase 0 migration: new tables only. Deploy + ship group management.
2. Phase 1 migration: nullable `Category.groupId`. Deploy resolvers with scope-aware reads
   (default scope `ALL` keeps current behavior for solo users, who only have personal data).
3. Phases 0-2 shipped together (one PR per repo, no flag); verified on prod with a test pair of
   accounts.
4. No expense backfill at any point (scope derives from category).

## Risk checklist

- Scope regressions: every read/write resolver changes, lean on denial unit tests + a manual
  two-account pass.
- Privacy: confirm a non-member can never read a group's categories/expenses (same IDOR
  discipline, membership-based).
- Auto-deploy safety: keep each migration additive; never couple a NOT-NULL change with required
  backfill.
- Currency mismatch across members: a shared category assumes one currency (consider per-group
  currency before launch).
