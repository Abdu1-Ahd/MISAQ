# MISAQ e Amanat — Phase 0 Implementation Plan

**Product:** MISAQ e Amanat — Kameti Management PWA  
**Phase:** 0 — Architecture and Shared Foundations  
**Status:** Ready for implementation  
**Source documents:** `PRD.md`, `TRAD.md`, `SECURITY.md`, `DESIGN.md`

## 1. Phase 0 Purpose

Phase 0 establishes the application skeleton and the centralized, reusable foundations required by every later feature. It should leave the project ready for authentication, dashboard, Kameti creation, joining, manager workflows, contributor workflows, offline sync, and testing without requiring another structural rewrite.

Phase 0 is complete when:

- the project has a clear feature/core/shared boundary;
- domain data and lifecycle values have one canonical TypeScript definition;
- the app has a single routing, configuration, error, date, currency, and localization strategy;
- local persistence is available behind an interface, without UI code depending directly on Dexie or Firebase;
- Firebase, Firestore rules, and environment configuration have safe placeholders;
- the PWA shell and offline boundaries are defined;
- the starter Vite screen is replaced by an application shell that can host future routes;
- build, lint, typecheck, and the initial test command are repeatable;
- the architecture decisions and acceptance checks are recorded for future phases.

## 2. Product Understanding

MISAQ is a Pakistan-focused Kameti management PWA. A Kameti is a rotating savings group in which a fixed group contributes a fixed amount at a fixed frequency, and members receive turns in an agreed order.

The product has two document-level roles:

- **Manager:** owns a Kameti, controls membership order and payment records, and can start, force-start, or renew it.
- **Contributor:** joins one or more Kametis and has read-only access to membership, turn, and payment status.

The key architecture constraint is the single-writer model: the Manager is the only writer for membership/order and payment records after joining. The UI must be offline-friendly, but Firestore Security Rules remain the real authorization boundary. Local state is a cache and queued-write source, not a security boundary.

The key user promise is clarity without messaging the Manager: every member should be able to see the current turn, their own turn, payment status, and the wider group's status.

## 3. Architectural Principles

1. **Domain-first:** Kameti concepts, lifecycle rules, and derived values are defined in `src/types` and `src/core/engine`, not inside screens.
2. **Local reads first:** UI reads through repositories backed by local persistence. Network synchronization is an implementation detail behind those repositories.
3. **One business-logic owner:** `kametiEngine` contains pure turn, period, countdown, completion, and payment-count calculations. No feature recreates those calculations.
4. **Explicit trust boundaries:** client route guards improve UX; Firestore Rules enforce access. No client-only authorization is treated as sufficient.
5. **Dependency direction:** features may depend on core and shared components; core must not import feature UI; domain code must not import React, Firebase, or Dexie.
6. **Typed boundaries:** validate external input at the Firebase, URL, form, and persistence boundaries with Zod before it enters domain code.
7. **Pakistan locale by default:** PKR, `Asia/Karachi`, and English/Urdu/Roman Urdu are first-class concerns rather than screen-level additions.
8. **Mobile-first and accessible:** touch targets, bilingual text expansion, reduced-motion behavior, keyboard access, and readable contrast are built into shared components.
9. **Small, replaceable adapters:** Firebase, Dexie, QR generation, and browser APIs are adapters. The domain and feature layers depend on interfaces where practical.
10. **No speculative backend:** there is no custom API server, Redis layer, container, or server-side session system in V1.

## 4. Current Baseline

The repository is currently a Vite React TypeScript starter:

- `src/App.tsx` contains the generated demo screen and counter;
- `src/App.css` and `src/index.css` contain starter styling;
- `src/main.tsx` is the React entry point;
- `vite.config.ts` exists and `vite-plugin-pwa` is already installed;
- the package has React 19, TypeScript, Vite, Tailwind CSS, the Tailwind Vite plugin, and Oxlint;
- there are no feature folders, core services, domain types, database schema, Firebase setup, router, i18n setup, or test setup yet;
- `public/` contains starter assets that should be evaluated while replacing the demo shell.

The first implementation task is therefore structural initialization, not incremental modification of an existing product architecture.

## 5. Target Source Structure

Create the following structure during Phase 0. Empty folders should not be added without an owning file or an immediate implementation task.

