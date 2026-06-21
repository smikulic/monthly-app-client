# Shared Budgets (Groups)

Status: **shipped (v1)**. Scope: **expenses, categories, subcategories only** (saving
goals and investments stay personal for now).

As-built notes (where the shipped feature differs from the original design below):
- **No feature flag.** Shipped as one PR per repo; the surfaces are live, not gated.
- **Scope args, not a `BudgetScope` input.** Queries take `scope: ScopeMode` (`ALL | MINE | GROUP`)
  plus an optional `groupId: ID`, rather than a wrapping input object.
- **Global "View" filter.** A single compact "View" dropdown in the page toolbar (with the month
  navigator centered next to it) drives All / Personal / group across Home, Expenses, and Budget.
  Selection lives in React context (per session), not localStorage.
- **Manage rule = enterer or group owner/admin.** Creating in a shared category is open to any
  member; editing/removing a category, subcategory, or expense is allowed only for the person who
  created/entered it OR a group OWNER/ADMIN. The UI hides Edit/Remove affordances accordingly.
- **Roles partially live.** Invites default to MEMBER and OWNER/ADMIN get manage rights; the
  ADMIN/VIEWER role-management UI and VIEWER read-only enforcement are deferred (see §8).
- **Shared-category badge.** In the "All" view, shared categories show their group name as a small
  badge next to the title on both Budget and Expenses.

## 1. Goal

Let people budget together without merging their whole financial life. A user keeps their
personal budget and can also **share specific categories** with one or more **groups**, a
partner, the whole family (including kids), roommates, or their parents, and then view their
money as **All (combined)**, **Mine (personal only)**, or **a specific group**.

Motivating scenario: a partner pays 120 EUR for baby equipment from her own account but has
no time to log it. The other partner has time but no access to her categories and no shared
one. With shared groups, there's a shared "Baby" category either of them can post to, with a
record of who paid.

## 2. Product positioning and marketing notes

> These notes are written to be reused in a launch/marketing email once the feature ships.

**One-liner:** Budget together, stay in control. Share only the categories you want, with the
people you want.

**Why it's different:** most budgeting apps force an all-or-nothing shared account. Monthly
lets you keep your personal budget private and share *individual categories* with *different
groups*, your partner, your household, your roommates, or your parents, all from one place.

**Benefit bullets (email-ready):**
- Share a "Groceries" or "Baby" category with your partner; keep your personal spending private.
- Be in more than one group at once: share rent with roommates and a holiday fund with family.
- See the full picture: switch a single view between **All**, **Personal**, and any group.
- Know who paid: every shared expense records which member's money it was.
- No new account, no merging: turn sharing on per category, turn it off anytime.

**Draft announcement copy:**
"Budgeting is rarely a solo activity. Now you can share the categories that matter, rent with
your roommates, groceries with your partner, a family fund with everyone, while your personal
budget stays yours. Switch any view between All, Personal, and each of your groups, and always
see who paid. Set it up in seconds, no shared bank account required."

**Audience segments to target:** couples, families with kids, flatmates/roommates, adult
children managing shared costs with parents.

## 3. Concepts and terminology

- **Group**: a named set of people who share some categories (e.g. "Family", "Flat 4B",
  "Mum & Dad"). A user can belong to many groups.
- **Member**: a user in a group, with a role.
- **Personal**: data owned by one user and not shared (the default, exactly like today).
- **Shared category**: a category attached to one group; visible and editable by that group's
  members.
- **Scope filter**: the view control (All / Mine / <group name>) that decides which data is shown.

## 4. Key design decisions

1. **Filter, not switch.** There is one combined dataset; the user filters it (All / Mine /
   group). This is what makes "see mine and combined" possible. We deliberately avoid a modal
   "active space" switcher, which would make a combined household view awkward.
2. **Sharing is per category (opt-in).** A category is either personal or attached to exactly
   **one** group. To share the same concept with two groups, create two categories. This keeps
   scope unambiguous and the filter simple.
3. **Groups are N-person.** Two people, a family with kids, or a houseshare all use the same
   model. A user can be in multiple groups.
4. **Expenses inherit scope from their category.** No per-expense sharing flag, which means the
   existing 2+ years of expenses need **no data backfill**.
5. **`Expense.userId` is repurposed as `paidByUserId`** (attribution). No data move, just a
   semantic change.
6. **Scope to budget only.** Categories / subcategories / expenses. Saving goals and
   investments remain personal in v1.

## 5. Data model

| Entity | Fields |
|---|---|
| **Group** (new) | `id, name, createdAt` |
| **GroupMember** (new) | `id, groupId, userId, role (OWNER \| ADMIN \| MEMBER \| VIEWER), createdAt`, unique `(groupId, userId)` |
| **GroupInvite** (new) | `id, groupId, email, role, token, status (PENDING \| ACCEPTED \| REVOKED \| EXPIRED), invitedByUserId, expiresAt` |
| **Category** (changed) | add nullable `groupId` (FK Group). NULL = personal (owner = `userId`); set = shared with that group. |
| **Subcategory** | unchanged; scope inherited from its category. |
| **Expense** (changed) | repurpose `userId` as `paidByUserId`; scope inherited from its category. |

Indexes: `Category(groupId)`, `Category(userId)`, `GroupMember(userId)`.

## 6. Access rules

A user may read/write a category (and its subcategories/expenses) if:

- `category.userId === currentUser` (personal), OR
- `category.groupId` is a group the user is a member of.

Write permission is further gated by role (see below). Expenses follow their category, so a
member can add/edit expenses in any shared category they can access.

