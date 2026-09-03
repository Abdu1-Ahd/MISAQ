# MISAQ — Technical Requirements & Architecture Document (TRAD)

**Version:** 1.0 (V1 build)
**Based on:** PRD.md v1.0

**Note on scope:** MISAQ has no traditional application server. It's a client-heavy PWA on Firebase's managed backend (Auth + Firestore + Hosting). Several sections below (JWT, REST endpoints, containers, Redis) exist in the template because that's the standard TRAD shape — this document adapts each to what actually exists, and says explicitly where something is intentionally *not* built, per "avoid overengineering."

---

## 1. System Overview & Architecture

### Objectives
- Give every Kameti a single, real-time, offline-available source of truth.
- Keep the entire system inside Firebase's free (Spark) tier limits.
- Single-writer-per-Kameti model (Manager writes, Contributor reads) — this is the core architectural decision everything else follows from, because it removes the need for conflict resolution, operational transforms, or a mediating server.

### System boundaries
- No payment processing, no money movement.
- No custom backend server / no Node/Express API layer.
- No real-time chat, no push notifications in V1.
- All business logic lives in one place: a framework-agnostic TypeScript module (`kametiEngine`), not duplicated across client and server, because there is no server to duplicate it into.

### High-level architecture

```
┌─────────────────────────────────────────────┐
│                Client (PWA)                  │
│                                               │
│  React UI ──▶ Zustand (UI/session state)     │
│      │                                       │
│      ▼                                       │
│  Repository Layer (generic, typed)           │
│      │                                       │
│      ▼                                       │
│  Dexie / IndexedDB  ◀── source of truth for  │
│   (local cache)         all reads            │
│      │                                       │
│      ▼                                       │
│  Sync Engine (queue, retry, version compare) │
│      │                                       │
│      ▼                                       │
│  Firebase SDK (Auth + Firestore)             │
└──────────────┬────────────────────────────────┘
               │  (only network boundary)
               ▼
┌─────────────────────────────────────────────┐
│              Firebase (managed)              │
│  Auth (Google OAuth2)                        │
│  Firestore (documents + Security Rules)      │
│  Hosting (static PWA + service worker)       │
│  App Check (bot/abuse protection)            │
└─────────────────────────────────────────────┘
```

### Data flow
1. UI reads only from Dexie — never blocks on network.
2. Writes (e.g., mark payment) go to Dexie immediately, then queue in the Sync Engine.
3. Sync Engine pushes queued writes to Firestore when online; Security Rules validate and either accept or reject each write server-side.
4. For the screen currently open, a Firestore listener streams changes back down into Dexie. Everything else on the dashboard is a periodic cheap `updatedAt`-field check, not a live listener (read-cost control, see §10).

---

## 2. Tech Stack & External Dependencies

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 + TypeScript | Stability, ecosystem, typed safety across the whole app |
| Build | Vite | Fast dev loop, small PWA-friendly output |
| Styling | Tailwind CSS | Small footprint, consistent mobile UI |
| Components | shadcn/ui (selective) | Accessible primitives without a heavy runtime |
| Routing | React Router | Lightweight, mature |
| Local DB | Dexie (IndexedDB) | Offline source of truth |
| State | Zustand | Small, no boilerplate, fine for UI/session state |
| Backend | Firebase (Auth, Firestore, Hosting, App Check) | Fully managed, free-tier viable, matches offline+sync needs directly |
| PWA | vite-plugin-pwa + Workbox | App-shell caching, install prompts |
| i18n | i18next + react-i18next | English / Urdu / Roman Urdu |
| Dates | date-fns | Lightweight; all date math fixed to Asia/Karachi |
| Validation | Zod | Runtime validation at every Firestore read/write boundary |
| Testing | Vitest, Testing Library, Playwright | Unit, component, and real-browser/PWA testing |
| QR | `qrcode` (client-side generation) | No server-side rendering needed |

**No Redis. No containers. No custom API server.** These are cut deliberately, not by omission — there's no compute layer that needs them.

---

## 3. Component Responsibilities

### Frontend (owns almost everything)
- **UI/UX rendering** — React components, mobile-first, per PRD screens.
- **State management** — Zustand holds ephemeral UI/session state only (current route params, open modals, form drafts). It does **not** hold Kameti data — that always comes from Dexie via the repository, so UI state and persisted data can never drift apart.
- **Client routing** — route guards redirect unauthenticated users to sign-in; this is UX convenience only, not a security boundary (see §5).
- **Business logic** — `kametiEngine` (turn calculation, current period, countdowns, paid/remaining counts) is pure functions, no I/O, fully unit-testable, called identically from any screen that needs it.
- **Sync Engine** — queues writes, retries with backoff, resolves the local vs. remote version on reconnect (last-write-wins per document, safe because of the single-writer model).