```text
src/
├── app/
│   ├── AppRouter.tsx              # route definitions and route-level lazy boundaries
│   ├── AppShell.tsx               # app-wide shell, header/nav outlet, providers
│   ├── RouteGuard.tsx             # UX guard based on auth/session state
│   └── providers.tsx              # ordered application providers
├── components/
│   ├── ui/                        # reusable presentational primitives
│   ├── feedback/                  # Toast, InlineError, EmptyState, LoadingState
│   ├── layout/                    # PageContainer, Section, BottomNav
│   └── kameti/                    # reusable domain display pieces
├── core/
│   ├── config/
│   │   ├── env.ts                 # validated VITE_* configuration
│   │   └── constants.ts           # timezone, currency, limits, schema versions
│   ├── engine/
│   │   ├── kametiEngine.ts        # pure lifecycle/turn/payment calculations
│   │   └── kametiEngine.types.ts  # engine input/output contracts if needed
│   ├── repository/
│   │   ├── types.ts                # repository and query contracts
│   │   ├── kametiRepository.ts    # Kameti read/write abstraction
│   │   └── userRepository.ts      # user profile abstraction
│   ├── db/
│   │   ├── database.ts             # Dexie database instance
│   │   ├── schema.ts               # tables, indexes, schema version
│   │   └── migrations.ts           # local data migration entry point
│   ├── sync/
│   │   ├── syncEngine.ts           # queue processing and retry policy
│   │   ├── syncQueue.ts            # durable pending operations
│   │   └── sync.types.ts           # operation/status/error contracts
│   ├── firebase/
│   │   ├── firebaseApp.ts          # Firebase initialization
│   │   ├── auth.ts                 # Google provider and auth adapter
│   │   ├── firestore.ts            # Firestore instance and converters
│   │   └── converters.ts            # Firestore <-> domain mapping
│   ├── errors/
│   │   ├── AppError.ts             # stable app-level error types
│   │   └── errorMapping.ts         # Firebase/browser errors to app errors
│   ├── dates/
│   │   └── dateUtils.ts            # Asia/Karachi date and frequency helpers
│   ├── currency/
│   │   └── formatCurrency.ts       # PKR display and input formatting
│   └── validation/
│       ├── domainSchemas.ts        # Zod schemas for domain values
│       └── boundarySchemas.ts      # external read/write/form schemas
├── features/
│   ├── auth/
│   │   ├── authStore.ts            # session state only
│   │   └── auth.types.ts
│   ├── dashboard/
│   ├── kameti-create/
│   ├── kameti-manager-view/
│   ├── kameti-contributor-view/
│   ├── kameti-join/
│   └── kameti-archive/
├── i18n/
│   ├── index.ts                    # i18next initialization
│   ├── resources.ts                # language resource registration
│   └── locales/
│       ├── en.ts
│       ├── ur.ts
│       └── ur-Roman.ts
├── store/
│   └── uiStore.ts                  # ephemeral UI state only
├── types/
│   ├── kameti.ts                   # canonical Kameti/member/period types
│   ├── user.ts                     # canonical user/profile types
│   ├── payment.ts                  # payment state types
│   └── common.ts                   # shared IDs, result types, pagination
└── utils/
    ├── cn.ts                       # class-name helper if required by UI setup
    └── share.ts                    # browser share/copy adapter

firebase/
├── firestore.rules                 # default-deny rules and Phase 0 placeholders
└── firestore.indexes.json          # documented required query indexes

tests/
├── setup.ts
├── unit/
└── fixtures/
```

The exact split may be adjusted while implementing, but every adjustment should preserve the ownership rules and dependency direction above.

## 6. Canonical Domain Contracts

Define these values once in `src/types`. They are shared by forms, repositories, the engine, persistence, and UI.

### 6.1 Lifecycle and frequency

```ts
type KametiStatus = 'processing' | 'active' | 'completed'
type FrequencyUnit = 'days' | 'weeks' | 'months'
type PaymentStatus = 'paid' | 'pending'
type Language = 'en' | 'ur' | 'ur-Roman'
```

Use branded or clearly named string IDs for `KametiId`, `UserId`, `PeriodId`, and `SyncOperationId` if that remains ergonomic with the selected tooling. Do not use ambiguous plain strings in public repository method signatures where a named type improves correctness.

### 6.2 Kameti aggregate

The canonical client model should cover:

- identity and ownership: `id`, `name`, `managerId`;
- contribution schedule: `amount`, `frequencyValue`, `frequencyUnit`;
- membership: `memberCap`, `memberIds`, `memberOrder`;
- lifecycle: `status`, `startedAt`, `firstTurnDate`;
- synchronization: `updatedAt`, `version`, `schemaVersion`;
- audit metadata: `createdAt`.

