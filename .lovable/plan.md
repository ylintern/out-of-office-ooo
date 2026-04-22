
# UI/UX Reboot Plan for $OOO

## Goal
Transform the current prototype into a much sharper product experience: premium, weird, darkly funny, motion-rich, and clearly intentional. Keep the absurd corporate satire, but upgrade the visual language, interaction quality, copywriting, mascot system, and tactile feel.

## What will change

### 1. Brand and visual system overhaul
- Replace the current green/gold “lich terminal” palette with a new core system:
  - White Pearl for elevated surfaces and readable contrast accents
  - Obsidian Charcoal for base backgrounds and chrome
  - Inkchain Purple as the primary brand accent
- Rebuild semantic tokens in `src/styles.css` so every screen inherits the new identity consistently.
- Shift the mascot direction from “lich corporate” to the attached purple meme character:
  - more expressive
  - cleaner
  - more viral/meme-ready
  - less fantasy, more internet-native brand character
- Tighten typography hierarchy so the app feels editorial and premium rather than novelty-first.

### 2. Iconography upgrade: remove emojis completely
- Replace all mission emojis, market badges, and quick-action markers with proper iconography.
- Use a consistent icon language across:
  - mission cards
  - bottom navigation
  - calendar states
  - ticker signals
  - stats
  - notifications and status banners
- Keep tone absurd through naming/copy, not through low-tier emoji decoration.

### 3. Home screen redesign
- Rework `/` into a high-impact command center instead of stacked cards.
- New structure:
  - hero status with mascot + live state
  - “next sacred moments” timeline
  - daily peace-earned dashboard
  - mission launcher rail
  - Bart tip of the day
  - subtle live ambient states based on work hours vs post-17h freedom mode
- Improve scannability, spacing, hierarchy, and visual rhythm.

### 4. Calendar UX redesign
- Rebuild `/calendar` around a more premium inverted-calendar experience:
  - stronger day switching
  - richer block visuals
  - better differentiation between “free” and “work”
  - more interactive templates
  - clearer legend and summaries
- Make free-time blocks feel celebratory and physically larger without looking crude.
- Add smarter microinteractions:
  - pressed states
  - animated insertion of blocks
  - selection feedback
  - subtle transitions between days
- Remove visual clutter and make the calendar feel like the main product, not a demo widget.

### 5. Missions experience redesign
- Rework `/missions` into a high-energy control room.
- Each mission card will get:
  - unique icon
  - stronger visual identity
  - richer supporting copy
  - better information hierarchy
  - more tactile pressed/hover states
- Upgrade `MissionOverlay` into a cinematic fullscreen ritual:
  - stronger countdown treatment
  - layered motion
  - better progress visuals
  - improved completion state
  - more premium CTA styles
- Add better haptic orchestration and sound timing hooks using existing browser-safe capabilities.

### 6. Academy redesign
- Make `/academy` feel like a real progression system:
  - stronger rank visualization
  - more readable lesson list
  - locked/unlocked states with better affordance
  - more satisfying unlock interaction
- Improve the tone of lessons so they feel more quotable, screenshot-worthy, and sharable.

### 7. Ticker page redesign
- Rework `/ticker` into a stronger meme-finance artifact.
- Improve:
  - market card styling
  - chart presentation
  - manifesto layout
  - whitepaper parody section
  - share/mint CTA styling
- Use motion and typography to make it feel closer to a polished fake asset dashboard than a fun placeholder page.

### 8. Copywriting pass across the app
- Rewrite product copy to keep:
  - absurdism
  - dark humor
  - “half-truths corporate”
  - mental health satire without sounding sloppy
- Improve all labels, headlines, microcopy, button text, state text, and completion messages.
- Make Bart’s voice more defined:
  - dry
  - clever
  - detached
  - confident
  - never childish

### 9. Motion design and haptics system
- Introduce a consistent motion language across the app:
  - page entrance transitions
  - card lift/press states
  - segmented control animations
  - ticker movement refinement
  - overlay reveal/dismiss choreography
  - progress pulses and live counters
- Use the best browser-appropriate haptic patterns available for:
  - mission start
  - mission completion
  - major CTA confirmation
  - liberation moments
- Keep all motion purposeful, not noisy.

### 10. Navigation and shell polish
- Refine `TopBar`, `BottomNav`, and route shell styling so the whole app feels like one coherent product.
- Improve active states, spacing, surface treatments, and device-safe-area behavior.
- Clean up metadata and app chrome to match the new brand direction.

## Files likely to change
- `src/styles.css`
- `src/lib/ooo.ts`
- `src/components/TopBar.tsx`
- `src/components/BottomNav.tsx`
- `src/components/MissionOverlay.tsx`
- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/routes/calendar.tsx`
- `src/routes/missions.tsx`
- `src/routes/academy.tsx`
- `src/routes/ticker.tsx`
- `public/manifest.webmanifest`
- mascot/image assets to replace the current Bart treatment

## Technical implementation notes
- Replace current mission data model fields that still assume emoji-first rendering with icon-friendly metadata.
- Add reusable UI primitives for:
  - section headers
  - stat pills
  - segmented toggles
  - status chips
  - premium cards
- Use Lucide where it fits, and keep mascot usage as a brand illustration rather than as repeated decorative clutter.
- Preserve TanStack route structure; do not edit `src/routeTree.gen.ts`.
- Keep browser-safe haptics and audio only; no unsupported native/mobile-only APIs.
- Use the uploaded mascot reference as inspiration for the new brand character direction, replacing the current lich visual identity.

## Recommended rollout order
1. Rebuild design tokens and brand system
2. Replace mascot assets and icon language
3. Redesign shell (`__root`, top bar, bottom nav)
4. Redesign home and calendar first
5. Redesign missions and overlay
6. Redesign academy and ticker
7. Run a full copy pass
8. Final interaction polish: motion, haptics, and consistency pass

## Expected result
A far more premium, viral, and distinctive $OOO experience: less gimmicky, more branded; less emoji-app, more cult calendar product. The absurdity stays, but the execution becomes sharper, more tactile, more memorable, and much more screenshot-worthy.