### "Backend" (Firebase-managed)
- **Data validation & authorization** — Firestore Security Rules are the actual backend logic layer: they enforce who can write what, and validate document shape and the member-cap invariant on every write.
- **Persistence & sync transport** — Firestore.
- **Identity** — Firebase Auth (Google OAuth2), no custom session/token code needed; the SDK attaches the ID token automatically.
- **Background jobs** — none required for V1. (Noted as a deliberate non-feature: cycle-complete/archive status is a *computed* value from dates, not a stored transition, so nothing needs to run on a schedule to update it.)

---

## 4. Codebase, File & Folder Structure

Single repository — a split frontend/backend repo isn't justified when there's no backend codebase.

```
misaq/
├── public/
│   ├── manifest.json
│   └── icons/
├── firebase/
│   ├── firestore.rules
│   └── firestore.indexes.json
├── src/
│   ├── app/                      # route definitions, top-level layout
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── kameti-create/
│   │   ├── kameti-manager-view/
│   │   ├── kameti-contributor-view/
│   │   └── kameti-archive/
│   ├── core/
│   │   ├── engine/                # kametiEngine.ts — pure turn/period logic, zero I/O
│   │   ├── repository/            # generic Repository<T>, one implementation, all features use it
│   │   ├── db/                    # Dexie schema + migrations
│   │   ├── sync/                  # sync queue, retry, conflict handling
│   │   └── firebase/              # SDK init, converters, App Check setup
│   ├── components/                # shared UI (Button, Card, TurnCountdown, etc.)
│   ├── store/                     # Zustand stores (UI/session only)
│   ├── i18n/                      # en / ur / ur-Roman resource files
│   ├── types/                     # shared TypeScript types/interfaces
│   └── utils/
├── tests/
├── .env.development
├── .env.staging
├── .env.production
└── firebase.json
```

**Naming convention:** feature folders are noun-based (`kameti-create`, not `create-kameti-screen`); every cross-feature concept (engine, repository, db, sync) lives once under `core/` — nothing feature-specific gets duplicated, per your DRY requirement.

---

## 5. Authentication, Roles & Authorization

- **Mechanism:** Firebase Authentication, Google provider only. The Firebase SDK manages the ID token lifecycle (refresh, attach-to-request) internally — there is no custom JWT issuance or session store to build or maintain.
- **No backend session handling exists because there's no backend to hold a session.** The client always talks directly to Firestore, authenticated by the SDK.
- **Role model:** roles are not stored on the user — they're derived per-document.
  - Manager = `kameti.managerId === auth.uid`
  - Contributor = `auth.uid` present in `kameti.memberIds`
- **Authorization enforcement — the real security boundary is Firestore Security Rules, not the client.** Example logic (not literal syntax):
  - Only `managerId` may write `amount`, `frequency`, `memberOrder`, `status`, or any `periods/*` document.
  - Any `memberIds` holder may read the Kameti doc and its `periods` subcollection, and may write nothing.
  - Join operation may only append to `memberIds` if `memberIds.length < memberCap`, executed as a transaction (see §7) so the rule evaluates against the true committed state.
- **Client-side route guards** exist purely so an unauthenticated user sees a sign-in screen instead of an error — never treat them as the enforcement point.

---

## 6. Database Architecture & Schema

Firestore (NoSQL, document-based). No SQL, no ORM, no traditional migrations.

### Collections

**`users/{uid}`**
```
displayName: string
email: string
language: 'en' | 'ur' | 'ur-Roman'
createdAt: timestamp
```

**`kametis/{kametiId}`**
```
name: string
managerId: string (uid)
amount: number
frequencyValue: number
frequencyUnit: 'days' | 'weeks' | 'months'
memberCap: number
memberIds: string[]              # embedded — small (5–20), one read gets the whole roster
memberOrder: { uid: string, turnIndex: number }[]
status: 'processing' | 'active' | 'completed'
startedAt: timestamp | null
firstTurnDate: timestamp | null
updatedAt: timestamp             # cheap change-detection field, see §10
version: number                  # incremented on every write, backstop for the sync engine
createdAt: timestamp
```

**`kametis/{kametiId}/periods/{periodId}`** (subcollection — grows over time, kept separate from the main doc so it never bloats the doc read on the dashboard)
```
periodIndex: number
turnHolderUid: string
startDate: timestamp
endDate: timestamp
payments: { [uid: string]: 'paid' | 'pending' }
```

### Indexing
- Composite index: `kametis` where `memberIds array-contains {uid}` + order by `updatedAt` — needed for the Contributor dashboard query.
- Composite index: `kametis` where `managerId == {uid}` + order by `createdAt` — Manager dashboard query.
- No manual indexing needed on `periods` — always queried by parent + `periodIndex`, which Firestore handles natively.

### "Migrations"
Firestore is schema-less at the database level, so migration = a `schemaVersion` field per document type plus a small client-side migration function that upgrades a document's shape on read if it's behind. For the rare case of a breaking change already in production, a one-off admin script (run manually, not a standing pipeline) batch-updates existing documents. No migration framework is justified at this scale.

---

## 7. API & Integration Specifications