Use one documented representation for timestamps at each boundary. A practical choice is Firestore timestamps in the Firebase adapter, ISO strings or epoch milliseconds in the local/domain model, and explicit conversion functions between them. Do not allow mixed timestamp representations inside engine functions.

### 6.3 Period and payment records

Represent a period as a separate record containing `periodIndex`, `turnHolderUid`, `startDate`, `endDate`, and a payment map keyed by user ID. Keep periods separate from the main Kameti aggregate so the dashboard document stays small, as required by the TRAD.

### 6.4 Derived engine results

The engine should expose pure functions for:

- calculating the ordered turn timeline;
- determining current, next, previous, own, and passed turns;
- calculating a period from a first date and frequency;
- calculating countdown state using `Asia/Karachi`;
- determining whether the cycle is complete/archived;
- counting paid and remaining members;
- validating whether a processing Kameti can start or force-start;
- producing presentation-neutral status values such as `upcoming`, `current`, `passed`, and `completed`.

The engine must not return translated strings, React elements, Firebase timestamps, or database records. Translation and display formatting belong to the UI/shared layers.

## 7. Phase 0 Work Packages

Implement work packages in this order because later packages depend on earlier contracts.

### P0.1 Repository and toolchain baseline

- Remove the generated Vite demo surface from the application entry path.
- Preserve the existing Vite, React, TypeScript, Tailwind, PWA, and Oxlint setup unless a concrete incompatibility is found.
- Add the planned scripts for typecheck, unit tests, test watch mode, and formatting if a formatter is adopted.
- Add only dependencies needed by the planned architecture: router, Zustand, Dexie, Firebase, Zod, date-fns, i18next/react-i18next, QR generation, and Vitest/Testing Library where required.
- Record the chosen package versions in the lockfile through the package manager rather than hand-editing it.
- Confirm strict TypeScript settings and establish import path aliases only if they reduce repeated relative-path complexity.

**Exit check:** clean install, lint, typecheck, production build, and an initial test command all run from package scripts.

### P0.2 Environment and configuration boundary

- Create `.env.example` with non-secret Firebase and app configuration names from the TRAD.
- Validate `import.meta.env` once in `src/core/config/env.ts`.
- Define constants for `Asia/Karachi`, `PKR`, supported languages, member-cap limits, schema versions, and sync retry limits.
- Fail with a useful startup error for missing required production configuration; keep local development usable with an explicit mock/offline mode if Firebase credentials are not available.
- Do not place actual Firebase credentials or App Check secrets in the repository.

**Exit check:** configuration can be read through one typed module and no feature imports `import.meta.env` directly.

### P0.3 Canonical types, schemas, and errors

- Add domain types for users, Kametis, members, member order, periods, payments, languages, IDs, timestamps, and sync states.
- Add Zod schemas for Firestore documents, form inputs, join payloads, and persisted local records.
- Add an app error taxonomy for permission denied, offline/queued, conflict, validation, configuration, and unknown errors.
- Add one error-mapping function for Firebase/browser errors and one UI-safe error presentation shape.

**Exit check:** representative valid and invalid fixtures parse as expected; no feature defines a second copy of a domain enum.

### P0.4 Pure Kameti engine

- Create the framework-agnostic engine with no imports from React, Firebase, Dexie, Zustand, or browser globals.
- Make date handling deterministic by accepting a clock/reference date as an argument rather than calling `new Date()` throughout the logic.
- Cover frequency calculations for days, weeks, and months, including month-end behavior.
- Define what happens for processing Kametis, force-started Kametis with fewer members than the cap, active Kametis, completed cycles, and a passed personal turn.
- Keep output language-neutral so English, Urdu, and Roman Urdu can share the same calculation results.

**Exit check:** unit tests cover normal turn order, current/next/previous turn, personal countdown, paid counts, force-start roster size, and cycle completion.

### P0.5 Local database and repository interfaces

- Define repository interfaces before feature screens call them.
- Create the Dexie database with tables for users, Kametis, periods, sync operations, and metadata/schema version.
- Add indexes needed for manager and contributor dashboard reads without duplicating Firestore-specific query assumptions in UI code.
- Add local migrations as an explicit versioned entry point.
- Implement repository methods for read, observe/read-through, create, join, start, force-start, mark payment, and renew contracts as typed interfaces; complete network behavior can be filled in later packages.
- Make local writes immediate and expose queued/sync metadata to callers.

