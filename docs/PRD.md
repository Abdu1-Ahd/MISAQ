# MISAQ e Amanat — Product Requirements Document (V1)

**Product:** MISAQ e Amanat — Kameti Management PWA
**Version:** 1.0 (MVP)
**Status:** Draft for build

---

## 1. Purpose

MISAQ digitizes the Kameti (rotating savings committee), a system millions of Pakistani households run manually through paper registers and WhatsApp messages. It gives every member of a Kameti a single, real-time, offline-capable source of truth for who's turn it is, who has paid, and when their own turn arrives — removing the organizer's need to repeatedly answer the same questions.

---

## 2. Problem Statement

- Kameti organizers track members, turns, and payments manually — in notebooks or WhatsApp threads.
- Members repeatedly ask the organizer: *"Meri bari kab hai?" / "Kis ki bari hai?" / "Maine payment ki hai?" / "Kitne logon ne payment ki?"*
- There is no shared, always-current record both sides can check without asking.
- Existing finance/banking apps don't fit — Kameti is a trust-based social system, not a banking product, and users don't want a banking-style interface for it.
- No free, offline-friendly, Pakistan-specific tool exists for this today.

---

## 3. Target Users

| Role | Who they are | Core need |
|---|---|---|
| **Manager** | The person who organizes and runs a Kameti (often runs several) | Fast setup, fast payment recording, zero ambiguity on turn order |
| **Contributor** | A member of one or more Kametis, joined via invite | See their turn, their payment status, and the group's status — without asking anyone |

One user can be a Manager on some Kametis and a Contributor on others simultaneously.

---

## 4. Core Features (V1 only)

### 4.1 Authentication & Onboarding
- Google Sign-In only.
- First login → name confirmation screen → dashboard.

### 4.2 Dashboard (Home)
- Two sections: **Kametis I Manage** / **Kametis I Contribute To**.
- Contributor list sorted by nearest upcoming turn; passed turns sink to the bottom, labeled *"Your turn has passed."*
- Language switch: English / Urdu / Roman Urdu.

### 4.3 Create Kameti (Manager)
- Set: name, contribution amount, frequency (days/weeks/months), member cap (= number of turns), start-date-to-be-set-later.
- On creation, Kameti enters **Processing** status and generates a QR code + invite link.

### 4.4 Join Flow (Contributor)
- Scan QR or open link → Google Sign-In → joins as Contributor, added to the Kameti's Processing pool.
- Join is capped at the Manager's set member count and is enforced atomically (a Firestore transaction checks and reserves a slot in one operation, so two people can't take the same last slot).

### 4.5 Processing Stage (Manager only)
- Manager sees who has joined so far, live.
- Manager can drag/reorder joined members' cards to set turn order.
- Manager can **Start** once the cap is filled, **or Force Start** at any time with however many members have joined so far — the remaining unfilled slots are simply dropped from that cycle.
- Starting requires the Manager to set the first turn's date.

### 4.6 Manager Kameti View
- Full member list, turn order, editable contribution amount/frequency (pre-start only), current period payment status.
- One-tap **Mark Paid/Pending** per member for the current period.
- Copy/share invite link and QR (available until Start).

### 4.7 Contributor Kameti View
- Read-only.
- Kameti name, amount, frequency, current turn holder, next turn, previous turn, own turn date + countdown (turns green with a confirmation message once passed).
- Current period payment status: Paid / Pending.
- **Learn More**: full turn timeline, full member list, who's paid / who hasn't, paid-vs-remaining count.

### 4.8 Cycle Completion & Archive
- Once every member has received their turn, the Kameti auto-moves to an **Archived** section on the dashboard.
- From Archive, Manager can **Renew** with one tap — same members, amount, and frequency, prompting only for a new start date and all these fields are also editable

### 4.9 Offline-First
- Local database (Dexie/IndexedDB) is the read source of truth; UI never blocks on network.
- Writes queue locally and sync to Firestore when back online.
- App is installable, works offline as a PWA (app-shell + cached data).

### 4.10 Performance and Responsiveness
- The app must render the application shell and available local data without waiting for Firestore or any other network request.
- Dashboard and Kameti detail views must show cached data immediately when available, with a visible stale, offline, syncing, or synced state where appropriate.
- User actions that are safe to apply locally, including payment status changes, must provide immediate local feedback and synchronize in the background.
- Opening a Kameti must load the current status first; historical periods and the full timeline load only when the user requests **Learn More**.
- The dashboard must not maintain live listeners for every Kameti. Live updates are required only for the currently open Kameti or processing pool.
- The app must remain usable on mid-range Android devices and constrained 4G connections, including while offline after the app shell and relevant data have been cached.
- Route-specific and optional functionality must not block the initial shell: QR tools, archive history, drag/reorder tools, and non-selected language resources may load when needed.
- Payment recording for a normal 5–15 member Kameti must remain fast enough for the Manager to complete a full period in under 60 seconds.
- Animations must be brief, purposeful, and disabled or reduced when the device requests reduced motion.

