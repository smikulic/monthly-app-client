# Security Audit Log - Monthly

Scope: `monthly-app-server` (GraphQL/Apollo/Prisma) and `monthly-app-client` (React/Vite).
Audience: solo maintainer. Prioritized for "highest risk per hour of effort".

Reproduce dependency findings: `yarn audit --groups dependencies` in each repo.
Node/tooling versions checked against installed runtime.

---

## 2026-06-21 - Initial audit

### Summary

| Area | Status |
|---|---|
| App-level authorization (IDOR) | FIXED (see CLAUDE.md P0) |
| Dependency CVEs | Action needed: 2 critical + several high (mostly transitive, fixable by bump/resolution) |
| Node runtime | OK for now (v22 maintenance LTS until 2027-04-30); patch + plan v24 |
| Auth hardening (rate limit, MFA, token lifetime) | Gaps typical for pre-fintech-grade; prioritized below |
| Transport/headers (helmet, CORS, GraphQL DoS guards) | Gaps; standalone server limits options |
| Audit logging / PII in telemetry | Gaps; partly fixed (Sentry PII) |
| Money representation | GOOD (integer minor units, not float) |

---

## A. Dependencies

This log tracks only **open** and **accepted** dependency findings. Resolved CVEs are not
logged here; the source of truth for what is installed is `yarn.lock`, and the `resolutions`
blocks below document the intentional transitive pins.

To re-check: `yarn audit --groups dependencies --level high` in each repo.

### Open
- None at high/critical except the accepted item below.

