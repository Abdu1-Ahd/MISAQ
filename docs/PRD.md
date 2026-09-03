# MISAQ — Product Requirements Document (V1)

**Product:** MISAQ — Kameti Management PWA
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
- From Archive, Manager can **Renew** with one tap — same members, amount, and frequency, prompting only for a new start date.

### 4.9 Offline-First
- Local database (Dexie/IndexedDB) is the read source of truth; UI never blocks on network.
- Writes queue locally and sync to Firestore when back online.
- App is installable, works offline as a PWA (app-shell + cached data).

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