**Exit check:** a repository test can write and read a fixture from IndexedDB or a test adapter without importing a React component.

### P0.6 Sync and Firebase adapter boundaries

- Initialize Firebase in one module and expose Auth/Firestore adapters rather than raw SDK calls throughout the app.
- Add Google provider setup, auth state subscription, and sign-out handling behind the auth adapter.
- Add Firestore converters and schema validation at read/write boundaries.
- Define a durable sync operation shape with operation type, aggregate ID, payload, local version, retry count, timestamps, and status.
- Add a sync engine skeleton that reacts to online state, processes queued writes with retry/backoff, maps permission/conflict/offline errors, and does not block local reads.
- Implement `joinKameti` as a transaction boundary in the Firebase adapter. The transaction must re-read the document, check the current committed member count, and append exactly once.
- Leave conflict resolution explicit. Do not silently pretend all writes are safe if the server rejects a version or authorization check.

**Exit check:** adapter and sync tests verify that local writes are available offline, queued operations are durable, and join uses a transaction contract rather than read-then-write behavior.

### P0.7 App shell, routing, and session state

- Replace the starter `App` with `AppShell` and a router.
- Establish route names for sign-in, onboarding, dashboard, create Kameti, join, manager detail, contributor detail, archive, and not-found states.
- Add a route guard for unauthenticated and onboarding-incomplete UX only.
- Keep Zustand limited to session/UI state: auth status, selected language, current route context, dialogs, and transient drafts. Kameti records must come from repositories.
- Add a temporary route placeholder component for each future feature so the architecture can be navigated before feature implementation.
- Add an error boundary and a consistent loading/empty/error state strategy.

**Exit check:** the shell renders at mobile and desktop widths, routes resolve, unknown routes are handled, and unauthenticated UX does not bypass the repository/security model.

### P0.8 Design system and localization foundation

- Translate `DESIGN.md` tokens into centralized CSS variables/Tailwind theme values.
- Establish the warm ivory, deep evergreen, amber, success, danger, and neutral semantic colors from the design document.
- Add Plus Jakarta Sans and Urdu-compatible fallbacks through the chosen asset/font strategy; define increased line-height for Urdu mode.
- Create shared primitives for buttons, inputs, cards, badges, avatars, page containers, bottom navigation, status feedback, and modal/bottom-sheet foundations.
- Enforce 48px minimum interactive targets and visible focus states in shared controls.
- Initialize i18next with English, Urdu, and Roman Urdu resources. All visible product copy should use translation keys, including validation and error messages.
- Add direction and typography handling for Urdu without coupling domain logic to language.

**Exit check:** a shell placeholder can switch languages, renders an Urdu sample without clipping, and uses shared tokens/components rather than screen-local color literals.

### P0.9 PWA and offline shell foundation

- Configure `vite-plugin-pwa` for an installable app shell and stable production caching rules.
- Add the manifest with MISAQ/Amanat name, theme colors, display mode, icons, and mobile viewport metadata.
- Cache only safe static app-shell assets in Phase 0. Data caching remains Dexie-owned; do not duplicate the domain cache in an ad hoc service worker store.
- Add online/offline detection and a reusable offline-ready/sync-status indicator.
- Define update behavior so a new service worker cannot silently strand an old app with incompatible local schema.

**Exit check:** production preview exposes a valid manifest and service worker, the shell loads after the expected cache is populated, and the app clearly distinguishes offline availability from successful sync.

### P0.10 Firebase rules and deployment placeholders

- Create `firebase/firestore.rules` with default deny and explicit placeholders for `users`, `kametis`, and `periods`.
- Encode the documented role model: manager writes Kameti settings/membership/payment records; contributors can read only when they are members; user profiles are owner-readable/writable.
- Add field-level validation scaffolding for manager-only fields, server timestamps, member-cap bounds, and payment status values.
- Create `firebase/firestore.indexes.json` for the manager and contributor dashboard query shapes documented in TRAD.
- Add `firebase.json` only when the Hosting/rules deployment configuration is known; do not claim deployability from a placeholder that has not been tested against a Firebase project.
- Document the local emulator decision. If emulators are not introduced in Phase 0, record the limitation and use adapter/unit tests until they are added.

**Exit check:** rules are syntactically valid through the selected Firebase validation command or emulator, and no rule defaults to broad authenticated-user access.

## 8. Dependency and Ownership Rules

