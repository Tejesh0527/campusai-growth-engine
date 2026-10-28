---
name: CampusAI Growth Engine
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#004d70'
  on-tertiary: '#ffffff'
  tertiary-container: '#006693'
  on-tertiary-container: '#b8e0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  metric-num-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  metric-num-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The visual identity embodies an institutional, high-velocity EdTech growth platform. Designed for operators, growth interns, and academic leaders, the interface combines the rigor of enterprise SaaS analytics with the engaging energy of learning technology.

The aesthetic philosophy centers on modern, dependable clarity:
- **Tone:** Methodical, progressive, empowering, and data-backed.
- **Aesthetic Movement:** Corporate Modern paired with soft-structural elevation. Crisp neutral surfaces minimize cognitive friction, while vibrant indigo and electric violet-blue accents drive focus toward key metrics and primary levers.
- **Visual Discipline:** Balanced typography, calm slate hierarchies, and controlled indigo-tinted depth layers create a sense of operational polish and institutional reliability.

## Colors

The palette establishes a hierarchy between data visualization, system feedback, and high-priority growth levers.

- **Primary (`#4F46E5` / `#4338CA` deep indigo):** Anchor color for primary growth calls-to-action, key state triggers, and active navigation nodes.
- **Secondary (`#6366F1` electric violet-blue):** Interactive hovers, supporting progress indicators, and active metric accents.
- **Tertiary (`#0EA5E9` cyan-blue):** Data analytics accents, tertiary telemetry, and live activity streams.
- **Neutral Palette:**
  - Canvas & Base Surfaces: `#FFFFFF` (pure card surface), `#F8FAFC` (dashboard base canvas), `#F1F5F9` (muted wells and track backgrounds).
  - Borders: `#E2E8F0` with structural alpha rings (`rgba(226, 232, 240, 0.8)`).
  - Typography: `#0F172A` (primary headlines/metrics), `#334155` (body text and table cells), `#64748B` (captions, labels, and muted metadata).
- **Functional Semantics:**
  - Success: `#10B981` (emerald) for milestone completion and positive conversion deltas.
  - Warning/Alert: `#F59E0B` (amber) for cohort attrition alerts and quota warnings.
  - Error: `#EF4444` (rose red) for submission drops and systemic blockers.

## Typography

Typography balances geometric structure and functional readability:
- **Headlines (`Plus Jakarta Sans`):** Soft curves and clear structural geometry deliver an authoritative yet welcoming tone suitable for growth benchmarks, course program headers, and milestone modules.
- **Body & Data (`Inter`):** Renders micro-copy, data matrices, and operational dashboards with neutrality.
- **Tabular Figures:** All analytical numbers, metric tallies, conversion rates, and ledger items must enforce `font-feature-settings: "tnum" on, "cv02" on, "cv03" on, "cv04" on` to guarantee absolute vertical column alignment across comparative lists.
- **Labeling:** Micro badges and category overlines utilize `label-sm` with slight uppercase tracking to maintain legibility at 11px.

## Layout & Spacing

The layout is built on an adaptive 8pt spatial grid with an architectural 12-column layout on desktop:
- **Desktop (1280px+):** 12-column layout, 24px (`1.5rem`) gutters, max-width container capped at 1440px with responsive margins (`margin`: `2rem`).
- **Tablet (768px – 1024px):** 8-column layout, 16px gutters, fluid side padding (`1.5rem`).
- **Mobile (< 768px):** 4-column layout, 16px gutters, 16px outer margins (`margin-mobile`: `1rem`). Secondary analytics stack vertically.

Content layouts favor strict spatial intervals:
- Data cards and analytics panels utilize internal padding derived from `space-lg` (24px) for desktop, downscaling to `space-md` (16px) on mobile.
- Micro inline gaps (such as icon-to-label or badge items) lock strictly to `space-xs` (4px) or `space-sm` (8px).

## Elevation & Depth

Visual hierarchy uses multi-layered ambient shadows tinted with deep indigo (`#4338CA`) rather than flat, desaturated greys. This approach adds warmth to clean white surfaces:

- **Level 0 (Flat Surface):** Background canvas (`#F8FAFC`) with no shadow. Structural dividers use low-contrast borders (`#E2E8F0`).
- **Level 1 (Card Default / Table Containers):** Pure white background (`#FFFFFF`) with a subtle structural stroke (`1px solid rgba(226, 232, 240, 0.8)`) layered over a soft indigo ambient cast:
  `box-shadow: 0 1px 3px 0 rgba(67, 56, 202, 0.04), 0 1px 2px -1px rgba(67, 56, 202, 0.04);`
- **Level 2 (Hover State / Interactive Cards / Dropdowns):** Subtle upward translation (-1px) combined with an amplified ambient spread:
  `box-shadow: 0 4px 6px -1px rgba(67, 56, 202, 0.06), 0 2px 4px -2px rgba(67, 56, 202, 0.05);`
- **Level 3 (Modals / Floating Drawers / Flyout Menus):** High-prominence overlays:
  `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(67, 56, 202, 0.04);`
  Paired with a backdrop blur `backdrop-filter: blur(8px);` over `rgba(15, 23, 42, 0.4)`.

## Shapes

The interface balances soft modern curves with functional data density:

- **Base Radius (Roundedness = 2):** Primary UI controls (inputs, default buttons, select toggles, table row indicators) use `0.5rem` (8px).
- **Containers & Modules (`rounded-lg`):** Small cards, metric widgets, and sub-panels use `1rem` (16px).
- **Feature Surfaces (`rounded-xl`):** Primary dashboard cards, large cohort analytics matrices, and dialog modals scale to `1.5rem` (24px).
- **Pills & Indicator Badges (`rounded-full`):** Metric trend badges, status tags, avatars, and segmented toggle groups use full circular radii (`9999px`) to distinguish categorical metadata from rectangular interactive cards.

## Components

- **Buttons:**
  - *Primary:* Deep indigo background (`#4F46E5`), white text (`#FFFFFF`), `0.5rem` radius, semi-bold typography (`label-md`). Hover elevates to `#4338CA` with subtle scale transition. Focus uses an outer indigo ring (`ring-2 ring-indigo-500/20 ring-offset-2`).
  - *Secondary / Outline:* Crisp white background with border `#E2E8F0`, slate text (`#334155`). Hover transitions to `#F8FAFC` with text `#0F172A`.
  - *Ghost / Tertiary:* Transparent background with slate-600 text; hover triggers `#F1F5F9`.

- **Cards & Analytical Containers:**
  - Built with `#FFFFFF` background, `rounded-xl` (16px), subtle border `rgba(226, 232, 240, 0.8)`, and Level 1 indigo ambient shadow. Headers include a clear divider or 24px interior spacing, separating title typography from KPI metric values.

- **Chips & Status Pills:**
  - *Status Badges:* Pill-shaped (`rounded-full`), `space-xs` vertical padding, `space-sm` horizontal padding. Font: `label-sm`.
    - Active / Growth: Emerald tint (`#ECFDF5` background, `#047857` text, `#A7F3D0` subtle border).
    - In Review / Stalled: Amber tint (`#FFFBEB` background, `#B45309` text, `#FDE68A` border).
    - AI Telemetry: Sky tint (`#F0F9FF` background, `#0369A1` text, `#BAE6FD` border).
  - *Filter Toggle Chips:* Pill-shaped interactive elements with neutral border (`#E2E8F0`). Active state fills with `#4F46E5` text `#FFFFFF`.

- **Input Fields & Form Elements:**
  - Height 40px, `0.5rem` radius, border `#CBD5E1`, background `#FFFFFF`, text `#0F172A`.
  - Focus state transitions border to `#4F46E5` accompanied by an indigo glow ring (`box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15)`). Placeholder set in `#94A3B8`.

- **Checkboxes & Radios:**
  - Checkboxes use `rounded` (4px), 16px × 16px geometry. Radios are circular. Checked state fills `#4F46E5` with a white checkmark icon.

- **Data Tables & Metric Grids:**
  - Header: `#F8FAFC` background, text `#64748B`, font `label-sm` uppercase, border-bottom `1px solid #E2E8F0`.
  - Row cells: Height 48px, vertical-align center, `Inter` font, tabular figures for metric numbers, border-bottom `1px solid #F1F5F9`. Hover highlights row with `#F8FAFC`.