### Accepted
- **lodash `_.template` (server, HIGH)**: no fixed lodash 4.x release exists (4.17.21 is the
  max; the advisory's "patched >=4.18.0" is not a real version), and the app's only lodash
  usage is `lodash.merge` in `src/index.ts` (no `_.template`, no untrusted input). Not
  exploitable here; will remain visible in `yarn audit` permanently. Ignore it in Snyk
  (`snyk ignore --id=<SNYK-JS-LODASH-...> --reason="only lodash.merge used"`, writes `.snyk`)
  so it stops nagging. Optional future cleanup: drop lodash by replacing the single `merge`
  call to remove the advisory for good.

### Intentional `resolutions` (why they exist)
Server `monthly-app-server/package.json` pins these patched transitive versions:
```jsonc
"resolutions": {
  "form-data": "^4.0.6",
  "sha.js": "^2.4.12",
  "axios": "^1.12.0",
  "jws": "^4.0.1",
  "jsonwebtoken/jws": "^3.2.3",
  "path-to-regexp": "0.1.13"
}
```
Client pins `"js-cookie": "^3.0.7"` in the **root** `package.json`.

Yarn 1 `resolutions` gotchas we hit (so future-you doesn't repeat them):
- In a workspaces repo, `resolutions` is only read from the **root** `package.json`, never
  from `apps/*`.
- A scoped key like `express/path-to-regexp` only matches when the parent is a *root*
  dependency. For deeply nested transitives use a plain global key (e.g. `path-to-regexp`),
  which is safe when there is only one consumer in the tree.

Revisit these when the parent packages catch up, so they don't silently hold a dep back.

### Process going forward
- **Snyk** (GitHub App) is the dependency scanner + fix-PR engine for both repos. It reads
  `yarn.lock`, so it sees the patched versions from our `resolutions`. Note: Snyk auto-fix
  PRs may not understand Yarn 1 `resolutions` and can try to bump a parent instead; review
  those PRs before merging.
- Optional stronger gate: CI step `npx snyk test --severity-threshold=high --all-projects`
  to fail PRs on new high/critical CVEs (the App already alerts without this).

---

## B. Runtime / platform

- **Both repos pinned to Node 24.11.1** (Active LTS) in `engines`, CI `node-version`, and
  `.nvmrc`. Keep the DO runtime in sync, and track the LTS line over time.
- **Lockfiles**: keep `--frozen-lockfile` in CI (already done in both workflows). Good.

---

## C. Modern fintech security posture

Ordered by risk. None of these block normal use, but they are the gap between "hobby app
handling money" and "fintech-grade". Pick top-down.

### High value
1. **Login brute-force / credential stuffing**: no rate limiting and no account lockout on
   login or password-reset request. Add per-IP + per-account throttling and exponential
   backoff. (Currently impossible to add cleanly with `startStandaloneServer`; see #6.)
2. **JWT lifetime + revocation**: tokens last **90 days** and are stateless, so a leaked
   token cannot be revoked and stays valid for 90 days. Options (cheapest first): shorten to
   hours/days; add a `tokenVersion` column on User bumped on password change/logout to
   invalidate old tokens; or move to short access token + refresh token.
3. **GraphQL DoS guards**: depth limit `depthLimit(10)` added and introspection gated on
   `NODE_ENV !== "production"` (`src/index.ts`). REMAINING: set `NODE_ENV=production` on the
   DO server so introspection is actually off in prod (verify via a prod introspection query).
   Optional later: add a query cost/complexity limit on top of depth.
4. **MFA/2FA**: none. Users expect at least optional TOTP for a money app. Medium effort;
   gate behind "if users ask".
5. **Security event audit trail**: no record of logins, password changes, email changes,
   account deletions, or saving-goal/expense deletions. For money/PII, keep an append-only
   `AuditLog` (userId, action, ip, timestamp). Also aids incident response.
6. **Transport hardening**: `startStandaloneServer` gives permissive CORS and no security
   headers. Consider moving to `expressMiddleware` + `helmet` (HSTS, etc.) + `cors` allowlist
   + `express-rate-limit`. This single change unblocks #1, #3 CORS, and headers at once. It
   is the highest-leverage infra refactor, but it is a real change; do it deliberately.

### Medium value
7. **Password policy**: min length is 6. Raise to >=8 and optionally check against a breached
   -password list (k-anonymity HaveIBeenPwned API). bcrypt cost is 10; 12 is the modern
   default, cheap to raise.
8. **Sentry Session Replay** captures DOM with `replaysOnErrorSampleRate: 1.0`. Replays of a
   budgeting UI can contain financial figures. Enable input masking / block financial
   selectors, or disable replay. (`sendDefaultPii` already set to false.)
9. **PII in logs**: `resetPasswordRequest` logs the user's email (`userResolvers.ts`). Strip
   email from logs (use userId) to keep logs PII-free.
10. **Password reset / email-confirm tokens**: confirm they are single-use (invalidated after
    use) and not just time-bounded (24h). Verify in `userResolvers`.
11. **CORS allowlist**: explicitly restrict to `https://yourmonthly.app` (and localhost in
    dev) rather than relying on standalone defaults.

### Verify (managed-infra, likely fine but confirm in Digital Ocean)
12. **Postgres encryption at rest** enabled on the managed DB.
13. **Automated backups + tested restore** for the prod DB.
14. **Least-privilege DB user** (app user is not the DB superuser).
15. **TLS** enforced DB connection (`sslmode=require` in `DATABASE_URL`).

### Already good (keep)
- Money stored as **integer minor units** (`Int`), not float: avoids rounding errors. Inputs
  validated against Postgres integer bounds. (`quantity` is Float, acceptable for share counts.)
- Passwords hashed with bcrypt; OAuth via verified Google ID tokens.
- Secrets in Digital Ocean env, `.env`/`.env.prod` gitignored and never committed.
- Per-user data scoping enforced on all resolvers (after the P0 IDOR fixes).
- Account deletion is transactional and complete.

---

## Suggested order of attack (remaining work, solo-friendly)
1. Set `NODE_ENV=production` on the DO server (finishes the introspection guard). (Optional)
   add a Snyk CI gate so dependency CVEs stay at zero (Snyk App already alerts).
2. The express + helmet + rate-limit migration (unblocks brute-force protection, headers, CORS).
3. JWT lifetime/revocation, then audit log, then optional MFA, as the product warrants.