Use these import rules during implementation:

```text
app              -> features, components, store, core
features         -> components, store, core, types, i18n
components       -> types, i18n, utilities
store            -> types only, plus narrowly scoped browser/session adapters
core/repository  -> core/db, core/firebase, core/sync, core/validation, types
core/sync        -> core/firebase, core/db, core/errors, types
core/firebase    -> Firebase SDK, core/validation, types
core/db          -> Dexie, core/validation, types
core/engine      -> types, date utilities only
types/engine     -> no React, Firebase, Dexie, Zustand, or DOM imports
```

Rules that should be enforced in code review:

- no raw Firestore calls from components or feature pages;
- no direct Dexie calls from components or feature pages;
- no duplicate domain enums in feature folders;
- no translated strings in the engine or repository layer;
- no payment/membership authorization implemented only in React;
- no Kameti data stored in Zustand as the source of truth;
- no direct `import.meta.env` usage outside configuration;
- no browser date/time assumptions that bypass `Asia/Karachi` helpers.

## 9. Initial Test Strategy

Phase 0 should establish the test seams, not attempt full product coverage.

### Unit tests

- engine turn and period calculations;
- month-end and timezone-sensitive date cases;
- payment counts and completion status;
- domain and boundary schema validation;
- currency/date formatting;
- repository behavior through an in-memory or IndexedDB test adapter;
- sync operation serialization and retry classification.

### Component tests

- AppShell renders loading, signed-out, signed-in, and error states;
- language switching changes resources and direction/typography state;
- shared controls expose labels, focus states, and 48px touch targets;
- route placeholders render through the router.

### Browser smoke tests

- app starts and shows the shell;
- route navigation resolves;
- offline indicator responds to browser connectivity changes;
- PWA manifest is available in a production preview;
- no starter Vite content remains reachable.

Security Rules tests should be added as soon as the Firebase emulator or a validated rules test harness is available. Until then, keep the rules narrow and mark their executable verification as an explicit Phase 0 gap rather than treating client tests as proof of authorization.

## 10. Phase 0 Validation Gates

Run these gates before starting Phase 1 feature implementation:

1. `npm ci` succeeds from a clean checkout.
2. `npm run lint` succeeds.
3. `npm run typecheck` succeeds.
4. `npm run test` succeeds with the Phase 0 unit/component suite.
5. `npm run build` succeeds and generates the PWA output.
6. The production preview renders the AppShell without starter Vite assets or copy.
7. A fixture can be stored and read through the repository boundary without a network.
8. Engine tests pass with a fixed clock and deterministic timezone expectations.
9. Configuration validation rejects missing required production values.
10. Firestore rules and indexes are syntactically valid and default-deny behavior is documented.
11. The dependency graph does not violate the ownership rules in Section 8.
12. The Phase 0 implementation leaves no feature with a second source of truth for Kameti data.

## 11. Phase 0 Non-Goals

Do not implement these as part of the architecture milestone:

- complete sign-in UI or production Google OAuth flow;
- dashboard cards and live Kameti lists;
- create Kameti forms;
- QR invite generation or scanning UI;
- processing pool drag-and-drop;
- manager payment batch UI;
- contributor learn-more timeline UI;
- archive/renew screens;
- push notifications or reminders;
- payment processing or financial integrations;
- partial payments, bidding, ballots, or member removal after start;
- custom API server, Cloud Functions, Redis, containers, or native mobile packaging;
- broad visual polish of feature screens before shared tokens and components exist.

Feature stubs and contracts are in scope; feature behavior is not.

## 12. Decisions to Confirm During Implementation

These decisions should be resolved once, recorded in the implementation PR, and reused:

- whether local/domain timestamps use ISO strings or epoch milliseconds;
- whether Firebase web SDK persistence is enabled in addition to Dexie, and how duplicate caches are avoided;
- the exact Firestore document versioning and conflict policy for queued manager writes;
- whether the application supports a mock/offline development mode without Firebase credentials;
- the selected font-loading approach for Plus Jakarta Sans and Urdu fallbacks;
- the exact month-end rule for adding monthly frequencies;
- whether a Firebase emulator is included in Phase 0 or immediately after it;
- whether Tailwind utility classes alone are sufficient or a small CSS token layer is also maintained.

Do not leave these implicit because they affect data compatibility, date correctness, security testing, or later migration cost.

## 13. Suggested Implementation Sequence