### 4.11 Data and Resource Efficiency
- The app must minimize Firestore reads and writes to remain within Firebase Spark limits for a Manager running multiple active Kametis.
- The app must not download period history, full payment history, or unrelated Kameti data during dashboard startup.
- Repeated unsynchronized changes to the same record may be coalesced so only the latest valid state is sent when connectivity returns.
- Cached data must remain available across normal app restarts and service-worker updates; an update must not delete queued writes or local Kameti data.
- The app must avoid duplicate application-data caches that can diverge. Dexie/IndexedDB is the application read source of truth; any Firebase SDK persistence decision must not create a competing UI data source.

### 4.12 Accessibility and Device Efficiency
- Primary controls must be usable with a minimum 48px touch target, keyboard access where applicable, visible focus states, and readable contrast in bright outdoor conditions.
- English, Urdu, and Roman Urdu must not cause clipped, overlapping, or unstable layouts; Urdu typography must allow for its larger line-height needs.
- The app must avoid unnecessary background polling, per-item timers, continuous decorative animation, and other work that wastes battery or blocks the main thread.

---

## 5. App Flow

**Manager path:**
Sign in → name onboarding → dashboard → Create Kameti → set name/amount/frequency/cap → share QR/link → watch Processing pool fill (or Force Start early) → arrange turn order → Start + set first turn date → mark payments each period → cycle completes → Kameti archives → optionally Renew.

**Contributor path:**
Receive QR/link → Sign in → name onboarding → auto-joins Kameti (Processing) → waits for Manager to Start → sees dashboard card with countdown to their turn → checks Paid/Pending each period → views full status via Learn More → turn passes → card shows "passed" message.

---

## 6. Success Criteria

- A Contributor can answer *"when is my turn"* and *"has everyone paid this period"* without messaging the Manager — measured by drop in Manager-reported "status questions."
- Manager can record a full period's payments (5–15 members) in under 60 seconds.
- App is fully usable with no network connection for reading Kameti status.
- Zero duplicate-join incidents on the last available slot under concurrent access.
- App stays within Firebase Spark (free tier) limits for a Manager running multiple active Kametis.
- Cached dashboard content is usable without a network connection and appears without an indefinite loading state.
- A payment toggle gives visible local feedback immediately and does not wait for a network response.
- A normal Kameti detail view loads current status without loading its complete historical timeline.
- On a representative mid-range mobile device and constrained 4G connection, the initial screen is visually usable within 2 seconds and the main content is substantially loaded within 3 seconds after a cold visit; exact measured budgets are tracked in the implementation plan.
- Core interaction latency remains below 200ms for local navigation, payment toggles, language switching, and opening cached Kameti data under normal conditions.
- Cumulative Layout Shift remains below 0.1 on core screens, including English and Urdu layouts.
- A production build provides an installable PWA shell that can reopen offline without losing local data or pending writes.

---

## 7. Business Requirements

- **Cost:** Must run entirely on free-tier infrastructure (Firebase Spark) — no mandatory paid services for V1.
- **Currency/Locale:** PKR only, Pakistan-only initially. Timezone fixed to Asia/Karachi.
- **Platform:** Mobile-only responsive PWA, installable on Android and iOS home screens. No native app in V1.
- **Languages:** English, Urdu, Roman Urdu supported at launch.
- **No payment processing:** App only records paid/pending status — no money moves through the app.
- **Data integrity:** Manager is the sole writer of payment and membership records per Kameti; Contributors are strictly read-only. This single-writer model is what keeps offline sync simple and safe.

---

## 8. Out of Scope for V1 (explicitly excluded)

- Partial payments (binary Paid/Pending only).
- Removing a member after a Kameti has Started (a known V1 limitation — Manager handles this manually outside the app; may revisit post-V1).
- Push notifications / payment reminders.
- Boli/bidding-style or ballot-based Kametis.
- PDF/Excel export, advanced reports.
- Native Android/iOS packaging.
- Any real payment gateway integration.

---

## 9. Performance and Quality Boundaries

The performance requirements above are product requirements, not permission to add unnecessary infrastructure. V1 should remain a client-heavy PWA using Firebase-managed services, Dexie/IndexedDB, and the single-writer Kameti model.

The product does not require:

- a custom backend, Redis, containers, server-side rendering, GraphQL, or native mobile packaging;
- background push notifications or continuous real-time listeners for every dashboard item;
- list virtualization for normal 5–20 member Kametis;
- complex caching layers outside Dexie and the app-shell service worker;
- encryption of the local cache beyond browser and device security in V1.

Performance work must preserve the security boundary: Firestore Rules remain authoritative for membership, manager writes, payment records, member-cap enforcement, and server timestamps. Client-side caching and optimistic UI must never be treated as authorization.

The implementation plan defines the measurement method, budgets, data-query strategy, sync behavior, bundle strategy, and regression tests for these requirements.
