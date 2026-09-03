# MISAQ — Security & Access Document (SECURITY.md)

**Based on:** TRAD.md v1.0

**Note on scope:** There's no application server, so several sections below (session tokens, API rate limiting, passwords) don't work the way they would in a traditional client-server app. Each is answered for what actually exists — Firebase Auth + Firestore + Security Rules — not padded out with mechanisms this architecture doesn't have.

---

## 1. User Roles & Access

| Role | Defined by | Access |
|---|---|---|
| **Unauthenticated visitor** | No session | Can only reach the sign-in screen and a Kameti join link/QR landing page (which itself forces sign-in before joining) |
| **Authenticated user** | Signed in via Google | Can read/write their own `users/{uid}` profile; can create Kametis |
| **Manager** | `kameti.managerId === auth.uid` | Full read/write on that specific Kameti: settings, member order, start/force-start, payment records |
| **Contributor** | `auth.uid` in `kameti.memberIds` | Read-only on that specific Kameti and its `periods` |

Roles are never global — a user is a Manager on one Kameti and a Contributor on another simultaneously. There is no admin/superuser role in V1; no one has cross-Kameti access, including the app's own operators (no backend exists to grant that).

**Who can access the system:** anyone with a Google account. There's no invite-only signup gate — access to the *app* is open, access to a *specific Kameti's data* is gated by membership, enforced at the database layer (§5), not the login layer.

---

## 2. Authentication & Session Management

- **Mechanism:** Firebase Authentication, Google OAuth2 provider only. No email/password, no custom auth server.
- **Session/token handling:** the Firebase SDK issues a short-lived ID token (1 hour) plus a long-lived refresh token, stored by the SDK in IndexedDB and refreshed automatically in the background. This app writes none of that logic — it's Firebase's, not custom-built, which removes an entire class of session-handling bugs (token replay, insecure storage, manual refresh races) that a hand-rolled JWT system would introduce.
- **Sign-out:** clears the local Firebase Auth session; Dexie's locally cached Kameti data is wiped or left as read-only cache depending on device storage policy — never re-synced until a new sign-in.
- **Multi-device:** each device holds its own session independently; signing out on one device doesn't revoke others (standard Firebase Auth behavior) — acceptable for V1 given the app holds no sensitive financial data, only paid/pending status.

---

## 3. API Security

There's no REST API — Firestore Security Rules **are** the access-control layer, evaluated server-side on every read and write, regardless of what the client claims. Two backstops sit in front of Firestore itself:

- **Firebase App Check** (reCAPTCHA v3 provider): every request must carry a valid App Check token proving it originates from the real MISAQ web app, not a script hitting the Firestore API directly with a stolen config.
- **Security Rules, enforced per collection:**
  - `users/{uid}`: read/write only where `request.auth.uid == uid`.
  - `kametis/{id}`: read allowed if `request.auth.uid == resource.data.managerId` or `request.auth.uid in resource.data.memberIds`. Write allowed only for the Manager, field-by-field (e.g., a Contributor's client can never successfully write `amount` or `status`, even if it tried).
  - `kametis/{id}/periods/{periodId}`: read allowed to any member of the parent Kameti; write (marking paid/pending) restricted to the Manager only.
  - Join operation: write to `memberIds` allowed only if the resulting array length `<= memberCap` — evaluated against the transaction's committed state (see TRAD §7), not a client-reported count.
- Since there's no server-side code to exploit (no SQL injection surface, no server business logic to attack), the entire attack surface is: can a malicious client construct a Firestore write that the Rules should have blocked. Every Rule is written to fail closed — default deny, then narrowly permit.

---

## 4. Rate Limiting & Abuse Prevention

- **No custom rate limiter is built** — there's no server to host one. Protection instead comes from:
  - **App Check**, which blocks non-app traffic (scripts, bots) before it can spam reads/writes at all.
  - **Firestore's own per-project quotas** (Spark tier: 50K reads / 20K writes / 20K deletes per day) act as a hard ceiling — the read-minimization design in TRAD §10 exists specifically so real usage stays well under this, not just to control cost.
  - **Security Rules as abuse limits, not just access limits** — e.g., the member-cap check on join prevents one bad actor from flooding a Kameti's `memberIds` array with junk entries.
- **Known gap for V1:** without a backend, there's no way to rate-limit a single authenticated user's write frequency (e.g., someone rapidly toggling Paid/Pending hundreds of times). Given the low-stakes nature of the data (no money moves), this is accepted as a V1 risk, not solved — revisit with a Cloud Function-based throttle only if it's actually abused in practice.

---

## 5. Database Security

- **Default-deny Security Rules** — nothing is readable or writable unless a rule explicitly permits it; a document type with no matching rule is inaccessible, not open.
- **Field-level write validation** — Rules check not just *who* can write but *what* they're allowed to change (e.g., a Contributor's client cannot flip their own payment status to "paid").
- **Server-side timestamp enforcement** — `createdAt`/`updatedAt` fields must be set via `request.time`, not client-supplied values, so a client can't backdate or forge sync-relevant timestamps.
- **No direct database access outside the app** — Firestore has no exposed SQL/network port; every access path is through the SDK and is subject to the same Rules, including any future admin tooling (which would use a separate service-account key, kept out of the client entirely).
- **Local storage (Dexie/IndexedDB) security:** data cached on-device is only as secure as the device itself — standard browser sandboxing applies (one origin can't read another's IndexedDB). No additional client-side encryption of the local cache in V1, since the data held (Kameti names, amounts, paid/pending flags) isn't sensitive enough to justify the added complexity — this is a deliberate call, revisit only if the product later stores something more sensitive.

---

## 6. Password Requirements

**Not applicable — there are no passwords.** Authentication is Google OAuth2 only; MISAQ never sees, stores, or validates a credential. Whatever password policy protects a user's account is Google's, not this app's problem to enforce or duplicate. This is a security *improvement* over a custom auth system, not a gap — it's one less thing that can be built wrong.

---

## 7. Data Encryption

- **In transit:** all traffic to Firebase Auth, Firestore, and Hosting is TLS-encrypted by default — not configurable, not something the app can misconfigure.
- **At rest:** Firestore encrypts all stored data at rest by default (Google-managed encryption keys) — again, not something MISAQ configures; it's inherited from the platform.
- **Local device cache:** not separately encrypted (see §5) — relies on OS/browser-level device security.
- **No custom encryption is implemented in V1** — there's no field in the schema sensitive enough (no payment credentials, no identity documents) to justify app-level encryption on top of the platform defaults.

---

## 8. Backup & Recovery

This is the one area where the free-tier constraint has a real cost, stated plainly:

- **Firestore's managed scheduled backups and point-in-time recovery require the Blaze (pay-as-you-go) plan** — not available on Spark. Running fully free in V1 means **no automatic platform backup exists** for the first release.
- **Interim mitigation for V1:**
  - Each user's own Dexie/IndexedDB cache is itself a distributed partial backup of their data — a full platform-wide data loss wouldn't erase what's on active devices, though there's no mechanism to reconstruct the server from them.
  - A manual `gcloud firestore export` can be run periodically by whoever administers the project, exported to Cloud Storage — this needs to be a deliberate, scheduled human action (or a simple scheduled Cloud Function once the project moves to Blaze), not assumed to be happening.
- **Recommendation:** budget for moving to Blaze before this app has enough real user data that losing it would matter — Blaze's pay-as-you-go pricing stays effectively free at MISAQ's expected usage levels (you only pay for what exceeds the same free quotas), so this isn't really a cost decision, it's a "flip the switch before it matters" decision. Treat "no backups" as a known, accepted V1 gap, not a permanent design choice.