1. Add package scripts and required dependencies.
2. Create configuration, constants, IDs, domain types, schemas, and errors.
3. Replace the starter entry point with the app shell, provider order, router, and placeholders.
4. Implement and test the pure Kameti engine.
5. Create Dexie schema, migrations, repository contracts, and test adapter.
6. Add Firebase initialization, converters, Auth adapter, Firestore adapter contracts, and rules/index files.
7. Add sync queue contracts and the minimal retry/online-state skeleton.
8. Add localization, design tokens, reusable UI primitives, and shared feedback states.
9. Configure PWA manifest/service worker and offline status presentation.
10. Add unit, component, and browser smoke tests, then run every validation gate.
11. Review the dependency graph and remove any accidental feature/core leakage.

## 14. Handoff to Phase 1

Phase 1 can begin when the shell is navigable and the following contracts are stable:

- `AuthAdapter` and session state;
- `KametiRepository` and local database schema;
- `kametiEngine` inputs/outputs;
- `AppError` categories and UI error mapping;
- translation key conventions and language switching;
- design tokens and shared controls;
- PWA/offline status behavior;
- Firestore role and field-level rules shape.

The first Phase 1 slice should then be authentication and onboarding, followed by the dashboard. Those features should consume the Phase 0 contracts rather than creating parallel versions of them.

## 15. Performance Optimization Plan

Performance is a cross-cutting Phase 0 concern. The goal is not merely a small JavaScript bundle: MISAQ must feel immediate on a mid-range Android device, remain useful on poor connectivity, minimize Firestore usage, and avoid battery-draining background work.

### 15.1 Performance architecture decisions

- **Dexie is the application-data read source of truth.** Components read through repositories backed by Dexie and react to local changes. Firestore is the synchronization boundary, not the component data source.
- **Firebase Auth persistence may remain enabled, but Firestore application persistence must not become a second independent UI cache.** Choose and document one owner for application reads and queued writes.
- **Local-first mutation flow:** write locally, update the UI optimistically, enqueue a durable operation, synchronize later, and reconcile an explicit rejection or conflict.
- **One active remote listener:** subscribe only to the currently open Kameti/detail or processing pool. Dashboard Kametis are refreshed on open, foreground return, controlled intervals, or explicit user action rather than one listener per card.
- **Current data first:** load the main Kameti document and current period first. Historical periods and full timelines are loaded only for **Learn More** or archive views.
- **No false cheap-read assumption:** reading only an `updatedAt` field still represents a Firestore document read. Use local freshness, controlled refresh, and measured query behavior instead of claiming field projection reduces billed reads.
- **One shared clock:** countdowns and date-derived status use a shared timer per visible screen, pause while hidden, and update at the minimum useful frequency.

### 15.2 P0.1 Toolchain and bundle setup additions

Add the following to the repository/toolchain work package:

- route-level lazy loading for auth, dashboard, create, manager detail, contributor detail, join, archive, and QR tools;
- modular imports for Firebase, date utilities, icons, and other libraries;
- a bundle inspection command or CI report for initial JavaScript, CSS, route chunks, fonts, and large dependencies;
- production build warnings or budgets for unexpectedly large chunks and duplicate dependencies;
- a performance test script that can run browser smoke tests against a production preview;
- only load dependencies required by the current route. QR scanning/generation, drag-and-drop, and archive history must not be part of the initial shell unless the route requires them.

Do not add `React.memo`, `useMemo`, or `useCallback` globally. Add memoization only after a trace demonstrates an expensive repeated render and the chosen boundary benefits from it.

### 15.3 P0.2 Configuration and runtime budgets

Centralize these values in `src/core/config/constants.ts` or a dedicated performance configuration module:

- fixed timezone: `Asia/Karachi`;
- refresh-on-foreground and stale-data thresholds;
- sync retry/backoff limits;
- maximum current-period/member query sizes;
- initial and route chunk budgets after a baseline build;
- Web Vitals targets;
- local dashboard and interaction timing targets;
- maximum background refresh frequency.

The exact values must be recorded after measuring the first production build. Initial targets are:

- First Contentful Paint below 1.8 seconds on a representative mid-range mobile profile;
- Largest Contentful Paint below 2.5 seconds on constrained 4G;
- Interaction to Next Paint below 200ms for normal interactions;
- Cumulative Layout Shift below 0.1;
- cached local dashboard read target below 100ms after Dexie initialization;
- visible local payment-toggle feedback without waiting for network;
- initial screen visually usable within 2 seconds and substantially loaded within 3 seconds on the PRD's representative cold-visit profile.

