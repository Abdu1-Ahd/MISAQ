---
name: Amanat Misaq
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#404847'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#707977'
  outline-variant: '#bfc8c6'
  surface-tint: '#326762'
  primary: '#003330'
  on-primary: '#ffffff'
  primary-container: '#114b47'
  on-primary-container: '#85bab4'
  inverse-primary: '#9bd1cb'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#003512'
  on-tertiary: '#ffffff'
  tertiary-container: '#004e1e'
  on-tertiary-container: '#48c768'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b6ede7'
  primary-fixed-dim: '#9bd1cb'
  on-primary-fixed: '#00201e'
  on-primary-fixed-variant: '#164f4b'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
  surface-ivory: '#F9FAF7'
  surface-card: '#FFFFFF'
  surface-tint-mint: '#E8F5F2'
  surface-tint-mint-subtle: '#F2F9F7'
  border-subtle: '#E2E8F0'
  border-mint: '#C4E5DF'
  gold-light: '#FEF3C7'
  gold-dark: '#92400E'
  success-light: '#DCFCE7'
  success-dark: '#166534'
  danger-alert: '#DC2626'
  danger-light: '#FEE2E2'
  danger-dark: '#991B1B'
  neutral-muted: '#64748B'
  neutral-subtle: '#94A3B8'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  currency-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit-1: 0.25rem
  unit-2: 0.5rem
  unit-3: 0.75rem
  unit-4: 1rem
  unit-5: 1.25rem
  unit-6: 1.5rem
  unit-8: 2rem
  unit-10: 2.5rem
  unit-12: 3rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  touch-target-min: 3rem
---

## Brand & Style

This design system is crafted for a communal rotating savings and credit committee (Kameti) platform rooted in Pakistan. The brand ethos centers around *Amanat* (trustworthiness, custodian responsibility) and *Misaq* (covenant, mutual pledge). Unlike transactional commercial fintech apps that evoke anxiety, scrutiny, and cold institutional distance, this design embraces an organic, community-first ethos: warmth, mutual dignity, effortless transparency, and absolute clarity.

The target audience spans diverse demographics across Pakistan—from family elders managing multi-generational household pools to neighborhood organizers and young urban professionals pooling savings. Many users will interact with the Progressive Web App outdoors under direct sunlight on varied Android devices, requiring bold contrast, legible tactile touchpoints, and clear bilingual hierarchy (English, Roman Urdu, and Nastaliq Urdu).

The aesthetic style blends **Tactile Modernism** with **Earthy Warm Minimalism**:
- Warm paper ivory canvases instead of sterile blue-gray enterprise backdrops.
- Deep pine teal reflecting heritage, security, and organic prosperity.
- Physical, tangible card metaphors that mimic traditional cloth savings pouches and ledger paper, reinforced by soft surface nesting rather than harsh dropped shadows.
- Humanized state cues: turns that have passed feel gently completed and celebrated, active turns feel prominent and warm, while pending statuses are gentle reminders rather than punitive debt warnings.

## Colors

The palette is anchored by `#114B47` (Deep Trust Evergreen), evoking the sanctuary of communal savings and personal honor. Rather than cold stark whites, the foundational background relies on `#F9FAF7` (Warm Paper Ivory), bringing a tactile parchment warmth that softens long sessions and honors offline paper registry traditions.

### Semantic State Architecture (The Kameti Lifecycle)
- **Primary / Identity (`#114B47` & `#E8F5F2`)**: Utilized for structural navigation, brand wordmarks, active Kameti headers, and primary affirmative actions. Badges layered in `#E8F5F2` signal active turn status with clear contrast.
- **Urgency & Rupee Value (`#D97706` & `#FEF3C7`)**: Warm Amber/Gold accents highlight upcoming payout turns, aggregate Rupee pool sums, and pending payment reminders. Gold carries auspicious communal prosperity without evoking penalty.
- **Completed & Verified (`#16A34A` & `#DCFCE7`)**: Signifies confirmed payments and completed cycles. It provides celebratory feedback when a member's payout has landed.
- **Attention & Overdue (`#DC2626` & `#FEE2E2`)**: Reserved strictly for critical warnings (e.g., unpaid cycles requiring organizer intervention, network sync failures).
- **Charcoal Text Tier (`#1E293B` & `#64748B`)**: Ensures maximum legibility across lower-tier mobile displays and outdoor sunlight conditions.

## Typography

The type system pairs modern, accessible geometry with open counters and balanced numerals, essential for quick financial comprehension. **Plus Jakarta Sans** is selected across all tiers for its welcoming geometric structure, sturdy legibility at small sizes on low-resolution mobile devices, and wide aperture that complements Urdu script typography.

### Urdu Script & Bilingual Compatibility
For screens rendered in Urdu (`امانت` / `میثاق`), system Nastaliq fallbacks (`"Noto Nastaliq Urdu"`, `"Jameel Noori Nastaleeq"`, `"Urdu Typesetting"`) are paired with increased vertical line-height multiplier (+35% to 45%) to prevent diacritic glyph clipping.

