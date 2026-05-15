# Phase 3 — Home Page

## Files to drop into your project

```
src/hooks/useDaysTogether.ts           → update if already exists (same logic, safe to skip)
src/components/features/home/
  DaysCounter.tsx
  ProfilePair.tsx
  PunOfTheDay.tsx
  KinderJoyTeaser.tsx
  MonthlyAnniversaryBanner.tsx
  QuickLinks.tsx
src/pages/HomePage.tsx                 → replace the stub
```

## Pre-requisites (already done in Phase 0/1/2)
- `src/types/index.ts` exports: `OWNERS`, `RELATIONSHIP_START`, `Profile`, `Photo`, `MemoryJarNote`
- `src/lib/supabase.ts` exports `supabase`
- `src/lib/utils.ts` exports `dayOfYear(date: Date): number`
- `src/data/puns.ts` exports `PUNS` as `Array<{ body: string }>`
- `src/hooks/useDaysTogether.ts` (provided above, or already exists)
- `src/components/layout/PageWrapper.tsx` accepts `pageName: string`
- `src/components/motifs/SunflowerDivider.tsx` exists

## One thing to check: `dayOfYear`

If `utils.ts` doesn't already have this, add it:

```ts
export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
```

## OWNERS / RELATIONSHIP_START
The home page will work without real UUIDs — ProfilePair gracefully handles `OWNERS.char === 'TBD'`
(it skips the Supabase fetch if both are still TBD). Fill in once both users have logged in.

`RELATIONSHIP_START` drives the DaysCounter. Update in `src/types/index.ts`.

## Monthly anniversary banner
Only renders when `new Date().getDate() === 14`. You can test it by temporarily changing
the condition to `true` in `MonthlyAnniversaryBanner.tsx`, then revert.

If no photos or memory notes exist yet, the banner still shows — with a friendly nudge to
add content.

## What Phase 3 looks like

Top → bottom layout:
1. Monthly anniversary banner (14th only)
2. "our little corner" header with sunflowers
3. DaysCounter — big Playfair number, animated count-up
4. SunflowerDivider
5. ProfilePair — two avatars with pulsing 💛 between
6. SunflowerDivider
7. PunOfTheDay card — deterministic daily pick
8. KinderJoyTeaser — egg emoji → /jar
9. SunflowerDivider
10. QuickLinks grid → all other pages
11. Tiny footer line

## Next: Phase 4 — Photo Gallery
The gallery is the biggest visual page. Budget a longer session for it.