These are measurement targets, not permission to degrade accessibility, validation, security, or data integrity to pass a number.

### 15.4 P0.3 Domain and engine efficiency

- Keep `kametiEngine` pure, deterministic, and language-neutral.
- Pass a reference clock into engine functions instead of repeatedly calling `new Date()`.
- Centralize date arithmetic, including the explicitly documented month-end rule, so screens do not independently recalculate periods.
- Return compact derived results that can be reused by dashboard cards and detail sections: current/next/previous turn, own turn, passed state, countdown state, completion state, and payment counts.
- Do not calculate the same timeline or payment totals separately in every rendered component.
- Use stable IDs and normalized records so a single payment change does not force rewriting a complete dashboard object.

### 15.5 P0.5 Dexie schema and repository performance

Design the local schema around real access patterns:

- users/profile records;
- Kameti records indexed by ID, manager ID, status, updated time, and member membership;
- periods indexed by Kameti ID and period index;
- sync operations indexed by status, next retry time, aggregate ID, and operation ID;
- metadata for schema version and migration state.

Use a multi-entry membership index if supported by the selected Dexie schema. Avoid speculative indexes because each index increases storage and write work.

Repository requirements:

- dashboard reads return only the user's relevant active/processing summaries;
- archive records are loaded only when Archive is opened;
- detail reads load one Kameti and its current period first;
- historical periods are explicitly requested;
- local queries are scoped to the active route rather than one global subscription that recomputes the entire app;
- repository tests cover fast local reads, migration compatibility, and preservation of pending operations.

For member names, resolve the data model before feature implementation. Options are a compact member display snapshot in the Kameti record, a member subcollection, or locally cached user profiles. Select the option that minimizes repeated per-member reads while keeping name changes correct; document the update policy and measure it against the expected 5–20 member group size.

### 15.6 P0.6 Firebase, Firestore, and Spark-tier efficiency

- Use separate manager and contributor queries with `limit()` and ordering appropriate to the dashboard.
- Do not fetch periods, complete payment history, QR binaries, or unrelated Kametis on dashboard startup.
- Subscribe only to the open Kameti and current period; unsubscribe immediately on route exit.
- Use a transaction for `joinKameti` that reads only the Kameti document, checks duplicate membership and the committed cap, and appends exactly once.
- Use field-level payment updates rather than rewriting the complete period when possible.
- Keep periods in a subcollection and keep the main Kameti document compact.
- Avoid rule designs that require unnecessary cross-document reads.
- Measure reads per dashboard open, reads per detail open, listener document changes, writes per payment period, transaction retries, and failed writes.

Do not assume that a query returning only `updatedAt` is cheaper than reading the document. Prefer Dexie freshness and controlled background refresh. Add a small summary document only if measured usage proves the existing strategy cannot meet Spark limits.

### 15.7 P0.6 Sync queue and mutation efficiency

Each queued mutation must be durable, idempotent, and serializable with:

- operation ID;
- operation type;
- Kameti/period/target IDs;
- payload;
- local version or base version;
- created time and next retry time;
- retry count and status.

Implement these behaviors:

- coalesce repeated payment changes for the same target to the latest unsynchronized value;
- deduplicate repeated join attempts by user and Kameti;
- merge repeated refresh requests;
- use exponential backoff with a maximum delay;
- retry temporary network/unavailable errors only;
- surface permission, validation, full-Kameti, authentication, and conflict errors without blind retries;
- process on app start, online transition, foreground return, and meaningful user actions rather than continuous polling;
- expose saved-locally, syncing, synced, waiting-for-connection, and failed states;
- coordinate multiple tabs with `BroadcastChannel` or an equivalent leader/coordination strategy so tabs do not duplicate sync work.

### 15.8 P0.7 React, routing, and rendering efficiency

- Keep the initial AppShell chunk small: shell, router, minimal auth bootstrap, language bootstrap, and core styles only.
- Lazy-load route features and optional QR, archive, drag/reorder, and history functionality.
- Keep Kameti and period data out of Zustand. Use narrow selectors for UI/session state.
- Use scoped repository/Dexie subscriptions instead of global data subscriptions.
- Avoid list virtualization for normal 5–20 member Kametis; introduce it only after real usage requires it.
- Reserve stable dimensions for cards, avatars, buttons, navigation, status labels, and countdown values to prevent layout shifts.
- Pause hidden-tab work and avoid synchronous parsing of all historical data during startup.
- Profile before introducing memoization or custom Web Workers.

