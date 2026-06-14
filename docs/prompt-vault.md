# DriveScope Prompt Vault

Design and creative prompts for DriveScope. **Start every design prompt by naming the COLOR PERSONALITY before room structure.**

---

## Active Theme: Futuristic Laboratory (#1)

**Mood:** Automotive Museum of the Future — Porsche Concept Studio + Aesop + Blade Runner 2049 + Apple

| Token | Value | Role |
|-------|-------|------|
| Base | `#09060D` | Deep Plum Black |
| Accent | `#35D6FF` | Electric Cyan |
| Room: Midnight Plum | `#140A1C` | Hero / Reveal |
| Room: Blueprint Indigo | `#101428` | Engineering Lab |
| Room: Terminal Emerald | `#081612` | Financial Command |
| Room: Warm Bronze | `#161008` | Lifecycle Analysis |
| Room: Graphite | `#111113` | Simulation + War Room |
| Room: Champagne Gold | `#12100C` | Luxury Showroom |
| Text Primary | `#F7F7F5` | Warm White |
| Text Secondary | `#9CA3AF` | Muted Gray |

**Typography:** Cormorant Garamond (hero + section titles) · Geist Mono (data labels) · Inter (body)

**Atmosphere:** Garage immersion — concrete floors, overhead fluorescent strips, bay door thresholds, card-over-card work orders.

**Implementation:** [`lib/theme.ts`](../lib/theme.ts) · [`app/globals.css`](../app/globals.css) · [`app/atmosphere.css`](../app/atmosphere.css)

---

## COLOR PERSONALITY

Choose one before writing any room/section prompt:

### 1. Futuristic Laboratory
**Plum + Cyan** — Active theme. Museum of the future. Blade Runner terminal meets Porsche studio.

### 2. Luxury Editorial
**Ivory + Olive** — Kinfolk magazine meets Bentley configurator. Matte surfaces, botanical restraint.

### 3. Performance Engineering
**Graphite + Petrol Green** — Dyno room. Raw concrete. Telemetry overlays. No decoration.

### 4. Vintage Motorsport
**Navy + Copper** — Le Mans pit lane. Patina leather. Analog gauges. Heritage racing livery.

### 5. Formula One Telemetry
**Lime + Charcoal** — Mission control. Live data streams. High-contrast monospace. Strategy wall.

### 6. Ultra Luxury
**Gold + Obsidian** — Private gallery. Brushed metal. Single spotlight. Whisper-level motion.

### 7. Adventure Intelligence
**Forest + Amber** — Expedition basecamp. Topographic maps. Rugged materials. Outdoor credibility.

---

## Usage

```
COLOR PERSONALITY: #1 Futuristic Laboratory

Build Room 03 as a financial command center...
```

Never default to blue-tech or orange-performance palettes unless the chosen personality explicitly calls for them.

---

## Understanding Mode — Content Authoring

**Brand line:** "Explain This Like I'm Buying It" — not another spec sheet; jargon becomes a buying decision.

Every feature/spec click opens a **3-layer Understanding Panel**:

| Layer | File / module | Purpose |
|-------|----------------|---------|
| **1 — Visual** | `data/understanding/features.json` → `visual.scene` + `components/understanding/scenes/` | Animated scenario (SVG + CSS keyframes, 10s loop) |
| **2 — Context** | `context.usefulIf` / `notUsefulIf` + `rules` in JSON; evaluated by `lib/understanding/context.ts` | Rule-based personalization from `ds-driving-profile` in localStorage |
| **3 — Value** | `value.practicalScore`, `experienceScore`, `ownershipImpact` | Dual meters + star impact |

### Adding a new feature explainer

1. Add an entry to [`data/understanding/features.json`](../data/understanding/features.json) with `featureId` matching [`data/features.json`](../data/features.json).
2. Set `visual.scene` to an existing registry key or create `components/understanding/scenes/YourScene.tsx` and register it in [`components/understanding/registry.tsx`](../components/understanding/registry.tsx).
3. Write `context.rules` using `when`: `{ cityId, highwayPctGte, annualKmGte, newDriver }` — **deterministic only, no LLM**.
4. Scores: `practicalScore` / `experienceScore` 1–10; `ownershipImpact` 1–3 (maps to stars).

Features **without** a JSON entry still work via [`lib/understanding/fallback.ts`](../lib/understanding/fallback.ts) (generic category animation + existing `whatItIs` / `whoNeedsIt`).

### Adding a spec explainer

1. Add to [`data/understanding/specs.json`](../data/understanding/specs.json) and extend `Model.dimensions` in [`lib/types.ts`](../lib/types.ts) if needed.
2. Wire the card in [`SpecUnderstandingGrid.tsx`](../components/understanding/SpecUnderstandingGrid.tsx).

### Scene conventions

- Reuse [`useSceneCaption.ts`](../components/understanding/useSceneCaption.ts) + `captions: { at, text }[]` synced to animation.
- Accent color: Electric Cyan `#35D6FF` for hero elements in scenes.
- Loop duration: 10s (`LOOP_S`).
- Mobile: panel is full-width; 48px min touch targets on controls.

### Profile defaults

Hyderabad · 12k km/yr · 25% highway — matches Financial Command Center. Key: `ds-driving-profile`.