### Financial Numeral Styling
Monospaced numerals (`font-feature-settings: 'tnum' 1`) are enforced on Rupee balances, member counts, and countdown timers to prevent UI jitter during active scrolling and real-time counter updates.

## Layout & Spacing

This design system is tailored for a mobile-first Progressive Web App (PWA) operating under the **Single-Column Fluid Shell** model on mobile devices (max viewport width constraint: `480px` centered on larger displays/desktops).

### Principles
- **Touch Targets**: All high-frequency interactive elements (such as Manager status toggles, invite sharing, tab switches) maintain a strict minimum bounding box of `48px` (`3rem`) to ensure effortless one-handed thumb navigation.
- **Rhythm**: Spacing follows a consistent 4px / 8px scale. Dense grouping (`8px` to `12px`) is used inside turn cards to keep associated member data cohesive, while section blocks are spaced by `20px` to `24px` (`unit-5` to `unit-6`).
- **Screen Margins**: Default horizontal gutter is `16px` on mobile screens, ensuring maximum content width while protecting against curved display palm rejections.

## Elevation & Depth

This system intentionally departs from heavy, dramatic drop shadows that create visual clutter and mimic aggressive corporate dashboards. Instead, it employs **Tonal Layering & Soft Ambient Occlusion**:

1. **Base Surface (Level 0)**: `#F9FAF7` Warm Paper Ivory canvas. Grounded, matte, non-reflective.
2. **Card Layer (Level 1)**: Pure white `#FFFFFF` cards bordered by a crisp, low-opacity hairline rule (`1px solid #E2E8F0`). Under low-contrast outdoor conditions, this boundary maintains separation without visual noise.
3. **Floating Overlays & Sheets (Level 2)**: For bottom sheets (e.g., Turn re-ordering, Quick Payment Confirmation), an ultra-diffused, ambient shadow tinted with pine teal is utilized: `0 12px 32px -4px rgba(17, 75, 71, 0.12), 0 4px 12px -2px rgba(17, 75, 71, 0.06)`.
4. **Hero Payout Turn Cards**: Emphasized using a nested tinted border (`1.5px solid #C4E5DF`) and surface fill (`#F2F9F7`), creating organic hierarchy through tone rather than artificial elevation.

## Shapes

The design system adopts a **Rounded (Level 2)** philosophy, reflecting warmth, sociability, and trust:
- **Base Components & Inputs**: `8px` (`0.5rem`) corner radius for dense table cells and list tags.
- **Cards & Pockets**: `16px` (`1rem`) border radius on dashboard containers and turn ledger cards, giving them an approachable, tactile handheld feel.
- **Modal Sheets & PWA Nav Bars**: `24px` (`1.5rem`) top corner curves for smooth slide-up ergonomics.
- **Interactive Badges & Status Chips**: Fully rounded pill shapes (`9999px`) to distinguish categorical metadata and payment indicators from clickable container cards.

## Components

### 1. Buttons & Actions
- **Primary CTA**: Deep Pine Teal (`#114B47`) background with pure white text, bold weight (`600`), `12px` border radius, minimum height `48px`. Provides distinct tactile feedback on press (`transform: scale(0.98)`).
- **Secondary / Actionable**: Mint tint surface (`#E8F5F2`) with `#114B47` text and subtle outline (`#C4E5DF`).
- **Quick-Pay Toggle (Manager 60-Second Batch Mode)**: High-speed segmented toggle. One tap switches from `Pending` (`#FEF3C7` / text `#92400E`) to `Paid` (`#DCFCE7` / text `#166534`) with instant haptic and micro-animation state transitions.

### 2. Status Chips & Badges
- **Paid / Completed Turn**: Pill badge, `#DCFCE7` background, `#166534` bold label with a subtle checkmark icon.
- **Pending / Cycle In Progress**: Pill badge, `#FEF3C7` background, `#92400E` bold label with an amber circular dot.
- **Turn Passed (Contributor)**: Low-contrast, gentle neutral chip (`#F1F5F9` background, `#64748B` text) with the explicit copy: *"Your turn has passed"*.

### 3. Member Turn Ledger Cards
- **My Turn Card (Upcoming)**: Featured card highlighted by a gentle `#E8F5F2` border, displaying large bold text for the payout month/date, a prominent Rupee badge (`Rs. XX,XXX`), and an easy countdown tag (`In 14 days`).
- **Standard Member Row**: Clean white card, `12px` padding, displaying member avatar circle (initials on mint/slate), turn number `#0X`, full name, and binary payment state badge.
- **Reordering Mode (Processing State)**: Grab handles (`#94A3B8`) with tactile drag boundaries and clear slot indicators.

### 4. Input Fields & Selectors
- **Form Controls**: Crisp white inputs with `#E2E8F0` borders, transitioning to a `2px` focus ring in `#114B47`.
- **Currency Entry**: Built-in fixed `"Rs."` prefix in muted slate (`#64748B`) with oversized high-contrast numerals (`currency-display`).

### 5. Bilingual Header Bar
- Minimalist top bar anchoring the `امانت MISAQ` wordmark alongside an instant language toggle button (`UR | EN`) and offline status indicator pill (`Offline ready` in subtle mint green when cached).