### 15.9 P0.8 CSS, typography, and asset efficiency

- Define design tokens centrally and avoid repeated arbitrary color/style literals.
- Load only required Plus Jakarta Sans weights and use `font-display: swap`.
- Provide Urdu-compatible fallback fonts with sufficient line height and test text expansion at mobile widths.
- Give images explicit dimensions and use appropriately sized SVG/WebP/AVIF assets where applicable.
- Avoid unused starter images and oversized source files.
- Prefer transform/opacity animations; avoid layout-triggering animation, continuous decorative loops, excessive blur, expensive backdrop filters, and unnecessarily layered shadows.
- Implement `prefers-reduced-motion` handling.
- Test English, Roman Urdu, and Urdu for overflow, clipping, overlap, and cumulative layout shift.

### 15.10 P0.9 PWA and service-worker efficiency

- Precache only the app shell, essential icons, core CSS/JS, and the first-screen font requirements.
- Cache hashed static assets aggressively; do not precache historical data, QR images, or user-generated content.
- Keep application data in Dexie rather than an ad hoc service-worker data cache.
- Define an update flow that preserves Dexie data and sync operations, runs database migrations before new code uses records, and does not silently strand an old schema.
- Verify cold install, warm reopen, offline reopen, online reconnect, and service-worker update behavior in a production preview.

### 15.11 P0.10 Auth, error, and security efficiency

- Render the shell while Firebase Auth resolves instead of blocking the whole application on remote initialization.
- Load the local profile and cached Kametis as early as possible after auth resolution.
- Keep route guards as UX behavior only; Firestore Rules remain authoritative.
- Perform client Zod validation for immediate feedback, repository validation for local integrity, and Firestore Rules validation for server enforcement.
- Treat cached/optimistic state as untrusted and reconcile rejected writes explicitly.
- Keep security rules narrow and avoid unnecessary rule `get()` calls that add latency.

### 15.12 Performance-specific tests and instrumentation

Add to the Phase 0 test strategy:

- Playwright mobile viewport and throttled-CPU/network tests;
- offline dashboard and reconnect synchronization tests;
- production-preview PWA manifest/service-worker tests;
- warm versus cold startup tests;
- repeated payment-toggle/coalescing tests;
- foreground/background timer tests;
- multi-tab queue coordination tests;
- database migration and service-worker update tests;
- Urdu overflow and layout stability tests;
- transaction retry and duplicate-join tests;
- long-task, render, IndexedDB, and network trace review for core flows.

Instrument without collecting sensitive financial data:

- local read duration;
- time to cached content;
- sync queue age and size;
- sync success/failure classification;
- transaction retries;
- Firestore reads/writes/listener changes;
- route load duration;
- Web Vitals;
- uncaught errors and migration failures.

Use Firebase Performance or comparable production telemetry only when its cost and privacy implications remain compatible with the V1 deployment constraints. Local development and CI traces are the baseline.

### 15.13 Performance anti-goals

Do not add the following without evidence from profiling or usage data:

- memoization everywhere;
- virtualization for normal Kameti lists;
- custom backend, Redis, GraphQL, server-side rendering, or Cloud Functions solely for speed;
- multiple competing application-data caches;
- aggressive denormalization that increases write complexity;
- encrypted local storage in V1;
- custom Web Workers for small calculations;
- continuous polling or a listener for every dashboard item.

### 15.14 Performance exit gate

Before Phase 1 begins, the following must be demonstrated in addition to Section 10:

1. The shell renders without waiting for Firestore.
2. Cached dashboard content appears immediately after local database initialization.
3. A payment status change updates locally without network latency and produces one coalesced sync intent.
4. Dashboard startup does not fetch historical periods or maintain one listener per Kameti.
5. The open Kameti listener is removed when its route unmounts.
6. The current period loads before historical timeline data.
7. Route chunks and optional QR/archive functionality are not in the initial chunk unless required by the entry route.
8. One shared countdown clock serves the visible screen and pauses when hidden.
9. English, Roman Urdu, and Urdu core screens pass overflow and layout-shift checks.
10. Offline reopen, reconnect, service-worker update, and Dexie migration preserve local records and queued writes.
11. Firestore reads/writes/listener changes and local timing metrics are observable in tests or development instrumentation.
12. The measured Web Vitals and bundle/query baselines are recorded for regression comparison.