There is no REST/GraphQL API — the Firestore SDK **is** the API, governed entirely by Security Rules. What would normally be "endpoints" are instead typed client-side operations, each wrapping a specific Firestore call pattern:

| Operation | Firestore pattern | Notes |
|---|---|---|
| `createKameti(data)` | Single doc `set` on `kametis/{id}` | Client-generated ID, `status: 'processing'` |
| `joinKameti(kametiId)` | `runTransaction`: read doc, check `memberIds.length < memberCap`, append uid | Prevents last-slot race condition (§ below) |
| `startKameti(kametiId, firstTurnDate)` | Doc `update`, `status → 'active'` | Manager-only, rule-enforced |
| `forceStartKameti(kametiId, firstTurnDate)` | Doc `update`, `status → 'active'` with current `memberIds` as final roster | Same write path as `startKameti`, difference is only in UI + no cap-reached check |
| `markPayment(kametiId, periodId, uid, status)` | `update` on `periods/{periodId}.payments.{uid}` | Manager-only |
| `renewKameti(kametiId)` | `create` new `kametis` doc, copy name/amount/frequency/memberOrder, `status: 'processing'`, new QR/link | Original stays in `completed` |

**Error handling:** every operation wraps Firestore errors into one of three app-level error types — `PermissionDenied`, `Offline` (queued, not failed), `Conflict` (version mismatch, re-fetch and retry) — surfaced to the UI as one consistent toast/inline pattern, not per-screen custom handling.

**Concurrency fix for the join race condition:** `joinKameti` must be a `runTransaction`, not a plain read-then-write. The transaction re-reads `memberIds` at commit time, so two simultaneous joins on the last open slot serialize correctly — one succeeds, one gets a `Conflict` and a "Kameti is full" message. The Security Rule capping `memberIds.length <= memberCap` is the backstop if a client ever bypasses the transaction, not the primary mechanism.

---

## 8. Environment & Secrets Management

Firebase client config (`apiKey`, `projectId`, etc.) is not a secret — it's safe to ship in the client bundle, since real enforcement is in Security Rules, not by hiding config. What's actually managed per environment:

| Variable | Dev | Staging | Prod |
|---|---|---|---|
| `VITE_FIREBASE_PROJECT_ID` | misaq-dev | misaq-staging | misaq-prod |
| `VITE_FIREBASE_API_KEY` | per-project | per-project | per-project |
| `VITE_APP_CHECK_SITE_KEY` | reCAPTCHA v3 dev key | staging key | prod key |
| `VITE_ENV` | development | staging | production |

- Three separate Firebase projects (dev/staging/prod) — never share Firestore data or rules across environments.
- App Check secret (server-side attestation key, if using a custom provider) is the one genuine secret, held in Firebase's own console, never in the repo.
- `.env.*` files are gitignored; CI injects the correct one per deploy target.

---

## 9. Deployment & DevOps Pipeline

- **Build:** `vite build` → static assets + service worker.
- **Hosting:** Firebase Hosting, serves the static bundle + is the CDN. No containerization — there's no server process to containerize.
- **CI/CD:** GitHub Actions.
  - PR opened → run lint, typecheck, unit tests (Vitest), Playwright smoke tests.
  - Merge to `staging` → deploy to `misaq-staging` (Hosting + Firestore Rules + indexes).
  - Merge to `main` → deploy to `misaq-prod`, same pipeline, manual approval gate before the prod deploy step.
- **Rules deploy:** `firestore.rules` and `firestore.indexes.json` are deployed in the same pipeline as the app, never edited by hand in the Firebase console — the repo is the source of truth for rules.
- No Kubernetes, no Docker registry, no server fleet — intentionally, since Hosting + Firestore is fully managed and this is a single small PWA, not a multi-service system.

---

## 10. Scalability & Performance Strategy

Scaling here means controlling **Firestore read/write cost**, not server capacity — there's no server to scale.

- **No live listeners on the dashboard.** Dashboard data loads from Dexie cache on open; a background check reads only each visible Kameti's `updatedAt` field (cheap, single-field reads) and pulls the full doc only if it changed.
- **Live listener only on the currently open Kameti detail screen** — the one place a user is actively watching for change.
- **Embedded `memberIds`/`memberOrder` arrays** instead of a members subcollection — one doc read returns the full roster for typical Kameti sizes (5–20 people), instead of N reads.
- **Periods as a subcollection**, not embedded — keeps the main Kameti doc small and cheap to read/listen to, since periods only grow.
- **Caching/CDN:** Firebase Hosting's CDN handles static asset caching automatically; no separate CDN layer needed. No Redis — there's no server-side compute that would benefit from a cache in front of it; the client's own Dexie store already serves that role for data.
- **Horizontal scaling:** automatic and managed by Firebase — not something this app's architecture needs to plan for directly. The actual scaling risk is Spark-tier read/write quotas, which is why every design choice above optimizes for read count first.
- **Load balancing:** not applicable — no origin server to balance load across.
