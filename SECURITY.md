# Security policy

Monthly is a personal finance app handling real users' financial data, built and
maintained by one person. This document describes how security is approached
here and how to report a problem.

## Reporting a vulnerability

Please report privately rather than opening a public issue: **sinisa@codewell.studio**.

Include what you found, how to reproduce it, and the impact you think it has.
I will confirm receipt and tell you what I intend to do about it. Please give me
a reasonable window to fix before disclosing publicly.

Please do not test against the production app or other people's accounts. The
public demo account exists for exactly this purpose.

## How security is approached here

The constraint is that one person maintains this. That rules out a lot of
standard practice, so the effort goes where risk per hour is highest rather
than toward completeness.

### Authorization is checked separately from authentication

The bug class that matters most in an app like this is not a missing login
check, it is a present login check that proves *who* the caller is and never
asks *whether this record is theirs*.

Every query that accepts a record id is scoped by ownership, not just wrapped in
an auth guard:

```ts
// not enough: proves the caller is logged in, nothing more
secured(({ id }) => db.record.findUnique({ where: { id } }))

// scoped by owner
secured(({ id }, user) => db.record.findFirst({
  where: { id, category: { userId: user.id } }
}))
```

This app shipped with several resolvers doing the first version. They were found
by a deliberate audit rather than by normal development, because ordinary
feature work never surfaces them: the happy path passes either way.

A public demo account raises the stakes considerably, since it turns "needs a
registered account" into "needs nothing".

**The regression test that matters requests another user's record and asserts a
denial.** Happy-path tests pass whether or not the check exists.

### Not every advisory is a task

Dependency findings are triaged into open and accepted, and every accepted item
records why it is not exploitable in this codebase, what the actual usage is,
and whether a real fix exists. The goal is that a known-and-dismissed finding
stops consuming attention on every scan.

Transitive pins are documented with the reason they exist, so they can be
removed when upstream catches up rather than being left in place indefinitely
because nobody remembers what they were for.

### Money representation

Amounts are stored as integer minor units, never floating point. Currency lives
alongside the amount. Formatting happens at the display edge only.

In an app whose entire purpose is a number the user came to check, a rounding
artifact is not a cosmetic bug.

### What gets tested

In order: pure domain logic (money math, rollover, date ranges), then denial
cases on anything authorization-related, then one end-to-end path. Security
regression tests are the standing exception to keeping tooling minimal, because
a breach and a wrong number are the two failures a solo maintainer cannot
absorb.

## Operational detail

The current configuration, the running risk register and the remediation queue
are tracked privately. If you are reporting a vulnerability you do not need
them, and publishing them would be a map for anyone who is not.
