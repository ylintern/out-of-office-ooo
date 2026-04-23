
# $OOO app-shell reboot plan

## Outcome
Turn the current experience from “website sections” into an app-like mobile-first product shell: tighter dashboard, stronger cards and data presentation, better copy, clearer feature hierarchy, and a real path toward account-based calendar intelligence.

## What will be rebuilt now

### 1. Make the whole product feel like a real app, not a landing page
- Rework the root shell into a denser PWA-style layout:
  - more native-app chrome
  - less hero-marketing structure
  - stronger safe-area spacing
  - tighter top bar + bottom nav behavior
  - app canvas feel instead of “stacked website cards”
- Keep current color system, but refine surfaces, borders, elevation, shadows, and contrast so screens feel product-grade.
- Keep the uploaded purple mascot as the base canonical Bart reference. Reuse/crop/frame it in different placements, but do not replace it with a different mascot style.

### 2. Rebuild Today into the real dashboard
- Replace the current homepage hero structure with a proper operations dashboard centered on:
  - active missions
  - next sacred reminders
  - today’s earned peace/money
  - quick-launch ritual buttons
  - Bart tip/wisdom module
  - status summary of the enslaved workday window
- Remove the line:
  - “The calendar app everyone wanted after their fifth meaningless invite.”
- Reframe copy so the page feels absurdist, memable, dry, and sharp rather than promotional.

### 3. Upgrade numbers, stats, and cards
- Redesign metric cards so money/time/progress feel premium and tactile:
  - stronger hierarchy
  - better tabular numerals
  - clearer positive/neutral/alert states
  - more contrast and spacing
  - app-grade mini charts / progress bars where relevant
- Introduce reusable card primitives for:
  - KPI card
  - mission card
  - timeline/reminder card
  - settings row
  - onboarding step card
- Improve motion on stat updates:
  - count-up / tick behavior
  - soft pulse for live values
  - pressed states on actions
  - reduced-motion fallback

### 4. Strengthen the base four features
The app should visually and structurally make these feel like the core product:
- Calendar
- Wisdom notifications
- Missions
- Academy

Implementation direction:
- Today becomes the orchestration layer for these four systems.
- Calendar gets more product authority and clearer conflict logic.
- Missions become more launchable and dashboard-native.
- Academy becomes quotable and habit-forming rather than a side archive.
- Wisdom notifications become a first-class system, not a side note.

### 5. Quick-start onboarding wizard
Add a first-run onboarding flow that captures the minimum required data:
- workday start
- workday end
- lunch time/window
- hourly pay

Use it to power:
- accurate “earned while absent” calculations
- sacred reminder timings
- calendar conflict checks
- default mission suggestions

Implementation shape:
- lightweight mobile-first wizard
- 3–4 short steps
- progress indicator
- skip/back support
- saved to user profile/preferences
- re-openable later from settings/dashboard

### 6. Real account system + stored user preferences
Because real Google + Notion integration is required and the user wants stored preferences:
- add authentication
- store profile/preferences per user
- keep preferences off auth.users directly
- create a proper profile/preferences table
- prepare linked-account records/settings for integrations

Default auth setup for this phase:
- email/password
- Google sign-in

Stored per-user data:
- work hours
- lunch window
- hourly rate
- mission defaults
- notification preferences
- connected service state

### 7. Real Google + Notion integration architecture
Implement real per-user OAuth-ready integrations so the app can ingest work context and invert it.

#### Google
Support:
- Google Calendar
- Google email/Gmail context if needed for work signals

Core use:
- read work events from user calendars
- detect conflicts with sacred time
- surface inverse reminders inside $OOO

#### Notion
Support:
- connect user workspace
- read task/database items relevant to work obligations
- cross-reference task pressure with calendar state

#### Product behavior enabled
Examples the app should support:
- meeting created at 12:45 when lunch is 13:00
- $OOO detects conflict
- warning appears before conflict
- at lunch start, app sends a hard-stop reminder with sarcastic copy
- future logic can flag patterns like “three lunch violations this week”

