---
name: design-taste-frontend
description: Anti-slop frontend taste skill. Forces the agent to read the room, apply context-driven visual density, and reject generic AI templates.
license: MIT
---

# Anti-Slop Frontend Taste & Aesthetic Framework

Stop generating generic, templated AI interfaces. Read the room, establish deliberate visual hierarchy, and produce distinctive, human-crafted design.

---

## 1. Brief Inference: Read the Room First

Before touching code or styles, declare your **Design Read**:
1. **Application Context:** Is this a financial dashboard, transaction ledger, receipt scanner modal, or analytics chart?
2. **Audience & Tone:** A financial app requires high trust, crisp data density, authoritative typography, and distraction-free clarity.
3. **Anti-Default Discipline:**
   - Ban generic purple/indigo gradient meshes.
   - Ban muddy, flat `#78716c` (stone-500) uppercase tracking-wider micro-labels on every card.
   - Ban uniform 3-card equal-weight layouts where primary data gets lost in identical containers.

---

## 2. The Three Dials for Fintech & Dashboards

For this financial application, calibrate the three core dials:

- **`DESIGN_VARIANCE: 5`** (Restrained, orderly, highly structured; avoids artsy chaos while rejecting cookie-cutter symmetry).
- **`MOTION_INTENSITY: 4`** (Subtle, snappy tactile feedback; no bouncy cartoon physics, no sluggish fades).
- **`VISUAL_DENSITY: 7`** (Fintech cockpit: high scannability, compact spacing, zero wasted vertical padding, clear data grouping).

---

## 3. Color & Radius Consistency Lock

1. **One Accent Anchor:**
   - In this application, emerald/green represents positive income/profit, rose/red represents expense, and a single neutral accent (emerald/slate/zinc) anchors navigation and primary actions.
   - Do not introduce random violet, blue, or orange buttons unless explicitly mapped to a distinct semantic status.

2. **Radius Hierarchy:**
   - Maintain a cohesive corner radius system:
     - Outer modals / main cards: `rounded-2xl` (16px)
     - Inner containers / form groups: `rounded-xl` (12px)
     - Interactive buttons / inputs / badges: `rounded-lg` (8px)
     - Micro tags / pills: `rounded-md` (6px) or `rounded-full` for status badges.
   - Do not mix random radii (e.g. sharp square cards alongside full-pill buttons).

3. **Depth & Elevation:**
   - On dark surfaces, use subtle inner highlights (`shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`) and hairline border borders (`border-white/10`) rather than flat muddy fills.
   - On light surfaces, use multi-layered soft ambient shadows tinted slightly to the background hue, not harsh pure-black shadows.