## 7. Scope filter and UI labels

A `scope` argument on the expenses and budget queries:

| Filter | UI label | Category `where` |
|---|---|---|
| **All** | "All" / "Everything" | `userId = me` OR `groupId ∈ myGroupIds` |
| **Mine** | "Personal" | `userId = me` AND `groupId IS NULL` |
| **Group X** | the group's name | `groupId = X` (and I'm a member) |

The filter is dynamic: it always shows All and Personal, then one entry per group the user
belongs to. Totals, charts, and monthly budgets all respect the active filter. Shared expense
rows record who paid (the paid-by member).

As shipped, this is a single global **"View"** dropdown in the page toolbar (the month navigator
sits centered beside it), shared across Home, Expenses, and Budget. It is hidden entirely for
users who belong to no groups.

## 8. Roles and permissions

- **OWNER**: created the group; manage members, rename, delete, everything an admin can do.
- **ADMIN**: invite/remove members, share/unshare categories, edit data.
- **MEMBER**: add/edit expenses and categories in the group.
- **VIEWER** (e.g. a kid, or a parent you only report to): read-only.

**As shipped (v1):** the role enum exists and `inviteToGroup` accepts a role (defaulting to
MEMBER), and the manage rule honors OWNER/ADMIN (they can edit/remove any member's items, on top
of the original enterer). Not yet built: a UI to change a member's role after they join, and
VIEWER read-only enforcement on create. So in practice today groups run as OWNER + MEMBER. Adding
ADMIN/VIEWER later is additive: the plumbing and permission checks already account for them.
Kids are just members (or future VIEWERs) of the family group; no separate "child account"
concept required.

## 9. Pricing and limits (future)

Sharing is the natural paid feature; personal budgeting stays free forever.

| | Free | Paid (Pro) |
|---|---|---|
| Personal budgeting | Unlimited | Unlimited |
| Groups you can be in / own | 1 group | Multiple (e.g. up to 5, or unlimited) |
| Members per group | Small (e.g. up to 3, incl. you) | Larger (e.g. up to 10) |
| Shared categories | Limited (e.g. up to 5) | Unlimited |

Notes:
- Numbers above are placeholders; treat as tunable product knobs.
- **Enforce server-side** at `createGroup` / `inviteMember` / share-category time (never trust
  the client); return a clear "limit reached, upgrade" error the client turns into an upgrade prompt.
- Add a `plan` (FREE | PRO) concept on the user when billing lands; limits read from plan.
- Grandfathering: decide whether early adopters keep higher limits.

## 10. Migration (lightweight)

Because expenses scope via their category, this is a small, low-risk change:

1. Add `Group`, `GroupMember`, `GroupInvite` tables and a **nullable** `Category.groupId`.
2. No backfill: existing categories stay `groupId = NULL` (personal). Solo users and current
   data are unaffected.
3. `Expense.userId` keeps its value, reinterpreted as `paidByUserId`.
4. Sharing an existing category just sets its `groupId`. Reversible.

Compared with a full "spaces" migration, there is no NOT-NULL column added across millions of
expense rows, which is the main reason to prefer this shape.

## 11. Example scenarios

- **Baby equipment (partner):** create/share a "Baby" category with the "Family" group; either
  partner logs the 120 EUR with Paid by = partner; both see it under All and Family.
- **Rent (roommates):** share a "Rent & Bills" category with the "Flat 4B" group of 4; each
  flatmate logs their share with Paid by = themselves.
- **Parents:** share a "Mum & Dad expenses" category with a separate "Parents" group, without
  exposing it to the Family group.
- **Mixed view:** filter to "All" to see your combined month across personal + all groups, or
  "Personal" to see just your private budget.

## 12. User stories

- As a user, I can create a named group and invite people by email.
- As an invitee, I can accept an invite and become a member.
- As a member, I can mark a category as shared with a specific group (and unshare it).
- As a member, I can filter expenses and budget by All / Personal / a specific group, with the
  group's name as the label.
- As a member, I can add an expense to a shared category and record who paid.
- As a member, I see all data in groups I belong to and never another user's personal data.
- As an owner/admin, I can manage members and roles; as a member, I can leave a group.
- As a free user, I'm told when I hit a sharing limit and how to upgrade.

## 13. Phased rollout (solo-maintainer friendly)

- **Phase 0 (done):** Group + GroupMember + GroupInvite models and the invite/accept flow. No
  sharing surface yet; just links accounts into groups.
- **Phase 1 (done):** `Category.groupId` + access rules + the **All / Mine / Group** scope filter on
  Expenses, Budget, and Home. Delivers the combined household view (the core value).
- **Phase 2 (done):** `paidBy` selector and display in shared categories.
- **Phase 3 (deferred):** role management UI + VIEWER enforcement, and pricing limits + upgrade
  prompts.
- **Later:** settle-up / splitting, shared saving goals, group-level reports.

## 14. Open questions / gotchas

- **Shared budget under "All":** every member sees the full shared category budget (household
  view), not a per-person split. Correct default; splitting is a later phase.
- **Currency:** a shared category assumes one currency; group members should agree (or we add
  conversion later). Consider a per-group currency.
- **Unsharing** a category that already holds other members' expenses: warn or block rather than
  silently hide their data.
- **Concurrent edits** to a shared category's budget: last-write-wins is acceptable for small
  groups.
- **Leaving/removing a member:** their past expenses in shared categories stay (attributed);
  they simply lose access.

## 15. Out of scope (v1)

Expense splitting / settle-up math, sharing a category with more than one group at once,
shared saving goals and investments, and child-specific account types.