Important implementation note:
- for Google and Notion, use real per-user OAuth architecture, not workspace-owner connector access, because this data belongs to each end user.
- add integration UI now in a way that clearly supports connected/disconnected/error/syncing states.

### 8. Calendar intelligence pass
Upgrade calendar from visual novelty into the product brain:
- merge user-defined sacred blocks with imported work events
- add conflict highlighting
- show “protected lunch”, “encroaching meeting”, “free block”, “work block”
- introduce inverse reminders based on imported calendar events
- show why a reminder triggered
- make free time feel protected and important, not leftover

### 9. Wisdom notifications system
Build a distinct notification/reminder layer with:
- lunch defense alerts
- break reminders
- Bart wisdom nudges
- conflict warnings
- 17:00 liberation cues

Tone rules:
- dark humor
- absurdity
- clever and memeable
- never childish
- never generic productivity-app language

Examples of copy direction:
- solemn, sarcastic, dry
- half-truth / half-corporate doctrine
- “This meeting appears to be attempting to consume lunch.”
- “Please stop working immediately. Nutrition has escalated.”

### 10. Copy rewrite pass
Rewrite the most visible copy across:
- Today
- calendar summaries
- mission cards
- overlay states
- academy framing
- onboarding steps
- reminder language
- metadata / manifest descriptions where needed

Remove lines that sound like:
- ad copy
- startup website hero text
- generic premium-product slogans

Replace with:
- absurdist product language
- memorable one-liners
- dark humor
- tips/tricks voice
- Bart as patron saint of composed disengagement

### 11. Motion, haptics, and tactile interaction pass
Apply state-of-the-art browser-safe interaction design:
- stronger press/release states
- spring-like transitions where appropriate
- route-level choreography
- live metric animation
- better mission launch/complete rituals
- haptic patterns by importance
- notification feedback that feels intentional

Practical rule:
- motion should support hierarchy and delight
- not noisy
- always reduced-motion safe

## Files likely to change
- `src/styles.css`
- `src/routes/__root.tsx`
- `src/components/TopBar.tsx`
- `src/components/BottomNav.tsx`
- `src/routes/index.tsx`
- `src/routes/calendar.tsx`
- `src/routes/missions.tsx`
- `src/routes/academy.tsx`
- `src/components/MissionOverlay.tsx`
- `src/lib/ooo.ts`
- `public/manifest.webmanifest`

## New files likely needed
- auth routes/components
- onboarding wizard component(s)
- settings/preferences UI
- server functions for profile/preferences persistence
- OAuth callback / integration server routes
- integration UI components
- shared card/stat/dashboard primitives
- validation schemas for onboarding/integrations

## Data/model work required
- add user auth
- add profiles/preferences storage
- add linked integrations storage
- store onboarding answers per user
- evolve stats model beyond local-only state
- preserve local feel, but make signed-in persistence authoritative

## Technical details
- Keep TanStack Start route structure intact.
- Do not edit `src/routeTree.gen.ts`.
- Use real per-user OAuth for Google and Notion, not builder-level shared connectors.
- Since profile/preferences data is required, implement auth plus a proper profile/preferences table.
- Validate all onboarding and integration inputs with schemas on both client and server.
- Keep roles in a separate roles table if roles are introduced later; never store roles on profiles/users directly.
- Preserve mobile-first behavior and standalone manifest support, but avoid service-worker complexity unless explicitly requested.

## Recommended rollout order
1. Rebuild shell and app chrome to feel like a PWA app
2. Redesign Today into a true mission dashboard
3. Refactor card/stat system and remove weak copy
4. Add onboarding wizard and preference model
5. Add auth + profile/preferences persistence
6. Build integration settings UI and per-user OAuth flows
7. Upgrade calendar with imported-event conflict logic
8. Add smarter notifications/wisdom system
9. Final polish pass on motion, haptics, and copy consistency

## Expected result
A much stronger $OOO product: less like a branded microsite, more like the pocket absurdist calendar app people would actually install, configure, connect to their work tools, and use daily to defend lunch, monetize disappearance, and turn corporate scheduling into a meme-worthy ritual.
